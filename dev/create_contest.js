require('../db')
var Contest = require('../models/contest')()

new Contest({
    name: "Roberto test",
    start_time: new Date(),
    end_time: new Date(),
    registration_end: new Date(),
    problems: [],
    submissions: [],
    collabs: [],
    registered: []
}).save((err) => {
    if(err) console.log(err)
})