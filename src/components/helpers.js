import "babel-polyfill";
import * as Scoring from "../../judge/scoring.js";
import {Task} from "../../judge/task.js";
import {VerdictConst} from "../../judge/verdict.js";
import Vue from 'vue';
import * as Api from './api.js';
import hljs from 'highlight.js/lib/index.js';
import moment from 'moment';

export function getScoringString(prob, contest){
    if(contest)
        return contest.scoring || prob.problem.attr.scoring;
    return prob.problem.attr.scoring;
}

export function getScoringClassFromString(sc){
    return Scoring[sc];
}

export function getScoringClass(prob){
    return Scoring[getScoringString(prob)];
}

export function getScoring(prob){
    return new (getScoringClass(prob))(new Task(prob.problem.attr));
}

export function getHumanVerdict(v){
    return VerdictConst[v];
}

export function getMainVerdict(verdicts, task){
    for(let data of [].concat(task.attr.datasets).reverse()){
        if(!verdicts.hasOwnProperty(data.name)) continue;
        if(verdicts[data.name].verdict != "VERDICT_SKIP")
            return verdicts[data.name].verdict;
    }

    return "";
}

export function getPassed(n){
    return n < 0 ? "-" : n;
}

export function getExecTime(verdict){
    if(!verdict.info || !verdict.info.hasOwnProperty("time")) return null;
    return parseInt(verdict.info.time*1000) + " ms";
}

export function getCountdown(m){
    let dur = moment.duration(m.diff(moment()));
    if(dur.asHours() >= 24) return m.fromNow();
    return `${parseInt(dur.asHours())}:${pad(dur.minutes(), 2)}:${pad(dur.seconds(), 2)}`;
}

export function pad(x, size, ch='0'){
    var s = ch.repeat(size+1) + x.toString();
    return s.substr(s.length-size);
}

export function getFormattedContestTime(t){
    if(t < 0) return "upsolving";
    let hours = Math.floor(t/60);
    let minutes = t-hours*60;
    minutes = pad(minutes, 2);
    return `${hours}:${minutes}`;
}

export function normalizeHexColor(x){
    let rem = 6-x.length;
    let res = "";
    for(let i = 0; i < rem; i++)
        res += x[i]+x[i];
    return res+x.substr(rem);
}

function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}

export function lighten(t){
    return shadeColor2("#"+normalizeHexColor(t), 0.3).substr(1);
}

export function showCode(sub){
    Api.submission.get({id: sub._id}).then((res) => {
        if(!res.json().hasOwnProperty("code")) return;
        let code = res.json().code;

        let modal = $('#modal-code');
        let content = modal.find('#modal-code-content');
        content.text(code).attr('class', 'cpp');
        hljs.highlightBlock(content[0]);
        modal.openModal();
    });
}