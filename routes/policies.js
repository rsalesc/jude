const limiter = require("express-rate-limit");
const { isAdmin } = require("@routes/common");

const THROTTLE_CODE = 429;

function sanitize(opts) {
  let msg = { error: "Too many requests." };
  if (opts.message)
    msg = { error: opts.message };

  opts.handler = function (req, res) {
    res.status(THROTTLE_CODE).send(msg);
  };
}

export class ThrottlingPolicy {
  constructor(sequenceOfOpts, commonOpts = {}) {
    let opts = sequenceOfOpts;
    if (!Array.isArray(sequenceOfOpts))
      opts = [sequenceOfOpts];
    for (const opt of opts)
      sanitize(opt);
    sanitize(commonOpts);
    this.constraints = opts.map(x => ({ ...x, ...commonOpts }));
    this.middlewares = this.constraints.map(x => limiter(x));
  }
}

export class UserThrottlingPolicy extends ThrottlingPolicy {
  constructor(sequenceOfOpts, commonOpts = {}) {
    commonOpts.keyGenerator = function (req) {
      if (req.auth2 && req.auth2.user)
        return req.auth2.user;
      return req.ip;
    };

    commonOpts.skip = function (req) {
      return req.auth2 && req.auth2.user && isAdmin(req);
    };

    commonOpts.skipFailedRequests = true;
    super(sequenceOfOpts, commonOpts);
  }
}
