import * as Api from "@front/api.js";

export default {
  install(Vue) {
    Vue.prototype.$judeLogout = async function () {
      await this.$http.post(Api.paths.logout);
      this.$router.push("/");
    };
  }
};
