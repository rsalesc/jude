/**
 * Created by rsalesc on 14/06/16.
 */

var fs = require('fs')
var util = require('util')

const EPS = 1e-7

function exists(p){
    try{
        var res = fs.statSync(p)
        return true
    }catch(e){
        return false
    }
}

function fileExists(p){
    try{
        var res = fs.statSync(p)
        return res.isFile()
    }catch(e){
        return false
    }
}

function dirExists(p){
    try{
        var res = fs.statSync(p)
        return res.isDirectory()
    }catch(e){
        return false
    }
}

function inspect(p){
    return util.inspect(p, false, null)
}

function logInspect(p){
    return console.log(inspect(p))
}

module.exports = {
    exists,
    fileExists,
    dirExists,
    inspect,
    logInspect
}