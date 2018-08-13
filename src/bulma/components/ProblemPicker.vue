<template>
  <b-autocomplete
    v-model="name"
    :data="data"
    :open-on-focus="true"
    :expanded="expanded"
    :placeholder="placeholder"
    field="name"
    @input="getData"
    @select="selected">
    <template slot-scope="props">
      <div>
        <p>
          {{ props.option.name }}
          <i class="ju-secondary-text">{{ props.option.code }}</i>
        </p>
        <p class="ju-tertiary-text">
          {{ props.option.attr.limits.time }} ms / {{ props.option.attr.limits.memory }} MB
        </p>
      </div>
    </template>
  </b-autocomplete>
</template>

<script>
import * as Helper from "../helpers";
import debounce from "debounce";
import elasticlunr from "elasticlunr";
import Fuse from "fuse.js";

export default {
  mounted() {
    this.$nextTick(() => this.getData());
  },
  data() {
    return {
      data: [],
      name: ""
    };
  },
  props: {
    problems: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "Select a problem..."
    }
  },
  computed: {
    useFuzzy() {
      return this.problems.length < 10000;
    },
    index() {
      const problems = this.problems.map((problem, index) => ({ ...problem, ref: index }));
      if (!this.useFuzzy) {
        return elasticlunr(function() {
          this.addField("code");
          this.addField("name");
          this.setRef("ref");
          this.saveDocument(false);

          for (const prob of problems)
            this.addDoc(prob);
        });
      } else {
        return new Fuse(problems, {
          shouldSort: true,
          threshold: 0.6,
          tokenize: true,
          includeScore: true,
          includeMatches: true,
          location: 0,
          distance: 32,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: ["code", "name"]
        });
      }
    }
  },
  methods: {
    selected(option) {
      this.$emit("select", option);
      this.$nextTick(() => this.name = "");
    },
    getData: debounce(function() {
      if (!this.name)
        return this.problems;
      if (this.useFuzzy) {
        this.data = this.index.search(this.name)
          .filter(result => result.score < 0.4)
          .map(result => result.item);
      } else {
        this.data = this.index.search(this.name)
          .map(result => this.problems[result.ref]);
      }
    }, 300)
  }
};
</script>
