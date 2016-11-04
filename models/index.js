var path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    files = fs.readdirSync(__dirname);

files.forEach(function(file) {
    var name = path.basename(file, '.js');
    if (name === 'index')
        return;

    var mod = require('./' + name);
    module.exports[name] = mod();
});