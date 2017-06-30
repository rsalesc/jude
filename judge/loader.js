/**
 * Created by rsalesc on 14/06/16.
 */

const path = require("path");
const task = require(path.join(__dirname, "task"));
const YAML = require("yamljs");
const logger = require(path.join(__dirname, "logger"));
const utils = require(path.join(__dirname, "utils"));
const scoring = require(path.join(__dirname, "scoring"));

const JUDE_FN = "jude.yml";

/**
*   Base class for all Loaders
*   Make sure it runs inside an aysnc or blockable environment
*   @abstract
 */
class Loader {
  constructor(store) {
    if (new.target === Loader)
      throw `Cannot instantiate abstract class ${this.constructor.name}`;
    this.store = store;
  }

  /**
    *   Check if a package can be loaded by this Loader
    *   @param {Storage} Storage object
    *   @returns {boolean} if package can be loaded or not
     */
  // eslint-disable-next-line no-unused-vars
  static async isLoadable(store) {
    throw `Auto-detection not implemented in ${this.name}`;
  }

  /**
    *   Load package and return a Task
    *   @returns {Task} resulting task or null if some error occurs
     */
  load() {
    throw `Load function not implemented in ${this.constructor.name}`;
  }
}

class JudeLoader extends Loader {
  static async isLoadable(store) {
    return store.isReadable(JUDE_FN);
  }

  /**
    *   Get paths for the tests of dataset
    *   @param {string} dataset directory
    *   @returns {Object[]} tests found
     */
  async getTestcases(datasetPath) {
    const testsPath = path.join("tests", datasetPath);

    const inputs = (await this.store.glob(path.join(testsPath, "/*.in"))).sort();
    const res = [];

    for (const input of inputs) {
      const output = input.replace(/\.in$/, ".out");
      // eslint-disable-next-line no-await-in-loop
      if (!await this.store.isReadable(output)) {
        logger.error("[%s] test %s should exist", JudeLoader.name, output);
        throw "Missing output file in dataset";
      }

      res.push({
        in: input,
        out: output
      });
    }

    if (res.length === 0) {
      logger.error("[%s] dataset %s is empty", JudeLoader.name, datasetPath);
      throw "Dataset has no tests";
    }
    return res;
  }

  /**
    * Returns parsed datasets given their properties in datasets
    * @param {Object[]} datasets to be parsed in Jude format
    * @throws if data is inconsistent
     */
  async parseDatasets(datasets) {
    if (!datasets || datasets.length === 0) {
      logger.error("[%s] package has no dataset", JudeLoader.name);
      throw "Package has no dataset";
    }

    const res = [];
    let percentageSum = 0;

    for (const dataset of datasets) {
      const cur = {
        name: dataset.name || dataset.path,
        percentage: dataset.percentage || 0,
        testcases: await this.getTestcases(dataset.path) // eslint-disable-line no-await-in-loop
      };

      cur.checkerParams = dataset.checkerParams || cur.name;

      percentageSum += cur.percentage;
      res.push(cur);
    }

    // check scoring
    if (Math.abs(percentageSum - 1) > utils.EPS) {
      logger.error("[%s] datasets percentages should sum to 1", JudeLoader.name);
      throw "Datasets percentages do not sum to 1";
    }

    return res;
  }

  /**
    *   Get a {Task} object correspondent to the loaded Jude file
    *   @param {string} loaded Jude file
    *   @returns {Task} task loaded or null if some error occurred
     */
  async getTask(cfg) {
    const lims = cfg.limits || {};
    const checks = cfg.checker || {};
    const multiplier = lims.timeMultiplier || 1;
    const ratio = lims.timeApproximation || 500;

    const attr = {
      weight: cfg.weight || 1,
      datasets: await this.parseDatasets(cfg.datasets),
      scoring: cfg.scoring || "ProductScoring",
      author: cfg.author || "",
      limits: {
        // in ms
        time: lims.time
          ? Math.ceil(lims.time * multiplier / ratio) * ratio
          : 1000,
        memory: lims.memory || 256,
        source: lims.source || 500
      },
      blockedLanguages: [],
      checker: {
        language: (checks.language || "cpp").toUpperCase(),
        path: checks.path || "checker.cpp"
      },
      statement: cfg.statement || null
    };

    if (!attr.scoring || !scoring.hasOwnProperty(attr.scoring)) {
      logger.error("[%s] scoring type %s does not exist", JudeLoader.name, attr.scoring);
      return null;
    }

    if (attr.statement && !await this.store.isReadable(attr.statement)) {
      logger.error("[%s] statement was specified but could not be find in %s",
                   JudeLoader.name, attr.statement);
      return null;
    }

    if (!await this.store.isReadable(attr.checker.path)) {
      logger.error("[%s] checker could not be found in %s", JudeLoader.name, attr.checker.path);
      return null;
    }

    return new task.Task(attr);
  }

  async load() {
    if (!await this.constructor.isLoadable(this.store)) {
      logger.error("[%s] package is not loadable or does not exist", JudeLoader.name);
      return null;
    }

    try {
      const cfg = YAML.parse(await this.store.getFileString(JUDE_FN));
      return this.getTask(cfg);
    } catch (e) {
      logger.error("[%s] package could not be read or parsed", JudeLoader.name);
      logger.debug(e);
      return null;
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
]);

/**
*   Returns a loader capable of loading package informed
*   @param {Storage} storage object
*/
async function autoDetect(store) {
  for (const [_, loader] of LOADERS) {
    // eslint-disable-next-line no-await-in-loop
    if (await loader.isLoadable(store))
      return loader;
  }
  return null;
}

// exports names manually since it's still not supported
module.exports = {
  Loader,
  JudeLoader,
  autoDetect,
  LOADERS
};
