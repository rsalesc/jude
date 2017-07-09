<template>
  <div id="modal-code" class="modal modal-fixed-footer">
    <div class="modal-content">
        <div>
          <h5>Submission Info<span class="secondary-content">Language: {{ getHumanLanguage() }}</span></h5>
          <table>
            <thead>
              <th>Dataset</th>
              <th>Passed</th>
              <th>Verdict</th>
              <th>Execution Time</th>
            </thead>
            <tbody>
              <tr v-for="(verdict, name) in getVerdicts()" :key="name">
                <td>{{ name }}</td>
                <td>{{ getPassed(verdict) }}</td>
                <td>{{ getHumanVerdict(verdict) }}</td>
                <td>{{ getExecTime(verdict) || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="getCodeCompilationInfo().trim().length > 0">
          <h5>Compilation Result</h5>
          <pre><code id="modal-code-compilati3on">{{ getCodeCompilationInfo() }}</code></pre>
        </div>
        <div>
          <h5>Submitted Code</h5>
          <pre><code id="modal-code-content" :class="getHlsClassBinding()">{{ getCodeContent() }}</code></pre>
        </div>
    </div>
    <div class="modal-footer">
        <a @click.prevent="" href="#!" class="modal-action modal-close waves-effect waves-green btn-flat ">Close</a>
    </div>
  </div>
</template>

<script type="text/babel">
import * as Helper from "./helpers.js";
import moment from "moment";
import "moment/locale/en-gb";
import { types } from "./store/";
import { mapGetters } from "vuex";
import hljs from "./hljs";

moment.locale("en-gb");

export default {
  mounted() {},
  data() {
    return {};
  },
  computed: {
    ...Helper.mapModuleState("main", [
      "shownSubmission",
      "codeModalTrigger"
    ]),
    ...mapGetters([
      "languages"
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
    getCodeContent() {
      const submission = this.shownSubmission || {};
      
      return submission.code || "";
    },
    getCodeLanguage() {
      const submission = this.shownSubmission || {};
      return submission.language || "";
    },
    getHlsClassBinding() {
      return { [Helper.getHlsMode(this.getCodeLanguage())]: true };
    },
    getPassed(v) {
      return Helper.getPassed(v.passed);
    },
    getHumanVerdict(v) {
      return Helper.getHumanVerdict(v.verdict);
    },
    getExecTime(v) {
      return Helper.getExecTime(v);
    },
    getVerdicts() {
      return (this.shownSubmission || {}).verdict || {};
    },
    getHumanLanguage() {
      const l = this.getCodeLanguage();
      for (const [key, language] of this.languages) {
        if (l === key)
          return language;
      }

      return "-";
    }
  },
  watch: {
    codeModalTrigger(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        this.$store.commit(types.CLEAR_MODAL_TRIGGER);
        this.$nextTick(() => {
          hljs.highlightBlock($("#modal-code-content")[0]);
          $("#modal-code").openModal();
        });
      }
    }
  }
};

</script>