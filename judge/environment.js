/**
 * Created by rsalesc on 15/06/16.
 */

var storage = require('./storage')
var await = require('asyncawait/await')
var async = require('asyncawait/async')
var path = require('path')

const MAX_SANDBOXES = 10

var JudgeConfig = {
    EPS : 1e-7,
    MAX_SANDBOXES : 10,
    MAX_SIMUL_TESTS: 3,
    TEMP_DIR : "/tmp",
    ISOLATE_PATH : path.resolve("isolate/isolate")
}

class JudgeEnvironment{
    constructor(){
        this.sandboxes = []
        this.nextSandboxId = 0
        //this.cacher = new Storage
    }

    getNextBoxId(){
        let res = this.nextSandboxId++
        return res % JudgeConfig.MAX_SANDBOXES
    }
}

module.exports = {
    JudgeEnvironment,
    JudgeConfig
}