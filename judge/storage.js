/**
 * Created by rsalesc on 15/06/16.
 */

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

module.exports = {
    Storage
}