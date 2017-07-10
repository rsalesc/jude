<template>
    <div class="columns">
      <div class="column">
        <ju-problems></ju-problems>
      </div>
      <div class="column">
        <ju-submissions></ju-submissions>
      </div>
    </div>
</template>

<script type="text/babel">
    import ProblemsComponent from './problems.vue';
    import SubmissionsComponent from './submissions.vue';
    export default {
        data()  {
            return {};
        },
        components: {
            JuProblems: ProblemsComponent,
            JuSubmissions: SubmissionsComponent
        }
    }
</script>