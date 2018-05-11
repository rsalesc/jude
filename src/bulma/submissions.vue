<template>
  <div class="box">
    <div class="box-title">
      <p class="title is-4">
        <span v-if="isAdmin()">Submissions</span>
        <span v-else>My Submissions</span>
      </p>
      <p class="subtitle ju-comment ju-secondary-text">
        {{ getTooltipText() }}
      </p>
    </div>
    <hr class="rule"></hr>
    <div class="box-content">
      <div class="container ju-override-container has-text-centered" v-if="getSubmissions().length === 0">
        <p>There is no submission to be shown.</p>
      </div>
      <div v-else>
        <b-table
          class="ju-b-table-less-compact"
          :data="getSubmissions()"
          :narrowed="true"
          :paginated="true"
          :per-page="getPerPage()"
          :backend-sorting="true">
          
          <template slot-scope="props">
            <b-table-column label="" class="has-text-centered">
              <span :style="{ color: '#'+lighten(getProblem(props.row.problem).color) }">
                {{ getProblem(props.row.problem).letter }}
              </span>
            </b-table-column>

            <b-table-column label="Problem">
              {{ getProblem(props.row.problem).problem.name }}
            </b-table-column>

            <b-table-column v-if="isAdmin()" label="Contestant" >
              {{ getContestantFromSubmission(props.row).name }}
            </b-table-column>
            
            <b-table-column label="Time">
              <span class="ju-comment ju-secondary-text">
                @ {{ getContestTime(props.row.timeInContest) }}
              </span>
            </b-table-column>

            <b-table-column label="Verdict" numeric>
              <ju-verdict-tag 
                :verdict="getMainVerdict(props.row.verdict, getProblem(props.row.problem).problem)" 
                :weighted="getProblem(props.row.problem).scoring.hasWeight()"
                :score="props.row.score">
              </ju-verdict-tag>
            </b-table-column>

            <b-table-column label="-" numeric>
              <b-tooltip v-if="!isAdmin()" label="Edit and re-submit">
                <a class="button is-primary is-small" @click="resubmit(props.row)">
                  <b-icon size="is-small" icon="send"></b-icon>
                </a>
              </b-tooltip>
              <b-tooltip label="See more">
                <a class="button is-primary is-small" @click="showCode(props.row)">
                  <b-icon size="is-small" icon="eye"></b-icon>
                </a>
              </b-tooltip>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </div>

    <b-modal
      :component="CodeModalComponent"
      :active.sync="codeModal.active">
    </b-modal>
    <b-modal
      :component="SubmitComponent"
      :active.sync="submitModal.active"
      :props="submitModal.props">
    </b-modal>
  </div>
</template>

<script type="text/babel">// import 'babel-polyfill';
    import * as Api from "./api.js";
    import * as Helper from "./helpers.js";
    import { mapGetters } from "vuex";
    import { types } from "./store/";
    import SubmitComponent from "./submit.vue";
    import CodeModalComponent from "./code-modal.vue";
    import BulmaUtils from "./bulmutils";
    import JuVerdictTag from "./components/VerdictTag.vue";

    export default {
      mounted() {},
      data() {
        return {
          CodeModalComponent,
          SubmitComponent,
          codeModal: {
            active: false
          },
          submitModal: {
            active: false,
            props: {
              problem: null,
              language: null,
              code: ""
            }
          }
        };
      },
      computed: {
        ...Helper.mapModuleState("main", [
          "shownSubmission",
          "user",
          "userObject"
        ]),
        ...mapGetters([
          "problems",
          "my",
          "submissions",
          "teams"
        ])
      },
      methods: {
        getSelf() {
          return this.userObject;
        },
        isAdmin() {
          return Helper.isAdmin(this.getSelf());
        },
        getPerPage() {
          return this.isAdmin() ? 50 : 5;
        },
        getContestantFromSubmission(sub) {
          for (let team of this.teams) {
            if (team._id === sub._creator)
              return team;
          }

          return { name: "-" };
        },
        getSubmissions() {
          return this.isAdmin() ? this.submissions : this.my.submissions;
        },
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
        async showCode(sub) {
          try {
            const loggedin = await this.$store.dispatch(types.FETCH_AND_SHOW_SUBMISSION, sub._id);
            if (!loggedin)
              this.$router.push("/");
            else
              this.codeModal.active = true;
          } catch (err) {
            console.error(err);
            new BulmaUtils(this).toast("Error contacting to the server", 4000, "is-danger");
          }
        },
        getTooltipText() {
          return Helper.getTooltipText(`Click in the eye button to show more details about a submission.`);
        },
        async resubmit(sub) {
          try {
            const loggedin = await this.$store.dispatch(types.FETCH_AND_SHOW_SUBMISSION, sub._id);
            if (!loggedin)
              this.$router.push("/");
            else {
              this.submitModal.props = {
                ...(this.submitModal.props),
                language: sub.language,
                problem: sub.problem,
                code: this.shownSubmission.code
              };
              this.submitModal.active = true;
            }
          } catch (err) {
            console.error(err);
            new BulmaUtils(this).toast("Error contacting to the server", 4000, "is-danger");
          }
        }
      },
      components: { JuVerdictTag }
    };
</script>

<style lang="sass"></style>
