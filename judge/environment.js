/**
 * Created by rsalesc on 15/06/16.
 */

const fs = require('fs')
const fse = require('fs-extra')
const tmp = require('tmp')
tmp.setGracefulCleanup();

var path = require('path')
var storage = require(path.join(__dirname, 'storage'));
var await = require('asyncawait/await')
var async = require('asyncawait/async')

var mongodbQueue = require('mongodb-queue')

var JudgeConfig = {
    EPS : 1e-7,
    MAX_SANDBOXES : 10,
    MAX_SIMUL_TESTS: 2,
    COMPILATION_TL: 25,
    CHECKING_TL: 10,
    CHECKING_ML: 512,
    CHECKING_WTL: 20,
    WT_MULTIPLIER: 4,
    OUTPUT_LIMIT: (1<<24),
    TEMP_DIR : "/tmp",
    ISOLATE_PATH : path.resolve("/usr/local/bin/isolate"),
    VISIBILITY_WINDOW: 30
}

class PackageCacher{
    constructor(){
        this.path = tmp.dirSync({prefix: "judecache-", unsafeCleanup: true}).name;
        this.has = new Set()
    }

    addFromStream(p, cb){
        let writeStream = fs.createWriteStream(path.join(this.path, p))
        writeStream.on("finish", () => {
            this.has.add(p)
            async(cb)(null)
        })

        writeStream.on("error", (err) => {
            async(cb)(err)
        })

        return writeStream
    }

    addFromFile(p, d){
        fse.copySync(d, this.getFilePath(p))
        this.has.add(p)
    }

    exists(p){
        return this.has.has(p)
    }

    getFilePath(p){
        return path.resolve(this.path, p)
    }
}

class JudgeEnvironment{
    constructor(db, seaweed){
        this.sandboxes = []
        this.nextSandboxId = 0
        this.db = db
        this.cache = new PackageCacher()

        this.seaweed = seaweed
        if(db) this.queue = mongodbQueue(db, "jude-queue")
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