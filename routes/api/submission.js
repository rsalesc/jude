/**
 * Created by rsalesc on 15/07/16.
 */
var express = require('express')
var router = express.Router()
var Submission = require('../../models/submission')()
var SubmissionNoCode =
    '_id _creator contest problem language code verdict'

function handleSubmissionError(err, req, res, next){
    res.json({error: err})
}

/**
 * @api {get} /api/submission/
 * @apiName GetSubmissions
 * @apiGroup Submission
 */
router.get('/', (req, res, next) => {
    Submission.find().select(SubmissionNoCode).lean().exec((err, subs) => {
        if(err) return handleSubmissionError(err, req, res)
        return res.json({result: subs})
    })
})

/**
 * @api {get} /api/submission/:id
 * @apiName GetSubmission
 * @apiGroup Submission
 */
router.get('/:id', (req, res, next) => {
    Submission.findOne({_id: req.params.id}).lean().exec((err, sub) => {
        if(err) return handleSubmissionError(err, req, res)
        return res.json({result: sub || null})
    })
})

module.exports = router
module.exports.SubmissionNoCode = SubmissionNoCode