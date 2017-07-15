var mongoose = require('mongoose')
const MongoQueue2 = require("mongo-queue2");
const weed = require('jude-seaweedfs');

// mongodb setup

let mongo_host = process.env.MONGO_HOST || 'localhost';
let weed_host = process.env.WEED_HOST || 'localhost';

var uri = 'mongodb://'+mongo_host+'/jude-dev';
if(!global.db) {
  global.db = mongoose.createConnection(uri);
  global.db.mods = {};
  global.judeQueue = new MongoQueue2(db, "jude-queue2");
  global.weedClient     = new weed({
      server:     weed_host,
      port:       9333
  });
}

module.exports = global.db;