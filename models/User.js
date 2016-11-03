/**
 * Created by rsalesc on 14/07/16.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
const sha256 = require('sha256');

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
            maxlength: 48,
            default: "unnamed"
        },
        description:String,
        password: {type: String},
        email: {
            type: String,
            maxlength: 64
            // TODO: put email regex here
        },
        contest: {type: Schema.Types.ObjectId, ref: 'Contest'},
        unofficial: {type: Boolean, default: false},
        role: {type: String, default: "contestant"}
    })

    UserSchema.index({handle: 1, contest: 1}, {unique: true});

    UserSchema.pre('save', function(next){
        if(this.isModified('password')){
            this.password = sha256(this.password);
        }

        next();
    });

    UserSchema.methods.matchPasswords = function(candidate){
        return this.password == sha256(candidate);
    };

    return db.models.User ?
        db.model('User') :
        db.model('User', UserSchema)
}