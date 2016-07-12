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
        return this.attr.checker.path
    }

    /*
    *   Get checker language
    *   @returns {string} checker language
     */
    getCheckerLanguage(){
        return this.attr.checker.language
    }

    /*
    *   Get datasets
     */
    getDatasets(){
        return this.attr.datasets
    }

    /*
    *   Get count of datasets
     */
    getDatasetsCount(){
        try{
            return this.attr.datasets.length
        }catch(e){
            return 0
        }
    }

    /*
    *   Get timelimit (in ms)
     */
    getTimelimit(){
        try{
            return this.attr.limits.time
        } catch(e){
            return 1.0
        }
    }

    /*
    *   Get memory limit (in MB)
     */
    getMemorylimit(){
        try{
            return this.attr.limits.memory
        }catch(e){
            return 256
        }
    }
}

module.exports = {
    Task
}
