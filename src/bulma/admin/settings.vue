<template>
  <b-tabs type="is-boxed">
    <b-tab-item label="Contest">
      <ju-contest-settings></ju-contest-settings>
    </b-tab-item>
  </b-tabs>
</template>

<script type="text/babel">
import ContestSettingsComponent from "@front/admin/contest-settings.vue";

export default {
  data() {
    return {};
  },
  components: {
    JuContestSettings: ContestSettingsComponent
  }
};
</script>
