/**
 * Created by rsalesc on 15/07/16.
 */
var express = require('express');
var router = express.Router();

var contestRouter = require('./contest')

// middlewares
router.use('/contest', contestRouter)

module.exports = router;