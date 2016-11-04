var mongoose = require('mongoose')
var mongodbQueue = require('mongodb-queue');
const weed = require('jude-seaweedfs');

// mongodb setup
var uri = 'mongodb://db/jude-dev';
if(!global.db) {
    global.db = mongoose.createConnection(uri);
    global.db.mods = {};
    global.judeQueue = mongodbQueue(db, "jude-queue");
    global.weedClient     = new weed({
        server:     "fs",
        port:       9333
    });
}

module.exports = global.db;