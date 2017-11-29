<template>
  <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Submission Details</p>
        <p class="ju-tertiary-text">
          Language: {{ getHumanLanguage() }}<br>
          Time: {{ getContestTime() }}
        </p>
      </header>
      <section class="modal-card-body">
        <span v-if="getCodeCompilationInfo().trim().length > 0">
          <p class="title is-6">Compilation Output</p>
          <pre class="ju-tertiary-text"><code>{{ getCodeCompilationInfo() }}</code></pre>
          <hr class="rule">
        </span>
        <p class="title is-6">Grading Information</p>
        <b-table
          class="ju-b-table-compact"
          :data="getVerdicts()"
          :narrowed="true"
          :paginated="false"
          :backend-sorting="true">
          <template scope="props">
            <b-table-column label="Dataset">
              {{ props.row.name }}
            </b-table-column>
            <b-table-column label="Passed">
              {{ getPassed(props.row.verdict) }}
            </b-table-column>
            <b-table-column label="Running time">
              {{ getExecTime(props.row.verdict) }}
            </b-table-column>
            <b-table-column label="Verdict">
              <ju-verdict-tag 
                :verdict="props.row.verdict.verdict" 
                :weighted="false">
              </ju-verdict-tag>
            </b-table-column>
          </template>
        </b-table>
        <div v-show="getCodeContent()">
          <hr class="rule">
          <p class="title is-6">Code</p>
          <brace
            :id="braceId"
            :value="getCodeContent()"
            style="height: 175px;"
            :readonly="true"
            :theme="'github'" :mode="getBraceMode()"></brace>
        </div>
      </section>
      <footer class="modal-card-foot">
        <a class="button" @click="close()">Close</a>
      </footer>
    </div>
</template>

<script type="text/babel">
import * as Helper from "./helpers.js";
import moment from "moment";
import "moment/locale/en-gb";
import { types } from "./store/";
import { mapGetters } from "vuex";
import Brace from "./components/Brace.vue";
import JuVerdictTag from "./components/VerdictTag.vue";


moment.locale("en-gb");

function genRandom(len) {
  const data = "0123456789abcdef";
  let res = "";
  for (let i = 0; i < len; i++)
    res += data[(Math.random() * data.length)|0];
  return res;
}

export default {
  mounted() {
    this.braceId = genRandom(8);
  },
  data() {
    return {
      braceId: "default"
    };
  },
  computed: {
    ...Helper.mapModuleState("main", [
      "shownSubmission"
    ]),
    ...mapGetters([
      "languages",
      "my",
      "problems"
    ])
  },
  methods: {
    getCodeCompilationInfo() {
      const submission = this.shownSubmission || {};
      if (!submission.verdict)
        return "";
      
      for (const [tag, dataset] of Object.entries(submission.verdict)) {
        if (dataset.verdict === "VERDICT_CE") {
          return (dataset.info || {}).text || "";
        }
      }

      return "";
    },
    getProblem(id) {
      for (const prob of this.problems) {
        if (prob.problem._id === id)
          return prob;
      }

      return undefined;
    },
    getCodeContent() {
      const submission = this.shownSubmission || {};
      
      return submission.code || "";
    },
    getCodeLanguage() {
      const submission = this.shownSubmission || {};
      return submission.language || "";
    },
    getBraceMode() {
      return Helper.getBraceMode(this.getCodeLanguage());
    },
    getPassed(v) {
      return Helper.getPassed(v.passed);
    },
    getHumanVerdict(v) {
      return Helper.getHumanVerdict(v.verdict);
    },
    getExecTime(v) {
      return Helper.getExecTime(v) || "-";
    },
    getVerdicts() {
      const verdictsObj = (this.shownSubmission || {}).verdict || {};
      return Object.entries(verdictsObj).map(([name, verdict]) => ({ name, verdict }));
    },
    getHumanLanguage() {
      const l = this.getCodeLanguage();
      for (const [key, language] of this.languages) {
        if (l === key)
          return language;
      }

      return "-";
    },
    getContestTime() {
      return Helper.getFormattedContestTime(this.shownSubmission.timeInContest);
    },
    close() {
      this.$emit("close");
    }
  },
  components: { Brace, JuVerdictTag }
};

</script>