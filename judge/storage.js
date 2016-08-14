/**
 * Created by rsalesc on 15/06/16.
 */

var Promise = require('bluebird')

const yauzl = require('yauzl')
const concatStream = require('concat-stream')
const utils = require('./utils')
const wildcard = require('node-wildcard')
var path = require('path')
var logger = require('./logger')
var fs = Promise.promisifyAll(require('fs'))
var await = require('asyncawait/await')
var async = require('asyncawait/async')
var glob = Promise.promisifyAll({glob: require('glob').glob}).globAsync

/* Helper Functions for storage */
function dealWithEntry(zipFile, entry){
    return new Promise((resolve, reject) => {
        async(() => {
            zipFile.openReadStream(entry, (err, stream) => {
                if(err) {
                    zipFile.readEntry()
                    return reject(err)
                }

                let concat = concatStream((buffer) => {
                    zipFile.readEntry()
                    return resolve({path: entry.fileName, buffer})
                })

                stream.on('error', (err) => {
                    zipFile.readEntry()
                    return reject(err)
                })

                stream.pipe(concat)
            })
        })()
    })
}

function loadZipAsync(p){
    let absPath = path.resolve(p)
    return new Promise((resolve, reject) => {
        async(() => {
            yauzl.open(absPath, {lazyEntries: true},
                (err, zipFile) => {

                    if(err) return reject(err)
                    let toWait = []
                    zipFile.readEntry()

                    // process entries
                    zipFile.on("entry", (entry) => {
                        if(/\/$/.test(entry.fileName))
                            return zipFile.readEntry()

                        toWait.push(dealWithEntry(zipFile, entry))
                    })

                    zipFile.once("end", async(() => {
                        zipFile.close()
                        // resolve or reject result
                        try{
                            let resWait = await(toWait)
                            resolve(resWait)
                        } catch(ex){
                            reject(ex)
                        }
                    }))
                })
        })()
    })
}

/**
*   This is the base class for Storage
*   Make sure it runs inside an async environment
*   @abstract
 */
class Storage{
    constructor(){
        if(new.target == Storage)
            throw "Cannot instantiate abstract class " + this.constructor.name
    }

    /**
    *   Load a directory/file into the storage
    *   @param {string} path to the directory/file
     */
    load(p){
        throw "Function not implemented in " + this.constructor.name
    }

    /**
     * Relative path to be normalized
     * @param p to be normalized
     * @returns {string} normalized path
     */
    normalizePath(p){
        return (p.length === 0 || p.charAt(0) != '/') ? "/" + p : p
    }

    /**
     *  Load a ZIP file into the storage
     *  @param {string} path to the zip file
     */
    loadZip(p){
        throw "Function not implemented in " + this.constructor.name
    }

    /**
    *   Create a file in the storage from a provided buffer/string
    *   @param {string} path/ID of the new file in the Storage
    *   @param {buffer|string} content of the new file
     */
    createFileFromContent(p, content){
        throw "Function not implemented in " + this.constructor.name
    }

    /**
    *   Get buffer from a file in Storage
    *   @param {string} path/ID to the file in storage
    *   @returns {buffer} buffer from the file
     */
    getFileBuffer(p){
        throw "Function not implemented in " + this.constructor.name
    }

    /**
    *   Get string from a file in storage
    *   @param {string} path/ID to the file in storage
    *   @returns {string} string from the file
     */
    getFileString(p){
        throw "Function not implemented in " + this.constructor.name
    }

    /**
     *  Check if file is readable
     */
    isReadable(p){
        try{
            this.getFileBuffer(p)
            return true
        } catch (ex){
            return false
        }
    }

    /**
     * Get file names that match the given glob pattern
     * @param {string} glob pattern
     * @return {string[]} file names that match the given glob pattern
     */
    glob(p, sort=false){
        throw "Function not implemented in " + this.constructor.name
    }

    /**
     *  Dispose any resource cached in-memory by the storage
     *  (the Storage object should be unusable after that)
     */
    dispose(p){

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
            throw e
        }
    }

    getFileString(p){
        let abs = path.resolve(this.path, p)
        try{
            let res = await(fs.readFileAsync(abs, "utf8"))
            return res
        }catch(e){
            logger.error("[%s] File %s could not be retrieved", this.constructor.name, p)
            throw e
        }
    }
}

class MemoryStorage extends Storage{
    constructor(){
        super()
        this.data = {}
    }

    load(p){
        let absPath = path.resolve(p)
        let res = await(glob("**/*", {cwd: absPath, nodir:true}))
        for(let file of res){
            this.data[this.normalizePath(file)]
                = await(fs.readFileAsync(path.join(absPath, file)))
        }
    }

    loadZip(p){
        let res = await(loadZipAsync(p))
        for(let {path, buffer} of res){
           this.createFileFromContent(path, buffer)
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

    glob(p, sort=false){
        p = this.normalizePath(p)
        let res = []
        for(let fn in this.data){
            if(this.data.hasOwnProperty(fn) &&
                    wildcard(fn, p))
                res.push(fn)
        }
        if(sort) res.sort()
        return res
    }

    dispose(){
        utils.destroy(this.data)
        this.data = null
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