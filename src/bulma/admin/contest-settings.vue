<template>
  <div>
    <b-field label="Name" horizontal>
      <b-input placeholder="Type the name of the contest" v-model="contest.name"></b-input>
    </b-field>
    <b-field label="Start" horizontal>
      <ju-date-time-picker v-model="contest.start_time"></ju-date-time-picker>
    </b-field>
    <b-field label="End" horizontal>
      <ju-date-time-picker v-model="contest.end_time"></ju-date-time-picker>
    </b-field>
    <b-field horizontal>
      <b-switch size="is-small" v-model="contest.hidden">Hidden</b-switch>
      <b-switch size="is-small" v-model="contest.upseeing">Can see code after contest ends</b-switch>
    </b-field>
    <b-field>
      <button class="button is-small is-primary" @click="confirm">
        Save
      </button>
    </b-field>
  </div>
</template>

<script type="text/babel">// import 'babel-polyfill';
    import * as Helper from "@front/helpers.js";
    import JuDateTimePicker from "@front/components/DateTime.vue";

    export default {
      props: {
        id: { type: String },
        contest: { type: Object }
      },
      data() {
        return {};
      },
      methods: {
        confirm() {
          this.$dialog.confirm({
            message: "Do you want to save these changes?",
            onConfirm: () => this.$emit("submit", this.contest)
          });
        }
      },
      components: {
        JuDateTimePicker
      }
    };
</script>

<style lang="sass"></style>