/**
 * Created by rsalesc on 15/07/16.
 */
var express = require('express');
var router = express.Router();

var contestRouter = require('./contest')
var userRouter = require('./user')
var submissionRouter = require('./submission')

// middlewares
router.use('/contests', contestRouter)
router.use('/users', userRouter)
router.use('/submissions', submissionRouter)

module.exports = router;