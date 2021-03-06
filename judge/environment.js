/**
 * Created by rsalesc on 15/06/16.
 */

const fs = require("fs");
const fse = require("fs-extra");
const tmp = require("tmp");
tmp.setGracefulCleanup();

const path = require("path");

const MongoQueue2 = require("mongo-queue2");

const { JudgeConfig } = require("~/config");

class FileCacher {
  constructor(size = 20) {
    this.path = tmp.dirSync({ prefix: "judecache-", unsafeCleanup: true }).name;
    this.has = new Map();
    this.size = size;
  }

  popLessFrequent() {
    let best = 1e9;
    let res = [];
    for (const [key, value] of this.has) {
      if (value < best)
        res = [];
      if (value <= best) {
        best = value;
        res.push(key);
      }
    }

    try {
      if (res.length > 0) {
        const idx = Math.random() * res.length | 0;
        const p = this.getFilePath(res[idx]);
        fs.removeSync(p);
        this.has.delete(res[idx]);
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }

  ensureSpace() {
    while (this.has.size >= this.size) {
      if (!this.popLessFrequent())
        break;
    }
  }

  ping(p) {
    const nv = Math.max(this.has.get(p) || 0, 0) + 1;
    for (const [key, value] of this.has)
      this.has.set(key, value - 1);

    this.has.set(p, nv);
  }

  addFromStream(p, cb) {
    const writeStream = fs.createWriteStream(path.join(this.path, p));
    writeStream.on("finish", () => {
      this.ensureSpace();
      this.ping(p);
      if (cb)
        cb(null);
    });

    writeStream.on("error", (err) => {
      if (cb)
        cb(null);
    });

    return writeStream;
  }

  async addFromFile(p, d) {
    await fse.copySync(d, this.getFilePath(p));
    this.ensureSpace();
    this.ping(p);
  }

  async addFromContent(p, content) {
    await fse.writeFile(this.getFilePath(p), content, { flag: "wx+" });
    this.ensureSpace();
    this.ping(p);
  }

  exists(p) {
    return this.has.has(p);
  }

  getFilePath(p) {
    return path.resolve(this.path, p);
  }
}

class JudgeEnvironment {
  constructor(db, seaweed) {
    this.sandboxes = [];
    this.nextSandboxId = 0;
    this.db = db;
    this.cache = new FileCacher();
    this.checkerCache = new FileCacher();
    this.ack = null;

    this.seaweed = seaweed;
    if (db)
      this.queue = new MongoQueue2(db, "jude-queue2");
  }

  async pingCurrent() {
    if (!this.ack)
      return null;
    
    try {
      await this.queue.ping(this.ack);
      console.log(`pinged ${this.ack}`);
    } catch (ex) {
      console.error(`couldnt ack ${this.ack}`);
    }

    return null;
  }

  getNextBoxId() {
    const res = this.nextSandboxId++;
    this.nextSandboxId %= JudgeConfig.MAX_SANDBOXES;
    return res % JudgeConfig.MAX_SANDBOXES
      + JudgeConfig.SANDBOX_OFFSET * JudgeConfig.MAX_SANDBOXES;
  }
}

module.exports = {
  JudgeEnvironment,
  JudgeConfig
};
