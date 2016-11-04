const async = require('asyncawait/async');
const await = require('asyncawait/await');
const path = require('path');
const logger = require(path.join(__dirname, "logger"));
const environment = require(path.join(__dirname, "environment"));
const db = require(path.join(__dirname, "../db"));
const weed = require('jude-seaweedfs')
const grader = require(path.join(__dirname, "grader"));
const {Submission} = require(path.join(__dirname, "../models/"));

const JudgeEnvironment = environment.JudgeEnvironment;
const JudgeConfig = environment.JudgeConfig;
const POLLING_RATE = 1000;

function watchAgain(env){
    console.log("[judge] watching for new submissions")
    watch(env);
}

function watch(env){
    env.queue.get({visibility: JudgeConfig.VISIBILITY_WINDOW}, (err, msg) => {
        if(err || !msg)
            return setTimeout(watch, POLLING_RATE, env);
        let req = msg.payload;

        let processMessage = (err) => {
            if(err){
                logger.error("error processing message %s: %s", msg.id, err.toString());
                return setTimeout(watchAgain, POLLING_RATE, env)
            }

            try {
                let packPath = env.cache.getFilePath(req.id);
                let verdict = grader.testPackage(env,
                    packPath,
                    req.code,
                    req.lang);

                let ack = () => {
                    env.queue.ack(msg.ack, (err, id) => {
                        if(err)
                            console.log(`error ack'ing ${msg.id}`);
                        setTimeout(watchAgain, POLLING_RATE, env);
                    });
                };

                // TODO: update verdict of submission in DB
                console.log(verdict);
                Submission.findById(req.subid).exec((err, sub) => {
                    if(err) {
                        logger.error("submission id %s not found", req.subid);
                        return setTimeout(watchAgain, POLLING_RATE, env);
                    }
                    if(!sub)
                        return ack();
                    sub.verdict = verdict;
                    sub.save((err) => {
                        if(err){
                            logger.error("submission could not be saved: %s", err.toString());
                            return setTimeout(watchAgain, POLLING_RATE, env);
                        }

                        logger.debug("verdict committed");
                        ack();
                    });
                });
            }catch(ex){
                logger.error("error testing package %s: %s", req.id, ex.toString());
                return setTimeout(watchAgain, POLLING_RATE, env)
            }

        };

        if(!env.cache.exists(req.id)){
            let writeStream = env.cache.addFromStream(req.id, processMessage);
            env.seaweed.read(req.fid, writeStream);
        } else async(processMessage)()
    })
}

function startWatching(env){
    env.queue.clean((err) => {
        if(err) {
            console.log("error cleaning up the message queue");
            throw err
        }

        async(watchAgain)(env);
    })
}


if(!module.parent) {
    let seaweed = weedClient;

    // TODO: dispose after interruption
    async(startWatching)(new JudgeEnvironment(db, seaweed));
}
