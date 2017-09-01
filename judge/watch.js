const path = require("path");
const mongodb = require("mongodb");
const logger = require("./logger");
const environment = require("./environment");
const db = require("../db");
const grader = require("./grader");
const { Submission } = require("../models");

const { JudgeEnvironment, JudgeConfig } = environment;
const POLLING_RATE = 1000;

function sleepAsync(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function watch(env) {
  return new Promise(async (resolve) => {
    // dbg
    // console.log(await(env.queue.size()));

    let msg = null;
    try {
      msg = await env.queue.get({ visibility: JudgeConfig.VISIBILITY_WINDOW });
    } catch (ex) {
      console.log(ex);
      return resolve(null);
    }

    if (!msg)
      return resolve(null);

    const req = msg.payload;

    const ack = async () => {
      try {
        await env.queue.ackById(new mongodb.ObjectID(msg.id));
        resolve(true);
      } catch (ex) {
        console.log(ex);
        resolve(false);
      }
    };
    
    if (msg.tries > JudgeConfig.MAX_TRIES)
      return ack();

    env.ack = msg.ack;
    const processMessage = async (err) => {
      if (err) {
        logger.error("error processing message %s", msg.id);
        console.error(err);
        return resolve(false);
      }

      try {
        const packPath = env.cache.getFilePath(req.fid.toString());
        const verdict = await grader.testPackage(env,
                                                 packPath,
                                                 req.code,
                                                 req.lang);

        console.log(verdict);
        Submission.findById(req.subid).exec((err2, sub) => {
          if (err2) {
            logger.error("submission id %s not found", req.subid);
            return resolve(false);
          }
          if (!sub)
            return ack();

          sub.verdict = verdict;
          return sub.save((err3) => {
            if (err3) {
              logger.error("submission could not be saved");
              console.error(err3);
              return resolve(false);
            }

            logger.debug("verdict committed");
            return ack();
          });
        });
      } catch (ex) {
        logger.error("error testing package %s", req.id);
        console.error(ex);
        return resolve(false);
      }

      return null;
    };

    if (!env.cache.exists(req.fid.toString())) {
      const writeStream = env.cache.addFromStream(req.fid.toString(), processMessage);
      env.seaweed.read(req.fid, writeStream);
    } else
      processMessage();

    return null;
  });
}

async function startWatching(env) {
  try {
    await env.queue.clean();
  } catch (ex) {
    console.log("error cleaning up the message queue");
    throw ex;
  }

  /* eslint-disable no-constant-condition, no-await-in-loop */
  while (true) {
    console.log("[judge] watching for new submissions");
    while (await watch(env) === null)
      await sleepAsync(POLLING_RATE);
  }
  /* eslint-enable */
}

const seaweed = weedClient;

// TODO: dispose after interruption
startWatching(new JudgeEnvironment(db, seaweed));
