<template>
  <div class="box">
    <div class="box-title">
      <p class="title is-4">
        <span v-if="isAdmin()">Submissions</span>
        <span v-else>My Submissions</span>
        <b-tooltip label="There are undelivered balloons."
                   v-if="isAdmin() && undeliveredBalloons > 0">
          <span class="is-danger tag ju-tag is-rounded">
            {{ undeliveredBalloons }}
          </span>
        </b-tooltip>
      </p>
      <p class="subtitle ju-comment ju-secondary-text">
        {{ getTooltipText() }}
      </p>
      <p class="subtitle ju-comment ju-secondary-text" v-if="isBlind()">
        The contest is in blind phase. Your submissions won't be judged
        until the contest ends and the scoreboard is unfrozen.
      </p>
    </div>
    <hr class="rule"></hr>
    <div class="box-content">
      <div class="level" v-if="isAdmin()">
        <div class="level-left">
          <div class="level-item ju-primary-text">Filters</div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-switch v-model="config.submissions.onlyAc"
                      size="is-small"
                      @input="changeConfig">
              Show only AC
            </b-switch>
          </div>
          <div class="level-item">
            <b-switch v-model="config.submissions.onlyUndelivered"
                      size="is-small"
                      @input="changeConfig">
              Show only undelivered
            </b-switch>
          </div>
          <div class="level-item">
            <b-select placeholder="By Problem"
              v-model="config.submissions.byProblem"
              @input="changeConfig"
              size="is-small">
              <option value=""></option>
              <option v-for="prob in problems" :key="prob.problem._id"
                      :value="prob.problem._id">
              {{ prob.letter }}. {{ prob.problem.name }}
              </option>
            </b-select>
          </div>
          <div class="level-item">
            <button class="button is-primary is-small"
              @click="rejudge(getSubmissions())">
              <b-icon size="is-small" icon="retweet"></b-icon>
              <span>Rejudge Filtered</span>
            </button>
          </div>
        </div>
      </div>

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
            <b-table-column label="" class="has-text-centered"
              :style="getProblemBorder(props.row.problem)">
              <span>
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
                :weighted="getProblem(props.row.problem).scoring.hasPartial()"
                :score="props.row.score"
                v-if="isAdmin() || !isBlind(props.row.timeInContest)">
              </ju-verdict-tag>
              <span v-else class="tag">blind</span>
            </b-table-column>
            <b-table-column label="-" numeric>
              <b-tooltip label="Check if balloon for this problem was delivered"
                         v-if="isAdmin() && isAc(props.row) && !isUpsolving(props.row)"
                         position="is-left">
                <a class="button is-small" @click="toggle(props.row)"
                   :class="{ 'is-info': getBalloon(props.row) }">
                  <b-icon size="is-small" icon="map-marker"></b-icon>
                  <span>Balloon</span>
                </a>
              </b-tooltip>
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
              <b-tooltip label="Rejudge" v-if="isAdmin()">
                <a class="button is-primary is-small" @click="rejudge(props.row)">
                  <b-icon size="is-small" icon="retweet"></b-icon>
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
          "userObject",
          "config",
          "rawContest"
        ]),
        ...mapGetters([
          "problems",
          "my",
          "submissions",
          "teams",
          "teamMapping"
        ]),
        undeliveredBalloons() {
          return [...new Set(this.submissions
            .filter(s => !this.isUpsolving(s) && this.isAc(s) && !this.getBalloon(s))
            .map(s => `${s.problem}/${s._creator}`))].length;
        }
      },
      methods: {
        isFrozen(x) {
          return Helper.isFrozen(this.rawContest, x);
        },
        isBlind(x) {
          return Helper.isBlind(this.rawContest, x);
        },
        getProblemBorder(problem) {
          const thickness = this.isAdmin() ? 5 : 1;
          return { borderLeft: `${thickness}px solid #${this.getProblem(problem).color}` };
        },
        isUpsolving(sub) {
          return sub.timeInContest < 0;
        },
        changeConfig() {
          const { submissions } = this.config;
          this.$store.commit(types.SET_SUBMISSIONS_CONFIG, submissions);
        },
        getBalloon(sub) {
          return this.$store.getters.getBalloon(
            this.getContestantFromSubmission(sub)._id, sub.problem);
        },
        toggle(sub) {
          const team = this.getContestantFromSubmission(sub);
          if (!team._id)
            return;
          this.$store.commit(types.MARK_BALLOON, {
            team: team._id,
            problem: sub.problem,
            state: !this.getBalloon(sub)
          });
        },
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
          return this.teamMapping[sub._creator] || { name: "-" };
        },
        getSubmissions() {
          const subs = this.isAdmin() ? this.submissions : this.my.submissions;
          const { onlyAc, byProblem, onlyUndelivered } = this.config.submissions;
          return subs.filter(s => !onlyAc || this.isAc(s))
            .filter(s => !byProblem || s.problem === byProblem)
            .filter(s => !onlyUndelivered || this.isAc(s) && !this.getBalloon(s));
        },
        getProblem(id) {
          for (const prob of this.problems) {
            if (prob.problem._id === id)
              return prob;
          }

          return undefined;
        },
        isAc(sub) {
          const prob = this.getProblem(sub.problem);
          if (!prob)
            return false;
          return this.getMainVerdict(sub.verdict, prob.problem) === "VERDICT_AC";
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
        async fetchAll() {
          try {
            const loggedin = await this.$store.dispatch(types.FETCH_CONTEST_DATA);
            if (!loggedin)
              this.$router.push("/");
          } catch (err) {
            new BulmaUtils(this).toastResponseError(err);
          }
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
        rejudge(subs) {
          if (!Array.isArray(subs))
            subs = [subs];
          this.$dialog.confirm({
            message: `Do you really want to rejudge ${subs.length} submission(s)?`,
            onConfirm: async () => {
              try {
                await Api.rejudge.save({}, { submissions: subs.map(s => s._id) });
                this.fetchAll();
              } catch (response) {
                if (response.status === 401 || response.status === 403)
                  this.$router.push("/");
                new BulmaUtils(this).toastResponseError(response);
              }
            }
          });
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
