/**
 * Created by rsalesc on 15/07/16.
 */
var express = require('express');
var router = express.Router();

var contestRouter = require('./contest')
var userRouter = require('./user')

// middlewares
router.use('/contest', contestRouter)
router.use('/user', userRouter)

module.exports = router;