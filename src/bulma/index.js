import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import App from "./app.vue";
import ContestList from "./contest-list.vue";
import Login from "./login.vue";
import MainPage from "./main.vue";
import Dashboard from "./dashboard.vue";
import Rankings from "./rankings.vue";
import Settings from "./admin/settings.vue";
import { store } from "./store/";
import Buefy from "buefy";
import "buefy/lib/buefy.css";
import "./main.scss";
require("font-awesome-webpack");

Vue.use(VueRouter);
Vue.use(Buefy, { defaultIconPack: "fa" });

// routing setup
const routes = [
  { path: "/", component: ContestList },
  { path: "/login", component: Login },
  {
    path: "/contest",
    component: MainPage,
    children: [
      { path: "dashboard", component: Dashboard },
      { path: "standings", component: Rankings },
      { path: "settings", component: Settings },
      { path: "", redirect: "dashboard" }
    ]
  }
];

const router = new VueRouter({ routes });

const app = new Vue({
  router,
  store,
  el: "#app",
  render: h => h(App)
});

document.body.className = document.body.className.replace("no-js", "");
