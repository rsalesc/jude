/**
 * Created by rsalesc on 15/06/16.
 */
const Promise = require("bluebird");

const fs = require("fs-extra");

const path = require("path");
const logger = require("./logger");
const jenv = require("./environment");
const utils = require("./utils");
const { globAsync } = utils;

const Storage = require("./storage").MemoryStorage;
const { JudgeConfig } = jenv;
const spawnDetachedPromise = require("child-process-promise").spawn;

/*
*   spawnDetached async version (promisified)
 *
function spawnDetachedAsync(command, args=[], options={}){
    return new Promise((resolve, reject) => {
        options.stdio = ['ignore']
        options.detached = true;
        let successfulExitCodes = (options && options.successfulExitCodes) || [0];

        let proc = spawn(command, args, options)
        proc.unref();

        proc.on("close", (code) => {
            if(successfulExitCodes.indexOf(code) === -1) {
                let commandStr = command + (args.length ? (' ' + args.join(' ')) : '');
                let err = {
                    code,
                    message: '`' + commandStr + '` failed with code ' + code,
                    toString(){
                        return this.message
                    }
                }

                reject(err)
            } else {
                resolve({code})
            }
        })

        proc.on("error", reject)
    })
}*/

// debug
function spawnDetachedAsync(command, args = [], options = {}) {
  if (options.hasOwnProperty("stdio")) {
    options.capture = options.stdio;
    delete options.stdio;
  }
  return spawnDetachedPromise(command, args, options);
}

/*
* This is the base class for sandboxes
* All sandboxes should be extended from this
* Make sure it runs inside an async environment
* @abstract
 */
class Sandbox {
  /*
    * @param {Storage} storage which will provide quick interaction (in-memory)
    *           between host FS and sandbox FS
    * @param {JudgeEnvironment} judge environment used by the sandbox
     */
  constructor(env, store) {
    if (this.constuctor.name === Sandbox.name)
      throw `Cannot instantiate abstract class ${this.constructor.name}`;
    this.cacher = store;
    this.env = env;
  }

  setStorage(store) {
    this.cacher = store;
  }

  setEnvironment(env) {
    this.env = env;
  }

  getRootPath() {
    throw "Concrete sandboxes must implement this function";
  }

  getRunningTime() {
    throw "Concrete sandboxes must implement this function";
  }

  getMemoryUsage() {
    throw "Concrete sandboxes must implement this function";
  }

  getExitCode() {
    throw "Concrete sandboxes must implement this function";
  }

  /*
    * @param {string} path in sandbox (relative to its bound directory)
    * @returns {string} absolute path in host
    **/
  resolvePath(p) {
    return path.join(this.getRootPath(), p);
  }

  _getMode(exec) {
    if (exec === true)
      return 0o777;
    else if (exec === false)
      return 0o664;
    return exec;
  }

  /*
    *   Open a new file in sandbox
    *   @param {string} path in sandbox
    *   @param {string} flags to fs.open
    *   @param {boolean|integer} [exec=false] is the new file executable, or octal mode
    *   @returns {number} file descriptor
     */
  async openFile(p, flags = "wx+", exec = false) {
    const absPath = this.resolvePath(p);
    try {
      const fd = await fs.open(absPath, flags, this._getMode(exec));
      return fd;
    } catch (e) {
      logger.error("Sandbox %s could not open file %s", this.constructor.name, p);
      throw e;
    }
  }

  /*
    * Create a new file in sandbox and close it
    * @param {string} path in sandbox
    * @param {boolean|integer} [exec=false] is the new file executable, or octal mode
     */
  async createFile(p, exec = false) {
    const absPath = this.resolvePath(p);
    try {
      const fd = await fs.open(absPath, "wx+");
      await fs.chmod(absPath, this._getMode(exec));
      await fs.close(fd);
    } catch (e) {
      logger.error("Sandbox %s could not create file %s", this.constructor.name, p);
      throw e;
    }
  }

  /*
    * Same as {Sandbox#createFile}, but writes file from {FileCacher}
    * @param {string} path in sandbox
    * @param {string} path/ID in {FileCacher}
    * @param {boolean|integer} [exec=false] is the new file executable, or octal mode
     */
  async createFileFromStorage(p, d, exec = false) {
    const absPath = this.resolvePath(p);
    try {
      const buf = await this.cacher.getFileBuffer(d);
      await fs.writeFile(absPath, buf, { flag: "wx+" });
      await fs.chmod(absPath, this._getMode(exec));
    } catch (e) {
      logger.error("Sandbox %s could not create file from storage", this.constructor.name);
      throw e;
    }
  }

  async createFileFromString(p, content, exec = false) {
    const absPath = this.resolvePath(p);
    try {
      await fs.writeFile(absPath, content, { flag: "wx+" });
      await fs.chmod(absPath, this._getMode(exec));
    } catch (e) {
      logger.error("Sandbox %s could not create file from storage", this.constructor.name);
      throw e;
    }
  }

