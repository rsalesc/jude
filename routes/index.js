const express = require("express");
const router = express.Router();
const path = require("path");
const models = require("../models");
const { Problem, Contest } = models;

const Storage = require("../judge/storage").MemoryStorage;
const Loader = require("../judge/loader");
const utils = require("../judge/utils");
const api = require("./api");
const contest = require("./contest");
const admin = require("./admin");
const auth2 = require("../auth2");
const passport = require("passport");

function handleInternalError(err, req, res, next) {
  res.status(500).json({ error: err.toString() });
}

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.post("/api-logout", auth2.dispose());
router.post("/api-login", auth2.authenticate(["contestant", "admin", "root"]));

router.post("/upload/:id", auth2.isAuth(["root"]), (req, res, next) => {
  if (!req.files || !req.files.file)
    return res.status(404).json({ message: "exactly one file should be uploaded" });
  Problem.findOne({ _id: req.params.id }, (err, problem) => {
    if (err)
      return res.status(400).json({ message: err.toString() });
    if (!problem)
      return res.status(400).json({ message: "problem not found" });

    (async () => {
      const file = req.files.file;

      let task = null;
      const store = new Storage();
      try {
        store.loadZip(file.path);

        const loade = Loader.autoDetect(store);
        if (loade === null)
          throw new Error("Package is not loadable");

        task = new loade(store).load();
      } catch (ex) {
        return res.status(400).json({ message: ex.toString() });
      }

      if (!task)
        return res.status(400).json({ message: "package could not be loaded" });


      console.log(`Uploading package ${file.path}`);

      weedClient.write(file.path).then((info) => {
        problem.fid = info.fid;
        problem.attr = task.toJSON();

        if (task.hasStatement()) {
          weedClient.write(store.getFileBuffer(task.getStatement())).then((infoStatement) => {
            problem.statementFid = infoStatement.fid;
            info.statementFid = infoStatement.fid;

            problem.save((err) => {
              if (err)
                return res.status(400).json({ message: err.toString() });
              res.send(info);
            });
          }).catch((err) => {
            res.status(400).json({ message: err.toString() });
          });
        } else {
          problem.save((err) => {
            if (err)
              return res.status(400).json({ message: err.toString() });
            res.send(info);
          });
        }
      }).catch((err) => {
        res.status(400).json({ message: err.toString() });
      });
    })();
  });
});

router.get("/contest-list", (req, res, next) => {
  Contest.find({ hidden: false }, (err, contests) => {
    if (err)
      return handleInternalError(err, req, res);

    res.json({ contests });
  });
});

router.use("/contest", contest);
router.use("/admin", admin);

module.exports = router;
