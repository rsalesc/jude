/**
 * Created by rsalesc on 15/06/16.
 */

class Storage{
    constructor(){
        if(new.target == Storage)
            throw "Cannot instantiate abstract class " + this.constructor.name
    }
    createFileFromBuffer(){
        throw "Function not implemented in " + this.constructor.name
    }

    getFileBuffer(){
        throw "Function not implemented in " + this.constructor.name
    }
}

module.exports = {
    Storage
}