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
        <div id="modal-code" class="modal modal-fixed-footer">
            <div class="modal-content">
                <pre><code id="modal-code-compilation"></code></pre>
                <pre>
                    <code id="modal-code-content">

                    </code>
                </pre>
            </div>
            <div class="modal-footer">
                <a @click.prevent="" href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import * as Api from './api.js';
    import * as Helper from './helpers.js';
    import SubmitComponent from "./submit.vue";
    import Vue from 'vue';
    import moment from 'moment';
    import 'moment/locale/en-gb';
    import { mapGetters, mapState } from "vuex";
    import { types } from "./store/";

    moment.locale('en-gb');

    export default {
        mounted () {
            this.fetch();
            window.setInterval(() => {
                this.countdownString = this.getRemainingTime();
            }, 1000);
            
            $(".button-collapse").sideNav();
            $('.modal-trigger').leanModal();
            $('.modal-trigger').click(function() {
                $('#submit-problem').material_select();
                $('#submit-language').material_select();
            });
        },
        data() {
            return {
                countdownString: "-"
            }
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
        methods:{
            getRemainingTime() {
                let contest = this.rawContest;
                if(!contest) return "";
                let start_ts = new Date(contest.start_time).getTime();
                let end_ts = new Date(contest.end_time).getTime();

                if(Date.now() >= end_ts) return "contest has ended";
                else if(Date.now() < start_ts) {
                    let res = Helper.getCountdown(moment(contest.start_time));
                    return `contest will start in ${res}`
                } else {
                    let res = Helper.getCountdown(moment(contest.end_time));
                    return `contest will end in ${res}`
                }
            },
            getContestName(){
                let contest = this.rawContest;
                if(!contest) return "-";
                return contest.name;
            },
            getStartTime(){
                let contest = this.rawContest;
                if(!contest) return "-";

                return moment(contest.start_time).format("LLL (Z)");
            },
            getEndTime(){
                let contest = this.rawContest;
                if(!contest) return "-";
                return moment(contest.end_time).format("LLL (Z)");
            },
            async fetch(){
                const loggedin = await this.$store.dispatch(types.FETCH_CONTEST_DATA);
                if(!loggedin) {
                    this.$router.push("/");
                }
            },
            async doLogout() {
                await this.$http.post(Api.paths.logout);
                this.$router.push("/");
            }
        },
        components: {
            JuSubmit: SubmitComponent
        }
    }
</script>

<style lang="sass">
</style>