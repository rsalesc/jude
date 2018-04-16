// import "babel-polyfill";
import * as Scoring from "../../judge/scoring.js";
import { Task } from "../../judge/task.js";
import { VerdictConst, VerdictTag } from "../../judge/verdict.js";
import Vue from "vue";
import * as Api from "./api.js";
import moment from "moment";
import { mapState } from "vuex";

export function getScoringString(contestProb, contest) {
  if (contest)
    return contest.scoring || contestProb.problem.attr.scoring;
  return contestProb.problem.attr.scoring;
}

export function getScoringClassFromString(sc) {
  if (!Scoring.hasOwnProperty(sc)) {
    console.log(`There is no such thing like ${sc} in scoring package. Falling back to ProductScoring.`);
    return Scoring.ProductScoring;
  }

  return Scoring[sc];
}

export function getScoringClass(contestProb, contest) {
  return Scoring[getScoringString(contestProb, contest)];
}

export function getScoring(contestProb, contest) {
  const task = new Task(contestProb.problem.attr);
  return new (getScoringClass(contestProb, contest))(task);
}

export function getScoringFromString(sc) {
  return new (getScoringClassFromString(sc))(null);
}

export function getHumanVerdict(v) {
  return VerdictConst[v];
}

export function getVerdictTag(s) {
  return `is-${VerdictTag[s] || "white"}`;
}

export function getCodeMirrorMode(lang) {
  const modes = {
    CPP: "clike",
    C: "clike",
    Java: "clike",
    Py2: "python",
    Py3: "python"
  };

  return modes[lang];
}

export function getBraceMode(lang) {
  if (!lang)
    return "c_cpp";
   
  const modes = {
    CPP: "c_cpp",
    C: "c_cpp",
    Java: "java",
    Py2: "python",
    Py3: "python"
  };

  return modes[lang] || "c_cpp";
}

export function getHlsMode(lang) {
  const modes = {
    CPP: "cpp",
    C: "cpp",
    Java: "java",
    Py2: "python",
    Py3: "python"
  };

  return modes[lang];
}

export function getMainVerdict(verdicts, task) {
  for (const data of [].concat(task.attr.datasets).reverse()) {
    if (!verdicts.hasOwnProperty(data.name))
      continue;
    if (verdicts[data.name].verdict !== "VERDICT_SKIP")
      return verdicts[data.name].verdict;
  }

  return "";
}

export function getPassed(n) {
  return n < 0
    ? "-"
    : String(n);
}

export function getExecTime(verdict) {
  if (!verdict.info || !verdict.info.hasOwnProperty("time"))
    return null;
  return `${parseInt(verdict.info.time * 1000, 10)} ms`;
}

export function pad(x, size, ch = "0") {
  const s = ch.repeat(size + 1) + x.toString();
  return s.substr(s.length - size);
}

export function getCountdown(m) {
  const dur = moment.duration(m.diff(moment()));
  if (dur.asHours() >= 24)
    return m.fromNow();
  return `${parseInt(dur.asHours(), 10)}:${pad(dur.minutes(), 2)}:${pad(dur.seconds(), 2)}`;
}

export function getRemainingTime(contest) {
  if (!contest)
    return "";
  const startTs = new Date(contest.start_time).getTime();
  const endTs = new Date(contest.end_time).getTime();

  if (Date.now() >= endTs)
    return "contest has ended";
  else if (Date.now() < startTs) {
    const res = getCountdown(moment(contest.start_time));
    return `contest will start ${res}`;
  }
  const res = getCountdown(moment(contest.end_time));
  return `contest will end ${res}`;
}

export function getFormattedContestTime(t) {
  if (t < 0)
    return "upsolving";
  const hours = Math.floor(t / 60);
  let minutes = t - hours * 60;
  minutes = pad(minutes, 2);
  return `${hours}:${minutes}`;
}

export function normalizeHexColor(x) {
  const rem = 6 - x.length;
  let res = "";
  for (let i = 0; i < rem; i++)
    res += x[i] + x[i];
  return res + x.substr(rem);
}

function shadeColor2(color, percent) {
  let f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = f >> 8 & 0x00FF,
    B = f & 0x0000FF;
  return `#${(0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1)}`;
}

function blendColors(c0, c1, p) {
  let f = parseInt(c0.slice(1), 16),
    t = parseInt(c1.slice(1), 16),
    R1 = f >> 16,
    G1 = f >> 8 & 0x00FF,
    B1 = f & 0x0000FF,
    R2 = t >> 16,
    G2 = t >> 8 & 0x00FF,
    B2 = t & 0x0000FF;
  return `#${(0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1)}`;
}

export function lighten(t) {
  return shadeColor2(`#${normalizeHexColor(t)}`, 0.3).substr(1);
}

export function darken(t) {
  return shadeColor2(`#${normalizeHexColor(t)}`, -0.3).substr(1);
}

export function mapModuleState(nesting, states = []) {
  if (!Array.isArray(nesting))
    nesting = [nesting];

  const res = {};
  for (const stateName of states) {
    res[stateName] = (state) => {
      let obj = state;
      for (const key of nesting)
        obj = obj[key];

      return obj[stateName];
    };
  }

  return mapState(res);
}

export function getTooltipText(s) {
  return `${s}`;
}

export function hasContestStarted(contest) {
  return new Date(contest.start_time) <= new Date();
}

export function hasContestEnded(contest) {
  return new Date(contest.end_time) <= new Date();
}
