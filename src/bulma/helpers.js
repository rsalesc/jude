// import "babel-polyfill";
import * as Scoring from "../../judge/scoring.js";
import { Task } from "../../judge/task.js";
import { VerdictConst, VerdictTag } from "../../judge/verdict.js";
import Vue from "vue";
import * as Api from "./api.js";
import ts from "./ts.js";
import moment from "moment";
import "moment/locale/en-gb";

import { mapState } from "vuex";

moment.locale("en-gb");

export function escapeHTML(s) { 
    return s.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

export function appendStyle(doc, css) {
  var head = doc.head || doc.getElementsByTagName('head')[0],
    style = doc.createElement('style');

  style.type = "text/css";
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}

export function getDatetimeString(date) {
  return moment(date).format("LLL");
}

export function dateEquals(a, b) {
  if (a == null && b == null)
    return true;
  if (a == null || b == null)
    return false;
  return a.getTime() === b.getTime();
}

export function getOnlyDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function getOnlyTime(date) {
  return new Date(0, 0, 0, date.getHours(), date.getMinutes(), 0, 0);
}

export function mergeDateAndTime(date, time) {
  const newDate = new Date(date);
  newDate.setHours(time.getHours());
  newDate.setMinutes(time.getMinutes());
  return newDate;
}

export function checkRole(role, needle) {
  if (Array.isArray(role))
    return role.indexOf(needle) !== -1;
  return role === needle;
}

export function isAdmin(userObject) {
  return checkRole(userObject.role, "admin");
}

export function isContestant(userObject) {
  return checkRole(userObject.role, "contestant");
}

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
  if (n != null) {
    return n < 0
      ? "-"
      : String(n);
  }
  return "-";
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
  const now = moment(ts.now());
  const dur = moment.duration(m.diff(now));
  if (dur.asHours() >= 24)
    return m.from(now);
  return `${parseInt(dur.asHours(), 10)}:${pad(dur.minutes(), 2)}:${pad(dur.seconds(), 2)}`;
}

export function getRemainingTime(contest) {
  if (!contest)
    return "";
  const startTs = new Date(contest.start_time).getTime();
  const endTs = new Date(contest.end_time).getTime();

  if (ts.now() >= endTs)
    return "contest has ended";
  else if (ts.now() < startTs) {
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

export function rgbToHex(color) {
  color = "" + color;
  if (!color || color.indexOf("rgb") < 0) {
    return "#000000";
  }

  if (color.charAt(0) == "#") {
    return color;
  }

  var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
    r = parseInt(nums[2], 10).toString(16),
    g = parseInt(nums[3], 10).toString(16),
    b = parseInt(nums[4], 10).toString(16);

  return "#" + (
    (r.length == 1 ? "0"+ r : r) +
    (g.length == 1 ? "0"+ g : g) +
    (b.length == 1 ? "0"+ b : b)
  );
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

export function getTimezone() {
  const minutes = new Date().getTimezoneOffset();
  const absMinutes = minutes < 0
    ? -minutes
    : minutes;
  const h = parseInt(absMinutes / 60, 10);
  const m = parseInt(absMinutes % 60, 10);
  if (minutes === 0)
    return "UTC 0:00";
  else if (minutes > 0)
    return `UTC -${h}:${pad(m, 2)}`;
  return `UTC +${h}:${pad(m, 2)}`;
}

export function getTooltipText(s) {
  return `${s}`;
}

export function hasContestStarted(contest) {
  return new Date(contest.start_time) <= ts.date();
}

export function hasContestEnded(contest) {
  return new Date(contest.end_time) <= ts.date();
}

export function isRunning(contest) {
  return hasContestStarted(contest) && !hasContestEnded(contest);
}

export function getTimeInContest(contest, x) {
  const cur = x != null ? x : ts.now();
  return parseInt((cur - new Date(contest.start_time).getTime()) / 60 / 1000, 10);
}

export function getDurationInContest(contest) {
  const diff = new Date(contest.end_time).getTime() 
    - new Date(contest.start_time).getTime();
  return parseInt(Math.ceil(diff / 60 / 1000), 10);
}

export function getRemainingInContest(contest, x) {
  return getDurationInContest(contest)
    - (x != null ? x : getTimeInContest(contest));
}

export function isFrozen(contest, x) {
  return getRemainingInContest(contest, x) <= contest.freeze && (isRunning(contest)
  || (hasContestEnded(contest) && !contest.unfreeze && contest.freeze > 0));
}

export function isBlind(contest, x) {
  return getRemainingInContest(contest, x) <= contest.blind && (isRunning(contest)
    || (hasContestEnded(contest) && !contest.unfreeze && contest.blind > 0));
}
