/**
 * Created by rsalesc on 15/07/16.
 */
var express = require('express')
var router = express.Router()
const path = require("path");

const async = require("asyncawait/async");
const await = require("asyncawait/await");

var models = require(path.join(__dirname, '../../models/'));
const { Submission } = models;

var SubmissionNoCode =
    '_id _creator contest problem language code verdict'

function handleSubmissionError(err, req, res, next){
    res.status(400).json([err])
}

// TODO: set back to IN_QUEUE status
router.post("/:id/rejudge", function(req, res, next) {
    if(!req.params.id)
        return handleSubmissionError("no rejudge id provided");
    
    Submission.findByIdAndUpdate(req.params.id, {}, { new: true }, async((err, sub) => {
        if(err)
            return handleSubmissionError(err);

        sub.populate("problem", async((err, sub) => {
            if(err)
                return handleSubmissionError(err);

            try {
                await(judeQueue.add({
                    id: sub.problem._id,
                    subid: sub._id,
                    fid: sub.problem.fid,
                    code: sub.code,
                    lang: sub.language
                }));
            } catch(ex) {
                return handleSubmissionError(ex, req, res);
            }

            res.json({success: "rejudged"});
        }));
    }));
});

module.exports = router
module.exports.SubmissionNoCode = SubmissionNoCode