<template>
  <b-autocomplete
    v-if="select"
    v-model="name"
    :size="size"
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
          <br>
          <i class="ju-secondary-text">{{ props.option.handle }}</i>
        </p>
      </div>
    </template>
  </b-autocomplete>
  <b-input
    v-else
    v-model="name"
    :size="size"
    :expanded="expanded"
    :placeholder="placeholder"
    @input="getData">
  </b-input>
</template>

<script>
import * as Helper from "@front/helpers";
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
    users: {
      type: Array,
      default: () => []
    },
    select: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "Select a problem..."
    },
    size: String,
    threshold: {
      type: Number,
      default: 0.4
    }
  },
  computed: {
    useFuzzy() {
      return this.users.length < 10000;
    },
    index() {
      const users = this.users.map((user, index) => ({ ...user, ref: index }));
      if (!this.useFuzzy) {
        return elasticlunr(function () {
          this.addField("handle");
          this.addField("name");
          this.setRef("ref");
          this.saveDocument(false);

          for (const user of users)
            this.addDoc(user);
        });
      } else {
        return new Fuse(users, {
          shouldSort: true,
          threshold: 0.6,
          tokenize: true,
          includeScore: true,
          includeMatches: true,
          location: 0,
          distance: 32,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: ["handle", "name"]
        });
      }
    }
  },
  methods: {
    selected(option) {
      this.$emit("select", option);
    },
    getData: debounce(function () {
      if (!this.name)
        this.data = this.users;
      else if (this.useFuzzy) {
        this.data = this.index.search(this.name)
          .filter(result => result.score < this.threshold)
          .map(result => result.item);
      } else {
        this.data = this.index.search(this.name)
          .map(result => this.users[result.ref]);
      }
      this.$emit("filter", this.data);
    }, 300)
  }
};
</script>
