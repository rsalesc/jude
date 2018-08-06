import * as timesync from "timesync";

class JudeTimesync {
  constructor(opts) {
    this.interval = opts.interval;
    if (opts.hasOwnProperty("interval"))
      this.interval = opts.interval;
    opts.interval = null;
    this.useStorage = typeof Storage !== "undefined";
    this.ts = timesync.create(opts);

    // Initialize from storage.
    this.lastUpdate = 0;
    if (this.useStorage) {
      if (window.localStorage.hasOwnProperty("timesync")) {
        const obj = JSON.parse(window.localStorage.getItem("timesync"));
        this.ts.offset = obj.offset;
        this.lastUpdate = obj.lastUpdate;
      }
    }

    if (opts.threshold != null) {
      (async () => {
        const singleShotTs = timesync.create({ ...opts, repeat: 1 });
        await singleShotTs.sync();
        if (Math.abs(singleShotTs.offset - this.ts.offset) > opts.threshold) {
          this.ts.offset = singleShotTs.offset;
          this.sync();
        }
      })();
    }

    if (this.interval != null) {
      // Configure lastSync callback.
      this.ts.on("sync", (event) => {
        if (event === "end") {
          this.lastUpdate = Date.now();
          if (this.useStorage) {
            window.localStorage.setItem("timesync", JSON.stringify({
              offset: this.ts.offset,
              lastUpdate: this.lastUpdate
            }));
          }
        }
      });

      const diff = Date.now() - this.lastUpdate;
      if (diff < 0 || diff > this.interval)
        this.sync();
      this.intervalHandler = setInterval(() => this.sync(), this.interval);
    }
  }

  offset() {
    return this.ts.offset;
  }

  sync() {
    this.ts.sync();
  }

  now() {
    return this.ts.now();
  }

  date() {
    return new Date(this.now());
  }
}

export default new JudeTimesync({
  server: "/timesync",
  interval: 1000 * 60 * 5,
  threshold: 5000
});
