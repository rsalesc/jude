<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script type="text/babel">
    import Vue from 'vue';
    import moment from 'moment';
    import 'moment/locale/en-gb';

    moment.locale('en-gb');

    export default {
        mounted() {},
        data() {
            return {}
        }
    }
</script>

<style lang="sass">
</style>