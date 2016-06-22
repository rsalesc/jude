/**
 * Created by rsalesc on 15/06/16.
 */

var Promise = require('bluebird')

var path = require('path')
var logger = require('./logger')
var fs = Promise.promisifyAll(require('fs'))
var await = require('asyncawait/await')
var async = require('asyncawait/async')
var glob = Promise.promisifyAll({glob: require('glob').glob}).globAsync

/*
*   This is the base class for Storage
*   Make sure it runs inside an async environment
*   @abstract
 */
class Storage{
    constructor(){
        if(new.target == Storage)
            throw "Cannot instantiate abstract class " + this.constructor.name
    }

    /*
    *   Load a directory/file into the storage
    *   @param {string} path to the directory/file
     */
    load(p){
        throw "Function not implemented in " + this.constructor.name
    }

    /*
    *   Create a file in the storage from a provided buffer/string
    *   @param {string} path/ID of the new file in the Storage
    *   @param {buffer|string} content of the new file
     */
    createFileFromContent(p, content){
        throw "Function not implemented in " + this.constructor.name
    }

    /*
    *   Get buffer from a file in Storage
    *   @param {string} path/ID to the file in storage
    *   @returns {buffer} buffer from the file
     */
    getFileBuffer(p){
        throw "Function not implemented in " + this.constructor.name
    }

    /*
    *   Get string from a file in storage
    *   @param {string} path/ID to the file in storage
    *   @returns {string} string from the file
     */
    getFileString(p){
        throw "Function not implemented in " + this.constructor.name
    }
}

class RealStorage extends Storage{
    // WARNING: class created only for testing purposes.
    // Non-persistent Storage should be used (in-memory, temporary dir, etc)
    // TODO: every function should check if dir exist and create it if it doesnt
    constructor(){
        super()
        this.path = "/"
    }
    load(p) {
        this.path = path.resolve(p)
    }
    createFileFromContent(p, content){
        let abs = path.resolve(this.path, p)
        try {
            await(fs.writeFileAsync(abs, content))
        }
        catch(e){
            logger.error("[%s] File %s could not be created", this.constructor.name, p)
            throw e
        }
    }

    getFileBuffer(p){
        let abs = path.resolve(this.path, p)
        try{
            let res = await(fs.readFileAsync(abs))
            return res
        }catch(e){
            logger.error("[%s] File %s could not be retrieved", this.constructor.name, p)
        }
    }

    getFileString(p){
        let abs = path.resolve(this.path, p)
        try{
            let res = await(fs.readFileAsync(abs, "utf8"))
            return res
        }catch(e){
            logger.error("[%s] File %s could not be retrieved", this.constructor.name, p)
        }
    }
}

class MemoryStorage extends Storage{
    constructor(){
        super()
        this.data = {}
    }

    normalizePath(p){
        return (p.length === 0 || p.charAt(0) != '/') ? "/" + p : p
    }

    load(p){
        let absPath = path.resolve(p)
        let res = await(glob("**/*", {cwd: absPath, nodir:true}))
        for(let file of res){
            try {
                this.data[this.normalizePath(file)] = await(fs.readFileAsync(path.join(absPath, file)))
            }catch(e){
                throw e
            }
        }
    }

    createFileFromContent(p, content){
        let norm = this.normalizePath(p)
        this.data[norm] = new Buffer(content)
    }

    getFileBuffer(p, def=null){
        p = this.normalizePath(p)
        if(!this.data.hasOwnProperty(p)){
            if(def === null) throw `File ${p} not found in MemoryStorage`
            else return new Buffer(def)
        }
        return this.data[p]
    }

    getFileString(p, def=null){
        p = this.normalizePath(p)
        if(!this.data.hasOwnProperty(p)){
            if(def === null) throw `File ${p} not found in MemoryStorage`
            else return def.toString()
        }
        return this.data[p].toString()
    }
}

if(!module.parent)
    async(function(){
        console.log("Testing with async...")
        let store = new MemoryStorage()
        store.load("test_contest")
        console.log(store.getFileString("jude.yml"))
        store.createFileFromContent("lola", "HAHAHA")
        console.log(store.getFileBuffer("jude.yml"))
        console.log(store.data)
    })()


module.exports = {
    Storage,
    RealStorage,
    MemoryStorage
}