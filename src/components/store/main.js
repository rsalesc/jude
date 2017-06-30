import Vue from "vue";
import * as Api from "../api";
import * as Helper from "../helpers";

export const types = {
    UPDATE_CONTEST_DATA: "main/UPDATE_CONTEST_DATA",
    FETCH_CONTEST_DATA: "main/FETCH_CONTEST_DATA"
};

export let state = {
    user: null,
    rawContest: {},
    rawSubmissions: [],
    rawTeams: []
};

export let mutations = {
    [types.UPDATE_CONTEST_DATA] (state, data) {
        state.user = data._user;
        state.rawContest = data.contest;
        state.rawTeams = data.teams;
        state.rawSubmissions = data.submissions;
    }
};

export let computed = {
    problems: (state, getters) => {
        let contest = state.rawContest;
        let my = getters.my;

        if(!my || !contest || !contest.problems) return [];
        let problems = Vue.util.extend([], contest.problems);

        for(let i = 0; i < problems.length; i++){
            let prob = problems[i];

            let subs = (my.submissions || []).filter((v) => {
                return v.problem == prob.problem._id;
            });

            let scoring = Helper.getScoring(prob, contest);
            let evaluation = scoring.evalContext(subs);

            let solved = scoring.solved(evaluation);
            let attempted = scoring.attempted(evaluation);
            let points = evaluation.score;

            let pending = subs.filter((v) => {
                return Object.keys(v.verdict).map((k) => v.verdict[k]).filter((w) => {
                    return w.verdict == "VERDICT_INQ";
                }).length > 0;
            }).length > 0;

            Vue.set(problems, i, { ...prob, scoring, points, solved, attempted, pending });
        }

        return problems;
    },
    my: (state, getters) => {
        if(!state.rawContest || getters.submissions === undefined) return {submissions:[]};
        let scoring = Helper.getScoringClassFromString(state.rawContest.scoring);

        let submissions = getters.submissions.filter((v) => {
            return v._creator == state.user;
        });

        return {scoring, submissions, languages: state.rawContest.languages};
    },
    submissions: (state, getters) => {
        let contest = state.rawContest;
        if(!state.rawSubmissions) return [];

        let submissions = Vue.util.extend([], state.rawSubmissions);
        if(!submissions || !contest || !contest.problems) return [];

        for(let i = 0; i < submissions.length; i++){
            let sub = submissions[i];
            let timeInContest = sub.timeInContest;

            let problem = getters.getRawProblem(sub.problem);

            let scoring = Helper.getScoring(problem, contest);
            let score = scoring.eval(sub.verdict);

            Vue.set(submissions, i, { ...sub, timeInContest, score});
        }

        return submissions.sort((a, b) => {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        }); 
    },
    groupedSubs: (state, getters) => {
        let submissions = getters.submissions;
        if(!submissions) return {};

        let res = {};
        for(let sub of submissions){
            if(!res.hasOwnProperty(sub._creator))
                    res[sub._creator] = [sub];
            else
                    res[sub._creator].push(sub);
        }

        return res;
    },
    teams: (state, getters) => {
        let my = getters.my;
        let problems = getters.problems;

        if(!state.rawTeams) return [];
        let teams = Vue.util.extend([], state.rawTeams);

        if(!teams || !my || !problems || !state.rawContest 
            || !my.scoring || !getters.groupedSubs) return [];
        let groupedSubs = getters.groupedSubs;

        for(let i = 0; i < teams.length; i++){
            let results = {};
            let arr = [];

            for(let prob of problems){
                let subs = (groupedSubs[teams[i]._id] || []).filter((v) => {
                    return v.problem === prob.problem._id;
                });
                results[prob.problem._id] = prob.scoring.evalContext(subs);
                arr.push(results[prob.problem._id]);
            }

            let merged = getters.my.scoring.mergeEvaluations(arr);
            Vue.set(teams, i, { ...teams[i], merged, results, rank: null });
        }

        teams = teams.sort((a, b) => {
            if(a.merged.score == b.merged.score)
                    return a.merged.penalty - b.merged.penalty;
            return b.merged.score - a.merged.score;
        });

        let pos = 0;
        let last = -1;
        let officials = 0;

        for(let i = 0; i < teams.length; i++){
            if(!teams[i].unofficial) {
                officials++;
                if(last != -1) teams[i].rank = teams[last].rank;
                if(last == -1 || teams[last].merged.score != teams[i].merged.score || teams[last].merged.penalty != teams[i].merged.penalty)
                    teams[i].rank = officials;
            }
        }

        return teams;
    },
    languages: (state, getters) => {
        if(!state.rawContest || !state.rawContest.languages) return [];
        return state.rawContest.languages;
    }
};

export let getters = {
    getRawProblem: (state, getters) => (id) => {
        if(!state.rawContest)
            return undefined;

        for(let prob of state.rawContest.problems){
            if(prob.problem._id == id)
                    return prob;
        }

        return undefined;
    }
};

export let actions = {
    async [types.FETCH_CONTEST_DATA] (context) {
        try {
            let [contestResult, submissionsResult] = 
                await Promise.all([Api.contest.get(), Api.submissions.get()]);
            
            context.commit(types.UPDATE_CONTEST_DATA, {
            ...contestResult.body,
            ...submissionsResult.body 
            });
        } catch(response) {
            if(response.status == 401 || response.status == 403)
                return false;
            throw response;
        }

        return true;
    }
};