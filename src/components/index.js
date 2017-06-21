import Vue from 'vue';
import VuePaginate from 'vue-paginate';
import Vuex from "vuex";
import VueRouter from "vue-router";
import App from "./app.vue";
import Dashboard from "./dashboard.vue";
import Rankings from "./rankings.vue";
import MainPage from './main.vue';
import Login from "./login.vue";
import ContestList from "./contest-list.vue";
import { store } from "./store/";
import 'highlight.js/styles/agate.css';


Vue.use(VueRouter);
Vue.use(VuePaginate);

// routing setup
let routes = [
    { path: '/', component: ContestList },
    { path: '/login', component: Login },
    { path: "/contest", component: MainPage, children: [
        { path: "dashboard", component: Dashboard },
        { path: "standings", component: Rankings },
        { path: "", redirect: "dashboard" }
    ]}
];

let router = new VueRouter({
    routes
});

let app = new Vue({
    router,
    store,
    el: "#app",
    render: h => h(App)
});