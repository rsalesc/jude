/**
 * Created by rsalesc on 15/07/16.
 */
require('../db')
var User = require('../models/User')()

new User({
    handle: "rsalesc",
    name: "Bebeto sales",
    password: "hashbaneira",
    email: "isemevsbeto@saga.nos.cinemas.com"
}).save((err) => {
    if(err) console.log(err)
})