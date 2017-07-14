<template>
    <div class="columns" v-if="hasStarted()">
      <div class="column" :class="{'is-one-third': isAdmin() }">
        <ju-problems></ju-problems>
      </div>
      <div class="column">
        <ju-submissions></ju-submissions>
      </div>
    </div>

    <div class="columns" v-else>
      <div class="column container has-text-centered">
        <h1 class="title">{{ updatedCountdown }}</h1>
      </div>
    </div>
</template>

<script type="text/babel">
    import * as Helper from "./helpers";
    import ProblemsComponent from './problems.vue';
    import SubmissionsComponent from './submissions.vue';
    export default {
        mounted() {
          this.countdownTimer = window.setInterval(() => this.updatedCountdown = this.getCountdown(), 1000);
        },
        beforeDestroy() {
          if (this.countdownTimer)
            window.clearInterval(this.countdownTimer);
        },
        data()  {
            return {
              countdownTimer: null,
              updatedCountdown: "-"
            }
        },
        computed: {
          ...Helper.mapModuleState("main", [
            "rawContest",
            "userObject"
          ])
        },
        methods: {
          getSelf() {
            return this.userObject;
          },
          isAdmin() {
            return this.getSelf().role === "admin";
          },
          getCountdown() {
            return Helper.getRemainingTime(this.rawContest);
          },
          hasStarted() {
            return Helper.hasContestStarted(this.rawContest);
          }
        },
        components: {
            JuProblems: ProblemsComponent,
            JuSubmissions: SubmissionsComponent
        }
    }
</script>