/**
 * Created by rsalesc on 14/06/16.
 */

const scoring = require(`${__dirname}/scoring`);
const deepcopy = require("deepcopy");

class Task {
  constructor(attr) {
    this.attr = attr;
  }

  // function to check if task is valid

  /**
     * Get scoring class
     */
  getScoringClass() {
    return scoring[this.attr.scoring];
  }

  /**
     * Get scoring
     */
  getScoring() {
    return new (this.getScoringClass())(this);
  }

  /*
    *   Get task directory
    *   @returns {string} task directory
     */
  getDirectory() {
    return this.attr.wd;
  }

  /*
    *   Get checker path
    *   @returns {string} checker path
     */
  getChecker() {
    return this.attr.checker.path;
  }

  /*
    *   Get checker language
    *   @returns {string} checker language
     */
  getCheckerLanguage() {
    return this.attr.checker.language;
  }

  /*
    *   Get datasets
     */
  getDatasets() {
    return this.attr.datasets;
  }

  /*
    *   Get count of datasets
     */
  getDatasetsCount() {
    try {
      return this.attr.datasets.length;
    } catch (e) {
      return 0;
    }
  }

  /*
    *   Get timelimit (in secs)
     */
  getTimelimit() {
    try {
      return this.attr.limits.time / 1000;
    } catch (e) {
      return 1.0;
    }
  }

  getTimelimitMs() {
    return this.attr.limits.time;
  }

  /*
    *   Get memory limit (in MB)
     */
  getMemorylimit() {
    try {
      return this.attr.limits.memory;
    } catch (e) {
      return 256;
    }
  }

  getWeight() {
    return this.weight || 1;
  }

  /**
     * @return {Boolean} if task has a statement specified in package
     */
  hasStatement() {
    return Boolean(this.attr.statement);
  }

  getStatement() {
    if (!this.attr.statement)
      return null;
    return this.attr.statement;
  }

  toJSON() {
    const res = deepcopy(this.attr);
    for (const dataset of res.datasets)
      delete dataset.testcases;
    return res;
  }
}

module.exports = { Task };
