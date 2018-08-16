const path = require("path");
const mongoose = require("mongoose");
const grader = require("../judge/grader");
const precheck = require("../judge/precheck");
const auth2 = require("../auth2");

const express = require("express");
const router = express.Router();

const models = require("../models/");
const sha256 = require("sha256");

const ContestProblemSelection
    = "code name _id attr.weight attr.author attr.datasets attr.scoring attr.limits attr.blockedLanguages";
const {
  Contest, Submission, Problem, User, Clarification, Printout
} = models;

const { rejudge } = require("@routes/api/submission");
const { getUserContest, isAdmin } = require("@routes/common");
const { ObjectId } = mongoose.mongo;

function handleContestError(err, req, res) {
  res.status(500).json({ error: err.toString() });
  console.error(err);
}

function handleRequestError(err, req, res) {
  res.status(400).json({ error: err.toString() });
}

function filterOutSub(sub) {
  for (const dataset of Object.keys(sub.verdict))
    sub.verdict[dataset].info = {};

  sub.code = undefined;
  return sub;
}

function filterOutPrivateSub(sub) {
  for (const dataset of Object.keys(sub.verdict)) {
    if (sub.verdict[dataset].verdict !== "VERDICT_CE") {
      if (sub.verdict[dataset].info)
        sub.verdict[dataset].info.text = undefined;
      else
        sub.verdict[dataset].info = {};
    }
  }

  return sub;
}

function filterPrivateUser(user) {
  if (!user)
    user = {};

  user.password = undefined;
  user.email = undefined;

  return user;
}

function filterBlind(contest, user, sub) {
  if (contest.isFrozen(sub.timeInContest) && !sub._creator.equals(user._id)
    || contest.isBlind(sub.timeInContest)) {
    for (const dataset of Object.keys(sub.verdict)) {
      sub.verdict[dataset] = { verdict: "VERDICT_INQ" };
    }
  }
  return sub;
}

function applyFreezeFilter(contest, user, subs) {
  let res = subs;

  // we have to filter out submissions
  if (!contest.hasEnded()) {
    res = res.filter(sub =>
      !contest.isFrozen(sub.timeInContest) || sub._creator.equals(user._id));
  }
  return res.map(sub => filterBlind(contest, user, sub));
}

function checkForDuplicateSubmission(user, contest, problem, hashCode) {
  return new Promise((resolve, reject) => {
    Submission.findOne({ _creator: user, contest, problem, codeHash: hashCode }).exec((err, result) => {
      if (err)
        return reject(err);

      resolve(result != null);
    });
  });
}

function getVisibleClarifications(req, done) {
  const clarificationQuery = isAdmin(req)
    ? { contest: req.auth2.user.contest }
    : {
      contest: req.auth2.user.contest,
      $or: [
        { _creator: req.auth2.user._id },
        { broadcast: true }
      ]
    };

  return Clarification.find(clarificationQuery)
    .sort("-updatedAt").exec(done);
}

function getVisiblePrintouts(req, done) {
  const printoutQuery = isAdmin(req)
    ? { contest: req.auth2.user.contest }
    : {
      contest: req.auth2.user.contest,
      _creator: req.auth2.user._id
    };

  return Printout.find(printoutQuery)
    .sort("-createdAt").exec(done);
}

function estimateLines(text) {
  return text.split("\n").reduce((acc, value) =>
    acc + parseInt(Math.ceil((value.length + 1) / 80), 10), 0);
}

// ensure user is auth'ed
router.use(auth2.isAuth(["contestant", "admin"]));

router.get("/", (req, res) => {
  getUserContest(req.auth2.user).deepPopulate("problems.problem", { populate: { "problems.problem": { select: ContestProblemSelection }}}).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res);
    if (!contest)
      return handleContestError("inconsistent session", req, res);

    if (!isAdmin(req) && !contest.hasStarted())
      contest.problems = [];

    const contestObj = {
      ...contest.toObject({ minimize: false }),
      ...{ languages: Object.entries(grader.availableLanguages) }
    };

    User.find({ contest: contest.id, role: "contestant", disabled: { $ne: true } })
      .select("-password -email").exec((err, teams) => {
        if (err)
          return handleContestError(err, req, res);
        if (teams === null)
          return handleContestError("couldnt retrieve teams", req, res);

        return getVisibleClarifications(req, (err, clarifications) => {
          if (err)
            return handleContestError(err, req, res);
          return getVisiblePrintouts(req, (err, printouts) => {
            if (err)
              return handleContestError(err, req, res);
            return res.json({
              _user: req.auth2.user._id,
              userObject: filterPrivateUser(req.auth2.user.toObject({ minimize: false })),
              teams,
              clarifications,
              printouts,
              contest: contestObj
            });
          });
        });
    });
  });
});

