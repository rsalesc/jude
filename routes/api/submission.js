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
  res.status(500).json([err]);
}

function handleRequestError(err, req, res, next) {
  res.status(400).json({ err: err.toString() });
}

function rejudge(id) {
  return new Promise((resolve, reject) => {
    Submission.findByIdAndUpdate(id, {}, { new: true }, (err, sub) => {
      if (err)
        return reject(err);

      sub.populate("problem", async (err, sub) => {
        if (err)
          return reject(err);
        try {
          await judeQueue.add({
            id: sub.problem._id,
            subid: sub._id,
            fid: sub.problem.fid,
            code: sub.code,
            lang: sub.language
          });
        } catch (err) {
          return reject(err);
        }

        const verdict = {};
        for (const data of sub.problem.attr.datasets) {
          verdict[data.name] = {
            verdict: "VERDICT_INQ", passed: -1, score: 0, info: ""
          };
        }

        sub.verdict = verdict;
        sub.save((err) => {
          if (err)
            return reject(err);
          return resolve();
        });
      });
    });
  });
}

// TODO: set back to IN_QUEUE status
router.post("/:id/rejudge", async (req, res, next) => {
  if (!req.params.id)
    return handleSubmissionError("no rejudge id provided", req, res);
  try {
    await rejudge(req.params.id, req, res, next);
    return res.json({ success: "rejudged" });
  } catch (err) {
    return handleSubmissionError(err, req, res);
  }
});

module.exports = router;
module.exports.SubmissionNoCode = SubmissionNoCode;
module.exports.rejudge = rejudge;
