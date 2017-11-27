<template>
  <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Team Submissions</p>
        <p class="ju-tertiary-text">
          Team: {{ getTeamName() }}<br>
          Problem: {{ getProblemName() }}
        </p>
      </header>
      <section class="modal-card-body">
        <b-table
          class="ju-b-table-compact"
          :data="getSubmissions()"
          :narrowed="true"
          :paginated="true"
          :per-page="5"
          :backend-sorting="true">
          <template scope="props">
            <b-table-column label="Time In Contest">
              {{ getContestTime(props.row) }}
            </b-table-column>
            <b-table-column label="Verdict">
              <ju-verdict-tag 
                :verdict="getMainVerdict(props.row.verdict, problem.problem)" 
                :weighted="problem.scoring.hasWeight()"
                :score="props.row.score">
              </ju-verdict-tag>
            </b-table-column>

            <b-table-column label="-" numeric>
              <b-tooltip label="See more">
                <a class="button is-primary is-small" @click="showCode(props.row)" v-if="canSee()">
                  <b-icon size="is-small" icon="eye"></b-icon>
                </a>
              </b-tooltip>
            </b-table-column>
          </template>
        </b-table>
      </section>
      <footer class="modal-card-foot">
        <a class="button" @click="close()">Close</a>
      </footer>

      <b-modal
        :component="CodeModalComponent"
        :active.sync="codeModal.active">
      </b-modal>
    </div>
</template>

<script type="text/babel">
import * as Helper from "./helpers.js";
import moment from "moment";
import "moment/locale/en-gb";
import { types } from "./store/";
import { mapGetters } from "vuex";
import JuVerdictTag from "./components/VerdictTag.vue";
import CodeModalComponent from "./code-modal.vue";


moment.locale("en-gb");

export default {
  data() {
    return {
      CodeModalComponent,
      codeModal: {
        active: false
      }
    };
  },
  props: {
    team: {
      default: null
    },
    problem: {
      default: null
    },
    shownSubmissions: {
      default: () => []
    }
  },
  computed: {
    ...Helper.mapModuleState("main", [
      "user",
      "userObject",
      "rawContest"
    ])  
  },
  methods: {
    getSelf() {
      return this.userObject;
    },
    isAdmin() {
      return this.getSelf().role === "admin";
    },
    getSubmissions() {
      if(!this.shownSubmissions)
        return [];
      return this.shownSubmissions;
    },
    getProblemName() {
      if(!this.problem)
        return "";

      return `${this.problem.letter}. ${this.problem.problem.name}`;
    },
    getTeamName() {
      if(!this.team)
        return "";
      return this.team.name;
    },
    getContestTime(submission) {
      return Helper.getFormattedContestTime(submission.timeInContest);
    },
    getMainVerdict(a, b) {
      return Helper.getMainVerdict(a, b);
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
    canSubmit() {
      return this.team._id === this.getSelf()._id;
    },
    canSee() {
      return this.canSubmit() || this.hasContestEnded() || this.isAdmin();
    },
    close() {
      this.$emit("close");
    },
    hasContestEnded() {
      return Helper.hasContestEnded(this.rawContest);
    }
  },
  components: { JuVerdictTag }
};

</script>