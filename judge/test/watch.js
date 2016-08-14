const async = require('asyncawait/async');
const await = require('asyncawait/await');
const logger = require('./../logger')
const environment = require('./../environment');
const db = require('../../db')
const weed = require('jude-seaweedfs')
const grader = require('./../grader')

const JudgeEnvironment = environment.JudgeEnvironment;
const JudgeConfig = environment.JudgeConfig;
const POLLING_RATE = 1000;

function watchAgain(env){
    console.log("[judge] watching for new submissions")
    watch(env)
}

function watch(env){
    env.queue.get({visibility: JudgeConfig.VISIBILITY_WINDOW}, (err, msg) => {
        if(err || !msg)
            return setTimeout(watch, POLLING_RATE, env);
        let req = msg.payload

        let processMessage = (err) => {
            if(err){
                logger.error("error processing message %s: %s", msg.id, err.toString())
                return setTimeout(watchAgain, POLLING_RATE, env)
            }

            try {
                let packPath = env.cache.getFilePath(req.id)
                let verdict = grader.testPackage(env,
                    packPath,
                    req.code,
                    req.lang)

                // TODO: update verdict of submission in DB
                console.log(verdict)

                env.queue.ack(msg.ack, (err, id) => {
                    if(err)
                        console.log(`error ack'ing ${msg.id}`);
                    setTimeout(watchAgain, POLLING_RATE, env);
                })
            }catch(ex){
                logger.error("error testing package %s: %s", req.id, ex.toString())
                return setTimeout(watchAgain, POLLING_RATE, env)
            }

        }

        if(!env.cache.exists(req.id)){
            let writeStream = env.cache.addFromStream(req.id, processMessage)
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
    let seaweed = new weed({
        server:		"localhost",
        port:		9333
    });

    // TODO: dispose after interruption
    async(startWatching)(new JudgeEnvironment(db, seaweed));
}
