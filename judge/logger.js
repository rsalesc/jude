/**
 * Created by rsalesc on 14/06/16.
 */
var winston = require('winston')

var logger = new winston.Logger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        new winston.transports.Console({
            level: (process.env.VERBOSE || true) ? 'debug' : 'warn',
            //handleExceptions: true
        }),
        new winston.transports.File({name: 'info-file', level: 'info', filename: '../logs/info.log'}),
        new winston.transports.File({
            name: 'error-file', level: 'warn', filename: '../logs/error.log',
            //handleExceptions: true, json: true
        })
    ]
})

module.exports = logger