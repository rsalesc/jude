<template>
    <section v-if="hasStarted() || true">
      <b-tabs v-model="activeTab" @change="changedTab">
        <b-tab-item label="Problems & Submissions">
          <div class="columns">
            <div class="column" :class="{'is-one-third': isAdmin() }">
              <ju-problems></ju-problems>
            </div>
            <div class="column">
              <ju-submissions></ju-submissions>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item>
          <template slot="header">
            <span>
              Clarifications
              <span class="is-danger tag ju-tag is-rounded"
                    v-if="unchecked.clarifications > 0">
                {{ unchecked.clarifications }}
              </span>
            </span>
          </template>
          <ju-clarifications></ju-clarifications>
        </b-tab-item>
        <b-tab-item>
          <template slot="header">
            <span>
              Printouts
              <span class="is-danger tag ju-tag is-rounded"
                    v-if="unchecked.printouts > 0 && isAdmin()">
                {{ unchecked.printouts }}
              </span>
            </span>
          </template>
          <ju-printouts></ju-printouts>
        </b-tab-item>
      </b-tabs>
    </section>

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
    import ClarificationsComponent from "./clarifications.vue";
    import PrintoutsComponent from "./printouts.vue";
    import { mapGetters } from "vuex";
    import { types } from "./store";
    export default {
        mounted() {
          this.countdownTimer = window.setInterval(() => this.updatedCountdown = this.getCountdown(), 1000);
          this.activeTab = this.persist.dashboardTab || this.activeTab;
        },
        beforeDestroy() {
          if (this.countdownTimer)
            window.clearInterval(this.countdownTimer);
        },
        data()  {
            return {
              countdownTimer: null,
              updatedCountdown: "-",
              activeTab: 0,
            }
        },
        computed: {
          ...Helper.mapModuleState("main", [
            "rawContest",
            "userObject",
            "persist"
          ]),
          ...mapGetters([
            "unchecked"
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
          },
          changedTab() {
            this.$store.commit(types.SET_DASHBOARD_TAB, this.activeTab);
            if (this.activeTab == 1) { // clarifications
              this.$store.commit(types.CHECK_CLARIFICATIONS);
            }
          }
        },
        components: {
            JuProblems: ProblemsComponent,
            JuSubmissions: SubmissionsComponent,
            JuClarifications: ClarificationsComponent,
            JuPrintouts: PrintoutsComponent
        }
    }
</script>
