/**
 * Created by rsalesc on 15/06/16.
 */

const yauzl = require("yauzl");
const concatStream = require("concat-stream");
const utils = require("./utils");
const wildcard = require("node-wildcard");
const path = require("path");
const logger = require("./logger");
const fs = require("fs-extra");
const promisify = require("es6-promisify");
const glob = promisify(require("glob").glob);
const streamifier = require("streamifier");

/* Helper Functions for storage */
function dealWithEntry(zipFile, entry) {
  return new Promise((resolve, reject) => {
    zipFile.openReadStream(entry, (err, stream) => {
      if (err) {
        zipFile.readEntry();
        return reject(err);
      }

      const concat = concatStream((buffer) => {
        zipFile.readEntry();
        return resolve({ path: entry.fileName, buffer });
      });

      stream.on("error", (err2) => {
        zipFile.readEntry();
        return reject(err2);
      });

      return stream.pipe(concat);
    });
  });
}

function loadZipAsync(p) {
  const absPath = path.resolve(p);
  return new Promise((resolve, reject) => {
    yauzl.open(absPath, { lazyEntries: true },
               (err, zipFile) => {
                 if (err)
                   return reject(err);
                 const toWait = [];
                 zipFile.readEntry();

                 // process entries
                 zipFile.on("entry", (entry) => {
                   if (/\/$/.test(entry.fileName))
                     return zipFile.readEntry();

                   return toWait.push(dealWithEntry(zipFile, entry));
                 });

                 zipFile.once("end", async () => {
                   zipFile.close();
                   // resolve or reject result
                   try {
                     const resWait = await Promise.all(toWait);
                     resolve(resWait);
                   } catch (ex) {
                     reject(ex);
                   }
                 });

                 return null;
               });
  });
}

/**
*   This is the base class for Storage
*   Make sure it runs inside an async environment
*   @abstract
 */
class Storage {
  constructor() {
    if (this.constructor.name === Storage.name)
      throw `Cannot instantiate abstract class ${this.constructor.name}`;
  }

  /**
  *   Load a directory/file into the storage
  *   @param {string} path to the directory/file
      */
  // eslint-disable-next-line no-unused-vars
  async load(p) {
    throw `Function not implemented in ${this.constructor.name}`;
  }

  /**
   * Relative path to be normalized
   * @param p to be normalized
   * @returns {string} normalized path
   */
  // eslint-disable-next-line no-unused-vars
  normalizePath(p) {
    return p.length === 0 || p.charAt(0) !== "/"
      ? `/${p}`
      : p;
  }

  /**
   *  Load a ZIP file into the storage
   *  @param {string} path to the zip file
   */
  // eslint-disable-next-line no-unused-vars
  async loadZip(p) {
    throw `Function not implemented in ${this.constructor.name}`;
  }

  /**
  *   Create a file in the storage from a provided buffer/string
  *   @param {string} path/ID of the new file in the Storage
  *   @param {buffer|string} content of the new file
    */
  // eslint-disable-next-line no-unused-vars
  async createFileFromContent(p, content) {
    throw `Function not implemented in ${this.constructor.name}`;
  }

  /**
  *   Get buffer from a file in Storage
  *   @param {string} path/ID to the file in storage
  *   @returns {buffer} buffer from the file
    */
  // eslint-disable-next-line no-unused-vars
  async getFileBuffer(p) {
    throw `Function not implemented in ${this.constructor.name}`;
  }

  /**
  *   Get string from a file in storage
  *   @param {string} path/ID to the file in storage
  *   @returns {string} string from the file
    */
  // eslint-disable-next-line no-unused-vars
  async getFileString(p) {
    throw `Function not implemented in ${this.constructor.name}`;
  }

  /**
   * Get readable stream from a file in storage
   * @param {string} path/ID to the file in storage
   * @returns {string} readable stream to the file
   * */
  // eslint-disable-next-line no-unused-vars
  async getFileStream(p) {
    throw `Function not implemented in ${this.constructor.name}`;
  }

  /**
   *  Check if file is readable
   */
  async isReadable(p) {
    try {
      await this.getFileBuffer(p);
      return true;
    } catch (ex) {
      return false;
    }
  }

  /**
     * Get file names that match the given glob pattern
     * @param {string} glob pattern
     * @return {string[]} file names that match the given glob pattern
     */
  // eslint-disable-next-line no-unused-vars
  async glob(p, sort = false) {
    throw `Function not implemented in ${this.constructor.name}`;
  }

