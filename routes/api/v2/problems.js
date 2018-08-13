const express = require("express");
const router = express.Router();
const { checkAdminContest, handleApiError } = require("./util");
const { Problem } = require("@models");

router.get("/problems", (req, res) => {
  Problem.find({}, (err, problems) => {
    if (err)
      return handleApiError(res, err);
    return res.json(problems);
  });
});

module.exports = router;
