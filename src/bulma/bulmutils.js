export default class {
  constructor(component) {
    this.parent = component;
  }

  toast(message, duration = 2500, type = "is-dark", position = "is-top-right") {
    this.parent.$toast.open({
      message,
      duration,
      type,
      position
    });
  }

  toastResponseError(response, internal = "Internal server error.") {
    if (response.status === 400)
      this.toast(`error: ${response.body.error}`, 4000, "is-danger");
    else
      this.toast(internal);
  }
}
