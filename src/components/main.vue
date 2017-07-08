<template>
    <div class="ju-main-wrapper">
        <!-- SideNav -->
        <ul id="slide-out" class="side-nav fixed">
            <li class="logo">
                <h4 class="brand-logo center">Jude</h4>
            </li>
            <li class="side-nav-info">
                <a href="#" @click.prevent="">
                    <span class="side-nav-info-title">Contest Name</span>
                    <span>{{ getContestName() }}</span>
                </a>
                <a href="#" @click.prevent="">
                    <span class="side-nav-info-title">Start Time</span>
                    <span>{{ getStartTime() }}</span>
                </a>
                <a href="#" @click.prevent="">
                    <span class="side-nav-info-title">End Time</span>
                    <span>{{ getEndTime() }}</span>
                </a>
            </li>
            <li><div class="divider"></div></li>
            <li>
                <router-link to="dashboard">Dashboard</router-link>
            </li>
            <li>
                <router-link to="standings">Standings</router-link>
            </li>
            <li><div class="divider"></div></li>
            <li>
                <a href="#modal-submit" class="modal-trigger">Submit</a>
            </li>
            <li>
                <a href="#" @click.prevent="doLogout()">Logout</a>
            </li>
        </ul>

        <!-- Navigation Bar -->
        <div class="navbar-fixed">
            <nav>
                <div class="nav-wrapper">
                    <a class="brand-logo left">Jude</a>
                    <ul class="right">
                        <li>
                            <a href="#" @click.prevent="">
                                <b>{{ countdownString }}</b>
                            </a>
                        </li>
                        <li>
                            <a class="button-collapse" href="#" @click.prevent="" data-activates="slide-out">
                                <i class="material-icons" style="color: white">menu</i>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>

        <div class="progress">
            <div :class="{ indeterminate: isFetching }"></div>
        </div>

        <!--<div class="wrapper">
            <div class="section"></div>
            <div class="section"></div>
            <div class="container main">
                <div class="row">
                    <ju-problem></ju-problem>
                    <ju-submission></ju-submission>
                </div>
                <div class="row">
                    <ju-standings></ju-standings>
                </div>
            </div>
        </div>-->

        <router-view></router-view>

        <ju-submit></ju-submit>
        <ju-code-modal></ju-code-modal>
    </div>
</template>

<script type="text/babel">import * as Api from "./api.js";
    import * as Helper from "./helpers.js";
    import SubmitComponent from "./submit.vue";
    import CodeModalComponent from "./codeModal.vue";
    import Vue from "vue";
    import moment from "moment";
    import "moment/locale/en-gb";
    import { mapGetters, mapState } from "vuex";
    import { types } from "./store/";

    moment.locale("en-gb");

    export default {
      mounted() {
        this.fetch();
        window.setInterval(() => {
          this.countdownString = this.getRemainingTime();
        }, 1000);
    
        $(".button-collapse").sideNav();
        $(".modal-trigger").leanModal();
        $(".modal-trigger").click(() => {
          $("#submit-problem").material_select();
          $("#submit-language").material_select();
        });
      },
      data() {
        return { countdownString: "-" };
      },
      computed: {
        ...Helper.mapModuleState("main", [
          "user",
          "rawContest",
          "rawSubmissions",
          "rawTeams"
        ]),
        ...mapGetters([
          "problems",
          "my",
          "groupedSubs",
          "teams",
          "languages",
          "submissions",
          "getRawProblem",
          "isFetching"
        ])
      },
      methods: {
        getRemainingTime() {
          return Helper.getRemainingTime(this.rawContest);
        },
        getContestName() {
          const contest = this.rawContest;
          if (!contest)
            return "-";
          return contest.name;
        },
        getStartTime() {
          const contest = this.rawContest;
          if (!contest)
            return "-";

          return moment(contest.start_time).format("LLL (Z)");
        },
        getEndTime() {
          const contest = this.rawContest;
          if (!contest)
            return "-";
          return moment(contest.end_time).format("LLL (Z)");
        },
        async fetch() {
          const loggedin = await this.$store.dispatch(types.FETCH_CONTEST_DATA);
          if (!loggedin)
            this.$router.push("/");
        },
        async doLogout() {
          await this.$http.post(Api.paths.logout);
          this.$router.push("/");
        }
      },
      components: { 
        JuSubmit: SubmitComponent,
        JuCodeModal: CodeModalComponent
      }
    };
</script>

<style lang="sass">
</style>