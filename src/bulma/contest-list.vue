<template>
  <div>
    <div class="hero is-primary is-bold">
      <div class="hero-body">
          <div class="columns">
            <div class="column">
              <h1 class="title">Jude Contest System</h1>
              <h2 class="subtitle">A modern judge designed for on-site programming contests.</h2>
            </div>
            <div class="column">
              <div class="card ju-centered ju-main-card">
                <header class="card-header">
                  <div class="card-header-title">
                    Choose a contest to log in to
                  </div>
                </header>
                <div class="card-content">
                  <b-table
                    class="ju-b-table-compact"
                    :data="contestList" 
                    :narrowed="true" 
                    :paginated="true"
                    :per-page="5"
                    :default-sort="['end_time', 'desc']"
                    :selected.sync="selectedContest">
                    
                    <template scope="props">
                      <b-table-column label="Contest">
                        {{ props.row.name }}
                      </b-table-column>

                      <b-table-column field="end_time" label="Time Remaining" sortable>
                        {{ getRemainingTime(props.row) }}
                      </b-table-column>
                    </template>
                  </b-table>
                </div>
                <div class="card-footer">
                  <a class="card-footer-item" @click="selectContest(selectedContest)">
                    Login
                  </a>
                  <a class="card-footer-item" @click="selectContest({ _id: null, name: 'admin' })">
                    Admin Panel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import * as Helper from "./helpers";
  import BulmaUtils from "./bulmutils";
  import { mapGetters } from "vuex";
  import { types } from "./store/";

  export default {
    data() {
      return {
        selectedContest: {}
      };
    },
    computed: {
      ...mapGetters([
        "contestList"
      ])
    },
    mounted() {
      this.fetch();
    },
    methods: {
      async fetch() {
        await this.$store.dispatch(types.FETCH_CONTEST_LIST);
      },
      selectContest(contest) {
        if (!contest._id && !contest.name)
          return new BulmaUtils(this).toast("Select a contest before trying to log in!");
        this.$store.commit(types.SELECT_CONTEST_FROM_LIST, contest);
        this.$router.push({ path: "/login", query: { id: contest._id }});
      },
      getRemainingTime(contest) {
        return Helper.getRemainingTime(contest);
      }
    }
  };
</script>