router.get("/my", (req, res, next) => {
  Submission.find({ contest: req.auth2.user.contest, _creator: req.auth2.user._id })
    .sort("-time")
    .exec((err, subs) => {
      if (err)
        return handleContestError(err, req, res, next);

      return res.json({
        _user: req.auth2.user._id,
        submissions: subs
      });
    });
});

router.get("/submissions", (req, res) => {
  getUserContest(req.auth2.user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res);
    if (!contest)
      return handleContestError("non existent contest", req, res);

    if (!contest.hasStarted())
      return res.json({ _user: req.auth2.user._id, submissions: []});

    return Submission.find({ contest: req.auth2.user.contest }).sort("-time").select("-code")
      .exec((err, subs) => {
        if (err)
          return handleContestError(err, req, res);
        let filteredSubs = subs;
        if (!isAdmin(req))
          filteredSubs = applyFreezeFilter(contest, req.auth2.user, filteredSubs);
        filteredSubs = filteredSubs.map(filterOutSub);
        return res.json({ _user: req.auth2.user._id, submissions: filteredSubs });
      });
  });
});

// TODO: hash submissions to avoid duplicates
router.post("/submit", (req, res) => {
  if (!req.body.code || !req.body.language || !req.body.problem)
    return handleRequestError("all fields must be filled", req, res);
  const { user } = req.auth2;

  if (isAdmin(req))
    return handleRequestError("admin cannot submit solutions", req, res);
  if (user.disabled)
    return handleRequestError("you cant submit solutions", req, res);

  if (!grader.availableLanguages.hasOwnProperty(req.body.language))
    return handleRequestError("language is invalid", req, res);

  try {
    req.body.code = precheck[req.body.language](req.body.code);
  } catch (ex) {
    return handleRequestError(ex.message, req, res);
  }

  getUserContest(user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res);
    if (!contest)
      return handleContestError("contest not found", req, res);

    Problem.findById(req.body.problem).exec(async (err, problem) => {
      if (err)
        return handleContestError(err, req, res);
      if (!problem || contest.problems.findIndex(x => x.problem == req.body.problem) === -1)
        return handleRequestError("problem not found", req, res);

      if (!contest.hasStarted())
        return handleRequestError("contest has not started", req, res);

      const hashCode = sha256(req.body.code);

      try {
        if (await checkForDuplicateSubmission(user._id, contest._id, req.body.problem, hashCode))
          return handleRequestError("you can't submit the same code twice", req, res);
      } catch (ex) {
        return handleContestError(ex, req, res);
      }

      let timeInContest = contest.getTimeInContest();

      if (contest.hasEnded())
        timeInContest = -1;

      const verdict = {};
      for (const data of problem.attr.datasets) {
        verdict[data.name] = {
          verdict: "VERDICT_INQ", passed: -1, score: 0, info: ""
        };
      }


      const sub = new Submission({
        _creator: req.auth2.user.id,
        contest,
        problem: req.body.problem,
        timeInContest,
        language: req.body.language,
        code: req.body.code,
        codeHash: hashCode,
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
      return handleContestError("contest not found", req, res);

    if (!contest.hasStarted() && !isAdmin(req))
      return handleRequestError("contest has not started", req, res);

    for (const prob of contest.problems) {
      if (prob.letter === req.params.letter) {
        // res.setHeader('Content-Disposition', 'attachment');
        return weedClient.read(prob.problem.statementFid, res);
      }
    }

    return handleRequestError("problem not found", req, res);
  });
});

router.get("/submission/:id", (req, res, next) => {
  getUserContest(req.auth2.user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res, next);
    if (!contest)
      return handleContestError("contest not found", req, res, next);

    Submission.findById(req.params.id).lean().exec((err2, sub) => {
      if (err2)
        return handleContestError(err2, req, res, next);
      if (!sub)
        return handleRequestError("submission not found", req, res, next);

      if (!sub._creator.equals(req.auth2.user._id) && !(contest.hasEnded() && contest.upseeing && !contest.isFrozen()) && !isAdmin(req))
        return res.json(filterBlind(contest, req.auth2.user, filterOutSub(sub)));


      let filteredSub = filterOutPrivateSub(sub);
      if (!isAdmin(req))
        filteredSub = filterBlind(contest, req.auth2.user, filteredSub);
      return res.json(filteredSub);
    });
  });
});

