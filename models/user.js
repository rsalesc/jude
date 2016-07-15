/**
 * Created by rsalesc on 14/07/16.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

module.exports = () => {
    var UserSchema = new Schema({
        handle: {
            type: String,
            minlength: 4,
            maxlength: 16,
            match: /[a-zA-Z][a-zA-Z0-9_\.]*/,
            required: true
        },
        name: {
            type: String,
            maxlength: 64,
            required: true
        },
        password: {
            type: String,
            minlength: 6,
            maxlength: 32,
            required: true,
            // TODO: put password regex here
        },
        email: {
            type: String,
            maxlength: 64,
            required: true,
            // TODO: put email regex here
        },
        registeredAt: [{type: Schema.Types.ObjectId, ref: 'Contest'}],
    })

    return db.model('User', UserSchema)
}