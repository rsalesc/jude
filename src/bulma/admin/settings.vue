<template>
    <div class="columns">
      <!-- Contest -->
      <div class="column is-half">
          <div class="box">
            <div class="box-title">
                <div class="columns">
                    <div class="column">
                        <div class="content">
                            <p class="title is-4">Contest</p>
                            <p class="subtitle ju-comment ju-secondary-text">
                                You can change contest configurations here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="rule"></hr>
            <div class="box-content">
                <div class="container ju-override-container" v-if="!isContestLoading">
                    <ju-contest-settings :id="getContestId()" :contest="data.contest" @submit="onContestSubmit"></ju-contest-settings>
                </div>
            </div>
          </div>
      </div>
      <!-- Problems -->
      <div class="column">
        <div class="box">
          <div class="box-title">
            <div class="columns">
              <div class="column">
                <div class="content">
                  <p class="title is-4">Problems</p>
                  <p class="subtitle ju-comment ju-secondary-text">
                    You can add/remove contest problems here.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr class="rule"></hr>
          <div class="box-content">
            <div class="container ju-override-container" v-if="!isContestLoading">
              <ju-problems-settings 
                :problems="getContestProblems()"
                :data="data.problems"
                @submit="onContestProblemsSubmit">
              </ju-problems-settings>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/babel">
  import ContestSettingsComponent from "@front/admin/contest-settings.vue";
  import ProblemsSettingsComponent from "@front/admin/problems-settings.vue";
  import * as Helper from "@front/helpers.js";
  import BulmaUtils from "@front/bulmutils";
  import { types } from "@front/store/";
  import * as Api from "@front/api";

  export default {
    data()  {
        return {
            data: {
                contest: {},
                problems: []
            },
            isContestLoading: true
        };
    },
    mounted() {
        this.$nextTick(async () => this.fetch());
    },
    computed: {
        ...Helper.mapModuleState("main", [
            "rawContest"
        ]),
    },
    watch: {
        rawContest(newVal) {
            this.fetch();
        }
    },
    methods: {
        getContestId() {
            return this.rawContest._id;
        },
        getContestProblems() {
          return this.data.contest.problems;
        },
        async fetchAll() {
            try {
                const loggedin = await this.$store.dispatch(types.FETCH_CONTEST_DATA);
                if(!loggedin)
                    this.$router.push("/");
            } catch (err) {
                console.error(err);
                new BulmaUtils(this).toast("Error contacting the server", 4000, "is-danger");
            }
        },
        async fetch() {
            this.isContestLoading = true;
            if (this.getContestId() == null) return;
            try {
                const [contest, problems] = await Promise.all([
                  Api.admin.contest.get({ id: this.getContestId() }),
                  Api.admin.problems.get()
                ]);
              this.data = { contest: contest.body, problems: problems.body };
            } catch (response) {
                if (response.status === 401 || response.status === 403)
                    return this.$router.push("/");

                new BulmaUtils(this).toast("Error contacting the server.", 4000, "is-danger");
                console.error(response);
            }
            this.isContestLoading = false;
        },
        async onContestSubmit(contest) {
            if (this.getContestId() == null) return;
            try {
                await Api.admin.contest.save({ id: this.getContestId() }, { contest });
                this.fetchAll();
            } catch(response) {
                if (response.status === 401 || response.status === 403)
                    return this.$router.push("/");
                
                new BulmaUtils(this).toast("Error contacting the server.", 4000, "is-danger");
                console.error(response);
            }
        },
        async onContestProblemsSubmit(probs) {
            if (this.getContestId() == null) return;
            try {
                await Api.admin.contestProblems.save({ id: this.getContestId() }, { problems: probs });
                this.fetchAll();
            } catch(response) {
                if (response.status === 401 || response.status === 403)
                    return this.$router.push("/");
                
                new BulmaUtils(this).toast("Error contacting the server.", 4000, "is-danger");
                console.error(response);
            }
        }
    },
    components: {
        JuContestSettings: ContestSettingsComponent,
        JuProblemsSettings: ProblemsSettingsComponent
    }
  }
</script>
