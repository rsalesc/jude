/**
 * Created by rsalesc on 15/06/16.
 */

var FileCacher = require('./fcacher')
var await = require('asyncawait/await')
var async = require('asyncawait/async')
    
class JudgeEnvironment{
    constructor(){
        this.sandboxes = []
        this.cacher = new FileCacher()
    }
}

module.exports = {
    JudgeEnvironment
}