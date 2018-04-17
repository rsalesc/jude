const { AssertionError } = require("assert");

export function makeImmutable(obj) {
  if ((typeof obj === "object" && obj !== null)
    || (Array.isArray
      ? Array.isArray(obj)
      : obj instanceof Array)
    || (typeof obj === "function")) {
    Object.freeze(obj);

    for (const value of Object.values(obj))
      makeImmutable(value);
  }
  return obj;
}

export function resolveGetters(gets, state) {
  const getterRef = {};
  const frozenState = makeImmutable(state);
  for (const [getterName, resolver] of Object.entries(gets)) {
    let seen = false;
    Object.defineProperty(getterRef, getterName, {
      get() {
        if (seen)
          throw new AssertionError("unexpected cycle while resolving getters");

        seen = true;
        const res = resolver(frozenState, getterRef);
        seen = false;
        return res;
      }
    });
  }

  return getterRef;
}
