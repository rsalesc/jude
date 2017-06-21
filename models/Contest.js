/**
 * Created by rsalesc on 14/07/16.
 */
var mongoose = require('mongoose')
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema

module.exports = () => {
    if(db.models.Contest)
        return db.model("Contest");

    const Problem = require('./Problem')();

    var ContestProblem = new Schema({
        letter: {
            type: String,
            required: true,
            match: /[A-Z][0-9]*/
        },
        problem: {type: Schema.Types.ObjectId, ref: 'Problem', required: true},
        color: {type: String, default: "000"}
    }, {_id: false});

    var ContestSchema = new Schema({
        name: {type: String, minlength: 4, maxlength: 64},
        start_time: {type: Date, required: true},
        end_time: {type: Date, required: true},
        scoring: {type: String, required: true},
        problems: {
            type: [ContestProblem],
            validate: {
                validator: function(v) {
                    if(!Array.isArray(v)) return false;
                    let letters = v.map((val) => {
                        return val.letter;
                    });

                    return new Set(letters).size == letters.length
                },
                message: 'Contest cannot have repeated letters and problems must be an array'
            }
        },
        hidden: Boolean
    });

    ContestSchema.index({name: 1});
    ContestSchema.index({name: 'text'});
    ContestSchema.plugin(deepPopulate);

    ContestSchema.pre('save', function(next){
        this.problems.sort((a, b) => {
            try {
                return ((x, y) => {
                    let xd = parseInt(x.slice(1)) || 0;
                    let yd = parseInt(y.slice(1)) || 0;

                    if(x[0] == y[0])
                        return xd < yd ? -1 : (xd > yd ? 1 : 0);

                    return x[0] < y[0] ? -1 : 1;
                })(a.letter, b.letter)
            } catch(ex){
                return false;
            }
        });

        next();
    });

    ContestSchema.methods.hasStarted = function(){
        return this.start_time.getTime() <= Date.now();
    };

    ContestSchema.methods.hasEnded = function(){
        return this.end_time.getTime() <= Date.now();
    };

    ContestSchema.methods.isRunning = function(){
        return this.hasStarted() && !this.hasEnded();
    };

    ContestSchema.methods.getTimeInContest = function(){
        return parseInt((Date.now() - this.start_time.getTime()) / 60 / 1000);
    };

    ContestSchema.pre("remove", function(next) {
        db.model("Submission").remove({ contest: this._id }, err => {
           if(err) console.error(err); 
        });
        db.model("User").remove({ contest: this._id }, err => {
           if(err) console.error(err); 
        });
        next();
    });


    return db.model('Contest', ContestSchema);
}