<template>
  <div class="columns">
    <!-- Contest -->
    <div class="column is-half">
      <div class="box">
        <div class="box-title">
          <div class="columns">
            <div class="column">
              <div class="content">
                <p class="title is-4">Users</p>
                <p class="subtitle ju-comment ju-secondary-text">
                You can add/edit/remove users here.
                </p>
              </div>
            </div>
          </div>
        </div>
        <hr class="rule"></hr>
        <div class="box-content">
          <div class="container ju-override-container">

          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/babel">
import * as Helper from "@front/helpers.js";
import BulmaUtils from "@front/bulmutils";
import { types } from "@front/store/";
import * as Api from "@front/api";

export default {
  data() {
    return {
      users: []
    };
  },
  mounted() {
    this.$nextTick(async () => this.fetch());
  },
  computed: {
    ...Helper.mapModuleState("main", [
      "rawContest"
    ])
  },
  methods: {
    async fetchAll() {
      try {
        await this.$store.dispatch(types.FETCH_CONTEST_DATA);
      } catch (response) {
        this.$jude.dealWithREsponse(response);
      }
    },
    async fetch() {
      try {
        const users = await Api.admin.users.get();
        this.users = users.body;
      } catch (response) {
        this.$jude.dealWithResponse(response);
      }
      this.isContestLoading = false;
    }
  }
};
</script>
