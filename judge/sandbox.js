/**
 * Created by rsalesc on 15/06/16.
 */
var Promise = require('bluebird')

var fs = Promise.promisifyAll(require('fs'))
var dlutil = Promise.promisifyAll({rmtree: require('dlutil').rmtreeAsync})

var path = require('path')
var await = require('asyncawait/await')
var async = require('asyncawait/async')
var logger = require('./logger')
var jenv = require('./environment')
var spawn = require('child-process-promise').spawn
var utils = require('./utils')

var Storage = require('./storage').MemoryStorage
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
        if(new.target == Sandbox)
            throw "Cannot instantiate abstract class " + this.constructor.name
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

    getExitCode(){
        throw "Concrete sandboxes must implement this function"
    }

    /*
    * @param {string} path in sandbox (relative to its bound directory)
    * @returns {string} absolute path in host
    **/
    resolvePath(p){
        return path.join(this.getRootPath(), p)
    }

    _getMode(exec){
        if(exec === true) return 0o777
        else if(exec === false) return 0o664
        return exec
    }

    /*
    *   Open a new file in sandbox
    *   @param {string} path in sandbox
    *   @param {string} flags to fs.open
    *   @param {boolean|integer} [exec=false] is the new file executable, or octal mode
    *   @returns {number} file descriptor
     */
    openFile(p, flags = 'wx+', exec = false){
        let absPath = this.resolvePath(p)
        try{
            let fd = await(fs.openAsync(absPath, flags, this._getMode(exec)))
            return fd
        }catch(e){
            logger.error("Sandbox %s could not open file %s", this.constructor.name, p)
            throw e
        }
    }

    /*
    * Create a new file in sandbox and close it
    * @param {string} path in sandbox
    * @param {boolean|integer} [exec=false] is the new file executable, or octal mode
     */
    createFile(p, exec = false){
        let absPath = this.resolvePath(p)
        try {
            let fd = await(fs.openAsync(absPath, 'wx+'))
            await(fs.chmodAsync(absPath, this._getMode(exec)))
            await(fs.closeAsync(fd))
        }catch(e){
            logger.error("Sandbox %s could not create file %s", this.constructor.name, p)
            throw e
        }
    }

    /*
    * Same as {Sandbox#createFile}, but writes file from {FileCacher}
    * @param {string} path in sandbox
    * @param {string} path/ID in {FileCacher}
    * @param {boolean|integer} [exec=false] is the new file executable, or octal mode
     */
    createFileFromStorage(p, d, exec = false){
        let absPath = this.resolvePath(p)
        try {
            let buf = this.cacher.getFileBuffer(d)
            await(fs.writeFileAsync(absPath, buf, {flag: "wx+"}))
            await(fs.chmodAsync(absPath, this._getMode(exec)))
        } catch(e){
            logger.error("Sandbox %s could not create file from storage", this.constructor.name)
            throw e
        }
    }

    createFileFromString(p, content, exec = false){
        let absPath = this.resolvePath(p)
        try {
            await(fs.writeFileAsync(absPath, content, {flag: "wx+"}))
            await(fs.chmodAsync(absPath, this._getMode(exec)))
        } catch(e){
            logger.error("Sandbox %s could not create file from storage", this.constructor.name)
            throw e
        }
    }

    /*
    *   Get an opened file from sandbox
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
            return await(fs.readFileAsync(absPath, "utf8"))
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
            this.cacher.createFileFromContent(d, await(fs.readFileAsync(absPath)))
        }catch(e){
            logger.error("Sandbox %s could not retrieve file %s to storage",
                this.constructor.name, p)
        }
    }

    getFileStats(p){
        let res = await(fs.statAsync(this.resolvePath(p)))
        return res
    }

    chmod(p, mode=0o664){
        await(fs.chmodAsync(this.resolvePath(p), mode))
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

const IsolateConst = {
    EXIT_SANDBOX_ERROR: "sandbox error",
    EXIT_OK: "ok",
    EXIT_SIGNAL: "signal",
    EXIT_TIMEOUT: "timeout",
    EXIT_TIMEOUT_WALL: "wall timeout",
    EXIT_FILE_ACCESS: "file access",
    EXIT_SYSCALL: "syscall",
    EXIT_NONZERO_RETURN: "nonzero return"
}

class Isolate extends Sandbox {
    constructor(env, store) {
        super(env, store)
        this.boxId = env.getNextBoxId()
        this.executable = JudgeConfig.ISOLATE_PATH
        this.execs = -1

        this.outerDir = await(fs.mkdtempAsync(path.join(JudgeConfig.TEMP_DIR, "iso-")))
        this.innerDir = "/tmp"
        this.path = this.outerDir + this.innerDir // have to use sum
        this.log = {}

        await(fs.mkdirAsync(this.path)) // defaults to 0o777
        await(fs.chmod(this.path, 0o777))

        logger.debug("Creating isolate sandbox %s (%d)", this.path, this.boxId)
        this.setDefaultConfigs()
    }

    getRootPath() {
        return this.path
    }

    getChdirPath(p) {
        return path.join(this.innerDir, p)
    }

    setDefaultConfigs() {
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

    init() {
        let params = []
        if (this.cgroup) params.push("--cg")
        params.push("--box-id=" + this.boxId)
        params.push("--init")

        try {
            let res = await(spawn(this.executable, params))
        } catch (e) {
            logger.error("[Isolate] Sandbox could not be initialized")
            throw e
        }
    }

    getRunArgs() {
        let res = [`--box-id=${this.boxId}`]
        // remember to add meta parameter (for logging) before execing

        if (this.chdir)
            res.push(`--chdir=${this.chdir}`)
        for (let dir of this.dirs) {
            let s = dir.in
            if (dir.out) s += `=${dir.out}`
            if (dir.opts) s += `:${dir.opts}`
            res.push(`--dir=${s}`)
        }
        if (this.preserveEnv)
            res.push("--full-env")

        for (let v of this.inheritEnv)
            res.push(`--env=${v}`)
        for (let key in this.setEnv)
            if (this.setEnv.hasOwnProperty(key))
                res.push(`--env=${key}=${this.setEnv[key]}`)

        if (this.fsize)
            res.push(`--fsize=${this.fsize}`)
        if (this.stdin)
            res.push(`--stdin=${this.getChdirPath(this.stdin)}`)
        if (this.stdout)
            res.push(`--stdout=${this.getChdirPath(this.stdout)}`)
        if (this.stderr)
            res.push(`--stderr=${this.getChdirPath(this.stderr)}`)
        if (this.stackSize)
            res.push(`--stack=${this.stackSize}`)
        if (this.memorySize)
            res.push(`--mem=${this.memorySize}`)
        if (this.maxProcesses)
            res.push(`--processes=${this.maxProcesses}`)
        else
            res.push("--processes")

        if (this.timelimit)
            res.push(`--time=${this.timelimit}`)
        if (this.wallclockLimit)
            res.push(`--wall-time=${this.wallclockLimit}`)
        if (this.extraTimelimit)
            res.push(`--extra-time=${this.extraTimelimit}`)

        for (let i = 0; i < this.verbose; i++)
            res.push("--verbose")

        if(this.cgroup)
            res.push("--cg")
        if (this.cgMemorySize)
            res.push(`--cg-mem=${this.cgMemorySize}`)
        if (this.cgTiming)
            res.push("--cg-timing")

        return res
    }

    getLog(ex) {
        if (this.execs < 0) throw "No execution took place in this sandbox"
        let exec = ex || this.execs
        if (exec > this.execs) throw "This execution did not take place in this sandbox"

        if(this.log && this.log._exec === exec)
            return this.log

        let fn = `run.log.${exec}`
        let res = {}

        try {
            let log = this.getFileToString(fn)
            for (let line of log.split(/[\r?\n]+/g)) {
                let [key, value] = line.split(":", 2)
                if (res.key)
                    res[key].push(value)
                else
                    res[key] = [value]
            }

            this.log = res
            this.log._exec = exec
        } catch (e) {
            logger.error("Error trying to read the log file %s", this.resolvePath(fn))
            throw e
        }

        return this.log
    }

    getRunningTime() { // seconds (float)
        if (this.log.hasOwnProperty("time"))
            return this.log["time"][0]
        return null
    }


    getMemoryUsage() { // in kilobytes (int)
        if (this.log.hasOwnProperty("cg-mem"))
            return parseInt(this.log["cg-mem"][0])
        return null
    }

    getWallTime() {
        if (this.log.hasOwnProperty("time-wall"))
            return this.log["time-wall"][0]
        return null
    }

    getExitCode() {
        if (this.log.hasOwnProperty("exitcode"))
            return parseInt(this.log["exitcode"][0])
        return 0
    }

    getKillingSignal() {
        if (this.log.hasOwnProperty("exitsig"))
            return parseInt(this.log["exitsig"][0])
        return 0
    }

    getStatusList() {
        if (this.log.hasOwnProperty("status"))
            return this.log["status"]
        return []
    }

    static translateBoxExitCode(code){
        if(code == 2) return false
        if(code == 1 || code == 0) return true
        throw "Unknown sandbox exitcode (" + code + ")"
    }

    getExitStatus() {
        list = this.getStatusList()
        if (list.indexOf("XX") !== -1)
            return IsolateConst.EXIT_SANDBOX_ERROR
        if (list.indexOf("FO") !== -1)
            return IsolateConst.EXIT_SYSCALL
        if (list.indexOf("FA") !== -1)
            return IsolateConst.EXIT_FILE_ACCESS
        if (list.indexOf("TO") !== -1) {
            if (this.log.hasOwnProperty("message") && this.log["message"].indexOf("wall") !== -1)
                return IsolateConst.EXIT_TIMEOUT_WALL
            else
                return IsolateConst.EXIT_TIMEOUT
        }
        if (list.indexOf("SG") !== -1)
            return IsolateConst.EXIT_SIGNAL
        if (list.indexOf("RE") !== -1)
            return IsolateConst.NONZERO_RETURN
        return IsolateConst.EXIT_OK
    }

    execute(command, capture=[], promise=false){
        this.execs++
        this.log = null
        let args = this.getRunArgs()
        args.push("--meta=" + this.resolvePath(`run.log.${this.execs}`))
        args.push("--run")
        args.push("--")
        if(!Array.isArray(command)) command = [command]
        args = args.concat(command)

        if(promise)
            return spawn(this.executable, args, {capture})
        else {
            let res = null
            try {
                res = await(spawn(this.executable, args, {capture}))
            } catch (e) {
                res = e
            }

            let ret = {
                code: res.code,
                message: res.message
            }
            for (let cap of capture) {
                if (res.hasOwnProperty(cap))
                    ret[cap] = res[cap].toString()
            }
            return ret
        }
    }

    cleanup(){
        logger.debug("Deleting Isolate sandbox %s (%d)", this.path, this.boxId)
        let args = [`--box-id=${this.boxId}`]
        if(this.cgroup) args.push("--cg")
        args.push("--cleanup")

        try{
            await(spawn(this.executable, args))
            await(dlutil.rmtreeAsync(this.outerDir))
        }catch(e){
            logger.error("Isolate sandbox %s (%d) could not be deleted", this.path, this.boxId)
            throw e
        }
    }
}

if(!module.parent) {
    async(function () {
        var sleep = require('sleep').sleep

        console.log("Testing with async...")
        let env = new jenv.JudgeEnvironment()
        let store = new Storage()

        let iso = new Isolate(env, store)
        store.load("test_contest/")

        iso.init()

        iso.dirs.push({in: "/etc"})

        iso.preserveEnv = true
        iso.maxProcesses = null
        iso.timelimit = 20
        iso.wallclockLimit = 30
        console.log(iso.getRunArgs())

        iso.createFileFromStorage("source.cpp", "checker.cpp")

        try {
            console.log(iso.execute(["/usr/bin/g++", "source.cpp", "-static",
                "-std=c++11", "-O2", "-lm"], ['stdout', 'stderr']))

            iso.getFileToStorage("a.out", "_/a.out")
            iso.getLog()
            console.log(iso.log)
        } catch (e) {
            logger.error("Could not execute a.out")
            console.log(e)
        }
        iso.cleanup()

    })()
}

module.exports = {
    Sandbox,
    Isolate,
    IsolateConst
}