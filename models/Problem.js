/**
 * Created by rsalesc on 15/07/16.
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// TODO: add creation time (with a plugin)
module.exports = () => {
    var ProblemSchema = new Schema({
        code: {
            type: String,
            minlength: 4,
            maxlength: 24,
            match: /[a-zA-Z][a-zA-Z0-9\-]*/,
            required: true
        },
        name: {
            type: String,
            minlength: 4,
            maxlength: 64,
            required: true
        },
        statementFid: String,
        fid: String,
        attr: Schema.Types.Mixed
    });

    ProblemSchema.index({code: 1}, {unique: 1});
    ProblemSchema.index({name: 1});

    return db.models.Problem ?
        db.model('Problem') :
        db.model('Problem', ProblemSchema)
};