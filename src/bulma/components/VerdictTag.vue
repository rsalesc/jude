<template>
  <span v-if="!weighted" class="tag" :class="{ [getTagClass()]: true }">
    {{ getHumanVerdict() }}
  </span>
  <span v-else class="tag is-dark">
    {{ props.row.score.score }} pt
  </span>
</template>

<script>
import * as Helper from "../helpers";
export default {
  data() { 
    return {};
  },
  props: {
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
    }
  }
};
</script>