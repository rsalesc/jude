<template>
    <div class="col s6 padded-container">
        <div class="z-depth-1 card-panel jude-panel">
            <h5 class="card-title">
                <span>Submissions</span>
                <span class="comment">Click in the eye to see more details about a submission.</span>
            </h5>
            <paginate name="submissions" :list="my.submissions" :per="100"
                class="collapsible submission-list">
                <li v-for="sub in paginated('submissions')" :key="sub._id">
                    <div class="collapsible-header">
                        <i class="problem-index" :style="{color: '#'+lighten(getProblem(sub.problem).color)}">
                            {{ getProblem(sub.problem).letter }}
                        </i>
                        <span class="problem-title">
                            {{ getProblem(sub.problem).problem.name }}
                            <span class="submission-time">@ {{ getContestTime(sub.timeInContest) }}</span>
                        </span>
                        <span class="right" v-if="sub.score.affect">
                            <a href="#" @click.stop.prevent="showCode(sub)">
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
                                <tr v-for="(verdict, name) in sub.verdict" :key="name">
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
            </paginate>

            <paginate-links for="submissions" :async="true"></paginate-links>

            <!--<ul class="pagination>
                <li class="waves-effect" v-for="link in mySubmissionsLinks"
                    :class="{active: currentMySubmissionsPage == link}">
                    <a @click.stop="changeMySubmissionsPage(link)" href="#">
                        {{ link }}
                    </a>
                </li>
            </ul>-->
        </div>
    </div>
</template>

<script type="text/babel">// import 'babel-polyfill';
    import * as Api from "./api.js";
    import * as Helper from "./helpers.js";
    import { mapGetters } from "vuex";
    import { types } from "./store/";

    export default {
      mounted() {
        $(".collapsible").collapsible();
      },
      data() {
        return { paginate: ["submissions"]};
      },
      computed: {
        ...mapGetters([
          "problems",
          "my"
        ])
      },
      methods: {
        getProblem(id) {
          for (const prob of this.problems) {
            if (prob.problem._id === id)
              return prob;
          }

          return undefined;
        },
        getPassed(n) {
          return Helper.getPassed(n);
        },
        getMainVerdict(a, b) {
          return Helper.getMainVerdict(a, b);
        },
        getHumanVerdict(x) {
          return Helper.getHumanVerdict(x);
        },
        getContestTime(t) {
          return Helper.getFormattedContestTime(t);
        },
        getExecTime(t) {
          return Helper.getExecTime(t);
        },
        lighten(t) {
          return Helper.lighten(t);
        },
        showCode(sub) {
          return this.$store.dispatch(types.FETCH_AND_SHOW_SUBMISSION, sub._id);
        }
      },
      watch: {
        my(val) {
          this.fullMySubmissions = val.submissions || [];
        }
      }
    };
</script>

<style lang="sass"></style>