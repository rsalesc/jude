/**
 * Created by rsalesc on 15/06/16.
 */
var Promise = require('bluebird')

var fs = Promise.promisifyAll(require('fs'))
var path = require('path')
var await = require('asyncawait/await')
var async = require('asyncawait/async')
var logger = require('./logger')
var jenv = require('./environment')
var spawn = require('spawn-rx').spawnPromise

var JudgeConfig = jenv.JudgeConfig

/*
* This is the base class for sandboxes
* All sandboxes should be extended from this
* Make sure it runs inside an async environment
* @abstract
 */
class Sandbox{

    /*
    * @param {Storage} storage which will provide quick interaction (in-memory)
    *           between host FS and sandbox FS
    * @param {JudgeEnvironment} judge environment used by the sandbox
     */
    constructor(env, store){
        this.cacher = store
        this.env = env
    }

    getRootPath(){
        throw "Concrete sandboxes must implement this function"
    }

    getRunningTime(){
        throw "Concrete sandboxes must implement this function"
    }

    getMemoryUsage(){
        throw "Concrete sandboxes must implement this function"
    }

    /*
    * @param {string} path in sandbox (relative to its bound directory)
    * @returns {string} absolute path in host
    **/
    resolvePath(p){
        return path.join(this.getRootPath(), p)
    }


    /*
    * Create a new file in sandbox
    * @param {string} path in sandbox
    * @param {boolean} [exec=false] is the new file executable
    * @returns {number} file descriptor
     */
    createFile(p, exec = false){
        let absPath = this.resolvePath(p)
        try {
            let fd = await(fs.openAsync(absPath, 'wx+', exec ? 0o777 : 0o664))
            return fd
        }catch(e){
            logger.error("Sandbox %s could not create file %s", this.constructor.name, p)
            throw e
        }
    }

    /*
    * Same as {Sandbox#createFile}, but writes file from {FileCacher}
    * @param {string} path in sandbox
    * @param {string} path/ID in {FileCacher}
    * @param {boolean} [exec=false] is the new file executable
     */
    createFileFromStorage(p, d, exec = False){
        let fd = this.createFile(p, exec)
        await(fs.writeAsync(fd, this.cacher.getFileBuffer(d)))
        await(fs.closeAsync(fd))
    }

    createFileFromString(p, content, exec = False){
        let fd = this.createFile(p, exec)
        await(fs.writeAsync(fd, content))
        await(fs.closeAsync(fd))
    }

    /*
    *   Get file from sandbox
    *   @param {string} path in sandbox
    *   @returns {number} file descriptor
     */
    getFile(p){
        try {
            let absPath = this.resolvePath(p)
            let fd = await(fs.openAsync(fd, "r"))
            return fd
        }catch(e){
            logger.error("Sandbox %s could not retrieve file %s",
                this.constructor.name, p)
            throw e
        }
    }

    getFileToString(p){
        try{
            let absPath = this.resolvePath(p)
            return await(fs.readFileAsync(p, "utf8"))
        }catch(e){
            logger.error("Sandbox %s could not retrieve file %s",
                this.constructor.name, p)
            throw e
        }
    }

    /*
    *   Get file from sandbox and read it into {FileCacher} storage
    *   @param {string} path in sandbox
    *   @param {string} path/ID in {FileCacher} storage
     */
    getFileToStorage(p, d){
        try{
            let absPath = this.resolvePath(p)
            this.cacher.createFileFromBuffer(d, await(fs.readFileAsync(p)))
        }catch(e){
            logger.error("Sandbox %s could not retrieve file %s to storage",
                this.constructor.name, p)
        }
    }

    getFileStats(p){
        let res = await(fs.statAsync(this.resolvePath(p)))
        return res
    }
    
    pathExists(p){
        try{
            let res = this.getFileStats(p)
            return true
        } catch(e){
            return false
        }
    }

    fileExists(p){
        try{
            let res = this.getFileStats(p)
            return res.isFile()
        }catch(e){
            return false
        }
    }

    dirExists(p){
        try{
            let res = this.getFileStats(p)
            return res.isDirectory()
        }catch(e){
            return false
        }
    }

    removeDir(p){
        await(fs.rmdirAsync(this.resolvePath(p)))
    }

    removeFile(p){
        await(fs.unlinkAsync(this.resolvePath(p)))
    }
}

