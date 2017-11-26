/**
 * Created by rsalesc on 15/07/16.
 */
const express = require("express");
const router = express.Router();
const path = require("path");

const models = require("../../models/");
const { Submission } = models;

const SubmissionNoCode
    = "_id _creator contest problem language code verdict";

function handleSubmissionError(err, req, res, next) {
  res.status(400).json([err]);
}

// TODO: set back to IN_QUEUE status
router.post("/:id/rejudge", (req, res, next) => {
  if (!req.params.id)
    return handleSubmissionError("no rejudge id provided", req, res);

  Submission.findByIdAndUpdate(req.params.id, {}, { new: true }, (err, sub) => {
    if (err)
      return handleSubmissionError(err, req, res);

    sub.populate("problem", async (err, sub) => {
      if (err)
        return handleSubmissionError(err, req, res);
      try {
          await judeQueue.add({
              id: sub.problem._id,
              subid: sub._id,
              fid: sub.problem.fid,
              code: sub.code,
              lang: sub.language
          });
      } catch (ex) {
          return handleSubmissionError(ex, req, res);
      }

      const verdict = {};
      for(const data of sub.problem.attr.datasets) {
          verdict[data.name] = {
              verdict: "VERDICT_INQ", passed: -1, score: 0, info: ""
          };
      }

      sub.verdict = verdict;
      sub.save(async (err2) => {
          if (err2)
              return handleSubmissionError(err2, req, res);

          res.json({ success: "rejudged" });
      });

    });
  });
});

module.exports = router;
module.exports.SubmissionNoCode = SubmissionNoCode;
