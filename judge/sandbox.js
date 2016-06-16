/**
 * Created by rsalesc on 15/06/16.
 */
var Promise = require('bluebird')

var fs = Promise.promisifyAll(require('fs'))
var path = require('path')
var await = require('asyncawait/await')
var async = require('asyncawait/async')
var logger = require('./logger')

/*
* This is the base class for sandboxes
* All sandboxes should be extended from this
* Make sure it runs inside an async environment
* @abstract
 */
class Sandbox{

    /*
    * @param {FileCacher} storage which will provide quick interaction (in-memory)
    *           between host FS and sandbox FS
     */
    constructor(cacher){
        this.cacher = cacher
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

module.exports = {
    Sandbox
}