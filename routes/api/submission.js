/**
 * Created by rsalesc on 15/07/16.
 */
var express = require('express')
var router = express.Router()
var Submission = require('../../models/Submission')()
var SubmissionNoCode =
    '_id _creator contest problem language code verdict'

function handleSubmissionError(err, req, res, next){
    res.status(400).json([err])
}

/**
 * @api {get} /api/submissions/
 * @apiName GetSubmissions
 * @apiGroup Submissions
 */
router.get('/', (req, res, next) => {
    Submission.find().select(SubmissionNoCode).lean().exec((err, subs) => {
        if(err) return handleSubmissionError(err, req, res)
        return res.json(subs)
    })
})

/**
 * @api {get} /api/submissions
 * /:id
 * @apiName GetSubmission
 * @apiGroup Submissions
 */
router.get('/:id', (req, res, next) => {
    Submission.findOne({_id: req.params.id}).lean().exec((err, sub) => {
        if(err) return handleSubmissionError(err, req, res)
        return res.json({result: sub || null})
    })
})

module.exports = router
module.exports.SubmissionNoCode = SubmissionNoCode