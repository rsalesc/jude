import * as Api from "@front/api.js";
import { types } from "@front/store";

export default {
  install(Vue) {
    Vue.prototype.$judeLogout = async function () {
      await this.$http.post(Api.paths.logout);
      this.$store.commit(types.LOGOUT);
      this.$router.push("/");
    };
  }
};
