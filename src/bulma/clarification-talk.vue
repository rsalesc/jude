

<template>
  <div>
    <div class="level">
      <div class="level-left">
        <div class="level-item ju-primary-text">Issue Type:</div>
        <div class="level-item ju-secondary-text">
          <span v-if="!clar.problem">General</span>
          <span v-else>
            <span class="ju-color-block"
                  :style="{ backgroundColor: `#${getProblem(clar.problem).color}` }"></span>
            {{ getProblem(clar.problem).letter }}. {{ getProblem(clar.problem).problem.name }}
          </span>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item" v-if="clar.broadcast">
          <b-tooltip label="This clarification is broadcasted" 
            position="is-bottom">
            <button class="button is-warn is-small">
              <b-icon size="is-small" icon="wifi"></b-icon>
            </button>
          </b-tooltip>
        </div>
        <div class="level-item">
          <b-field v-if="isAdmin()">
            <p class="control">
            <button class="button is-primary is-small"i
                    @click="select()"
                    :class="{ 'is-danger': !answeredByAdmin(clar) }">Answer</button>
            </p>
            <p class="control">
            <b-dropdown position="is-bottom-left">
              <button class="button is-primary is-small" slot="trigger"
                :class="{ 'is-danger': !answeredByAdmin(clar) }">
                <b-icon icon="caret-down"></b-icon>
              </button>

              <b-dropdown-item v-for="answer in defaultAnswers"
                               :key="answer"
                               @click="select(answer)">
                {{ answer }}
              </b-dropdown-item>
            </b-dropdown>
            </p>
          </b-field>
        </div>
      </div>
    </div>
    <article class="message is-small" 
             v-for="comment in clar.comments"
             :class="getCommentClasses(comment)">
      <div class="message-header"
           :class="{ 'ju-flex-end': !comment._creator }">
        {{ creator(comment) }} ({{ getDatetimeString(comment) }})
      </div>
      <p class="message-body ju-overflow-wrap">
        {{ comment.text  }}
      </p>
    </article>
  </div>
</template>

<script type="text/babel">
import * as Helper from "./helpers";
import * as Api from "./api";
import { mapGetters } from "vuex";
import BulmaUtils from "./bulmutils";

export default {
  mounted() {},
  data() {
    return {
      defaultAnswers: [
        "Nothing to declare.",
        "Please read the statement again.",
        "Nada a declarar.",
        "Por favor, releia o enunciado."
      ]
    };
  },
  props: ["clarification"],
  computed: {
    ...Helper.mapModuleState("main", [
      "userObject"
    ]),
    ...mapGetters([
      "problems",
      "teams",
      "teamMapping"
    ]),
    clar() {
      return this.clarification;
    }
  },
  methods: {
    getSelf() {
      return this.userObject;
    },
    isAdmin() {
      return this.getSelf().role === "admin";
    },
    select(content) {
      this.$emit("select", {
        clarification: this.clar,
        answer: content
      });
    },
    answeredByAdmin(clar) {
      return clar.comments.filter(t => !t._creator).length > 0;
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
    getDatetimeString(clar) {
      return Helper.getDatetimeString(clar.createdAt);
    },
    getProblem(id) {
      for (const prob of this.problems) {
        if (prob.problem._id === id)
          return prob;
      }

      return undefined;
    }
  }
};
</script>
