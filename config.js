const path = require("path");
const { UserThrottlingPolicy } = require("@routes/policies");
const { SharedConfig } = require("~/config.shared");

export const JudgeConfig = {
  MAX_TRIES: 5,
  EPS: 1e-7,
  SANDBOX_OFFSET: parseInt(process.env.SANDBOX_OFFSET || 0, 10),
  MAX_SANDBOXES: parseInt(process.env.MAX_SANDBOXES || 10, 10),
  MAX_SIMUL_TESTS: parseInt(process.env.MAX_SIMUL_TESTS || 1, 10),
  COMPILATION_TL: 90,
  CHECKING_TL: 90,
  CHECKING_ML: 512,
  CHECKING_WTL: 90,
  WT_MULTIPLIER: 15,
  OUTPUT_LIMIT: 1 << 24,
  TEMP_DIR: "/tmp",
  ISOLATE_PATH: path.resolve("/usr/local/bin/isolate"),
  VISIBILITY_WINDOW: parseInt(process.env.VISIBILITY_WINDOW || 20, 10),
  BOUND_ML: 2048
};


export const SiteConfig = {
  ...SharedConfig,

  // throttling
  throttling: {
    submissions: new UserThrottlingPolicy([
      { windowMs: 10 * 1000, max: 3 },
      { windowMs: 60 * 1000, max: 7 },
      { windowMs: 2 * 60 * 1000, max: 10 }
    ], {
      message: "You submitted too many times! Wait until you can submit again."
    }),
    clarifications: new UserThrottlingPolicy([
      { windowMs: 60 * 1000, max: 4 },
      { windowMs: 10 * 60 * 1000, max: 10 }
    ], {
      message: "You can't spam clarifications like that!"
    }),
    printouts: new UserThrottlingPolicy([
      { windowMs: 60 * 1000, max: 4 },
      { windowMs: 10 * 60 * 1000, max: 10 }
    ], {
      message: "You can't ask for printouts like that! Wait and try again."
    })
  }
};
