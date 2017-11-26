<template>
  <span v-if="!weighted" class="tag" :class="{ [getTagClass()]: true }">
    {{ getHumanVerdict() }}
  </span>
  <span v-else class="tag" :class="{ [getWeightedTagClass()]: true }">
    {{ getScore() }}
  </span>
</template>

<script>
import * as Helper from "../helpers";
export default {
  data() { 
    return {};
  },
  props: {
    score: {
      default: false
    },
    verdict: {
      default: ""
    },
    weighted: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getHumanVerdict() {
      return Helper.getHumanVerdict(this.verdict);
    },
    getTagClass() {
      return Helper.getVerdictTag(this.verdict);
    },
    getWeightedTagClass() {
      if(this.verdict === "VERDICT_INQ")
        return Helper.getVerdictTag(this.verdict);
      else if(this.verdict === "VERDICT_AC")
        return Helper.getVerdictTag(this.verdict);
      else if(this.score.score === 0)
        return Helper.getVerdictTag("VERDICT_WA");
      else
        return "is-dark";
    },
    getScore() {
      if(this.verdict === "VERDICT_INQ")
        return Helper.getHumanVerdict(this.verdict);
      return `${this.score.score} pt(s)`;
    }
  }
};
</script>
