<template>
    <div class="box">
      <div class="box-title">
        <p class="title is-4">Problems</p>
      </div>
      <hr class="rule"></hr>
      <div class="box-content">
        <div class="container ju-override-container has-text-centered" v-if="problems.length === 0">
          <p>There are no problems to be shown.</p>
        </div>
        <div v-else class="media" v-for="prob in problems" :key="prob.problem._id">
          <div class="media-left ju-circle" :class="getCellClasses(prob)">
            <span>{{ prob.letter }}</span>
          </div>

          <div class="media-content">
            <p class="ju-problem-title"> 
              <span class="ju-color-block"
                    :style="{ backgroundColor: `#${prob.color}` }"></span>
              {{ prob.problem.name }}
            </p>
            <p class="ju-tertiary-text">
              {{ prob.problem.attr.limits.time }} ms / {{ prob.problem.attr.limits.memory }} MB
              <span v-if="my.scoring.hasWeight()">/ {{ getProblemWorthScore(prob) }} pt(s)</span>
            </p>
          </div>

          <div class="media-right">
            <b-tooltip label="Download statement">
              <a class="button is-primary is-small"
                :href="`/contest/statement/${prob.letter}`" target="_blank">
                <b-icon size="is-small" icon="file-text"></b-icon>
              </a>
            </b-tooltip>
            <b-tooltip label="Quick submit" v-if="!isAdmin()">
              <a class="button is-primary is-small" @click="quickSubmit(prob)">
                <b-icon size="is-small" icon="send"></b-icon>
              </a>
            </b-tooltip>
          </div>
        </div>
      </div>

      <b-modal
        :component="SubmitComponent"
        :active.sync="submitModal.active"
        :props="submitModal.props">
      </b-modal>
    </div>
</template>

<script type="text/babel">
    // import 'babel-polyfill';
    import * as Helper from "./helpers";
    import { mapGetters } from "vuex";
    import SubmitComponent from "./submit.vue";

    export default {
        mounted () {},
        data() {
            return {
              SubmitComponent,
              submitModal: {
                active: false,
                props: {
                  problem: null
                }
              }
            };
        },
        computed: {
            ...Helper.mapModuleState("main", [
              "userObject"
            ]),
            ...mapGetters([
                "problems",
                "my"
            ])
        },
        methods: {
            getSelf() {
              return this.userObject;         
            },
            isAdmin() {
              return Helper.isAdmin(this.getSelf());
            },
            isPending(prob){
                return prob.pending && !prob.solved;
            },
            isWa(prob){
                return prob.attempted && !prob.solved && !prob.pending;
            },
            isAc(prob){
                return prob.solved;
            },
            getCellClasses(prob) {
              if (this.isAc(prob))
                return ["ac-color"];
              else if (this.isWa(prob))
                return ["wa-color"];
              return [];
            },
            getProblemWorthScore(prob) {
              if (this.my.scoring.hasWeight())
                return prob.scoring.weight;
              return "";
            },
            lighten(t){
                return Helper.lighten(t);
            },
            darken(t) {
              return Helper.darken(t);
            },
            getTooltipText() {
              return Helper.getTooltipText(`Click in the page icon to download the statement for a problem.`);
            },
            quickSubmit(prob) {
              this.submitModal.props.problem = prob.problem._id;
              this.submitModal.active = true;
            }
        }
    }
</script>

<style lang="sass"></style>
