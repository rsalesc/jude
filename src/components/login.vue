<template>
    <div>
        <div class="section"></div>
        <div class="section"></div>
        <div class="main container smaller">
            <div class="row">
                <div class="col s12">
                    <div class="card-panel">
                        <form id="login-form" class="default-form">
                            <center>
                                <h5 class="indigo-text">Type your credentials and log in to {{ selectedContest.name }}</h5>
                            </center>
                            <div class="input-field col s12">
                                <input type="text" v-model="handle" name="handle">
                                <label for="handle">Username</label>
                            </div>
                            <div class="input-field col s12">
                                <input type="password" v-model="password" name="handle">
                                <label for="password">Password</label>
                            </div>
                            <center>
                                <button class="btn waves-effect waves-light" type="submit" @click.prevent="formLogin()">Login</button>
                                <router-link to="/" class="btn waves-effect waves-light" tag="button">Go Back</router-link>
                            </center>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import * as Api from "./api";
    import { mapGetters } from "vuex";

    export default {
        data () {
            return {
                handle: "",
                password: ""
            };
        },
        computed: {
            ...mapGetters([
                "selectedContest"
            ])
        },
        methods: {
            formLogin() {
                this.$http.post(Api.paths.login, {
                    handle: this.handle,
                    password: this.password,
                    contest: this.$route.query.id
                }).then((res) => {
                    this.$router.push("/contest");
                }, (err) => {
                    Materialize.toast(`Login Error: ${err.body.error}`, 4000);
                });
            }
        }
    }
</script>