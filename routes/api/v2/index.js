/**
 * Created by rsalesc on 15/07/16.
 */
const express = require("express");
const router = express.Router();
const auth2 = require("~/auth2");

const contest = require("@routes/api/v2/contest");
const problems = require("@routes/api/v2/problems");

router.use(auth2.isAuth(["root", "admin"]));
router.use(contest);
router.use(problems);

module.exports = router;
