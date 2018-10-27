/**
 * Created by rsalesc on 14/07/16.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
const sha256 = require('sha256');

module.exports = () => {
    if(db.models.User)
        return db.model("User");

    var UserSchema = new Schema({
        handle: {
            type: String,
            minlength: 3,
            maxlength: 24,
            match: /[a-zA-Z][a-zA-Z0-9_\.]*/,
            required: true
        },
        name: {
            type: String,
            maxlength: 48,
            default: "unnamed"
        },
        description:String,
        password: {
          type: String,
          minlength: 1,
          maxlength: 48
        },
        email: {
            type: String,
            maxlength: 64
            // TODO: put email regex here
        },
        contest: {type: Schema.Types.ObjectId, ref: 'Contest'},
        unofficial: {type: Boolean, default: false},
        disabled: {type: Boolean, default: false},
        role: {type: String, default: "contestant"}
    }, {timestamps: true});

    UserSchema.index({handle: 1, contest: 1}, {unique: true});
    UserSchema.index({handle: 'text', name: 'text'}, {
        weights: {
            handle: 2,
            name: 1
        }
    });

    UserSchema.pre('save', function(next){
        if(this.isModified('password')){
            this.password = sha256(this.password);
        }

        next();
    });

    UserSchema.methods.matchPasswords = function(candidate){
        return this.password == sha256(candidate);
    };

    UserSchema.pre("remove", function(next) {
        db.model("Submission").remove({ _creator: this._id }, err => {
            if(err) console.error(err);
        });
        next();
    });

    return db.model('User', UserSchema)
}
