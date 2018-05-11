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

// admin api v2
export const admin = {
  contest: Vue.resource(resolveToRoot("/api/v2/contest{/id}"))
};

export const paths = {
  login: "/api-login",
  logout: "/api-logout"
};
