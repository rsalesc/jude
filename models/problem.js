/**
 * Created by rsalesc on 15/07/16.
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// TODO: add creation time (with a plugin)
module.exports = () => {
    var ProblemSchema = new Schema({
        source: String,
        hash: String,
        name: String,
        timelimit: Number,
        memorylimit: Number,
        attrs: Schema.Types.Mixed
    })

    return db.model('Problem', ProblemSchema)
}