  /*
    *   Get an opened file from sandbox
    *   @param {string} path in sandbox
    *   @returns {number} file descriptor
     */
  async getFile(p) {
    try {
      const absPath = this.resolvePath(p);
      const fd = await fs.open(absPath, "r");
      return fd;
    } catch (e) {
      logger.error("Sandbox %s could not retrieve file %s",
                   this.constructor.name, p);
      throw e;
    }
  }

  async getFileToString(p) {
    try {
      const absPath = this.resolvePath(p);
      return await fs.readFile(absPath, "utf8");
    } catch (e) {
      if (e.code === "ENOENT")
        return "";
      logger.error("Sandbox %s could not retrieve file %s",
                   this.constructor.name, p);
      throw e;
    }
  }

  /*
    *   Get file from sandbox and read it into {FileCacher} storage
    *   @param {string} path in sandbox
    *   @param {string} path/ID in {FileCacher} storage
     */
  async getFileToStorage(p, d) {
    try {
      const absPath = this.resolvePath(p);
      await this.cacher.createFileFromContent(d, await fs.readFile(absPath));
    } catch (e) {
      logger.error("Sandbox %s could not retrieve file %s to storage",
                   this.constructor.name, p);
    }
  }

  async globToStorage(pattern, fun) {
    try {
      const files = await globAsync(pattern, { cwd: this.getRootPath(), absolute: true });
      await Promise.all(files.map(async (file) => {
        this.cacher.createFileFromContent(fun(file), await fs.readFile(file));
      }));
    } catch (ex) {
      console.log(ex);
      logger.error("Sandbox could not save class files");
    }
  }

  async globFromStorage(pattern, fun) {
    const matches = await this.cacher.glob(pattern);
    await Promise.all(matches.map(async (match) => {
      await this.createFileFromStorage(fun(match), match);
    }));
  }

  async getFileStats(p) {
    const res = await fs.stat(this.resolvePath(p));
    return res;
  }

  async chmod(p, mode = 0o664) {
    await fs.chmod(this.resolvePath(p), mode);
  }

  async pathExists(p) {
    try {
      await this.getFileStats(p);
      return true;
    } catch (e) {
      return false;
    }
  }

