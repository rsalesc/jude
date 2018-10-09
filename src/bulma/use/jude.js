import * as Api from "@front/api.js";
import { types } from "@front/store";

class JudePlugin {
  constructor(parent) {
    this.vue = parent;
  }

  async logout() {
    await this.vue.$http.post(Api.paths.logout);
    this.vue.$store.commit(types.LOGOUT);
    this.vue.$router.push("/");
  }
}

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, "$jude", {
      get: function $jude() {
        if (!this.hasOwnProperty("_jude_plugin"))
          this._jude_plugin = new JudePlugin(this);
        return this._jude_plugin;
      }
    });
  }
};
