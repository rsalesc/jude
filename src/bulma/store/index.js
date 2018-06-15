import Vue from "vue";
import Vuex from "vuex";
import * as main from "./main";
import * as login from "./login";
import createPersistedState from "vuex-persistedstate";

function normalizeModule(mod) {
  const {
    types, computed, getters, ...newMod
  } = mod;
  return { ...newMod, getters: { ...getters, ...computed }};
}

export const types = {
  ...main.types,
  ...login.types,
  START_FETCHING: "START_FETCHING",
  STOP_FETCHING: "STOP_FETCHING"
};

const state = { fetching: { fetchingCount: 0 }};

const mutations = {
  [types.START_FETCHING]: (state) => {
    state.fetching.fetchingCount++;
  },
  [types.STOP_FETCHING]: (state) => {
    state.fetching.fetchingCount--;
  }
};

const getters = { isFetching: (state, getters) => state.fetching.fetchingCount > 0 };

const modules = {
  main: normalizeModule(main),
  login: normalizeModule(login)
};

Vue.use(Vuex);

// store setup
export const store = new Vuex.Store({
  modules,
  state,
  mutations,
  getters,
  plugins: [createPersistedState({
    paths: ["main.config", "main.persist"]
  })]
});