  async fileExists(p) {
    try {
      const res = await this.getFileStats(p);
      return res.isFile();
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async dirExists(p) {
    try {
      const res = await this.getFileStats(p);
      return res.isDirectory();
    } catch (e) {
      return false;
    }
  }

  async removeDir(p) {
    try {
      await fs.rmdir(this.resolvePath(p));
    } catch (e) {
      if (e.code !== "ENOENT")
        throw e;
    }
  }

  async removeFile(p) {
    try {
      await fs.unlink(this.resolvePath(p));
    } catch (e) {
      if (e.code !== "ENOENT")
        throw e;
    }
  }
}

const IsolateConst = {
  EXIT_SANDBOX_ERROR: "sandbox error",
  EXIT_OK: "ok",
  EXIT_SIGNAL: "signal",
  EXIT_TIMEOUT: "timeout",
  EXIT_TIMEOUT_WALL: "wall timeout",
  EXIT_FILE_ACCESS: "file access",
  EXIT_SYSCALL: "syscall",
  EXIT_OUTPUT_LIMIT: "output limit exceeded",
  EXIT_NONZERO_RETURN: "nonzero return"
};

class Isolate extends Sandbox {
  constructor(env, store, log = {}) {
    super(env, store);
    this.log = log;
    this.path = null;
    this.initialized = false;
  }

  getRootPath() {
    if (!this.path)
      throw "sandbox was not init'd";
    return this.path;
  }

  getChdirPath(p) {
    return path.join(this.innerDir, p);
  }

  setDefaultConfigs() {
    this.cgroup = true;
    this.chdir = this.innerDir;
    this.dirs = [
      { in: this.innerDir, out: this.path, opts: "rw" }
    ];

    this.preserveEnv = false;
    this.inheritEnv = [];
    this.setEnv = {};
    this.fsize = null;
    this.stdin = null;
    this.stdout = null;
    this.stderr = null;
    this.stackSize = null;
    this.memorySize = null;
    this.maxProcesses = 1;
    this.timelimit = null;
    this.wallclockLimit = null;
    this.extraTimelimit = null;
    this.verbosity = 0;
    this.bufferize = null;

    this.cgMemorySize = null;
    this.cgTiming = false;
  }

  async init() {
    if (this.initialized) {
      this.setDefaultConfigs();
      await fs.emptyDir(this.path);
      return;
    }

    this.boxId = this.env.getNextBoxId();
    this.executable = JudgeConfig.ISOLATE_PATH;
    this.execs = -1;

    this.outerDir = await fs.mkdtemp(path.join(JudgeConfig.TEMP_DIR, "iso-"));
    this.innerDir = "/tmp";

    // have to use sum, absoluteness of tmp will mess things up
    this.path = this.outerDir + this.innerDir;

    // defaults to 0o777
    await fs.mkdir(this.path);
    await fs.chmod(this.path, 0o777);

    logger.debug("Creating isolate sandbox %s (%d)", this.path, this.boxId);
    this.setDefaultConfigs();

    const params = [];
    if (this.cgroup)
      params.push("--cg");
    params.push(`--box-id=${this.boxId}`);
    params.push("--init");

    try {
      await spawnDetachedAsync(this.executable, params, { stdio: ["ignore"]});
      this.initialized = true;
    } catch (e) {
      logger.error("[Isolate] Sandbox could not be initialized");
      throw e;
    }
  }

  getBoxFilePath(p) {
    if (this.bufferize)
      return this.resolvePath(p);
    return this.getChdirPath(p);
  }

  getRunArgs() {
    const res = [`--box-id=${this.boxId}`];
    // remember to add meta parameter (for logging) before execing

    if (this.bufferize)
      res.push(`--bufferize=${this.bufferize}`);
    if (this.chdir)
      res.push(`--chdir=${this.chdir}`);
    for (const dir of this.dirs) {
      let s = dir.in;
      if (dir.out)
        s += `=${dir.out}`;
      if (dir.opts)
        s += `:${dir.opts}`;
      res.push(`--dir=${s}`);
    }
    if (this.preserveEnv)
      res.push("--full-env");

    for (const v of this.inheritEnv)
      res.push(`--env=${v}`);
    for (const key of Object.keys(this.setEnv))
      res.push(`--env=${key}=${this.setEnv[key]}`);


    if (this.fsize)
      res.push(`--fsize=${this.fsize}`);
    if (this.stdin)
      res.push(`--stdin=${this.getChdirPath(this.stdin)}`);
    if (this.stdout)
      res.push(`--stdout=${this.getBoxFilePath(this.stdout)}`);
    if (this.stderr)
      res.push(`--stderr=${this.getBoxFilePath(this.stderr)}`);
    if (this.stackSize)
      res.push(`--stack=${this.stackSize}`);
    if (this.memorySize)
      res.push(`--mem=${this.memorySize}`);
    if (this.maxProcesses)
      res.push(`--processes=${this.maxProcesses}`);
    else
      res.push("--processes");

    if (this.timelimit)
      res.push(`--time=${this.timelimit}`);
    if (this.wallclockLimit)
      res.push(`--wall-time=${this.wallclockLimit}`);
    if (this.extraTimelimit)
      res.push(`--extra-time=${this.extraTimelimit}`);

    for (let i = 0; i < this.verbose; i++)
      res.push("--verbose");

    if (this.cgroup)
      res.push("--cg");
    if (this.cgMemorySize)
      res.push(`--cg-mem=${this.cgMemorySize}`);
    if (this.cgTiming)
      res.push("--cg-timing");

    return res;
  }

  async getLog(ex) {
    if (this.execs < 0)
      throw "No execution took place in this sandbox";
    const exec = ex || this.execs;
    if (exec > this.execs)
      throw "This execution did not take place in this sandbox";

    if (this.log && this.log.exec === exec)
      return this.log;

    const fn = `run.log.${exec}`;
    const res = {};

    try {
      const log = await this.getFileToString(fn);
      for (const line of log.split(/[\r?\n]+/g)) {
        const [key, value] = line.split(":", 2);
        if (res.key)
          res[key].push(value);
        else
          res[key] = [value];
      }

      this.log = res;
      this.log.exec = exec;
    } catch (e) {
      logger.error("Error trying to read the log file %s", this.resolvePath(fn));
      throw e;
    }

    return this.log;
  }

  // seconds (float)
  getRunningTime() {
    if (this.log.hasOwnProperty("time"))
      return parseFloat(this.log.time[0]);
    return null;
  }

  // in kilobytes (int)
  getMemoryUsage() {
    if (this.log.hasOwnProperty("cg-mem"))
      return parseInt(this.log["cg-mem"][0], 10);
    return null;
  }

  getWallTime() {
    if (this.log.hasOwnProperty("time-wall"))
      return parseFloat(this.log["time-wall"][0], 10);
    return null;
  }

  getExitCode() {
    if (this.log.hasOwnProperty("exitcode"))
      return parseInt(this.log.exitcode[0], 10);
    return 0;
  }

  getKillingSignal() {
    if (this.log.hasOwnProperty("exitsig"))
      return parseInt(this.log.exitsig[0], 10);
    return 0;
  }

  getStatusList() {
    if (this.log.hasOwnProperty("status"))
      return this.log.status;
    return [];
  }

  static translateBoxExitCode(code) {
    if (code === 2)
      return false;
    if (code === 1 || code === 0)
      return true;
    throw `Unknown sandbox exitcode (${code})`;
  }

  getExitStatus() {
    const checkWall = (message) => {
      for (const msg of message) {
        if (msg.indexOf("wall") !== -1)
          return true;
      }
      return false;
    };

    const list = this.getStatusList();
    if (list.indexOf("XX") !== -1)
      return IsolateConst.EXIT_SANDBOX_ERROR;
    if (list.indexOf("FO") !== -1)
      return IsolateConst.EXIT_SYSCALL;
    if (list.indexOf("FA") !== -1)
      return IsolateConst.EXIT_FILE_ACCESS;
    if (list.indexOf("TO") !== -1) {
      if (this.log.hasOwnProperty("message") && checkWall(this.log.message))
        return IsolateConst.EXIT_TIMEOUT_WALL;
      return IsolateConst.EXIT_TIMEOUT;
    }
    if (list.indexOf("SG") !== -1)
      return IsolateConst.EXIT_SIGNAL;
    if (list.indexOf("OL") !== -1)
      return IsolateConst.EXIT_OUTPUT_LIMIT;

    if (list.indexOf("RE") !== -1)
      return IsolateConst.NONZERO_RETURN;
    return IsolateConst.EXIT_OK;
  }

  async executeBufferized(...args) {
    const oldVal = this.bufferize;
    try {
      this.bufferize = JudgeConfig.OUTPUT_LIMIT;
      const res = await this.execute(...args);
      this.bufferize = oldVal;
      return res;
    } catch (e) {
      this.bufferize = oldVal;
      throw e;
    }
  }

  async execute(comm, capture = ["ignore"], promise = false) {
    this.execs += 1;
    this.log = null;
    let args = this.getRunArgs();
    args.push(`--meta=${this.resolvePath(`run.log.${this.execs}`)}`);
    args.push("--run");
    args.push("--");

    const command = Array.isArray(comm)
      ? comm
      : [comm];
    args = args.concat(command);

    if (promise)
      return spawnDetachedAsync(this.executable, args, { stdio: capture });

    let res = null;
    try {
      res = await spawnDetachedAsync(this.executable, args, { stdio: capture });
    } catch (e) {
      res = e;
    }

    const ret = {
      code: res.code,
      message: res.message
    };
    for (const cap of capture) {
      if (res.hasOwnProperty(cap))
        ret[cap] = res[cap].toString();
    }
    return ret;
  }

  async cleanup() {
    logger.debug("Deleting Isolate sandbox %s (%d)", this.path, this.boxId);
    const args = [`--box-id=${this.boxId}`];
    if (this.cgroup)
      args.push("--cg");
    args.push("--cleanup");

    try {
      if (this.initialized)
        await spawnDetachedAsync(this.executable, args, { stdio: ["ignore"]});
      await fs.remove(this.outerDir);
    } catch (e) {
      logger.error("Isolate sandbox %s (%d) could not be deleted", this.path, this.boxId);
      throw e;
    }
  }
}

class IsolatePool {
  constructor(size) {
    this.size = size;
    this.sandboxes = [];
    this.ptr = 0;
    for (let i = 0; i < size; i++)
      this.sandboxes.push(new Isolate());
  }

  getNext(env, store, log = []) {
    const sandbox = this.sandboxes[this.ptr];
    this.ptr += 1;
    this.ptr %= this.size;
    sandbox.setEnvironment(env);
    sandbox.setStorage(store);
    sandbox.log = log;
    return sandbox;
  }

  cleanup() {
    for (const sandbox of this.sandboxes)
      sandbox.cleanup();
  }
}

if (!module.parent && false) {
  // eslint-disable-next-line require-await
  (async () => {
    console.log("Testing with async...");
    const env = new jenv.JudgeEnvironment();
    const store = new Storage();

    const iso = new Isolate(env, store);
    await store.load("test_contest/");

    await iso.init();

    iso.dirs.push({ in: "/etc" });

    iso.preserveEnv = true;
    iso.maxProcesses = null;
    iso.timelimit = 20;
    iso.wallclockLimit = 30;
    console.log(iso.getRunArgs());

    await iso.createFileFromStorage("source.cpp", "checker.cpp");

    try {
      console.log(await iso.execute(["/usr/bin/g++", "source.cpp", "-static",
                                     "-std=c++11", "-O2", "-lm"], ["stdout", "stderr"]));

      await iso.getFileToStorage("a.out", "_/a.out");
      await iso.getLog();
      console.log(iso.log);
    } catch (e) {
      logger.error("Could not execute a.out");
      console.log(e);
    }

    await iso.cleanup();
  })();
}

module.exports = {
  Sandbox,
  Isolate,
  IsolateConst,
  IsolatePool
};
