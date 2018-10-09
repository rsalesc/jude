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

  toastError(message, duration = 4000, position = "is-top-right") {
    this.toast(message, duration, IS_DANGER, position);
  }

  toastWithResponse(response, defaultMessage = "Internal server error.") {
    if (response.status === 400)
      this.toastError(`Error: ${response.body.error}`);
    else if (response.status === 429)
      this.toastError(`Limit exceeded: ${response.body.error}`);
    else
      this.toastError(defaultMessage);
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
