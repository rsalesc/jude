<template>
    <div id="modal-submit" class="modal bottom-sheet modal-fixed-footer">
        <div class="modal-content">
            <h5 class="card-title">Submit Code</h5>
            <form>
                <div class="row">
                    <div class="col s8">
                        <textarea id="submit-code"></textarea>
                    </div>
                    <div class="col s4">
                        <div class="input-field">
                            <select id="submit-problem">
                                <option v-for="prob in problems" :value="prob.problem._id">{{prob.letter}}. {{ prob.problem.name }}</option>
                            </select>
                            <label>Problem</label>
                        </div>
                        <div class="section"></div>
                        <div class="input-field">
                            <select id="submit-language">
                                <option value="CPP">C++</option>
                            </select>
                            <label>Language</label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <a class="modal-action btn-flat waves-effect" href="#" @click="submit">Submit</a>
            <a class="modal-action modal-close btn-flat waves-effect" href="#">Close</a>
        </div>
    </div>
</template>

<script type="text/babel">
    import 'babel-polyfill';
    import * as Helper from './helpers.js';
    import * as Api from './api.js';

    export default {
        ready(){},
        data() {
            return {
                submitting: 0
            }
        },
        methods:{
            getProblem(id){
                for (let prob of this.problems) {
                    if (prob.problem._id == id)
                        return prob;
                }

                return undefined;
            },
            submit(){
                if(this.submitting++ > 0){
                    this.submitting--;
                    return;
                }

                let el = $(this.$el);
                let problem = el.find('#submit-problem').val();
                let code = window._cm.getValue();
                let language = el.find('#submit-language').val();

                Api.submit.save({
                    problem,
                    code,
                    language
                }).then((result) => {
                    window._cm.setValue("");
                    Materialize.toast('Your submission was sent successfully!', 4000);
                    el.closeModal();
                    this.submitting--;
                }).catch((err) => {
                    Materialize.toast(`Submission error: ${err.data.error}`, 4000);
                    this.submitting--;
                });
            }
        },
        props: {
            "problems":{
                type: Array,
                default: () => []
            }
        }
    }
</script>

<style lang="sass"></style>