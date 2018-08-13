import Vue from "vue";
import VueResource from "vue-resource";
import { store, types } from "./store/";

Vue.use(VueResource);

Vue.http.interceptors.push((request, next) => {
  store.commit(types.START_FETCHING);
  next((response) => {
    store.commit(types.STOP_FETCHING);
  });
});

function resolveToRoot(path) {
  return window.location.origin + path;
}

export const contestList = Vue.resource(resolveToRoot("/contest-list"));
export const contest = Vue.resource(resolveToRoot("/contest"));
export const my = Vue.resource(resolveToRoot("/contest/my"));
export const submissions = Vue.resource(resolveToRoot("/contest/submissions"));
export const submit = Vue.resource(resolveToRoot("/contest/submit"));
export const submission = Vue.resource(resolveToRoot("/contest/submission{/id}"));
export const clarification = Vue.resource(resolveToRoot("/contest/clarification{/id}"));
export const printout = Vue.resource(resolveToRoot("/contest/printout{/id}"));
export const rejudge = Vue.resource(resolveToRoot("/contest/rejudge"));

// admin api v2
export const admin = {
  contest: Vue.resource(resolveToRoot("/api/v2/contest{/id}")),
  contestProblems: Vue.resource(resolveToRoot("/api/v2/contest{/id}/problems")),
  problems: Vue.resource(resolveToRoot("/api/v2/problems"))
};

export const paths = {
  login: "/api-login",
  logout: "/api-logout"
};
