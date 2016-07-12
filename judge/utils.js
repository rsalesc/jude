/**
 * Created by rsalesc on 14/06/16.
 */

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var Promise = require('bluebird')
var commonfs = require('fs')
var fs = Promise.promisifyAll({stat: commonfs.stat})
var util = require('util')
var JudgeConfig = require('./environment').JudgeConfig

const EPS = JudgeConfig.EPS

function exists(p){
    try{
        var res = await(fs.statAsync(p))
        return true
    }catch(e){
        return false
    }
}

function fileExists(p){
    try{
        var res = await(fs.statAsync(p))
        return res.isFile()
    }catch(e){
        return false
    }
}

function dirExists(p){
    try{
        var res = await(fs.statAsync(p))
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

function fillUpTo(arr, n=0){
    if(n == 0) return []
    if(!(arr instanceof Array) || arr.length == 0)
        arr = [undefined]

    while(arr.length > n) arr.pop()
    while(arr.length < n){
        let el = arr.pop()
        arr.push(el)
        arr.push(el)
    }

    return arr
}

module.exports = {
    exists,
    fileExists,
    dirExists,
    inspect,
    logInspect,
    fillUpTo
}