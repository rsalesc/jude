const path = require('path');
const mongoose = require('mongoose');

var express = require('express');
var router = express.Router();

var models = require(path.join(__dirname, '../models/'));

const {Contest, Submission, Problem, User} = models;

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

function handleAdminPageError(err, req, res, next){
  res.status(err.status).send({ error: err.message });
}

router.use(function(req, res, next){
  if(!req.user)
    return handleAdminPageError({ status: 401, message: "not authenticated" }, req, res);
  if(req.user.contest)
    return handleAdminPageError({ status: 403, message: "no privilege" }, req, res);

  next();
});

router.get('/', function(req, res, next) {
  res.render('admin');
});

module.exports = router;