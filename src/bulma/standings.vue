<template>
  <div class="box">
    <div class="box-title">
      <div class="columns">
        <div class="column">
          <div class="content">
            <p class="title is-4">Standings</p>
            <p class="subtitle ju-comment ju-secondary-text">
              {{ getTooltipText() }}
            </p>
          </div>
        </div>
        <div class="column is-narrow">
          <div class="block has-text-right">
            <b-switch size="is-small"
              :value="config.compactTable"
              @change="setCompactTable">Compact Table</b-switch>
            <b-switch size="is-small"
              :value="config.formattedPenalty"
              @change="setFormattedPenalty">Format Penalty</b-switch>
          </div>
        </div>  
      </div>
    </div>
    <hr class="rule"></hr>
    <div class="box-content">
      <table class="table ju-standings" :class="getTableClasses()">
        <thead>
          <tr>
            <th class="has-text-centered">#</th>
            <th></th>
            <th class="ju-problem-cell ju-score-cell">Score</th>
            <th class="ju-problem-cell" v-for="prob in problems"
              :key="prob.problem._id">
              <p>{{ prob.letter }}</p>
              <p class="ju-comment ju-tertiary-text"></p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team._id">
            <td style="width: 36px;" class="has-text-centered">
              <strong>{{ team.rank }}</strong>
            </td>
            <td>
              <p>{{ team.name }}</p>
              <p class="ju-comment ju-tertiary-text">
                {{ team.description }}
              </p>
            </td>
            <td class="ju-problem-cell ju-score-cell">
              <p>{{ team.merged.score }}</p>
              <p class="ju-score-info" v-if="my.scoring.hasPenalty()">
                {{ config.formattedPenalty ? getContestTime(team.merged.penalty) : team.merged.penalty }}
              </p>
            </td>
            <td class="ju-problem-cell"
              v-for="prob in problems" :key="prob.problem._id"
              :class="{'ac-color': isAc(team, prob), 'wa-color': isWa(team, prob)}">
              <span v-if="prob.scoring.attempted(team.results[prob.problem._id])">
                  <p> {{ getProblemScore(team, prob) }}</p>
                  <p class="ju-score-info" v-if="my.scoring.hasPenalty() && isAc(team, prob)">
                      {{ getContestTime(team.results[prob.problem._id].penalty) }}
                  </p>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script type="text/babel">// import 'babel-polyfill';
    import * as Helper from "./helpers.js";
    import { types } from "./store/";
    import { mapGetters } from "vuex";
    import BulmaUtils from "./bulmutils";

    export default {
      data() {
        return { renderedSubmissions: [] };
      },
      computed: {
        ...Helper.mapModuleState("main", [
          "config"
        ]),
        ...mapGetters([
          "problems",
          "my",
          "groupedSubs",
          "teams"
        ])
      },
      methods: {
        isWa(team, prob) {
          const result = team.results[prob.problem._id];
          return prob.scoring.attempted(result) && !prob.scoring.solved(result);
        },
        isAc(team, prob) {
          return prob.scoring.solved(team.results[prob.problem._id]);
        },
        getProblem(id) {
          for (const prob of this.problems) {
            if (prob.problem._id === id)
              return prob;
          }

          return undefined;
        },
        getMainVerdict(a, b) {
          return Helper.getMainVerdict(a, b);
        },
        getHumanVerdict(x) {
          return Helper.getHumanVerdict(x);
        },
        getContestTime(t) {
          return Helper.getFormattedContestTime(t);
        },
        getProblemScore(team, prob) {
          const result = team.results[prob.problem._id];
          if (this.isAc(team, prob)) {
            if (result.fails === 0)
              return "+";
            return `+${result.fails}`;
          } else if (this.isWa(team, prob))
            return `-${result.fails}`;
    
          return "";
        },
        lighten(t) {
          return Helper.lighten(t);
        },
        showScore(id, problem) {
          const modal = $("#modal-standings");
          const group = this.groupedSubs[id];
          if (!group)
            return;
          this.renderedSubmissions = group.filter(x => x.problem === problem._id);
          // modal.openModal();
        },
        async showCode(sub) {
          const loggedin = await this.$store.dispatch(types.FETCH_AND_SHOW_SUBMISSION, sub._id);
          if (!loggedin)
            this.$router.push("/");
        },
        getTooltipText() {
          return Helper.getTooltipText(`Click a problem/team cell to show details about the tries of a team for that problem.`);
        },
        getTableClasses() {
          let res = {};
          if (!this.config.compactTable) 
            res["ju-b-table-less-compact"] = true;
          else {
            res["ju-b-table-compact"] = true;
            res["is-narrow"] = true;
          }
          return res;
        },
        setCompactTable(val, $event) {
          this.$store.commit(types.SET_COMPACT_TABLE, val);
        },
        setFormattedPenalty(val, $event) {
          this.$store.commit(types.SET_FORMATTED_PENALTY, val);
        }
      }
    };
</script>

<style lang="sass"></style>