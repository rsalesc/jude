<template>
    <!-- SideNav -->
    <ul id="slide-out" class="side-nav fixed">
        <li class="logo">
            <h4 class="brand-logo center">Jude</h4>
        </li>
        <li class="side-nav-info">
            <a href="#">
                <span class="side-nav-info-title">Contest Name</span>
                <span>{{ getContestName() }}</span>
            </a>
            <a href="#">
                <span class="side-nav-info-title">Start Time</span>
                <span>{{ getStartTime() }}</span>
            </a>
            <a href="#">
                <span class="side-nav-info-title">End Time</span>
                <span>{{ getEndTime() }}</span>
            </a>
        </li>
        <li><div class="divider"></div></li>
        <li>
            <a href="#">Dashboard</a>
        </li>
        <li>
            <a href="#">Standings</a>
        </li>
        <li>
            <a href="#">Clarifications</a>
        </li>
        <li><div class="divider"></div></li>
        <li>
            <a href="#modal-submit" class="modal-trigger">Submit</a>
        </li>
        <li>
            <a href="#">Statements</a>
        </li>
        <li>
            <a href="/logout">Logout</a>
        </li>
        <li>
            <a href="#">Help</a>
        </li>
    </ul>

    <!-- Navigation Bar -->
    <div class="navbar-fixed">
        <nav>
            <div class="nav-wrapper">
                <a class="brand-logo left">Jude</a>
                <ul class="right">
                    <li>
                        <a href="#">
                            <b>{{ countdownString }}</b>
                        </a>
                    </li>
                    <li>
                        <a class="button-collapse" href="#" data-activates="slide-out">
                            <i class="material-icons">menu</i>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>

    <div class="section"></div>
    <div class="container main">
        <div class="row">
            <ju-problem :problems="problems" :my="my"></ju-problem>
            <ju-submission :problems="problems" :my="my"></ju-submission>
        </div>
        <div class="row">
            <ju-standings :problems="problems" :my="my" :teams="teams" :grouped-subs="groupedSubs"></ju-standings>
        </div>

        <ju-submit :problems="problems"></ju-submit>
    </div>

    <!-- Code Modal -->
    <div id="modal-code" class="modal modal-fixed-footer">
        <div class="modal-content">
            <pre>
                <code id="modal-code-content">

                </code>
            </pre>
        </div>
        <div class="modal-footer">
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
        </div>
    </div>
</template>

