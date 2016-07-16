var express = require('express')
var router = express.Router()
var User = require('../../models/user')()
var Submission = require('../../models/submission')()
var SubmissionNoCode = require('./submission').SubmissionNoCode

var UserSelection = '_id handle name'

function handleUserError(err, req, res, next){
    res.json({error: err})
}

/**
 * @api {get} /api/user/
 * @apiName GetUsers
 * @apiGroup User
 */
router.get('/', (req, res, next) => {
    User.find().selection(UserSelection).lean().exec((err, users) => {
        if(err) return handleUserError(err, req, res)
        res.json({result: users})
    })
})

/**
 * @api {get} /api/user/:type/:id
 *
 * @apiParam {String} id or handle of the user
 * @apiParam {String} specifies if :id is an id or a handle
 *
 * @apiName GetUser
 * @apiGroup User
 */
router.get('/:type/:id', (req, res, next) => {
    let types = ["handle", "id"]
    if(types.indexOf(req.params.type) === -1) return next()

    let match = req.params.type == "id" ? {_id: req.params.id} :
                            {handle: req.params.id}

    User.findOne(match).selection(UserSelection).lean().exec((err, user) => {
        if(err) return handleUserError(err, req, res)
        res.json({result: user || null})
    })
})

/**
 * @api {get} /api/user/handle/:id/submissions
 * @apiName GetUserSubmissions
 * @apiGroup User
 *
 * @apiParam {String} id or handle of the user
 * @apiParam {String} specifies if :id is an id or a handle
 */
router.get('/handle/:id/submissions', (req, res, next) => {
    User.findOne({handle: req.params.id}).lean().exec((err, user) => {
        if(err) return handleUserError(err, req, res)
        if(!user) return res.json({result: null})

        Submission.find({_creator: user._id}).select(SubmissionNoCode).
            lean().exec((err, subs) => {

            if(err) return handleUserError(err, req, res)
            res.json({result: subs})
        })
    })
})


module.exports = router