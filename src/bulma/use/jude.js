import * as Api from "@front/api.js";
import { types } from "@front/store";

const ERROR_TOAST_TIME = 4000;
const IS_DANGER = "is-danger";

class JudePlugin {
  constructor(parent) {
    this.vue = parent;
  }

  async logout() {
    await this.vue.$http.post(Api.paths.logout);
    this.vue.$store.commit(types.LOGOUT);
    this.vue.$router.push("/");
  }

  toast(message, duration = 2500, type = "is-dark", position = "is-top-right") {
    this.vue.$toast.open({
      message,
      duration,
      type,
      position
    });
  }

  toastWithResponse(response, defaultMessage = "Internal server error.") {
    if (response.status === 400)
      this.toast(`Error: ${response.body.error}`, ERROR_TOAST_TIME, IS_DANGER);
    else
      this.toast(defaultMessage, ERROR_TOAST_TIME, IS_DANGER);
  }

  dealWithResponse(response, defaultMessage = "Internal server error.") {
    if (response.status === 401 || response.status === 403)
      this.logout();
    else
      this.toastWithResponse(response, defaultMessage);
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
