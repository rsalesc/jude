<template>
    <div class="columns">
        <div class="column">
            <div class="box">
                <div class="box-title">
                    <div class="columns">
                        <div class="column">
                            <div class="content">
                                <p class="title is-4">Contest</p>
                                <p class="subtitle ju-comment ju-secondary-text">
                                    You can change contest configurations here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box-content">
                <div class="container">
                    <ju-contest-settings :id="getContestId()" :contest="data.contest" @submit="onContestSubmit"></ju-contest-settings>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import ContestSettingsComponent from "@front/admin/contest-settings.vue";
    import * as Helper from "@front/helpers.js";
    import BulmaUtils from "@front/bulmutils";
    import { types } from "@front/store/";
    import * as Api from "@front/api";

    export default {
        data()  {
            return {
                data: {
                    contest: {}
                }
            };
        },
        mounted() {
            this.$nextTick(async () => this.fetch());
        },
        computed: {
            ...Helper.mapModuleState("main", [
                "rawContest"
            ]),
        },
        watch: {
            rawContest(newVal) {
                this.fetch();
            }
        },
        methods: {
            getContestId() {
                return this.rawContest._id;
            },
            async fetchAll() {
                try {
                    const loggedin = await this.$store.dispatch(types.FETCH_CONTEST_DATA);
                    if(!loggedin)
                        this.$router.push("/");
                } catch (err) {
                    console.error(err);
                    new BulmaUtils(this).toast("Error contacting the server", 4000, "is-danger");
                }
            },
            async fetch() {
                if (this.getContestId() == null) return;
                try {
                    const [contest] = await Promise.all([Api.admin.contest.get({ id: this.getContestId() })]);
                    this.data = { contest: contest.body };
                } catch (response) {
                    if (response.status === 401 || response.status === 403)
                        return this.$router.push("/");

                    new BulmaUtils(this).toast("Error contacting the server.", 4000, "is-danger");
                    console.error(response);
                }
            },
            async onContestSubmit(contest) {
                if (this.getContestId() == null) return;
                try {
                    const res = await Api.admin.contest.save({ id: this.getContestId() }, { contest });
                    this.fetchAll();
                } catch(response) {
                    if (response.status === 401 || response.status === 403)
                        return this.$router.push("/");
                    
                    new BulmaUtils(this).toast("Error contacting the server.", 4000, "is-danger");
                    console.error(response);
                }
            }
        },
        components: {
            JuContestSettings: ContestSettingsComponent
        }
    }
</script>