var express = require('express');
var router = express.Router();
const path = require('path');
const async = require('asyncawait/async');
const models = require(path.join(__dirname, "../models"))
const {Problem, Contest} = models;

const Storage = require(path.join(__dirname, "../judge/storage")).MemoryStorage;
const Loader = require(path.join(__dirname, "../judge/loader"));
const utils = require(path.join(__dirname, "../judge/utils"));
const contest = require(path.join(__dirname, "contest"));
const admin = require(path.join(__dirname, "admin"));
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user && !req.user.contest)
      return res.redirect('/admin');

    res.redirect('/contest/dashboard')
});

router.get('/login', function(req, res, next){
    Contest.find({hidden: false}).select('_id name').lean().exec((err, contests) => {
        if(err)
            res.status(400).json({message: err.toString()});
        let obj = {error: req.flash('error'), contests};
        
        res.render('login', obj);
    });
});

router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.post('/login', passport.authenticate('custom', { failureRedirect: '/login', failureFlash: true }), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.post('/upload/:id', function(req, res, next){
    if(!req.files || !req.files.file)
        return res.status(404).json({message: "exactly one file should be uploaded"});
    Problem.findOne({_id: req.params.id}, (err, problem) => {
        if (err)
            return res.status(400).json({message: err.toString()});
        if (!problem)
            return res.status(400).json({message: "problem not found"});

        async(() => {
            let file = req.files.file;

            let task = null;
            let store = new Storage();
            try {
                store.loadZip(file.path);

                let loade = Loader.autoDetect(store);
                if (loade === null)
                    throw new Error("Package is not loadable");

                task = new loade(store).load();
            } catch (ex) {
                return res.status(400).json({message: ex.toString()});
            }

            if (!task)
                return res.status(400).json({message: "package could not be loaded"});


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
                                return res.status(400).json({message: err.toString()});
                            res.send(info);
                        });

                    }).catch((err) => {
                        res.status(400).json({message: err.toString()});
                    });
                } else {
                    problem.save((err) => {
                        if (err)
                            return res.status(400).json({message: err.toString()});
                        res.send(info);
                    });
                }
            }).catch((err) => {
                res.status(400).json({message: err.toString()});
            });
        })();
    });
});

router.use('/contest', contest);
router.use('/admin', admin);

module.exports = router;
