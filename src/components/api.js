import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

function resolveToRoot(path){
    return window.location.origin + path;
}

export let contest = Vue.resource(resolveToRoot('/contest'));
export let my = Vue.resource(resolveToRoot('/contest/my'));
export let submissions = Vue.resource(resolveToRoot('/contest/submissions'));
export let submit = Vue.resource(resolveToRoot('/contest/submit'));
export let submission = Vue.resource(resolveToRoot('/contest/submission{/id}'));