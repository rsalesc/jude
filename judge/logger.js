/**
 * Created by rsalesc on 14/06/16.
 */
const winston = require("winston");
const process = require("process");

const logger = new winston.Logger({
    level: process.env.LOG_LEVEL || "info",
    transports: [
        new winston.transports.Console({
            // eslint-disable-next-line no-constant-condition
            level: process.env.VERBOSE || true
                ? "debug"
                : "warn"
            // handleExceptions: true
        }),
        new winston.transports.File({
            name: "info-file",
            level: "info",
            filename: `${__dirname}/../logs/info.log`
        }),
        new winston.transports.File({
            name: "error-file",
            level: "warn",
            filename: `${__dirname}/../logs/error.log`
            // handleExceptions: true, json: true
        })
    ]
});

module.exports = logger
;
