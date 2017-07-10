<template>
  <div>
    <nav class="navbar">
      <div class="navbar-brand">
        <a class="navbar-item has-text-centered">
          Jude
        </a>
        <div class="navbar-burger burger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            <b-icon icon="dashboard" size="is-small"></b-icon>
            <span>Dashboard</span>
          </a>
          <a class="navbar-item">
            <b-icon icon="users" size="is-small"></b-icon>
            <span>Standings</span>
          </a>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field">
              <p class="control">
                <a class="button is-primary">
                  <span class="icon"><b-icon icon="send" size="is-small"></b-icon></span>
                  <span>Submit</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <section class="section">
      <router-view></router-view>
    </section>
  </div>
</template>

<script type="text/babel">import * as Api from "./api.js";
    import * as Helper from "./helpers.js";
    //import SubmitComponent from "./submit.vue";
    //import CodeModalComponent from "./codeModal.vue";
    import Vue from "vue";
    import moment from "moment";
    import "moment/locale/en-gb";
    import { mapGetters, mapState } from "vuex";
    import { types } from "./store/";

    moment.locale("en-gb");

    export default {
      mounted() {
        this.fetch();
        window.setInterval(() => {
          this.countdownString = this.getRemainingTime();
        }, 1000);
      },
      data() {
        return { countdownString: "-" };
      },
      computed: {
        ...Helper.mapModuleState("main", [
          "user",
          "rawContest",
          "rawSubmissions",
          "rawTeams"
        ]),
        ...mapGetters([
          "problems",
          "my",
          "groupedSubs",
          "teams",
          "languages",
          "submissions",
          "getRawProblem",
          "isFetching"
        ])
      },
      methods: {
        getRemainingTime() {
          return Helper.getRemainingTime(this.rawContest);
        },
        getContestName() {
          const contest = this.rawContest;
          if (!contest)
            return "-";
          return contest.name;
        },
        getStartTime() {
          const contest = this.rawContest;
          if (!contest)
            return "-";

          return moment(contest.start_time).format("LLL (Z)");
        },
        getEndTime() {
          const contest = this.rawContest;
          if (!contest)
            return "-";
          return moment(contest.end_time).format("LLL (Z)");
        },
        async fetch() {
          const loggedin = await this.$store.dispatch(types.FETCH_CONTEST_DATA);
          if (!loggedin)
            this.$router.push("/");
        },
        async doLogout() {
          await this.$http.post(Api.paths.logout);
          this.$router.push("/");
        }
      },
      components: { 
        //JuSubmit: SubmitComponent,
        //JuCodeModal: CodeModalComponent
      }
    };
</script>

<style lang="sass">
</style>