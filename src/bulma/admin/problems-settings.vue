<template>
  <div>
    <b-field>
      <ju-problem-picker 
        :problems="data" 
        @select="addProblem" 
        placeholder="Select a problem to add it..." expanded>
      </ju-problem-picker>
    </b-field>
    <div class="media" v-for="(prob, index) in filteredProblems" :key="prob.problem._id">
      <div class="media-left ju-letter-input">
        <b-input 
          :value="prob.letter"
          placeholder="?"
          @input="letter => localProblems[index].letter = letter.toUpperCase()">
        </b-input>
      </div>
      <div class="media-content">
        <p class="ju-problem-title">
          <color-picker
           :value="'#' + prob.color" 
            @change="color => changeColor(index, color)"></color-picker>
          {{ prob.problem.name }}
          <i class="ju-tertiary-text">{{ prob.problem.code }}</i>
        </p>
        <p class="ju-tertiary-text">
          {{ prob.problem.attr.limits.time }} ms / {{ prob.problem.attr.limits.memory }} MB
        </p>
      </div>
      <div class="media-right">
        <b-tooltip label="Remove problem from contest (submissions not removed)">
          <a class="button is-danger is-small" @click="localProblems.splice(index, 1)">
            <b-icon size="is-small" icon="remove"></b-icon>
          </a>
        </b-tooltip>
      </div>
    </div>
    <button class="button is-small is-primary" @click="confirm">
      Save
    </button>
  </div>
</template>

<script type="text/babel">// import 'babel-polyfill';
    import * as Helper from "@front/helpers.js";
    import JuProblemPicker from "@front/components/ProblemPicker.vue";
    import { VueColorpicker } from "vue-pop-colorpicker";
    import Vue from "vue";
    const clone = require("clone");

    export default {
      props: {
        data: { type: Array, default: () => []},
        problems: { type: Array }
      },
      data() {
        return {
          localProblems: clone(this.problems, false)
        };
      },
      computed: {
        problemMap() {
          const map = {};
          for (const problem of this.data)
            map[problem._id] = problem;
          return map;
        },
        filteredProblems() {
          return this.localProblems
            .filter(prob => this.problemMap.hasOwnProperty(prob.problem))
            .map(prob => ({ ...prob, problem: this.getProblemById(prob.problem) }));
        }
      },
      methods: {
        confirm() {
          this.$dialog.confirm({
            message: "Do you want to save these changes?",
            onConfirm: () => this.$emit("submit", this.localProblems)
          });
        },
        getProblemById(id) {
          if (!this.problemMap.hasOwnProperty(id))
            throw Error("Problem was not found in problem list");
          return this.problemMap[id];
        },
        changeColor(index, newRgb) {
          this.localProblems[index].color = Helper.rgbToHex(newRgb).substring(1);
        },
        addProblem(problem) {
          this.localProblems.push({
            problem: problem._id,
            color: "000",
            letter: ""
          });
        }
      },
      components: {
        JuProblemPicker,
        ColorPicker: VueColorpicker
      }
    };
</script>

<style lang="sass"></style>
