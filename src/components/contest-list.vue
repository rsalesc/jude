<template>
    <div>
        <div class="section"></div>
        <div class="section"></div>
        <div class="container main smaller">
            <div class="row">
                <div class="col s12 z-depth-1">
                    <ul class="collection with-header">
                        <li class="collection-header">
                            <center>
                                <h5 class="indigo-text">Available Contests</h5>
                                <div class="section"></div>
                                <img class="responsive-img" src="/images/jude.jpg">
                            </center>
                        </li>
                        <li class="collection-item" v-for="contest in contestList">
                            <div>
                                {{ contest.name }}
                                <a href="#" @click.prevent="selectContest(contest)" class="secondary-content">
                                    <i class="material-icons">send</i>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import Helper from "./helpers";
    import { mapGetters } from "vuex";
    import { types } from "./store/";

    export default {
        data () {
            return {};
        },
        computed: {
            ...mapGetters([
                "contestList"
            ])
        },
        mounted () {
            this.fetch();
        },
        methods: {
            async fetch() {
                await this.$store.dispatch(types.FETCH_CONTEST_LIST);
            },
            selectContest(contest) {
                this.$store.commit(types.SELECT_CONTEST_FROM_LIST, contest);
                this.$router.push({ path: '/login', query: { id: contest._id }});
            }
        }
    }
</script>