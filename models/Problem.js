/**
 * Created by rsalesc on 15/07/16.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

// TODO: add creation time (with a plugin)
module.exports = () => {
  if (db.models.Problem)
    return db.model("Problem");

  const VisibilitySchema = new Schema({
    contest: { type: Schema.Types.ObjectId, ref: "Contest" }
  }, { _id: false });

  const ProblemSchema = new Schema({
    code: {
      type: String,
      minlength: 4,
      maxlength: 24,
      match: /[a-zA-Z][a-zA-Z0-9-]*/,
      required: true
    },
    name: {
      type: String,
      minlength: 4,
      maxlength: 64,
      required: true
    },
    statementFid: String,
    fid: String,
    attr: Schema.Types.Mixed,
    visibility: [VisibilitySchema]
  }, { timestamps: true });

  ProblemSchema.index({ code: 1 }, { unique: 1 });
  ProblemSchema.index({ name: 1 });
  ProblemSchema.index({ code: "text", name: "text" });

  ProblemSchema.pre("remove", function (next) {
    db.model("Submission").remove({ problem: this._id }, (err) => {
      if (err)
        console.error(err);
    });
    const contestQuery = {
      problems: {
        $elemMatch: {
          problem: this._id
        }
      }
    };

    db.model("Contest").find(contestQuery, (err, contests) => {
      if (err)
        return console.error(err);

      for (const contest of contests) {
        contest.problems
                    = contest.problems.filter(problem => !this._id.equals(problem.problem));
        contest.save((err) => {
          if (err)
            console.error(err);
        });
      }
    });
    next();
  });

  return db.model("Problem", ProblemSchema);
};
