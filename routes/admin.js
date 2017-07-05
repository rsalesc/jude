const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const auth2 = require("../auth2");

const express = require("express");
const router = express.Router();

const models = require("../models/");

const {
  Contest, Submission, Problem, User
} = models;

/* router.post('/login', (req, res, next) => {
  passport.authenticate('custom', (err, user, info) => {
    if(err) return next(err);
    if(!user) return res.status(401).json({ error: "unauthorized" });
    req.logIn(user, (err) => {
      if(err) return next(err);
      next();
    });
  })(req, res, next);
}, (req, res, next) => {
  req.session.save((err) => {
    if(err){
      return next(err);
    }
    res.sendStatus(200);
  });
});

router.post('/logout', (req, res, next) => {
  req.logout();
  res.sendStatus(200);
});
*/

router.post("/login", auth2.authenticate("root"));
router.post("/logout", auth2.dispose());

function handleAdminPageError(err, req, res, next) {
  res.status(err.status).json({ error: err.message });
}

router.use(auth2.possiblyAuth("root"), (req, res, next) => {
  if (!req.auth2.user)
    return res.redirect("/");
  next();
});

router.get("/", (req, res, next) => {
  res.render("admin");
});

module.exports = router;
