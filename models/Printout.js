const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = () => {
  if (db.models.Printout)
    return db.model("Printout");

  const PrintoutSchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: "User" },
    contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    text: String,
    lines: Number,
    done: Boolean
  }, { timestamps: true });

  PrintoutSchema.index({ _creator: 1, contest: 1 });

  return db.model("Printout", PrintoutSchema);
};
