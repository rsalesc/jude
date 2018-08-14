<template>
  <div>
    <b-field label="Name" horizontal>
      <b-input placeholder="Type the name of the contest" v-model="localContest.name"></b-input>
    </b-field>
    <b-field label="Server time" horizontal>
      <pre class="control is-size-7 ju-pre-field">{{ time }}</pre>
      <p class="control ju-secondary-text has-text-danger">
        When changing times, notice that your clock may be out of sync. 
        Use the server time (already shifted to your timezone) as a reference.
      </p>
    </b-field>
    <b-field label="Start" horizontal>
      <ju-date-time-picker v-model="localContest.start_time"></ju-date-time-picker>
    </b-field>
    <b-field label="End" horizontal>
      <ju-date-time-picker v-model="localContest.end_time"></ju-date-time-picker>
    </b-field>
    <b-field label="Scoring" horizontal>
      <b-select v-model="localContest.scoring">
        <option v-for="scoring in scorings" :value="scoring">
          {{ scoring }}
        </option>
      </b-select>
    </b-field>
    <b-field horizontal>
      <ju-object-editor 
        edit-text="Edit scoring options..."
        v-model="localContest.scoringOpts"></ju-object-editor>
    </b-field>
    <b-field label="Freeze duration" horizontal>
      <b-input type="number" v-model="localContest.freeze"></b-input>
    </b-field>
    <b-field label="Blind duration" horizontal>
      <b-input type="number" v-model="localContest.blind"></b-input>
    </b-field>
    <b-field horizontal>
      <b-switch size="is-small" v-model="localContest.hidden">
        Hidden
      </b-switch>
    </b-field>
    <b-field horizontal>
      <b-switch size="is-small" v-model="localContest.upseeing">
        Can see code after the contest ends
      </b-switch>
    </b-field>
    <b-field horizontal>
      <b-switch size="is-small" v-model="localContest.unfreeze">
        Unfreeze the scoreboard after the contest ends
      </b-switch>
    </b-field>
    <b-field horizontal>
      <button class="button is-small is-primary" @click="confirm">
        Save
      </button>
    </b-field>
  </div>
</template>

<script type="text/babel">// import 'babel-polyfill';
    import * as Helper from "@front/helpers.js";
    import JuDateTimePicker from "@front/components/DateTime.vue";
    import JuObjectEditor from "@front/components/ObjectEditor.vue";
    import Vue from "vue";
    import * as Scorings from "@judge/scoring.js";
    import ts from "@front/ts.js";
    const clone = require("clone");

    export default {
      mounted() {
        this.timer = window.setInterval(() => this.tsDate = ts.date(), 1000);
      },
      beforeDestroy() {
        if (this.timer)
          window.clearInterval(this.timer);
      },
      props: {
        id: { type: String },
        contest: { type: Object }
      },
      data() {
        return {
          localContest: Object.assign(clone(this.contest, false), {
            start_time: new Date(this.contest.start_time),
            end_time: new Date(this.contest.end_time)
          }),
          tsDate: ts.date(),
          timer: null
        };
      },
      computed: {
        time() {
          const datetime = Helper.getFormattedDateTime(this.tsDate);
          const tz = Helper.getTimezone();
          return `${datetime} ${tz}`;
        },
        scorings() {
          return Object.keys(Scorings)
            .filter(s => !s.startsWith("_"))
            .filter(s => s !== "default");
        }
      },
      methods: {
        confirm() {
          this.$dialog.confirm({
            message: "Do you want to save these changes?",
            onConfirm: () => this.$emit("submit", this.localContest)
          });
        }
      },
      components: {
        JuDateTimePicker,
        JuObjectEditor
      }
    };
</script>

<style lang="sass"></style>
