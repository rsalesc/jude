
<template>
  <div>
    <div class="level" v-if="isAdmin()">
      <div class="level-left">
        <div class="level-item ju-primary-text">Filters</div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-switch v-model="config.clarifications.sortByAnswer"
            size="is-small"
            @input="changeConfig">
            Prioritize unanswered
          </b-switch>
        </div>
        <div class="level-item">
          <b-switch v-model="config.clarifications.onlyNonAnswered"
            size="is-small"
            @input="changeConfig">
            Show only non-answered
          </b-switch>
        </div>
      </div>
    </div>
    <div class="container ju-override-container has-text-centered" 
      v-if="clarifications.length === 0">
      <hr class="rule"></hr>
      <p>There are no clarifications to be shown.</p>
    </div>
    <div v-else v-for="clar in sortedClarifications" :key="clar._id">
      <hr class="rule"></hr>
      <ju-clarification-talk :clarification="clar"
        @select="select"></ju-clarification-talk>
    </div>
  </div>
</template>

<script type="text/babel">
import Vue from "vue";
import * as Helper from "./helpers";
import * as Api from "./api";
import { mapGetters } from "vuex";
import { types } from "./store";
import BulmaUtils from "./bulmutils";
import ClarificationTalkComponent from "./clarification-talk.vue";

export default {
  mounted() {},
  data() {
    return {};
  },
  props: ["clarifications"],
  computed: {
    ...Helper.mapModuleState("main", [
      "userObject",
      "config"
    ]),
    ...mapGetters([
      "problems",
      "teams",
      "teamMapping"
    ]),
    sortedClarifications() {
      if (!this.isAdmin())
        return this.clarifications;
      else {
        const { onlyNonAnswered, sortByAnswer } = this.config.clarifications;
        const sorted = Vue.util.extend([], this.clarifications)
          .filter(c => !onlyNonAnswered || !this.answeredByAdmin(c));
        if (!sortByAnswer)
          return sorted;
        sorted.sort((a, b) => {
          const xa = this.answeredByAdmin(a);
          const xb = this.answeredByAdmin(b);
          if (xa && !xb)
            return 1;
          if (xb && !xa)
            return -1;
          if (a.updatedAt > b.updatedAt)
            return -1;
          if (b.updatedAt > a.updatedAt)
            return 1;
          return 0;
        });
        return sorted;
      }
    }
  },
  methods: {
    changeConfig() {
      this.$store.commit(
        types.SET_CLARIFICATIONS_CONFIG, this.config.clarifications);
    },
    getSelf() {
      return this.userObject;
    },
    isAdmin() {
      return this.getSelf().role === "admin";
    },
    select(data) {
      this.$emit("select", data);
    },
    answeredByAdmin(clar) {
      return clar.comments.filter(t => !t._creator).length > 0;
    },
    creator(clar) {
      if (!clar._creator)
        return "Admin";
      else
        return this.teamMapping[clar._creator] || "<unknown>";
    },
    isUserCreator(clar) {
      if (!clar._creator)
        return this.isAdmin();
      else
        return this.getSelf()._id === clar._creator;
    },
    getCommentClasses(clar) {
      if (!clar._creator)
        return ["is-dark"];
      else if (this.isUserCreator(clar))
        return ["is-primary"];
      else
        return ["is-info"];
    },
    getProblem(id) {
      for (const prob of this.problems) {
        if (prob.problem._id === id)
          return prob;
      }

      return undefined;
    }
  },
  components: {
    JuClarificationTalk: ClarificationTalkComponent
  }
};
</script>
