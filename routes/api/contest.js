/**
 * Created by rsalesc on 15/07/16.
 */
var express = require('express');
var router = express.Router();
const path = require("path");

var models = require(path.join(__dirname, '../../models/'));
const { Contest } = models;

var SubmissionNoCode = require('./submission').SubmissionNoCode

function handleContestError(err, req, res, next){
    res.status(400).json({error: err})
}

const ContestSelection =
    'name start_time end_time _id registration_end collabs _creator'

module.exports = router;
