const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = () => {
  if (db.models.Clarification)
    return db.model("Clarification");

  const CommentSchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: "User" },
    text: String
  }, { timestamps: true });

  const ClarificationSchema = new Schema({
    _creator: { type: Schema.Types.ObjectId, ref: "User" },
    contest: { type: Schema.Types.ObjectId, ref: "Contest" },
    broadcast: { type: Boolean, default: false },
    comments: [CommentSchema]
  }, { timestamps: true });

  ClarificationSchema.index({ _creator: 1, contest: 1 });
  ClarificationSchema.index({ contest: 1, broadcast: 1 });

  return db.model("Clarification", ClarificationSchema);
};
