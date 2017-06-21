var express = require('express')
const path = require("path");
var router = express.Router()
var models = require(path.join(__dirname, '../../models/'));
const { User, Submission } = models;
var SubmissionNoCode = require('./submission').SubmissionNoCode

var UserSelection = '_id handle name'

function handleUserError(err, req, res, next){
    res.json({error: err})
}

module.exports = router