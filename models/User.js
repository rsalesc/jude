/**
 * Created by rsalesc on 14/07/16.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocal = require('passport-local-mongoose')

module.exports = () => {
    var UserSchema = new Schema({
        handle: {
            type: String,
            minlength: 4,
            maxlength: 16,
            match: /[a-zA-Z][a-zA-Z0-9_\.]*/,
            required: true,
            index: true,
            unique: true
        },
        name: {
            type: String,
            maxlength: 64,
            required: true
        },
        email: {
            type: String,
            maxlength: 64,
            required: true,
            // TODO: put email regex here
        },
        registeredAt: [{type: Schema.Types.ObjectId, ref: 'Contest'}],
    })

    UserSchema.plugin(passportLocal, {usernameField: "handle"}) // populate fields?

    return db.models.User ?
        db.model('User') :
        db.model('User', UserSchema)
}