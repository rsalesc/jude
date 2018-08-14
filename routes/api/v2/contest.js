const express = require("express");
const router = express.Router();
const { checkAdminContest, handleApiError } = require("./util");
const { Contest } = require("@models");

router.post("/contest/:id", (req, res) => {
  checkAdminContest(req.params.id)(req, res, () => {
    Contest.update({ _id: req.params.id }, { $set: req.body.contest },
                   { runValidators: true }, (err) => {
                     if (err)
                       return handleApiError(res, err);
                     return res.send(200);
                   });
  });
});

router.post("/contest/:id/problems", (req, res) => {
  checkAdminContest(req.params.id)(req, res, () => {
    Contest.update({ _id: req.params.id }, { $set: { problems: req.body.problems }},
                   { runValidators: true }, (err) => {
                     if (err)
                       return handleApiError(res, err);
                     return res.send(200);
                   });
  });
});

router.get("/contest/:id", (req, res) => {
  checkAdminContest(req.params.id)(req, res, () => {
    Contest.findById(req.params.id, (err, contest) => {
      if (err)
        return handleApiError(res, err);
      if (!contest)
        return res.status(400).json({ error: "contest not found" });
      return res.json(contest.toObject({ minimize: false }));
    });
  });
});

module.exports = router;
