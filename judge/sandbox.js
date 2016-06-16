/**
 * Created by rsalesc on 15/06/16.
 */
var Promise = require('bluebird')

var fs = Promise.promisifyAll(require('fs'))
var path = require('path')
var await = require('asyncawait/await')
var async = require('asyncawait/async')
var logger = require('./logger')

// make sure Sandboxes are run inside async environments
class Sandbox{
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

    resolvePath(p){
        return path.join(this.getRootPath(), p)
    }

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

    getFileToStorage(p, d){
        try{
            let absPath = this.resolvePath(p)
            this.cacher.createFileFromBuffer(d, await(fs.readFileAsync(p)))
        }catch(e){
            logger.error("Sandbox %s could not retrieve file %s to storage",
                this.constructor.name, p)
        }
    }
}

module.exports = {
    Sandbox
}