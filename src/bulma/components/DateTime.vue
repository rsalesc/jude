<template>
  <b-field>
    <b-datepicker
      ref="datepicker"
      icon="calendar-alt"
      placeholder="Select a date..."
      v-model="dateValue">
    </b-datepicker>
    <b-timepicker
      ref="timepicker"
      placeholder="Pick a time..."
      v-model="timeValue">
    </b-timepicker>
    <p class="control">
      <span class="button is-static ju-comment">{{ getTimezone() }}</span>
    </p>
  </b-field>
</template>

<script type="text/babel">
  import * as Helper from "@front/helpers.js";

  export default {
    props: {
      value: { type: Object }
    },
    data() {
      return {
        dateValue: null,
        timeValue: null
      };
    },
    mounted() {
      this.setDate(this.value);
    },
    watch: {
      dateValue(newVal, oldVal) {
        if (newVal == null) this.refresh(null, null);
        if (Helper.dateEquals(newVal, oldVal)) return;
        this.refresh(newVal, this.timeValue);
      },
      timeValue(newVal, oldVal) {
        if (newVal == null) this.refresh(null, null);
        if (Helper.dateEquals(newVal, oldVal)) return;
        this.refresh(this.dateValue, newVal);
      },
      value(newVal) {
        this.setDate(newVal);
      }
    },
    methods: {
      getTimezone() {
        return Helper.getTimezone();
      },
      setDate(date) {
        if(date == null) {
          this.dateValue = Helper.getOnlyDate(new Date());
          this.timeValue = Helper.getOnlyTime(new Date());
        } else {
          this.dateValue = Helper.getOnlyDate(new Date(date));
          this.timeValue = Helper.getOnlyTime(new Date(date));
        }
      },
      refresh(date, time) {
        const merged = date == null ? null : Helper.mergeDateAndTime(Helper.getOnlyDate(date), Helper.getOnlyTime(time));
        this.$emit("input", merged);
        this.$emit("change", merged);
      }
    }
  };
</script>

<style lang="sass"></style>