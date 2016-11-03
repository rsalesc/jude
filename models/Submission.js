/**
 * Created by rsalesc on 15/07/16.
 */

const path = require('path');

var mongoose = require('mongoose')
const {Problem} = require(__dirname);
var Schema = mongoose.Schema;

const DEFAULT_VERDICT = {verdict: "", info:"", passed: -1, score: 0};

// TODO: add creation time (with a plugin)
module.exports = () => {
    var SubmissionSchema = new Schema({
        _creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        contest: {type: Schema.Types.ObjectId, ref: 'Contest'},
        problem: {type: Schema.Types.ObjectId, ref: 'Problem', required: true},
        time: {type: Date, default: Date.now},
        timeInContest: {type: Number, default: 0},
        language: String, // add enum validator? maybe not, language set is mutable
        code: String,
        verdict: Schema.Types.Mixed
    });

    SubmissionSchema.index({contest: 1, _creator: 1});
    SubmissionSchema.index({contest: 1, problem: 1});
    SubmissionSchema.index({contest: 1, time: 1});

    SubmissionSchema.pre('save', function(next){
        if(this.problem){
            Problem.findById(this.problem).exec((err, problem) => {
                if(err)
                    next(err);
                this.verdict = (this.verdict || {});
                let res = {};
                for(let data of problem.attr.datasets) {
                    res[data.name] = (this.verdict[data.name] || DEFAULT_VERDICT);
                }

                this.verdict = res;
                next();
            });

        }
    });

    return db.models.Submission ?
        db.model('Submission') :
        db.model('Submission', SubmissionSchema)
}