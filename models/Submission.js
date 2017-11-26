/**
 * Created by rsalesc on 15/07/16.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const DEFAULT_VERDICT = {
  verdict: "", info: "", passed: -1, score: 0
};

// TODO: add creation time (with a plugin)
module.exports = () => {
  if (db.models.Submission)
    return db.model("Submission");


  const SubmissionSchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    time: { type: Date, default: Date.now },
    timeInContest: { type: Number, default: 0 },
    language: String, // add enum validator? maybe not, language set is mutable
    code: String,
    codeHash: { type: String, default: "" },
    verdict: Schema.Types.Mixed
  });

  SubmissionSchema.index({ contest: 1, _creator: 1 });
  SubmissionSchema.index({ contest: 1, problem: 1 });
  SubmissionSchema.index({ contest: 1, time: 1 });
  SubmissionSchema.index({ contest: 1, timeInContest: 1 });
  SubmissionSchema.index({ problem: 1, _creator: 1 });
  SubmissionSchema.index({ _creator: 1 });

  SubmissionSchema.pre("save", function (next) {
    if (this.problem) {
      db.model("Problem").findById(this.problem).exec((err, problem) => {
        if (err)
          next(err);
        this.verdict = this.verdict || {};
        const res = {};
        for (const data of problem.attr.datasets)
          res[data.name] = this.verdict[data.name] || DEFAULT_VERDICT;

        this.verdict = res;
        next();
      });
    }
  });

  return db.model("Submission", SubmissionSchema);
};
