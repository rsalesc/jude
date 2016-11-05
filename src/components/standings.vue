<template>
    <div id="problems-container" class="z-depth-1 col s11 card-panel jude-panel">
        <h5 class="card-title">Standings</h5>
        <table class="standings-table bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th></th>
                    <th class="problem-letter">
                        <p class="score">Score</p>
                    </th>
                    <th class="problem-letter" v-for="problem in problems">
                        <p>{{ problem.letter }}</p>
                        <p class="score-info"></p>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="team in teams">
                    <td>{{ team.rank }}</td>
                    <td class="team-name">
                        <p>{{ team.name }}</p>
                        <p class="team-description">{{ team.description }}</p>
                    </td>
                    <td class="problem-letter">
                        <p>{{ team.merged.score }}</p>
                        <p class="score-info" v-if="my.scoring.hasPenalty()">
                            {{ getContestTime(team.merged.penalty) }}
                        </p>
                    </td>
                    <td class="problem-letter lighter" v-for="problem in problems"
                        :class="{'ac-color': isAc(team, problem), 'wa-color': isWa(team, problem)}"
                        @dblclick.stop="showScore(team._id, problem.problem)">
                        <span v-if="problem.scoring.attempted(team.results[problem.problem._id])">
                            <p> {{ getProblemScore(team, problem) }}</p>
                            <p class="score-info" v-if="my.scoring.hasPenalty() && isAc(team, problem)">
                                {{ getContestTime(team.results[problem.problem._id].penalty) }}
                            </p>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Standings Modal -->
    <div id="modal-standings" class="modal modal-fixed-footer">
        <div class="modal-content submission-list">
            <div v-for="sub in renderedSubmissions" class="submission-line">
                <a href="#" @click.stop="showCode(sub)">
                    <i class="material-icons">remove_red_eye</i>
                </a>
                <span class="submission-time"> @ {{ getContestTime(sub.timeInContest) }} </span>
                <span class="right">
                    {{ getHumanVerdict(getMainVerdict(sub.verdict, getProblem(sub.problem).problem)) }}
                </span>
            </div>
        </div>
        <div class="modal-footer">
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
        </div>
    </div>
</template>

<script type="text/babel">
    import 'babel-polyfill';
    import * as Helper from './helpers.js';

    export default {
        ready(){},
        data() {
            return {
                renderedSubmissions: []
            }
        },
        methods:{
            isPending(prob){
                return prob.pending && !prob.solved;
            },
            isWa(team, prob){
                let result = team.results[prob.problem._id];
                return prob.scoring.attempted(result) && !prob.scoring.solved(result);
            },
            isAc(team, prob){
                return prob.scoring.solved(team.results[prob.problem._id]);
            },
            getProblem(id){
                for(let prob of this.problems){
                    if(prob.problem._id == id)
                        return prob;
                }

                return undefined;
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
            getProblemScore(team, prob){
                let result = team.results[prob.problem._id];
                if(this.isAc(team, prob)) {
                    if(result.fails === 0) return "+";
                    return `+${result.fails}`;
                } else if(this.isWa(team, prob)){
                    return `-${result.fails}`;
                }
                return "";
            },
            lighten(t){
                return Helper.lighten(t);
            },
            showScore(id, problem){
                let modal = $('#modal-standings');
                let group = this.groupedSubs[id];
                if(!group) return;
                this.renderedSubmissions = group.filter((x) => x.problem == problem._id);
                modal.openModal();
            },
            showCode(sub){
                Helper.showCode(sub);
            }
        },
        props: {
            "problems":{
                type: Array,
                default: () => []
            },
            "my":{
                default: () => {}
            },
            "groupedSubs":{
                default: () => {}
            },
            "teams":{
                default: () => []
            }
        }
    }
</script>

<style lang="sass"></style>