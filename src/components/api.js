import Vue from 'vue';
import VueResource from 'vue-resource';
import { store, types } from "./store/";

Vue.use(VueResource);

Vue.http.interceptors.push(function(request, next) {
    store.commit(types.START_FETCHING);
    next(function(response) {
        store.commit(types.STOP_FETCHING);
    });
});

function resolveToRoot(path){
    return window.location.origin + path;
}

export let contestList = Vue.resource(resolveToRoot("/contest-list"));
export let contest = Vue.resource(resolveToRoot('/contest'));
export let my = Vue.resource(resolveToRoot('/contest/my'));
export let submissions = Vue.resource(resolveToRoot('/contest/submissions'));
export let submit = Vue.resource(resolveToRoot('/contest/submit'));
export let submission = Vue.resource(resolveToRoot('/contest/submission{/id}'));

export let paths = {
    login: "/api-login",
    logout: "/api-logout"
};