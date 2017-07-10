<template>
    <div class="box">
      <div class="box-title">
        <p class="title is-4">Problems</p>
      </div>
      <hr class="rule"></hr>
      <div class="box-content">
        <div class="media" v-for="prob in problems" :key="prob.problem._id">
          <div class="media-left ju-circle"
            :style="{ color: `#${lighten(prob.color)}`, borderColor: `#${lighten(prob.color)}` }">
            <span>{{ prob.letter }}</span>
          </div>

          <div class="media-content">
            <p class="ju-problem-title"> {{ prob.problem.name }}</p>
            <p class="ju-tertiary-text">
              {{ prob.problem.attr.limits.time }} ms / {{ prob.problem.attr.limits.memory }} MB
            </p>
          </div>

          <div class="media-right">
            <b-tooltip label="Download statement">
              <a class="button is-primary is-small"
                :href="`/contest/statement/${prob.letter}`" target="_blank">
                <b-icon size="is-small" icon="file-text"></b-icon>
              </a>
            </b-tooltip>
            <b-tooltip label="Quick submit">
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
            ...mapGetters([
                "problems",
                "my"
            ])
        },
        methods: {
            isPending(prob){
                return prob.pending && !prob.solved;
            },
            isWa(prob){
                return prob.attempted && !prob.solved && !prob.pending;
            },
            isAc(prob){
                return prob.solved;
            },
            lighten(t){
                return Helper.lighten(t);
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