class Isolate extends Sandbox{
    constructor(env, store){
        super(env, store)
        this.boxId = env.getNextBoxId()
        this.executable = JudgeConfig.ISOLATE_PATH
        this.execs = -1

        this.outerDir = await(fs.mkdtempAsync(path.join(JudgeConfig.TEMP_DIR, "iso-")))
        this.innerDir = "/box"
        this.path = this.outerDir + this.innerDir // have to use sum

        await( fs.mkdirAsync(this.path) ) // defaults to 0o777

        this.setDefaultConfigs()
    }

    getRootPath(){
        return this.path
    }

    setDefaultConfigs(){
        this.cgroup = true
        this.chdir = this.innerDir
        this.dirs = [
            {in: this.innerDir, out: this.path, opts: "rw"}
        ]

        this.preserveEnv = false
        this.inheritEnv = []
        this.setEnv = {}
        this.fsize = null
        this.stdin = null
        this.stdout = null
        this.stderr = null
        this.stackSize = null
        this.memorySize = null
        this.maxProcesses = 1
        this.timelimit = null
        this.wallclockLimit = null
        this.extraTimelimit = null
        this.verbosity = 0

        this.cgMemorySize = null
        this.cgTiming = false
    }

    init(){
        let params = []
        if(this.cgroup) params.push("--cg")
        params.push("--box-id=" + this.boxId)
        params.push("--init")

        try{
            let res = await( spawn(this.executable, params) )
        }catch(e){
            logger.error("[Isolate] Sandbox could not be initialized")
            throw e
        }
    }

    getRunArgs(){
        let res = []
        // remember to add meta parameter (for logging) before execing

        if(this.chdir)
            res.push(`--chdir=${this.chdir}`)
        for(let dir of this.dirs) {
            let s = dir.in
            if(dir.out) s += `=${dir.out}`
            if(dir.ops) s += `:${dir.opts}`
            res.push(`--dir=${s}`)
        }
        if(this.preserveEnv)
            res.push("--full-env")

        for(let v of this.inheritEnv)
            res.push(`--env=${v}`)
        for(let key in this.setEnv)
            if(this.setEnv.hasOwnProperty(key))
                res.push(`--env=${key}=${this.setEnv[key]}`)

        if(this.fsize)
            res.push(`--fsize=${this.fsize}`)
        if(this.stdin)
            res.push(`--stdin=${this.stdin}`)
        if(this.stdout)
            res.push(`--stdout=${this.stdout}`)
        if(this.stderr)
            res.push(`--stderr=${this.stderr}`)
        if(this.stackSize)
            res.push(`--stack=${this.stackSize}`)
        if(this.memorySize)
            res.push(`--mem=${this.memorySize}`)
        if(this.maxProcesses)
            res.push(`--processes=${this.maxProcesses}`)
        else
            res.push("--processes")

        if(this.timelimit)
            res.push(`--time=${this.timelimit}`)
        if(this.wallclockLimit)
            res.push(`--wall-time=${this.wallclockLimit}`)
        if(this.extraTimelimit)
            res.push(`--extra-time=${this.extraTimelimit}`)

        for(let i = 0; i < this.verbose; i++)
            res.push("--verbose")

        if(this.cgMemorySize)
            res.push(`--cg-mem=${this.cgMemorySize}`)
        if(this.cgTiming)
            res.push("--cg-timing")

        return res
    }

    getLog(ex){
        if(this.execs < 0) throw "No execution took place in this sandbox"
        let exec = ex || this.execs
        if(exec > this.execs) throw "This execution did not take place in this sandbox"

        let fn = `run.log.${exec}`
        let res = {}

        try {
            let log = this.getFileToString(fn)
            for (let line of log.split(/[\r\n]+/g)) {
                let [key, value] = line.split(":", 1)
                if (log.key)
                    log[key].push(value)
                else
                    log[key] = [value]
            }
        }catch(e){
            logger.error("Error trying to read the log file %s", this.resolvePath(fn))
            throw e
        }
    }
}

async(function(){
    console.log("Testing with async...")
    let env = new jenv.JudgeEnvironment()
    let iso = new Isolate(env)
    console.log(`Box directory: ${iso.path}`)
    console.log(iso.getRunArgs())

    console.log(iso.getLog())
})()

module.exports = {
    Sandbox,
    Isolate
}