<template>
  <div v-if="!editing" class="has-nested-fields">
    <b-field v-for="(value, key) in shownMap" :key="key" grouped>
      <p class="control">
        <pre class="ju-pre-field">{{ key }}:</pre>
      </p>
      <p class="control">
        <pre class="ju-pre-field">{{ value }}</pre>
      </p>
    </b-field>
    <b-field grouped>
      <p class="control">
        <button class="button is-small" @click="edit">
          <b-icon size="is-small" icon="edit"></b-icon>
          <span>{{ editText }}</span>
        </button>
      </p>
    </b-field>
  </div>
  <div v-else class="has-nested-fields">
    <b-field 
       v-for="(path, index) in editedPaths" 
      :key="index" 
      grouped>
      <b-input size="is-small" v-model="path.key" placeholder="Option name"></b-input>
      <b-input size="is-small" v-model="path.value" placeholder="Option value"></b-input>
      <p class="control">
        <button class="button is-danger is-small" @click="editedPaths.splice(index, 1)">
          <b-icon size="is-small" icon="remove"></b-icon>
        </button>
      </p>
    </b-field>
    <b-field grouped>
      <p class="control">
        <button class="button is-primary is-small" @click="add">
          <b-icon size="is-small" icon="plus"></b-icon>
        </button>
      </p>
      <p class="control">
        <button class="button is-primary is-small" @click="done">
          Done
        </button>
      </p>
      <p class="control">
        <button class="button is-small" @click="cancel">
          Cancel
        </button>
      </p>
    </b-field>
  </div>
</template>

<script>
import * as Helper from "@front/helpers";

function genRandom(len) {
  const data = "0123456789abcdef";
  let res = "";
  for (let i = 0; i < len; i++)
    res += data[(Math.random() * data.length)|0];
  return res;
}

export default {
  data() {
    return {
      editing: false,
      editedPaths: []
    };
  },
  props: {
    value: { type: Object },
    editText: { type: String, default: "Edit" }
  },
  computed: {
    shownMap() {
      const map = Helper.objectToPathMap(this.value);
      for (const [key, value] of Object.entries(map))
        map[key] = JSON.stringify(value);
      Object.keys(map).forEach(key => map[key] === undefined && delete map[key]);
      return map;
    }
  },
  methods: {
    add() {
      this.editedPaths.push({ key: "", value: "" });
    },
    edit() {
      this.editedPaths = Object.entries(this.shownMap).map(([key, value]) => ({ key, value }));
      this.editing = true;
    },
    done() {
      this.editing = false;
      const map = {};
      for (const { key, value } of this.editedPaths)
        map[key] = value;
      this.$emit("input", Helper.pathMapToObject(map));
      this.editedPaths = [];
    },
    cancel() {
      this.editing = false;
      this.editedPaths = [];
    }
  }
};
</script>
