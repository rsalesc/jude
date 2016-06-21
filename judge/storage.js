/**
 * Created by rsalesc on 15/06/16.
 */

var Promise = require('bluebird')

var path = require('path')
var logger = require('./logger')
var fs = Promise.promisifyAll(require('fs'))
var await = require('asyncawait/await')
var async = require('asyncawait/async')

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

if(!module.parent)
    async(function(){
        console.log("Testing with async...")
        let store = new RealStorage()
        store.load("test_contest")
        console.log(store.getFileString("jude.yml"))
        store.createFileFromContent("lol", "HAHAHA")
        console.log(store.getFileBuffer("jude.yml"))
    })()


module.exports = {
    Storage,
    RealStorage
}