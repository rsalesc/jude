import Vue from "vue";
import * as Api from "../api";
import * as Helper from "../helpers";

export const types = {
  UPDATE_CONTEST_DATA: "main/UPDATE_CONTEST_DATA",
  FETCH_CONTEST_DATA: "main/FETCH_CONTEST_DATA",
  FETCH_AND_SHOW_SUBMISSION: "main/FETCH_AND_SHOW_SUBMISSION",
  UPDATE_SHOWN_SUBMISSION: "main/UPDATE_SHOWN_SUBMISSION",
  CLEAR_MODAL_TRIGGER: "main/CLEAR_MODAL_TRIGGER",
  SET_AUTO_FETCH_STANDINGS: "main/SET_AUT_FETCH_STANDINGS"
};

export const state = {
  user: null,
  rawContest: {},
  rawSubmissions: [],
  rawTeams: [],
  shownSubmission: {},
  codeModalTrigger: false,
  autoFetchStandings: false
};

export const mutations = {
  [types.UPDATE_CONTEST_DATA](state, data) {
    state.user = data._user;
    state.rawContest = data.contest;
    state.rawTeams = data.teams;
    state.rawSubmissions = data.submissions;
  },
  [types.UPDATE_SHOWN_SUBMISSION](state, submission) {
    state.shownSubmission = submission;
    state.codeModalTrigger = true;
  },
  [types.CLEAR_MODAL_TRIGGER](state) {
    state.codeModalTrigger = false;
  },
  [types.SET_AUTO_FETCH_STANDINGS](state, value) {
    state.autoFetchStandings = value;
  }
};

export const computed = {
  problems: (state, getters) => {
    const contest = state.rawContest;
    const my = getters.my;

    if (!my || !contest || !contest.problems)
      return [];
    const problems = Vue.util.extend([], contest.problems);

    for (let i = 0; i < problems.length; i++) {
      const prob = problems[i];

      const subs = (my.submissions || []).filter(v => v.problem === prob.problem._id);

      const scoring = Helper.getScoring(prob, contest);
      const evaluation = scoring.evalContext(subs);

      const solved = scoring.solved(evaluation);
      const attempted = scoring.attempted(evaluation);
      const points = evaluation.score;

      const pending = subs.filter(v => Object.keys(v.verdict).map(k => v.verdict[k]).filter(w => w.verdict === "VERDICT_INQ").length > 0).length > 0;

      Vue.set(problems, i, {
        ...prob, scoring, points, solved, attempted, pending
      });
    }

    return problems;
  },
  my: (state, getters) => {
    if (!state.rawContest || getters.submissions === undefined)
      return { submissions: []};
    const scoring = Helper.getScoringClassFromString(state.rawContest.scoring);

    const submissions = getters.submissions.filter(v => v._creator === state.user);

    return { scoring, submissions, languages: state.rawContest.languages };
  },
  submissions: (state, getters) => {
    const contest = state.rawContest;
    if (!state.rawSubmissions)
      return [];

    const submissions = Vue.util.extend([], state.rawSubmissions);
    if (!submissions || !contest || !contest.problems)
      return [];

    for (let i = 0; i < submissions.length; i++) {
      const sub = submissions[i];
      const timeInContest = sub.timeInContest;

      const problem = getters.getRawProblem(sub.problem);

      const scoring = Helper.getScoring(problem, contest);
      const score = scoring.eval(sub.verdict);

      Vue.set(submissions, i, { ...sub, timeInContest, score });
    }

    return submissions.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  },
  groupedSubs: (state, getters) => {
    const submissions = getters.submissions;
    if (!submissions)
      return {};

    const res = {};
    for (const sub of submissions) {
      if (!res.hasOwnProperty(sub._creator))
        res[sub._creator] = [sub];
      else
        res[sub._creator].push(sub);
    }

    return res;
  },
  teams: (state, getters) => {
    const my = getters.my;
    const problems = getters.problems;

    if (!state.rawTeams)
      return [];
    let teams = Vue.util.extend([], state.rawTeams);

    if (!teams || !my || !problems || !state.rawContest
            || !my.scoring || !getters.groupedSubs)
      return [];
    const groupedSubs = getters.groupedSubs;

    for (let i = 0; i < teams.length; i++) {
      const results = {};
      const arr = [];

      for (const prob of problems) {
        const subs = (groupedSubs[teams[i]._id] || []).filter(v => v.problem === prob.problem._id);
        results[prob.problem._id] = prob.scoring.evalContext(subs);
        arr.push(results[prob.problem._id]);
      }

      const merged = getters.my.scoring.mergeEvaluations(arr);
      Vue.set(teams, i, {
        ...teams[i], merged, results, rank: null
      });
    }

    teams = teams.sort((a, b) => {
      if (a.merged.score === b.merged.score)
        return a.merged.penalty - b.merged.penalty;
      return b.merged.score - a.merged.score;
    });

    let last = -1;
    let officials = 0;

    for (let i = 0; i < teams.length; i++) {
      if (!teams[i].unofficial) {
        officials++;
        if (last !== -1)
          Vue.set(teams, i, { ...teams[i], rank: teams[last].rank });
        if (last === -1 || teams[last].merged.score !== teams[i].merged.score || teams[last].merged.penalty !== teams[i].merged.penalty)
          Vue.set(teams, i, { ...teams[i], rank: officials });
        last = i;
      }
    }

    return teams;
  },
  languages: (state, getters) => {
    if (!state.rawContest || !state.rawContest.languages)
      return [];
    return state.rawContest.languages;
  }
};

export const getters = {
  getRawProblem: (state, getters) => (id) => {
    if (!state.rawContest)
      return undefined;

    for (const prob of state.rawContest.problems) {
      if (prob.problem._id === id)
        return prob;
    }

    return undefined;
  }
};

export const actions = {
  async [types.FETCH_CONTEST_DATA](context) {
    try {
      const [contestResult, submissionsResult]
                = await Promise.all([Api.contest.get(), Api.submissions.get()]);

      context.commit(types.UPDATE_CONTEST_DATA, {
        ...contestResult.body,
        ...submissionsResult.body
      });
    } catch (response) {
      if (response.status === 401 || response.status === 403)
        return false;
      throw response;
    }

    return true;
  },
  async [types.FETCH_AND_SHOW_SUBMISSION](context, submissionId) {
    try {
      const res = await Api.submission.get({ id: submissionId });

      context.commit(types.UPDATE_SHOWN_SUBMISSION, res.body);
    } catch (response) {
      if (response.status === 401 || response.status === 403)
        return false;

      throw response;
    }

    return true;
  }
};
