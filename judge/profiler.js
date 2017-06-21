const process = require("process");

function getSeconds(tuple) {
    return tuple[0] + tuple[1] / 1e9;
}

class Profiler {
    constructor() {
        this.start = {};
        this.acc = {};
    }

    fire(task = "default") {
        if(!this.acc.hasOwnProperty(task))
            this.acc[task] = 0;
        this.start[task] = process.hrtime();
    }

    reset(task = "default") {
        this.acc[task] = 0;
        this.start[task] = process.hrtime();
    }

    elapsed(task = "default") {
        let started = this.start[task];
        return this.acc[task] + (started ? getSeconds(process.hrtime(started)): 0);
    }

    stop(task = "default") {
        this.acc[task] = this.elapsed(task);
        this.start[task] = null;
    }

    dump(cb = console.log) {
        for(let task in this.acc) {
            if(this.acc.hasOwnProperty(task)) {
                cb(`${task}: ${this.elapsed(task)}`);
            }
        }
    }
}

module.exports = Profiler;