<template>
  <b-field class="ju-datetime">
    <b-datepicker
      ref="datepicker"
      icon="calendar-alt"
      placeholder="Select a date..."
      :value="dateValue"
      @input="refreshDate">
    </b-datepicker>
    <b-timepicker
      ref="timepicker"
      placeholder="Pick a time..."
      :value="timeValue"
      @input="refreshTime">
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
      value: { type: Date }
    },
    data() {
      return {
        dateValue: this.value == null ? null : Helper.getOnlyDate(this.value),
        timeValue: this.value == null ? null : Helper.getOnlyTime(this.value)
      };
    },
    watch: {
      value(newVal, oldVal) {
        if(Helper.dateEquals(newVal, oldVal)) return;
        this.setDate(newVal);
      }
    },
    methods: {
      getTimezone() {
        return Helper.getTimezone();
      },
      setDate(date) {
        if (date != null) {
          this.dateValue = Helper.getOnlyDate(new Date(date));
          this.timeValue = Helper.getOnlyTime(new Date(date));
        }
      },
      refreshDate(newVal) {
        if (newVal == null) this.refresh(null, null);
        this.refresh(newVal, this.timeValue);
      },
      refreshTime(newVal) {
        if (newVal == null) this.refresh(null, null);
        this.refresh(this.dateValue, newVal);
      },
      refresh(date, time) {
        this.dateValue = date;
        this.timeValue = time;
        const merged = date == null ? null : Helper.mergeDateAndTime(Helper.getOnlyDate(date), Helper.getOnlyTime(time));
        this.$emit("input", merged);
        this.$emit("change", merged);
      }
    }
  };
</script>

<style lang="sass"></style>
