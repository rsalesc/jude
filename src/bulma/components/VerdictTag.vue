<template>
  <span v-if="!weighted" class="tag" :class="{ [getTagClass()]: true }">
    {{ getHumanVerdict() }}
  </span>
  <span v-else class="tag is-dark">
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
    getScore() {
      return `${this.score.score} pt(s)`;
    }
  }
};
</script>