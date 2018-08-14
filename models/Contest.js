/**
 * Created by rsalesc on 14/07/16.
 */
const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const { Schema } = mongoose;

module.exports = () => {
  if (db.models.Contest)
    return db.model("Contest");

  const Problem = require("./Problem")();

  const ContestProblem = new Schema({
    letter: {
      type: String,
      required: true,
      match: /[A-Z][0-9]*/
    },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    color: { type: String, default: "000" },
    scoringOpts: { type: Schema.Types.Mixed, default: {}}
  }, { _id: false });

  const ContestSchema = new Schema({
    name: { type: String, minlength: 4, maxlength: 64 },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    scoring: { type: String, required: true },
    scoringOpts: { type: Schema.Types.Mixed, default: {}},
    problems: {
      type: [ContestProblem],
      validate: {
        validator(v) {
          if (!Array.isArray(v))
            return false;
          const letters = v.map(val => val.letter);
          const ids = v.map(val => val.problem.toString());

          return new Set(letters).size === letters.length
            && new Set(ids).size === ids.length;
        },
        message: "Contest cannot have repeated letters and problems must be an array"
      }
    },
    hidden: Boolean,
    upseeing: { type: Boolean, required: true, default: false },
    blind: { type: Number, default: 0 },
    freeze: { type: Number, default: 0 },
    unfreeze: { type: Boolean, default: false }
  }, { timestamps: true });

  ContestSchema.index({ name: 1 });
  ContestSchema.index({ name: "text" });
  ContestSchema.plugin(deepPopulate);

  ContestSchema.pre("save", function (next) {
    this.problems.sort((a, b) => {
      try {
        return ((x, y) => {
          const xd = parseInt(x.slice(1), 10) || 0;
          const yd = parseInt(y.slice(1), 10) || 0;

          if (x[0] === y[0])
            return xd < yd ? -1 : xd > yd ? 1 : 0;

          return x[0] < y[0]
            ? -1
            : 1;
        })(a.letter, b.letter);
      } catch (ex) {
        return false;
      }
    });

    next();
  });

  ContestSchema.methods.hasStarted = function () {
    return this.start_time.getTime() <= Date.now();
  };

  ContestSchema.methods.hasEnded = function () {
    return this.end_time.getTime() <= Date.now();
  };

  ContestSchema.methods.isRunning = function () {
    return this.hasStarted() && !this.hasEnded();
  };

  ContestSchema.methods.getTimeInContest = function (x) {
    const cur = x != null ? x : Date.now();
    return parseInt((cur - this.start_time.getTime()) / 60 / 1000, 10);
  };

  ContestSchema.methods.getDurationInContest = function () {
    const diff = (this.end_time.getTime() - this.start_time.getTime());
    return parseInt(Math.ceil(diff / 60 / 1000), 10);
  };

  ContestSchema.methods.getRemainingInContest = function (x) {
    return this.getDurationInContest()
      - (x != null ? x : this.getTimeInContest());
  };

  ContestSchema.methods.isFrozen = function (x) {
    return this.getRemainingInContest(x) <= this.freeze
    && (this.isRunning()
      || (this.hasEnded() && !this.unfreeze && this.freeze > 0));
  };

  ContestSchema.methods.isBlind = function (x) {
    return this.getRemainingInContest(x) <= this.blind
      && (this.isRunning()
        || (this.hasEnded() && !this.unfreeze && this.blind > 0));
  };

  ContestSchema.pre("remove", function (next) {
    db.model("Submission").remove({ contest: this._id }, (err) => {
      if (err)
        console.error(err);
    });
    db.model("User").remove({ contest: this._id }, (err) => {
      if (err)
        console.error(err);
    });
    db.model("Clarification").remove({ contest: this._id }, (err) => {
      if (err)
        console.error(err);
    });
    db.model("Printout").remove({ contest: this._id }, (err) => {
      if (err)
        console.error(err);
    });
    next();
  });


  return db.model("Contest", ContestSchema);
};
