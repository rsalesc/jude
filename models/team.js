/**
 * Created by rsalesc on 14/07/16.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

module.exports = () => {
    var TeamSchema = new Schema({
        name: {
            type: String,
            maxlength: 64
        },
        contest: {type: Schema.Types.ObjectId, ref: 'Contest'},
        members: [{type: Schema.Types.ObjectId, ref: 'User'}]
    })

    return db.model('Team', TeamSchema)
}