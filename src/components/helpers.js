// import "babel-polyfill";
import * as Scoring from "../../judge/scoring.js";
import { Task } from "../../judge/task.js";
import { VerdictConst } from "../../judge/verdict.js";
import Vue from "vue";
import * as Api from "./api.js";
import moment from "moment";
import { mapState } from "vuex";

import hljs from "./hljs";

export function getScoringString(prob, contest) {
  if (contest)
    return contest.scoring || prob.problem.attr.scoring;
  return prob.problem.attr.scoring;
}

export function getScoringClassFromString(sc) {
  return Scoring[sc];
}

export function getScoringClass(prob, contest) {
  return Scoring[getScoringString(prob, contest)];
}

export function getScoring(prob, contest) {
  return new (getScoringClass(prob, contest))(new Task(prob.problem.attr));
}

export function getHumanVerdict(v) {
  return VerdictConst[v];
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
    if (verdicts[data.name].verdict != "VERDICT_SKIP")
      return verdicts[data.name].verdict;
  }

  return "";
}

export function getPassed(n) {
  return n < 0 ? "-" : n;
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
    return `contest will start in ${res}`;
  }
  const res = getCountdown(moment(contest.end_time));
  return `contest will end in ${res}`;
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

export function showCode(component, sub) {
  Api.submission.get({ id: sub._id }).then((res) => {
    if (!res.body.hasOwnProperty("code"))
      return;
    const { code } = res.body;

    const modal = $("#modal-code");
    const content = modal.find("#modal-code-content");
    const compilation = modal.find("#modal-code-compilation");
    compilation.text("");
    if (res.body.verdict) {
      for (const dataset in res.body.verdict) {
        if (res.body.verdict.hasOwnProperty(dataset) && res.body.verdict[dataset].verdict === "VERDICT_CE")
          compilation.text(res.body.verdict[dataset].info.text || "");
      }
    }

    content.text(code).attr("class", getHlsMode(res.body.language));
    hljs.highlightBlock(content[0]);
    modal.openModal();
  }).catch((res) => {
    if (res.status === 401 || res.status === 403) {
      Materialize.toast("Not logged in, cannot show submission info!");
      component.$router.push("/");
    } else {
      Materialize.toast("Cannot retrieve submission info for an unknown reason. Try again!");
    }
  });
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
