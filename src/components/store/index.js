import Vue from "vue";
import Vuex from "vuex";
import * as main from "./main";
import * as login from "./login";

function normalizeModule(mod) {
    let { types, computed, getters, ...newMod } = mod;
    return { ...newMod, getters: { ...getters, ...computed }};
}

export let types = {
    ...main.types,
    ...login.types,
    START_FETCHING: "START_FETCHING",
    STOP_FETCHING: "STOP_FETCHING"
};

let state = {
    fetching: {
        fetchingCount: 0
    }
};

let mutations = {
    [types.START_FETCHING]: (state) => {
        state.fetching.fetchingCount++;
    },
    [types.STOP_FETCHING]: (state) => {
        state.fetching.fetchingCount--;
    }
};

let getters = {
    isFetching: (state, getters) => {
        return state.fetching.fetchingCount > 0;
    }
};

let modules = {
    main: normalizeModule(main),
    login: normalizeModule(login)
};

Vue.use(Vuex);

// store setup
export let store = new Vuex.Store({
    modules,
    state,
    mutations,
    getters
});
