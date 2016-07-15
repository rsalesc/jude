var mongoose = require('mongoose')

// mongodb setup
var uri = 'mongodb://localhost/jude-dev';
if(!global.db) global.db = mongoose.createConnection(uri);