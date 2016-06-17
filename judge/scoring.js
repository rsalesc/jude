/**
 * Created by rsalesc on 15/06/16.
 */

var task = require('./task')
var utils = require('./utils')
var logger = require('./logger')

class Scoring{
    constructor(){
        if(new.target == Scoring)
            throw "Cannot instantiate abstract class " + this.constructor.name
    }


    /*
    returns true if Task <tk> is a task with valid <this> properties
     */
    static isTaskValid(tk){
        throw "Function not implemented in " + this.name
    }

    static eval(tk, sub){
        throw "Function not implemented in " + this.name
    }
}

class ProductScoring{
    static isTaskValid(tk){
        return true
    }
}

class SumScoring{

}

const SCORINGS = new Map([
  [ProductScoring.name, ProductScoring]
])