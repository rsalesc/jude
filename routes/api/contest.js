/**
 * Created by rsalesc on 15/07/16.
 */
const express = require("express");
const router = express.Router();
const path = require("path");

const mongoose = require("mongoose");
const models = require("../../models/");
const { Contest, User } = models;
const { SubmissionNoCode } = require("./submission");
const { ObjectId } = mongoose.Types;

function handleContestError(err, req, res, next) {
  res.status(400).json({ error: err });
}

const ContestSelection
    = "name start_time end_time _id registration_end collabs _creator";

router.post("/:id/addUsers", async (req, res) => {
  // eslint-disable-next-line
  const { users, override } = Object.assign({}, { override: false }, req.body);

  // eslint-disable-next-line promise/avoid-new
  const awaited = await Promise.all(users.map(u => new Promise((resolve) => {
    // eslint-disable-next-line new-cap, prefer-object-spread/prefer-object-spread
    const du = Object.assign({}, u, { contest: ObjectId(req.params.id) });
    const user = new User(du);
    return User.findOne({ handle: user.handle, contest: user.contest }, (err, oldUser) => {
      if (err)
        return resolve(err);

      if (!oldUser) {
        return user.save((err2) => {
          if (err2)
            return resolve(err2);
          return resolve(true);
        });
      } else if (!override)
        return resolve(false);

      // eslint-disable-next-line no-underscore-dangle 
      return oldUser.update(du, (err2) => {
        if (err2)
          return resolve(err2);
        return resolve(true);
      });
    });
  })));

  const erred = awaited.filter(x => x !== true && x !== false);
  if (erred.length > 0)
    return handleContestError(erred[0], req, res);

  return res.send(200);
});

module.exports = router;
