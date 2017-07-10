<template>
    <div class="columns">
      <div class="column">
        <ju-problem></ju-problem>
      </div>
      <div class="column">
        <ju-submission></ju-submission>
      </div>
    </div>
</template>

<script type="text/babel">
    import ProblemsComponent from './problems.vue';
    import SubmissionsComponent from './submissions.vue';
    export default {
        data()  {
            return {}
        },
        components: {
            JuProblem: ProblemsComponent,
            JuSubmission: SubmissionsComponent
        }
    }
</script>