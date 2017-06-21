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
                            <select id="submit-language" @change="changeLanguage($event)">
                                <option v-for="lang in languages" :value="lang[0]">{{lang[1]}}</option>
                            </select>
                            <label>Language</label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <a class="modal-action btn-flat waves-effect" href="#" @click.prevent="submit">Submit</a>
            <a class="modal-action modal-close btn-flat waves-effect" @click.prevent="" href="#">Close</a>
        </div>
    </div>
</template>

<script type="text/babel">
    import 'babel-polyfill';
    import * as Helper from './helpers.js';
    import * as Api from './api.js';
    import { mapGetters } from "vuex";
    import { types } from "./store/";

    export default {
        mounted () {
            this.cm = CodeMirror.fromTextArea(document.getElementById("submit-code"), {
                lineNumbers: true,
                theme: "ambiance",
                autoRefresh: true,
                fixedGutter: true
            });
        },
        data() {
            return {
                submitting: 0,
                cm: {}
            }
        },
        computed: {
            ...mapGetters([
                "problems",
                "languages"
            ])
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
                let language = el.find('#submit-language').val();
                let code = this.cm.getValue();

                Api.submit.save({
                    problem,
                    code,
                    language
                }).then((result) => {
                    this.cm.setValue("");
                    Materialize.toast('Your submission was sent successfully!', 4000);
                    el.closeModal();
                    this.$store.dispatch(types.FETCH_CONTEST_DATA);
                    this.submitting--;
                }).catch((err) => {
                    Materialize.toast(`Submission error: ${err.data.error}`, 4000);
                    this.submitting--;
                });
            },
            changeLanguage(e) { 
                this.cm.setOption("mode", Helper.getCodeMirrorMode(e.target.value));
            }
        }
    }
</script>

<style lang="sass"></style>