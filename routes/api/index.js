/**
 * Created by rsalesc on 15/07/16.
 */
const express = require("express");
const router = express.Router();

const contestRouter = require("./contest");
const userRouter = require("./user");
const submissionRouter = require("./submission");

// middlewares
router.use("/contests", contestRouter);
router.use("/users", userRouter);
router.use("/submissions", submissionRouter);

module.exports = router;
