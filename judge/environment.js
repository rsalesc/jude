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
    COMPILATION_TL: 25,
    CHECKING_TL: 10,
    CHECKING_ML: 512,
    CHECKING_WTL: 20,
    WT_MULTIPLIER: 4,
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
        this.nextSandboxId %= JudgeConfig.MAX_SANDBOXES
        return res % JudgeConfig.MAX_SANDBOXES
    }
}

module.exports = {
    JudgeEnvironment,
    JudgeConfig
}