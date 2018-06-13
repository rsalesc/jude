/* eslint-disable */
let path = require("path"),
  fs = require("fs"),
  mongoose = require("mongoose");
// files = fs.readdirSync(__dirname);

require("../db");

/* files.forEach(function(file) {
    var name = path.basename(file, '.js');
    if (name === 'index')
        return;

    var mod = require('./' + name);
    module.exports[name] = mod();
});*/

module.exports = {
  Contest: require("./Contest")(),
  User: require("./User")(),
  Submission: require("./Submission")(),
  Problem: require("./Problem")(),
  Clarification: require("./Clarification")()
};
