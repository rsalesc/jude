<template>
    <div class="col s6 padded-container">
        <div class="z-depth-1 card-panel jude-panel">
            <h5 class="card-title">
                <span>Problemset</span>
                <span class="comment-smaller tooltipped" :data-tooltip="getTooltipText()"><i class="material-icons">info</i></span>
                <span class="comment">{{ getTooltipText() }}</span>
            </h5>
            <ul class="collapsible problems-list" data-collapsible="accordion">
                <li v-for="prob in problems" :key="prob.problem._id">
                    <div class="collapsible-header" :class="{'ac-color': isAc(prob), 'wa-color': isWa(prob), 'pending-color': isPending(prob)}">
                        <i class="problem-index" :style="{color: '#'+lighten(prob.color)}">
                            {{ prob.letter }}
                        </i>
                        <span class="problem-title">
                            {{prob.problem.name}}
                        </span>

                        <span class="right">
                            <span class="right-text">
                                {{ prob.problem.attr.limits.time }} ms / {{ prob.problem.attr.limits.memory }} MB
                            </span>
                            <a v-bind:href="'/contest/statement/' + prob.letter" target='_blank'>
                                <i class="material-icons">description</i>
                            </a>
                        </span>
                    </div>
                    <div class="collapsible-content">
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/babel">
    // import 'babel-polyfill';
    import * as Helper from "./helpers";
    import { mapGetters } from "vuex";

    export default {
        mounted (){
          this.$nextTick(() => $('.tooltipped').tooltip({ delay: 50, html: true }));
        },
        data() {
            return {}
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
            }
        }
    }
</script>

<style lang="sass"></style>