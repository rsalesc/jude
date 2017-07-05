import * as Api from "../api";

export const types = {
    UPDATE_CONTEST_LIST: "login/UPDATE_CONTEST_LIST",
    FETCH_CONTEST_LIST: "login/FETCH_CONTEST_LIST",
    SELECT_CONTEST_FROM_LIST: "login/SELECT_CONTEST_FROM_LIST"
};

export let state = {
    rawContestList: [],
    rawSelectedContest: {}
};

export let mutations = {
    [types.UPDATE_CONTEST_LIST]: (state, contestList) => {
        state.rawContestList = contestList;
    },
    [types.SELECT_CONTEST_FROM_LIST]: (state, contest) => {
        state.rawSelectedContest = contest;
    }
};

export let getters = {

};

export let computed = {
    contestList: (state, getters) => {
        if(!state.rawContestList)
            return [];
        return state.rawContestList;
    },
    selectedContest: (state, getters) => {
        if(!state.rawSelectedContest)
            return { name: "admin" };
        return state.rawSelectedContest;
    }
};

export let actions = {
    [types.FETCH_CONTEST_LIST]: async (context) => {
        const res = await Api.contestList.get();
        context.commit(types.UPDATE_CONTEST_LIST, res.body.contests);
    }
};