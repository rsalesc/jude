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
  if(req.user.contest)
    return handleAdminPageError("no privilege to access this page", req, res);

  next();
});

router.get('/', function(req, res, next) {
  res.render('admin');
});

router.post('/login', passport.authenticate('custom'), (req, res, next) => {
  req.session.save((err) => {
    if(err) {
      res.status(401).json({ error: "error during authentication" });
    }
    res.send();
  });
});

router.post('/logout', (req, res, next) => {
  req.logout();
  res.send();
});

module.exports = router;