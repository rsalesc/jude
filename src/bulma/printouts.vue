<template>
  <div class="columns">
    <div class="column is-narrow ju-min-tablet-600">
      <div class="box">
        <div class="box-title">
          <p class="title is-4">
            <span v-if="isAdmin()">Print Requests</span>
            <span v-else>Ask for Printouts</span>
          </p>
          <p v-if="!isAdmin()" class="subtitle ju-comment ju-secondary-text">
            Write what you want to be in paper in the textbox below and
            we will get you a "print out of it" (pun intended). Max of 100000 characters.
          </p>
        </div>
        <hr class="rule"></hr>
        <div class="box-content">
          <div v-if="!isAdmin()">
            <b-field label="Text to be printed">
              <textarea class="textarea"
                        v-model="text"
                        placeholder="Paste the text to be printed..."
                        maxlength="100000"
                        ref="text"></textarea>
            </b-field>
            <b-field>
              <a class="button is-primary" @click="submit()">
                Submit New Printout Request
              </a>
            </b-field>
            <hr class="rule"></hr>
          </div>

          <div class="container ju-override-container has-text-centered" 
            v-if="printouts.length === 0">
            <p>There are no print requests to be shown.</p>
          </div>
          <div v-else>
            <b-table
              class="ju-b-table-less-compact"
              :data="printouts"
              :narrowed="true"
              :paginated="true"
              :per-page="getPerPage()"
              :backend-sorting="false">

              <template slot-scope="props">
                <b-table-column label="Time">
                  {{ getDatetimeString(props.row.createdAt) }}
                </b-table-column>
                <b-table-column label="Contestant">
                  {{ getTeam(props.row).name }}
                </b-table-column>
                <b-table-column label="Lines">
                  {{ props.row.lines }}
                </b-table-column>
                <b-table-column numeric>
                  <b-tooltip label="Print" position="is-bottom">
                    <button class="button is-primary is-small"
                      @click="print(props.row)">
                      <b-icon icon="print" size="is-small"></b-icon>
                    </button>
                  </b-tooltip>
                  <b-tooltip label="Marked as delivered" 
                    position="is-bottom"
                    v-if="!isAdmin() && props.row.done">
                    <button class="button is-success is-small">
                      <b-icon icon="check" size="is-small"></b-icon>
                    </button>
                  </b-tooltip>
                  <b-tooltip label="Mark as delivered" 
                             position="is-bottom"
                             v-if="isAdmin() && !props.row.done">
                    <button class="button is-success is-small" 
                      @click="mark(props.row, true)">
                      <b-icon icon="check" size="is-small"></b-icon>
                    </button>
                  </b-tooltip>
                  <b-tooltip label="Mark as pending" 
                             position="is-bottom"
                             v-if="isAdmin() && props.row.done">
                    <button class="button is-warning is-small" 
                            @click="mark(props.row, false)">
                      <b-icon icon="times" size="is-small"></b-icon>
                    </button>
                  </b-tooltip>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import * as Helper from "./helpers";
import * as Api from "./api";
import { mapGetters } from "vuex";
import BulmaUtils from "./bulmutils";
import { types } from "./store";

import printoutStyle from "./printout.css.tpl";

export default {
  mounted() {},
  data() {
    return {
      submitting: 0,
      text: ""
    };
  },
  computed: {
    ...Helper.mapModuleState("main", [
      "userObject"
    ]),
    ...mapGetters([
      "teamMapping",
      "printouts"
    ])
  },
  methods: {
    getSelf() {
      return this.userObject;
    },
    isAdmin() {
      return this.getSelf().role === "admin";
    },
    creator(clar) {
      if (!clar._creator)
        return "Admin";
      else
        return this.teamMapping[clar._creator] || "<unknown>";
    },
    clear() {
      this.text = "";
    },
    getPerPage() {
      return this.isAdmin() ? 20 : 5;
    },
    getTeam(printout) {
      return this.teamMapping[printout._creator] || { name: "<unknown>" };
    },
    getProblem(id) {
      for (const prob of this.problems) {
        if (prob.problem._id === id)
          return prob;
      }

      return undefined;
    },
    getDatetimeString(date) {
      return Helper.getDatetimeString(date);
    },
    print(printout) {
      const win = window.open("", "_blank");
      const lines = printout.text.split("\n").map(p => `<code>${Helper.escapeHTML(p)}</code>`);
      const code = lines.join("\n");
      const teamName = this.getTeam(printout).name;
      Helper.appendStyle(win.document, printoutStyle);
      win.document.title = `Printout of ${teamName}`;
      win.document.body.innerHTML = `
        <div class="no-print">
          USE YOUR BROWSER TO PRINT THIS CODE.
        </div>
        <h2>${teamName}</h2>
        <h4>${Helper.getDatetimeString(new Date())}</h4>
        <pre>${code}</pre>`;
      if (this.isAdmin())
        win.print();
    },
    async fetchAll() {
      try {
        await this.$store.dispatch(types.FETCH_CONTEST_DATA);
      } catch (err) {
        this.$jude.dealWithResponse(err);
      }
    },
    async mark(printout, state) {
      if (!printout)
        return;
      if (this.submitting > 0)
        return;
      this.submitting++;
      try {
        await Api.printout.save({ id: printout._id }, {
          done: state
        });
        this.submitting--;
        this.fetchAll();
      } catch (response) {
        this.submitting--;
        this.$jude.dealWithResponse(response);
      }
    },
    submit() {
      if (this.submitting > 0)
        return;
      this.$dialog.confirm({
        message: "Do you really want to request this printout?",
        onConfirm: async () => {
          this.submitting++;
          try {
            await Api.printout.save({}, {
              text: this.text
            });
            this.submitting--;
            this.fetchAll();
          } catch (response) {
            this.submitting--;
            this.$jude.dealWithResponse(response);
          }
          this.clear();
        }
      });
    }
  }
};
</script>
