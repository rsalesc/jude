/**
 * Created by rsalesc on 14/07/16.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var TeamSchema = require('./team')().schema
var Submission = require('./submission')()
var Problem = require('./problem')()

module.exports = () => {
    var ContestSchema = new Schema({
        _creator: {type: Schema.Types.ObjectId, ref: 'User'},
        name: {type: String, minlength: 4, maxlength: 64},
        start_time: Date,
        end_time: Date,
        registration_end: Date,
        problems: [{type: Schema.Types.ObjectId, ref: 'Problem'}],
        submissions: [{type: Schema.Types.ObjectId, ref: 'Submission'}],
        collabs: [{type: Schema.Types.ObjectId, ref: 'User'}],
        registered: [TeamSchema]
    })

    return db.models.Contest ?
        db.model('Contest') :
        db.model('Contest', ContestSchema)
}