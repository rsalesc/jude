const path = require('path');
const mongoose = require('mongoose');

var express = require('express');
var router = express.Router();

var models = require(path.join(__dirname, '../models/'));

const {Contest, Submission, Problem, User} = models;

function handleAdminPageError(err, req, res, next){
  res.redirect('/login');
}

router.use(function(req, res, next){
  if(!req.user)
    return handleAdminPageError("not authenticated", req, res);
  if(req.user.contest !== null)
    return handleAdminPageError("inconsistent session", req, res);

  next();
});

router.get('/', function(req, res, next) {
  res.render('admin');
});

module.exports = router;