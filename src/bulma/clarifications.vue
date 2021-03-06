<template>
  <div class="columns">
    <div class="column is-narrow ju-min-tablet-550 ju-max-550">
      <div class="box">
        <div class="box-title">
          <p class="title is-4">
            <span v-if="isAdmin()">Make Clarifications</span>
            <span v-else>Ask for Clarifications</span>
          </p>
          <p class="subtitle ju-comment ju-secondary-text"
            v-if="!isAdmin()">
            Ask a question by filling the textbox below. Make sure to fill
            the issue type field if you have a very specific question. Max of 1500 characters.
          </p>

        </div>
        <hr class="rule"></hr>
        <div class="box-content">
          <div v-if="isAnswering()">
            <ju-clarification-talk 
              :clarification="selectedClarification"></ju-clarification-talk>
            <hr class="rule"></hr>
          </div>
          <b-field label="Target" v-if="isAdmin() && !isAnswering()">
            <b-select
                      v-model="newClarification._creator" expanded>
              <option value="" selected>***BROADCAST***</option>
              <option v-for="team in teams"
                      :value="team._id"
                      :key="team._id">
              {{ team.name }}
              </option>
            </b-select>
          </b-field>
          <b-field label="Issue" v-if="!isAnswering()">    
            <b-select
                      v-model="newClarification.problem" expanded>
              <option value="">General</option>
              <option
                v-for="prob in problems"
                :value="prob.problem._id"
                :key="prob.problem._id">
              {{ prob.letter }}. {{ prob.problem.name }}
              </option>
            </b-select>
          </b-field>
          <b-field :label="isAnswering() ? 'Answer' : 'Issue Description'">
            <textarea class="textarea"
                      v-model="newClarification.text"
                      placeholder="Write here..."
                      maxlength="1500"
                      ref="text"></textarea>
          </b-field>
          <b-field v-if="isAnswering()">
            <b-switch v-model="newClarification.broadcast"
                      type="is-danger">
              Should be broadcasted
            </b-switch>
          </b-field>
          <b-field>
            <a class="button is-primary" @click="submit()">
              <span v-if="!isAnswering()">Submit New Clarification</span>
              <span v-else>Answer Clarification</span>
            </a>
            <a class="button" 
              @click="newDraft()"
              v-if="isAnswering()">Submit New Clarification</a>
          </b-field>

          <ju-clarification-list 
            :clarifications="myClarifications" @select="answer" 
            v-if="!isAdmin()"></ju-clarification-list>
        </div>
      </div>
    </div>
    <div class="column is-narrow ju-min-tablet-500 ju-max-500">
      <div class="box">
        <div class="box-title">
          <p class="title is-4">Public Clarifications</p>
        </div>
        <ju-clarification-list :clarifications="clarifications" 
            @select="answer"></ju-clarification-list>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import * as Helper from "./helpers";
import * as Api from "./api";
import { mapGetters } from "vuex";
import ClarificationListComponent from "./clarification-list.vue";
import ClarificationTalkComponent from "./clarification-talk.vue";
import { types } from "./store";

export default {
  mounted() {
    this.clear();
  },
  data() {
    return {
      selectedClarification: null,
      newClarification: {},
      submitting: 0
    };
  },
  computed: {
    ...Helper.mapModuleState("main", [
      "userObject"
    ]),
    ...mapGetters([
      "clarifications",
      "problems",
      "teams",
      "teamMapping"
    ]),
    myClarifications() {
      return this.clarifications.filter(c => this.getSelf()._id === c._creator);
    }
  },
  methods: {
    getSelf() {
      return this.userObject;
    },
    isAdmin() {
      return this.getSelf().role === "admin";
    },
    clear() {
      this.newClarification = {
        _creator: null,
        problem: null,
        text: "",
        broadcast: false
      };
    },
    answer(data) {
      this.clear();
      this.selectedClarification = data.clarification;
      this.newClarification.broadcast = data.clarification.broadcast;
      this.newClarification.text = data.answer || "";
      if (data.answer)
        this.submit();
      else
        this.$refs.text.focus();
    },
    isAnswering() {
      return Boolean(this.selectedClarification);
    },
    newDraft() {
      this.clear();
      this.selectedClarification = null;
      this.$refs.text.focus();
    },
    creator(clar) {
      if (!clar._creator)
        return "Admin";
      else
        return this.teamMapping[clar._creator].name || "<unknown>";
    },
    isUserCreator(clar) {
      if (!clar._creator)
        return this.isAdmin();
      else
        return this.getSelf()._id === clar._creator;
    },
    getCommentClasses(clar) {
      if (!clar._creator)
        return ["is-dark"];
      else
        return ["is-info"];
    },
    getProblem(id) {
      for (const prob of this.problems) {
        if (prob.problem._id === id)
          return prob;
      }

      return undefined;
    },
    async fetchAll() {
      try {
        await this.$store.dispatch(types.FETCH_CONTEST_DATA);
      } catch (err) {
        this.$jude.dealWithResponse(err);
      }
    },
    submit() {
      if (this.submitting > 0)
        return;
      if (this.isAnswering())
        this.doAnswer();
      else
        this.ask();
    },
    doAnswer() {
      if (this.submitting > 0)
        return;
      this.$dialog.confirm({
        message: "Do you really want to answer this?",
        onConfirm: async () => {
          this.submitting++;
          const data = { ...this.newClarification };
          const clar = this.selectedClarification;
          try {
            await Api.clarification.save({ id: clar._id }, {
              broadcast: data.broadcast,
              $push: data.text ? [data.text] : []
            });
            this.submitting--;
            this.fetchAll();
          } catch (response) {
            this.submitting--;
            this.$jude.dealWithResponse(response);
          }
          this.newDraft();
        }
      });
    },
    ask() {
      if (this.submitting > 0)
        return;
      this.$dialog.confirm({
        message: "Do you really want to ask this?",
        onConfirm: async () => {
          this.submitting++;
          const data = { ...this.newClarification };
          try {
            await Api.clarification.save({}, {
              broadcast: this.isAdmin() && !data._creator,
              target: data._creator || null,
              $push: data.text ? [data.text] : [],
              problem: data.problem || null
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
  },
  components: {
    JuClarificationList: ClarificationListComponent,
    JuClarificationTalk: ClarificationTalkComponent
  }
};
</script>
