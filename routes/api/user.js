const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// eslint-disable-next-line new-cap
const router = express.Router();
const models = require("../../models/");
const { User, Submission } = models;
const { SubmissionNoCode } = require("./submission");
const { ObjectId } = mongoose.Types;

const UserSelection = "_id handle name";

function handleUserError(err, req, res) {
  res.json({ error: err });
}

module.exports = router;