<script type="text/babel">
    import * as Api from './api.js';
    import * as Helper from './helpers.js';
    import ProblemsComponent from './problems.vue';
    import SubmissionsComponent from './submissions.vue';
    import StandingsComponent from "./standings.vue";
    import SubmitComponent from "./submit.vue";
    import Vue from 'vue';
    import moment from 'moment';
    import 'moment/locale/en-gb';

    moment.locale('en-gb');

    export default {
        ready(){
            this.fetch();
            window.setInterval(() => {
                this.countdownString = this.getRemainingTime();
            }, 1000);

        },
        data(){
            return{
                user: null,
                rawContest: {},
                rawSubmissions: [],
                rawTeams: [],
                countdownString: "-"
            }
        },
        computed: {
            problems:{
                /**
                 * Extend problems with the following paths
                 *      .solved - if any submission for this problem achieved full score
                 *      .attempts - number of *affect* submissions before getting problem solved
                 *      .pending - if there is a pending submission for this problem
                 *      .scoring - Scoring object
                 *      .points - best score achieved for this problem
                 */
                get: function(){
                    let contest = this.rawContest;
                    let my = this.my;

                    if(!contest || !contest.problems) return [];
                    let problems = Vue.util.extend([], contest.problems);

                    for(let i = 0; i < problems.length; i++){
                        let prob = problems[i];

                        let subs = (my.submissions || []).filter((v) => {
                            return v.problem == prob.problem._id;
                        });

                        let scoring = Helper.getScoring(prob, contest);
                        let evaluation = scoring.evalContext(subs);

                        let solved = scoring.solved(evaluation);
                        let attempted = scoring.attempted(evaluation);
                        let points = evaluation.score;

                        let pending = subs.filter((v) => {
                            return Object.keys(v.verdict).map((k) => v.verdict[k]).filter((w) => {
                                return w.verdict == "VERDICT_INQ";
                            }).length > 0;
                        }).length > 0;

                        problems.$set(i, Object.assign({}, prob, {scoring, points, solved, attempted, pending}));
                    }

                    return problems;
                }
            },

            /**
             *  Extend my with the following paths
             *      .scoring - scoring *class* used in the contest
             *      .submissions - submissions sent by the current user
             *
             *  Extend my.submissions with the following paths
             *      .timeInContest - minutes into the contest this submission was made
             *      .score - scoring evaluation object
             */
            my:{
                get: function(){
                    if(!this.rawContest || this.submissions === undefined) return {submissions:[]};
                    let scoring = Helper.getScoringClassFromString(this.rawContest.scoring);

                    let submissions = this.submissions.filter((v) => {
                        return v._creator == this.user;
                    });

                    return {scoring, submissions};
                }
            },
            submissions: {
                get: function(){
                    let contest = this.rawContest;
                    let submissions = Vue.util.extend([], this.rawSubmissions);
                    if(!submissions || !contest || !contest.problems) return [];

                    for(let i = 0; i < submissions.length; i++){
                        let sub = submissions[i];
                        let timeInContest = sub.timeInContest;

                        let problem = this.getRawProblem(sub.problem);

                        let scoring = Helper.getScoring(problem, contest);
                        let score = scoring.eval(sub.verdict);

                        submissions.$set(i, Object.assign({}, sub, {timeInContest, score}));
                    }

                    return submissions.sort((a, b) => {
                        return new Date(b.time).getTime() - new Date(a.time).getTime();
                    });
                }
            },
            groupedSubs: {
                get: function(){
                    let submissions = this.submissions;
                    if(!submissions) return {};

                    let res = {};
                    for(let sub of submissions){
                        if(!res.hasOwnProperty(sub._creator))
                                res[sub._creator] = [sub];
                        else
                                res[sub._creator].push(sub);
                    }

                    return res;
                }
            },
            teams: {
                get: function(){
                    let my = this.my;
                    let problems = this.problems;
                    let teams = Vue.util.extend([], this.rawTeams);

                    if(!teams || !my || !problems) return [];
                    let groupedSubs = this.groupedSubs;

                    for(let i = 0; i < teams.length; i++){
                        let results = {};
                        let arr = [];

                        for(let prob of problems){
                            let subs = (groupedSubs[teams[i]._id] || []).filter((v) => {
                                return v.problem === prob.problem._id;
                            });
                            results[prob.problem._id] = prob.scoring.evalContext(subs);
                            arr.push(results[prob.problem._id]);
                        }

                        let merged = this.my.scoring.mergeEvaluations(arr);
                        teams.$set(i, Object.assign({}, teams[i], {merged, results, rank: null}));
                    }

                    teams = teams.sort((a, b) => {
                        if(a.merged.score == b.merged.score)
                                return a.merged.penalty - b.merged.penalty;
                        return b.merged.score - a.merged.score;
                    });

                    let pos = 0;
                    for(let i = 0; i < teams.length; i++){
                        if(!teams[i].unofficial)
                            teams[i].rank = ++pos;
                    }

                    return teams;
                }
            }
        },
        methods:{
            getRawProblem(id){
                for(let prob of this.rawContest.problems){
                    if(prob.problem._id == id)
                            return prob;
                }

                return undefined;
            },
            getRemainingTime(){
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
            fetchContest(){
                Api.contest.get().then((result) => {
                    this.user = result.json()._user;
                    this.rawContest = result.json().contest;
                    this.rawTeams = result.json().teams;
                }).catch((err) => {
                    console.log(err);
                });
            },
            fetchSubmissions(){
                Api.submissions.get().then((res) => {
                    let resObj = res.json();
                    this.rawSubmissions = resObj.submissions;
                }).catch((err) => {
                    console.log(err);
                });
            },
            fetch(){
                this.fetchContest();
                this.fetchSubmissions();
            }
        },
        components:{
            JuProblem: ProblemsComponent,
            JuSubmission: SubmissionsComponent,
            JuStandings: StandingsComponent,
            JuSubmit: SubmitComponent
        }
    }
</script>

<style lang="sass">
</style>