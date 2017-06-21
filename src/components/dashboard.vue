<template>
    <div class="wrapper">
        <div class="section"></div>
        <div class="section"></div>
        <div class="container main">
            <div class="row">
                <ju-problem></ju-problem>
                <ju-submission></ju-submission>
            </div>
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