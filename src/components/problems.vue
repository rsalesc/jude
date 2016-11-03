<template>
    <div id="problems-container" class="z-depth-1 col s6 card-panel jude-panel">
        <h5 class="card-title">Problemset</h5>
        <ul class="collapsible problems-list" data-collapsible="accordion">
            <li v-for="prob in problems">
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
                        <a href="/contest/statement/{{prob.letter}}" target='_blank'>
                            <i class="material-icons">description</i>
                        </a>
                    </span>
                </div>
                <div class="collapsible-content">
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/babel">
    import 'babel-polyfill';
    import * as Helper from "./helpers";

    export default {
        ready(){},
        data() {
            return {}
        },
        methods:{
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
            }
        },
        props: {
            "problems":{
                type: Array,
                default: () => []
            },
            "my":{
                default: () => {}
            }
        }
    }
</script>

<style lang="sass"></style>