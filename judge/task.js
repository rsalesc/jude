/**
 * Created by rsalesc on 14/06/16.
 */

var path = require('path')

class Task {
    constructor(attr){
        this.attr = attr
    }

    // function to check if task is valid

    /*
    *   Get task directory
    *   @returns {string} task directory
     */
    getDirectory(){
        return this.attr.wd
    }

    /*
     *   Resolve path according to getDirectory()
     *   @param {string} path to be resolved
     */
    resolvePath(p){
        return path.join(this.getDirectory(), p)
    }

    /*
    *   Get checker path
    *   @returns {string} checker path
     */
    getChecker(){
        throw "not implemented"
    }

    /*
    *   Get checker language
    *   @returns {string} checker language
     */
    getCheckerLanguage(){
        throw "not implemented"
    }
}

module.exports = {
    Task
}
