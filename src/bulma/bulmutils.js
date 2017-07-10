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
}
