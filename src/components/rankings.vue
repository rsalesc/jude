<template>
    <div class="wrapper">
        <div class="section"></div>
        <div class="section"></div>
        <div class="container main">
            <div class="row">
                <ju-standings></ju-standings>
            </div>
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