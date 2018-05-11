const mongoose = require("mongoose");
const { isAdmin, getUserContest } = require("@routes/common");

function handleApiError(res, error) {
  return res.status(400).json({ error });
}

function checkAdminContest(contestId) {
  return function (req, res, next) {
    if (isAdmin(req)) {
      getUserContest(req.auth2.user).exec((err, contest) => {
        if (err)
          return handleApiError(res, err);
        if (!contest)
          return res.status(400).json({ error: "contest not found" });
        if (!contest._id.equals(mongoose.Types.ObjectId(contestId)))
          return res.status(401).json({ error: "unauthorized" });
        return next();
      });
    } else
      return next();
  };
}

module.exports = {
  checkAdminContest,
  handleApiError
};
