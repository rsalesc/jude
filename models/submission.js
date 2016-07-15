/**
 * Created by rsalesc on 15/07/16.
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// TODO: add creation time (with a plugin)
module.exports = () => {
    var SubmissionSchema = new Schema({
        _creator: {type: Schema.Types.ObjectId, ref: 'User'},
        contest: {type: Schema.Types.ObjectId, ref: 'Contest'},
        problem: {type: Schema.Types.ObjectId, ref: 'Problem'},
        language: String, // add enum validator? maybe not, language set is mutable
        code: String,
        verdict: [Schema.Types.Mixed]
    })

    return db.model('Submission', SubmissionSchema)
}