  /**
     *  Dispose any resource cached in-memory by the storage
     *  (the Storage object should be unusable after that)
     */
  // eslint-disable-next-line no-unused-vars
  async dispose(p) {
    throw `Function not implemented in ${this.constructor.name}`;
  }
}

class RealStorage extends Storage {
  // WARNING: class created only for testing purposes.
  // Non-persistent Storage should be used (in-memory, temporary dir, etc)
  // TODO: every function should check if dir exist and create it if it doesnt
  constructor() {
    super();
    this.path = "/";
  }

  // eslint-disable-next-line require-await
  async load(p) {
    this.path = path.resolve(p);
  }

  async createFileFromContent(p, content) {
    const abs = path.resolve(this.path, p);
    try {
      await fs.writeFile(abs, content);
    } catch (e) {
      logger.error("[%s] File %s could not be created", this.constructor.name, p);
      throw e;
    }
  }

  async getFileBuffer(p) {
    const abs = path.resolve(this.path, p);
    try {
      const res = await fs.readFile(abs);
      return res;
    } catch (e) {
      logger.error("[%s] File %s could not be retrieved", this.constructor.name, p);
      throw e;
    }
  }

  async getFileString(p) {
    const abs = path.resolve(this.path, p);
    try {
      const res = await fs.readFile(abs, "utf8");
      return res;
    } catch (e) {
      logger.error("[%s] File %s could not be retrieved", this.constructor.name, p);
      throw e;
    }
  }

  async getFileStream(p) {
    return fs.createReadStream(p);
  }
}

class MemoryStorage extends Storage {
  constructor() {
    super();
    this.data = {};
  }

  async load(p) {
    const absPath = path.resolve(p);
    const stat = await fs.lstat(absPath);
    if (stat.isDirectory()) {
      const res = await glob("**/*", { cwd: absPath, nodir: true });

      await Promise.all(res.map(async (file) => {
        this.data[this.normalizePath(file)] = await fs.readFile(path.join(absPath, file));
      }));
    } else
      this.data[this.normalizePath(absPath)] = await fs.readFile(absPath);
  }

  async loadZip(p) {
    const res = await loadZipAsync(p);
    const promises = res.map(({ path: resPath, buffer }) =>
      this.createFileFromContent(resPath, buffer));
    await Promise.all(promises);
  }

  // eslint-disable-next-line require-await
  async createFileFromContent(p, content) {
    const norm = this.normalizePath(p);
    this.data[norm] = new Buffer(content);
  }

  // eslint-disable-next-line require-await
  async getFileBuffer(p, def = null) {
    const normalizedPath = this.normalizePath(p);
    if (!this.data.hasOwnProperty(normalizedPath)) {
      if (def === null)
        throw `File ${normalizedPath} not found in MemoryStorage`;
      else
        return new Buffer(def);
    }
    return this.data[normalizedPath];
  }

  // eslint-disable-next-line require-await
  async getFileString(p, def = null) {
    const normalizedPath = this.normalizePath(p);
    if (!this.data.hasOwnProperty(normalizedPath)) {
      if (def === null)
        throw `File ${normalizedPath} not found in MemoryStorage`;
      else
        return def.toString();
    }
    return this.data[normalizedPath].toString();
  }

  // eslint-disable-next-line require-await
  async getFileStream(p, def = null) {
    return streamifier.createReadStream(this.getFileBuffer(p, def));
  }

  // eslint-disable-next-line require-await
  async glob(p, sort = false) {
    const normalizedPath = this.normalizePath(p);
    const res = [];
    for (const fn of Object.keys(this.data)) {
      if (wildcard(fn, normalizedPath))
        res.push(fn);
    }
    if (sort)
      res.sort();
    return res;
  }

  // eslint-disable-next-line require-await
  async dispose() {
    utils.destroy(this.data);
    this.data = null;
  }
}

if (!module.parent && false) {
  // eslint-disable-next-line require-await
  (async () => {
    console.log("Testing with async...");
    const store = new MemoryStorage();
    await store.load("test_contest");
    console.log(store.getFileString("jude.yml"));
    await store.createFileFromContent("lola", "HAHAHA");
    console.log(store.getFileBuffer("jude.yml"));
    console.log(store.data);
  })();
}


module.exports = {
  Storage,
  RealStorage,
  MemoryStorage
};
