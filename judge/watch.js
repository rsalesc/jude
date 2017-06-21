const async = require('asyncawait/async');
const await = require('asyncawait/await');
const path = require('path');
const mongodb = require("mongodb");
const logger = require(path.join(__dirname, "logger"));
const environment = require(path.join(__dirname, "environment"));
const db = require(path.join(__dirname, "../db"));
const weed = require('jude-seaweedfs')
const grader = require(path.join(__dirname, "grader"));
const {Submission} = require(path.join(__dirname, "../models/"));
const Promise = require("bluebird");

const JudgeEnvironment = environment.JudgeEnvironment;
const JudgeConfig = environment.JudgeConfig;
const POLLING_RATE = 1000;

function sleepAsync(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

function watch(env) {
    return new Promise(async((resolve, reject) => {
        // dbg
        // console.log(await(env.queue.size()));

        let msg = null;
        try {
            msg = await(env.queue.get({ visibility: JudgeConfig.VISIBILITY_WINDOW }));
        } catch(ex) {
            console.log(ex);
            return resolve(null);
        }

        if(!msg)
            return resolve(null);
        
        let req = msg.payload;
        let processMessage = (err) => {
            if(err) {
                logger.error("error processing message %s: %s", msg.id, err.toString());
                return resolve(false);
            }

            try {
                let packPath = env.cache.getFilePath(req.id.toString());
                let verdict = grader.testPackage(env,
                    packPath,
                    req.code,
                    req.lang);
                
                let ack = async(() => {
                    try {
                        await(env.queue.ackById(new mongodb.ObjectID(msg.id)));
                        resolve(true);
                    } catch(ex) {
                        console.log(ex);
                        resolve(false);
                    }
                });

                console.log(verdict);
                Submission.findById(req.subid).exec((err, sub) => {
                    if(err) {
                        logger.error("submission id %s not found", req.subid);
                        return resolve(false);
                    }
                    if(!sub)
                        return ack();
                    sub.verdict = verdict;
                    sub.save((err) => {
                        if(err){
                            logger.error("submission could not be saved: %s", err.toString());
                            return resolve(false);
                        }

                        logger.debug("verdict committed");
                        ack();
                    });
                });
            } catch(ex) {
                logger.error("error testing package %s: %s", req.id, ex.toString());
                return resolve(false);
            }
        };

        if(!env.cache.exists(req.id.toString())) {
            let writeStream = env.cache.addFromStream(req.id.toString(), processMessage);
            env.seaweed.read(req.fid, writeStream);
        } else processMessage();
    }));
}

function startWatching(env) {
    try {
        await(env.queue.clean());
    } catch(ex) {
        console.log("error cleaning up the message queue");
        throw err;
    }

    while(true) {
        console.log("[judge] watching for new submissions");
        while(await(watch(env)) === null) {
            await(sleepAsync(POLLING_RATE));
        }
    }
}


if(!module.parent) {
    let seaweed = weedClient;

    // TODO: dispose after interruption
    async(startWatching)(new JudgeEnvironment(db, seaweed));
}
