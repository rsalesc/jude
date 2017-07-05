const path = require("path");
const mongoose = require("mongoose");
const grader = require("../judge/grader");
const precheck = require("../judge/precheck");
const auth2 = require("../auth2");

const express = require("express");
const router = express.Router();

const models = require("../models/");

const ContestProblemSelection
    = "code name _id attr.weight attr.author attr.datasets attr.scoring attr.limits attr.blockedLanguages";
const {
  Contest, Submission, Problem, User
} = models;

function handleContestError(err, req, res, next) {
  res.status(400).json({ error: err.toString() });
}

function getUserContest(user) {
  try {
    return Contest.findById(user.contest);
  } catch (ex) {
    return { exec: cb => cb(ex) };
  }
}

// ensure user is auth'ed
router.use(auth2.isAuth("contestant"));

router.get("/", (req, res, next) => {
  getUserContest(req.auth2.user).deepPopulate("problems.problem", {
    populate: {"problems.problem": { select: ContestProblemSelection }}
  }).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res);
    if (!contest)
      return handleContestError("inconsistent session", req, res);

    if (!contest.hasStarted())
      contest.problems = [];

    const contestObj = {...contest.toObject(), ...{ languages: Object.entries(grader.availableLanguages)}};

    User.find({ contest: contest.id }).select("-password -email -handle").exec((err, teams) => {
      if (err)
        return handleContestError(err, req, res);
      if (teams === null)
        return handleContestError("couldnt retrieve teams", req, res);

      res.json({ _user: req.auth2.user._id, teams, contest: contestObj });
    });
  });
});

// TODO: contest started check
router.get("/my", (req, res, next) => {
  Submission.find({ contest: req.auth2.user.contest, _creator: req.auth2.user._id })
    .sort("-time")
    .exec((err, subs) => {
      if (err)
        return handleContestError(err, req, res);

      res.json({ _user: req.auth2.user._id, submissions: subs });
    });
});

router.get("/submissions", (req, res, next) => {
  getUserContest(req.auth2.user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res);
    if (!contest)
      return handleContestError("non existent contest", req, res);

    if (!contest.hasStarted())
      return res.json({ _user: req.auth2.user._id, submissions: []});

    Submission.find({ contest: req.auth2.user.contest }).sort("-time").select("-code").exec((err, subs) => {
      if (err)
        return handleContestError(err, req, res);
      res.json({ _user: req.auth2.user._id, submissions: subs });
    });
  });
});

// TODO: hash submissions to avoid duplicates
router.post("/submit", (req, res, next) => {
  if (!req.body.code || !req.body.language || !req.body.problem)
    return handleContestError("all fields must be filled", req, res);
  const user = req.auth2.user;

  if (!grader.availableLanguages.hasOwnProperty(req.body.language))
    return handleContestError("language is invalid", req, res);

  try {
    req.body.code = precheck[req.body.language](req.body.code);
  } catch (ex) {
    return handleContestError(ex.message, req, res);
  }

  getUserContest(user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res);
    if (!contest)
      return handleContestError("contest not found", req, res);

    Problem.findById(req.body.problem).exec((err, problem) => {
      if (err)
        return handleContestError(err, req, res);
      if (!problem || contest.problems.findIndex(x => x.problem == req.body.problem) === -1)
        return handleContestError("problem not found", req, res);

      if (!contest.hasStarted())
        return handleContestError("contest not started", req, res);

      let timeInContest = contest.getTimeInContest();

      if (contest.hasEnded())
        timeInContest = -1;

      const verdict = {};
      for (const data of problem.attr.datasets)
        verdict[data.name] = { 
verdict: "VERDICT_INQ", passed: -1, score: 0, info: "" 
};


      const sub = new Submission({
        _creator: req.auth2.user.id,
        contest,
        problem: req.body.problem,
        timeInContest,
        language: req.body.language,
        code: req.body.code,
        verdict
      });

      sub.save(async (err) => {
        if (err)
          return handleContestError(err, req, res);

        try {
          await judeQueue.add({
            id: req.body.problem,
            subid: sub._id,
            fid: problem.fid,
            code: req.body.code,
            lang: req.body.language
          });
        } catch (ex) {
          return handleContestError(ex, req, res);
        }

        res.json({ success: "submitted" });
      });
    });
  });
});

router.get("/statement/:letter", (req, res, next) => {
  getUserContest(req.auth2.user).deepPopulate("problems.problem").exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res, next);
    if (!contest)
      return next();

    for (const prob of contest.problems) {
      if (prob.letter == req.params.letter) {
        // res.setHeader('Content-Disposition', 'attachment');
        return weedClient.read(prob.problem.statementFid, res);
      }
    }

    next();
  });
});

router.get("/submission/:id", (req, res, next) => {
  getUserContest(req.auth2.user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res, next);
    if (!contest)
      return handleContestError("contest not found", req, res, next);

    Submission.findById(req.params.id).lean().exec((err, sub) => {
      if (err)
        return handleContestError(err, req, res, next);
      if (!sub)
        return handleContestError("submission not found", req, res, next);

      if (!sub._creator.equals(req.auth2.user._id) && !contest.hasEnded())
        sub.code = undefined;


      res.json(sub);
    });
  });
});

router.get("/languages", (req, res, next) => res.json(Object.entries(grader.availableLanguages)));

module.exports = router;
