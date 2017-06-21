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

const MongoQueue2 = require("mongo-queue2");

var JudgeConfig = {
    EPS : 1e-7,
    MAX_SANDBOXES : 10,
    MAX_SIMUL_TESTS: 3,
    COMPILATION_TL: 25,
    CHECKING_TL: 10,
    CHECKING_ML: 512,
    CHECKING_WTL: 20,
    WT_MULTIPLIER: 4,
    OUTPUT_LIMIT: (1<<24),
    TEMP_DIR : "/tmp",
    ISOLATE_PATH : path.resolve("/usr/local/bin/isolate"),
    VISIBILITY_WINDOW: 30,
    BOUND_ML: 2048
}

class PackageCacher{
    constructor(size = 20){
        this.path = tmp.dirSync({prefix: "judecache-", unsafeCleanup: true}).name;
        this.has = new Map();
        this.size = size;
    }

    popLessFrequent() {
        let best = 1e9;
        let res = [];
        for(let [key, value] of this.has) {
            if(value < best)
                res = [];
            if(value <= best) {
                best = value;
                res.push(key);
            }
        }

        try {
            if(res.length > 0) {
                const idx = Math.random() * res.length | 0;
                const path = this.getFilePath(res[idx]);
                fse.removeSync(path);
                this.has.delete(res[idx]);
                return true;
            } else {
                return false;
            }
        } catch(ex) {
            return false;
        }
    }

    ensureSpace() {
        while(this.has.size >= this.size) {
            if(!this.popLessFrequent())
                break;
        }
    }

    ping(p) {
        const nv = Math.max((this.has.get(p) || 0), 0) + 1;
        for(let [key, value] of this.has) {
            this.has.set(key, value - 1);
        }
        this.has.set(p, nv);
    }

    addFromStream(p, cb){
        let writeStream = fs.createWriteStream(path.join(this.path, p))
        writeStream.on("finish", () => {
            this.ensureSpace();
            this.ping(p);
            (async(cb)(null));
        });

        writeStream.on("error", (err) => {
            (async(cb)(err));
        });

        return writeStream;
    }

    addFromFile(p, d){
        fse.copySync(d, this.getFilePath(p));
        this.ensureSpace();
        this.ping(p);
    }

    exists(p){
        return this.has.has(p);
    }

    getFilePath(p){
        return path.resolve(this.path, p);
    }
}

class JudgeEnvironment{
    constructor(db, seaweed){
        this.sandboxes = []
        this.nextSandboxId = 0
        this.db = db
        this.cache = new PackageCacher()

        this.seaweed = seaweed
        if(db) this.queue = new MongoQueue2(db, "jude-queue2");
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