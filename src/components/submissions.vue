<template>
    <div id="problems-container" class="z-depth-1 col s5 card-panel jude-panel">
        <h5 class="card-title">Submissions</h5>
        <ul class="collapsible submission-list" v-paginate:5="mySubmissions">
            <li v-for="sub in mySubmissions">
                <div class="collapsible-header">
                    <i class="problem-index" :style="{color: '#'+lighten(getProblem(sub.problem).color)}">
                        {{ getProblem(sub.problem).letter }}
                    </i>
                    <span class="problem-title">
                        {{ getProblem(sub.problem).problem.name }}
                        <span class="submission-time">@ {{ getContestTime(sub.timeInContest) }}</span>
                    </span>
                    <span class="right" v-if="sub.score.affect">
                        <a href="#" @click.stop="showCode(sub)">
                            <i class="material-icons">remove_red_eye</i>
                        </a>
                        <span v-if="my.scoring.hasWeight()">
                            {{ sub.score.score }} pts
                        </span>
                        <span v-else>
                            {{ getHumanVerdict(getMainVerdict(sub.verdict, getProblem(sub.problem).problem)) }}
                        </span>
                    </span>
                </div>

                <div class="collapsible-body">
                    <table class="verdict-table">
                        <thead>
                            <tr>
                                <th>Dataset</th>
                                <th>Passed</th>
                                <th>Verdict</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(name, verdict) in sub.verdict">
                                <td>{{ name }}</td>
                                <td>{{ getPassed(verdict.passed) }}</td>
                                <td>
                                    {{ getHumanVerdict(verdict.verdict) }}
                                    <span v-if="getExecTime(verdict) !== null">
                                        ({{ getExecTime(verdict) }})
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </li>
        </ul>

        <ul class="pagination" style="text-align: right">
            <li class="waves-effect" v-for="link in mySubmissionsLinks"
                :class="{active: currentMySubmissionsPage == link}">
                <a @click.stop="changeMySubmissionsPage(link)" href="#">
                    {{ link }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script type="text/babel">
    import 'babel-polyfill';
    import * as Api from './api.js';
    import * as Helper from './helpers.js';

    export default {
        ready(){},
        data() {
            return {
                mySubmissions: []
            }
        },
        methods:{
            getProblem(id){
                for(let prob of this.problems){
                    if(prob.problem._id == id)
                        return prob;
                }

                return undefined;
            },
            getPassed(n){
                return Helper.getPassed(n);
            },
            getMainVerdict(a, b){
                return Helper.getMainVerdict(a, b);
            },
            getHumanVerdict(x){
              return Helper.getHumanVerdict(x);
            },
            getContestTime(t){
                return Helper.getFormattedContestTime(t);
            },
            getExecTime(t){
                return Helper.getExecTime(t);
            },
            lighten(t){
                return Helper.lighten(t);
            },
            showCode(sub){
                return Helper.showCode(sub);
            }
        },
        watch:{
            my: function(val){
                this.fullMySubmissions = val.submissions || [];
            }
        },
        props: {
            "problems":{
                type: Array,
                default: () => []
            },
            "my":{
                default: () => {}
            }
        }
    }
</script>

<style lang="sass"></style>