/**
 * Created by rsalesc on 15/07/16.
 */
var express = require('express');
var router = express.Router();
var Contest = require('../../models/Contest')()
var SubmissionNoCode = require('./submission').SubmissionNoCode

function handleContestError(err, req, res, next){
    res.status(400).json({error: err})
}

const ContestSelection =
    'name start_time end_time _id registration_end collabs _creator'

/**
 * @api {get} /api/contest
 * @apiName GetContests
 * @apiGroup Contest
 *
 * @apiDescription return a list of all contests
 */
router.get('/', (req, res, next) => {
    Contest.find().select(ContestSelection)
        .lean().exec((err, contests) => {

        if(err) return handleContestError(err, req, res)
        res.json({result: contests})
    })
});

/**
 * @api {get} /api/contest/:id
 * @apiName GetContest
 * @apiGroup Contest
 *
 * @apiParam {String} contest id
 *
 * @apiDescription return a single contest or NULL
 *                 if it was not found
 */
router.get('/:id', (req, res, next) => {
    Contest.findOne({_id: req.params.id}).select(ContestSelection)
        .lean().exec((err, contest) => {

        if(err) return handleContestError(err, req, res)
        res.json({result: contest || null})
    })
})

/**
 * @api {get} /api/contest/:id/submissions
 * @apiName GetContestSubmissions
 * @apiGroup Contest
 *
 * @apiParam {String} contest id
 *
 * @apiDescription return all the submissions of a contest or
 *                 NULL if the contest was not found
 */
router.get('/:id/submissions', (req, res, next) => {
    Contest.findOne({_id: req.params.id}).populate('submissions', SubmissionNoCode)
        .select('submissions').lean().exec((err, contest) => {

        if(err) return handleContestError(err, req, res)
        if(!contest) return res.json({result: null})
        res.json({result: contest.submissions})
    })
})

/**
 * @api {get} /api/contest/:id/problems
 * @apiName GetContestProblems
 * @apiGroup Contest
 *
 * @apiParam {String} contest id
 *
 * @apiDescription return all the problems of a contest or
 *                  NULL if the contest does not exist
 */
router.get('/:id/problems', (req, res, next) => {
    // TODO: make problem object compact here
    Contest.findOne({_id: req.params.id}).populate('problems')
        .select('problems').lean().exec((err, contest) => {

        if(err) return handleContestError(err, req, res)
        if(!contest) return res.json({result: null})
        res.json({result: contest.problems})
    })
})

/**
 * @api {get} /api/contest/:id/registered
 * @apiName GetContestRegistered
 * @apiGroup Contest
 *
 * @apiParam {string} contest id
 *
 * @apiDescription return all the registered Teams of a contest
 *                  or NULL if the contest does not exist
 */
router.get('/:id/registered', (req, res, next) => {
    Contest.findOne({_id: req.params.id}).select('registered')
        .lean().exec((err, contest) => {

        if(err) return handleContestError(err, req, res)
        if(!contest) return res.json({result: null})
        res.json({result: contest.registered})
    })
})

module.exports = router;