router.post("/clarification", (req, res, next) => {
  if (req.auth2.user.disabled)
    return handleRequestError("you are a disabled user", req, res);

  getUserContest(req.auth2.user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res, next);
    if (!contest)
      return handleContestError("contest not found", req, res, next);

    // TODO: validate if comments are really strings

    let insertData = {
      _creator: req.auth2.user._id,
      contest: contest._id,
      problem: req.body.problem || null,
      comments: (req.body.$push || []).map(t => (t || "").trim()).filter(t => t).map(t => ({
        _creator: isAdmin(req) ? null : req.auth2.user._id,
        text: t
      }))
    };

    if (insertData.comments.length === 0)
      return handleRequestError("cant create empty clarification", req, res, next);

    if (isAdmin(req))
      insertData._creator = req.body.target || null;
    if (isAdmin(req) && req.body.broadcast != null)
      insertData = { ...insertData, broadcast: req.body.broadcast };

    return new Clarification(insertData).save((err2) => {
      if (err2)
        return handleContestError(err2, req, res, next);
      return res.json({ success: "posted" });
    });
  });
});

router.post("/clarification/:id", (req, res, next) => {
  if (req.auth2.user.disabled)
    return handleRequestError("you are a disabled user", req, res);

  getUserContest(req.auth2.user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res, next);
    if (!contest)
      return handleContestError("contest not found", req, res, next);

    return Clarification.findById(req.params.id, (err2, clar) => {
      if (err2)
        return handleContestError(err2, req, res, next);
      if (!clar || !clar.contest.equals(ObjectId(req.auth2.user.contest)))
        return handleRequestError("clarification not found", req, res, next);
      if (!isAdmin(req) && !clar._creator.equals(ObjectId(req.auth2.user._id))) {
        return handleRequestError("no permission on this clarification",
                                  req, res, next);
      }
      if (req.body.$push.length && clar.broadcast && !isAdmin(req)) {
        return handleRequestError("cant comment on a broadcast clarification",
                                  req, res, next);
      }
      // TODO: validate if comments are really strings

      const toPush = (req.body.$push || []).map(t => (t || "").trim())
        .filter(t => t).map(t => ({
          _creator: isAdmin(req) ? null : req.auth2.user._id,
          text: t
        }));
      let updateQuery = {
        $push: { comments: { $each: toPush }}
      };

      if (isAdmin(req) && req.body.broadcast != null)
        updateQuery = { ...updateQuery, broadcast: req.body.broadcast };

      return Clarification.update({ _id: req.params.id }, updateQuery, (err3) => {
        if (err3)
          return handleContestError(err3, req, res, next);

        return res.json({ success: "posted" });
      });
    });
  });
});

router.post("/printout", (req, res, next) => {
  if (req.auth2.user.disabled)
    return handleRequestError("you are a disabled user", req, res);

  getUserContest(req.auth2.user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res, next);
    if (!contest)
      return handleContestError("contest not found", req, res, next);

    const insertData = {
      _creator: req.auth2.user._id,
      contest: contest._id,
      text: (req.body.text || "").trim(),
      lines: estimateLines(req.body.text),
      done: false
    };

    if (!insertData.text)
      return handleRequestError("cant create empty printout", req, res, next);

    return new Printout(insertData).save((err2) => {
      if (err2)
        return handleContestError(err2, req, res, next);
      return res.json({ success: "posted" });
    });
  });
});

router.post("/printout/:id", (req, res, next) => {
  if (!isAdmin(req))
    return handleRequestError("only admins can mark printouts", req, res, next);
  getUserContest(req.auth2.user).exec((err, contest) => {
    if (err)
      return handleContestError(err, req, res, next);
    if (!contest)
      return handleContestError("contest not found", req, res, next);

    return Printout.update({
      _id: req.params.id
    }, { done: req.body.done }, (err) => {
      if (err)
        return handleContestError(err, req, res, next);
      return res.json({ success: "posted" });
    });
  });
});

router.get("/languages", (req, res) => res.json(Object.entries(grader.availableLanguages)));

router.use(auth2.isAuth(["admin"]));

router.post("/rejudge", (req, res, next) => {
  getUserContest(req.auth2.user).exec(async (err, contest) => {
    if (err)
      return handleContestError(err, req, res, next);
    if (!contest)
      return handleContestError("contest not found", req, res, next);

    // filter by contest
    const toRejudge = [...new Set((req.body.submissions || []))];

    const reflect = (p => p.then(v => ({v, status: true }), e => ({e, status: false })));

    const ans = await Promise.all(toRejudge.map(s => rejudge(s)).map(reflect));
    return res.json({ success: ans.filter(r => r.status).length });
  });
});

module.exports = router;
