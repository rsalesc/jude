const { Contest } = require("@models");

function getUserContest(user) {
  try {
    return Contest.findById(user.contest);
  } catch (ex) {
    return { exec: cb => cb(ex) };
  }
}

function isAdmin(req) {
  return req.auth2.roles.indexOf("admin") !== -1;
}

module.exports = {
  getUserContest,
  isAdmin
};
