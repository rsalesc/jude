/**
 * Created by rsalesc on 14/06/16.
 */

var path = require('path')
var fs = require('fs')
var task = require(path.join(__dirname, 'task'));
var YAML = require('yamljs')
var logger = require(path.join(__dirname, 'logger'));
var utils = require(path.join(__dirname, 'utils'));
const scoring = require(path.join(__dirname, 'scoring'));

const JUDE_FN = "jude.yml"

/**
*   Base class for all Loaders
*   Make sure it runs inside an aysnc or blockable environment
*   @abstract
 */
class Loader {
    constructor(store){
        if(new.target == Loader)
            throw "Cannot instantiate abstract class " + this.constructor.name
        this.store = store
    }

    /**
    *   Check if a package can be loaded by this Loader
    *   @param {Storage} Storage object
    *   @returns {boolean} if package can be loaded or not
     */
    static isLoadable(store){
        throw "Auto-detection not implemented in " + this.name
    }

    /**
    *   Load package and return a Task
    *   @returns {Task} resulting task or null if some error occurs
     */
    load() {
        throw "Load function not implemented in " + this.constructor.name
    }
}

class JudeLoader extends Loader {
    static isLoadable(store){
        return store.isReadable(JUDE_FN)
    }

    /**
    *   Get paths for the tests of dataset
    *   @param {string} dataset directory
    *   @returns {Object[]} tests found
     */
    getTestcases(datasetPath){
        let testsPath = path.join("tests", datasetPath)

        let inputs = this.store.glob(path.join(testsPath, "/*.in"))
        let res = []

        for(let input of inputs){
            let output = input.replace(/\.in$/, ".out")
            if(!this.store.isReadable(output)){
                logger.error("[%s] test %s should exist", JudeLoader.name, output)
                throw "Missing output file in dataset"
            }

            res.push( {
                in: input,
                out: output
            })
        }

        if(res.length == 0){
            logger.error("[%s] dataset %s is empty", JudeLoader.name, datasetPath)
            throw "Dataset has no tests"
        }
        return res
    }

    /**
    * Returns parsed datasets given their properties in datasets
    * @param {Object[]} datasets to be parsed in Jude format
    * @throws if data is inconsistent
     */
    parseDatasets(datasets){
        if(!datasets || datasets.length == 0){
            logger.error("[%s] package has no dataset", JudeLoader.name)
            throw "Package has no dataset"
        }

        let res = [];
        let cnt = 0
        let percentageSum = 0

        for(let dataset of datasets){

            let cur = {
                name: dataset["name"] || dataset["path"],
                percentage: dataset["percentage"] || 0,
                testcases: this.getTestcases(dataset["path"])
            }

            cur.checkerParams = dataset["checkerParams"] || cur.name

            percentageSum += cur.percentage
            res.push(cur)
        }

        if(Math.abs(percentageSum-1) > utils.EPS){ // check scoring
            logger.error("[%s] datasets percentages should sum to 1", JudeLoader.name)
            throw "Datasets percentages do not sum to 1"
        }

        return res
    }

    /**
    *   Get a {Task} object correspondent to the loaded Jude file
    *   @param {string} loaded Jude file
    *   @returns {Task} task loaded or null if some error occurred
     */
    getTask(cfg){
        let lims = cfg["limits"] || {}
        let checks = cfg["checker"] || {}
        let multiplier = lims["timeMultiplier"] || 1
        let ratio = lims["timeApproximation"] || 500

        var attr = {
            weight: cfg["weight"] || 1,
            datasets: this.parseDatasets(cfg["datasets"]),
            scoring: cfg["scoring"] || "ProductScoring",
            author: cfg["author"] || "",
            limits:{
                time: (lims["time"] ? Math.ceil(lims["time"]*multiplier/ratio)*ratio : 1000), // in ms
                memory: lims["memory"] || 256,
                source: lims["source"] || 500
            },
            blockedLanguages: [],
            checker: {
                language: (checks["language"] || "cpp").toUpperCase(),
                path: checks["path"] || "checker.cpp"
            },
            statement: cfg["statement"] || null
        };

        if (!attr.scoring || !scoring.hasOwnProperty(attr.scoring)){
            logger.error("[%s] scoring type %s does not exist", JudeLoader.name, attr.scoring);
            return null;
        }

        if(attr.statement && !this.store.isReadable(attr.statement)){
            logger.error("[%s] statement was specified but could not be find in %s", JudeLoader.name, attr.statement);
            return null;
        }

        if(!this.store.isReadable(attr.checker.path)){
            logger.error("[%s] checker could not be found in %s", JudeLoader.name, attr.checker.path)
            return null;
        }

        return new task.Task(attr)
    }

    load(){
        if(!this.constructor.isLoadable(this.store)) {
            logger.error('[%s] package is not loadable or does not exist', JudeLoader.name)
            return null
        }

        try {
            var cfg = YAML.parse(this.store.getFileString(JUDE_FN))
            return this.getTask(cfg)
        }catch(e){
            logger.error('[%s] package could not be read or parsed', JudeLoader.name)
            logger.debug(e)
            return null
        }
    }
}

/**
* Contains the loaders available for use
* They can be accessed by their names
 */
const LOADERS = new Map([
    // add loaders here in the following format
    [JudeLoader.name, JudeLoader]
])

/**
*   Returns a loader capable of loading package informed
*   @param {Storage} storage object
*/
function autoDetect(store){
    for(let [name, loader] of LOADERS){
        if(loader.isLoadable(store))
            return loader
    }
    return null
}

// testing
if(!module.parent) {

}

// exports names manually since it's still not supported
module.exports = {
    Loader,
    JudeLoader,
    autoDetect,
    LOADERS
}