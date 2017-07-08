<template>
  <div id="modal-code" class="modal modal-fixed-footer">
    <div class="modal-content">
        <pre>
          <code id="modal-code-compilation">{{ getCodeCompilationInfo() }}</code>
        </pre>
        <pre>
            <code id="modal-code-content" :class="getHlsClassBinding()">{{ getCodeContent() }}</code>
        </pre>
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