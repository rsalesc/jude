<template>
     <div class="columns">
      <div class="column">
        <ju-standings></ju-standings>
      </div>
    </div>
</template>

<script type="text/babel">
    import StandingsComponent from "./standings.vue";
    export default {
        data()  {
            return {}
        },
        components: {
            JuStandings: StandingsComponent
        }
    }
</script>