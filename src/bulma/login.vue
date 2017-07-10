<template>
  <div class="columns">
    <div class="column">
      <div class="card ju-centered ju-main-card">
        <header class="card-header">
          <div class="card-header-title">
            Login to {{ selectedContest.name }}
          </div>
        </header>
        <div class="card-content">
          <b-field label="Username">
            <b-input v-model="handle" placeholder="Type your handle here" icon="user"></b-input>
          </b-field>
          <b-field label="Password">
            <b-input v-model="password" type="password" placeholder="ssshhh!" icon="lock"></b-input>
          </b-field>
        </div>
        <div class="card-footer">
          <a class="card-footer-item" @click="formLogin()">
            Login
          </a>
          <router-link to="/" class="card-footer-item">
            Go Back
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">import * as Api from "./api";
    import { mapGetters } from "vuex";
    import BulmaUtils from "./bulmutils";

    export default {
      data() {
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
            contest: this.$route.query.id === "null"
              ? null
              : this.$route.query.id
          }).then(() => {
            if (this.selectedContest.name === "admin")
              window.location = "/admin";
            else
              this.$router.push("/contest");
            return null;
          }).catch((err) => {
            if (err.status !== 200)
              return new BulmaUtils(this).toast(`Error contacting to server: code ${err.status}`, 4000, "is-danger");
            new BulmaUtils(this).toast(`Login Error: ${err.body.error}`, 4000, "is-danger");
          });
        }
      }
    };
</script>