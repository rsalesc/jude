/**
 * Created by rsalesc on 15/06/16.
 */

function submissionComparator(a, b){
    if(a.timeInContest == b.timeInContest)
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    return a.timeInContest - b.timeInContest;
}

class Scoring{
    constructor(task, opts={}){
        if(new.target == Scoring)
            throw "Cannot instantiate abstract class " + this.constructor.name;
        this._task = task;
        this._opts = opts;
    }

    get task(){
        return this._task;
    }

    get opts(){
        return this._opts;
    }

    static isTaskValid(tk){
        throw new Error("Function not implemented in this class");
    }

    static hasWeight(){
        throw new Error("Function not implemented in this class");
    }

    static hasPenalty(){
        throw new Error("Function not implemented in this class");
    }

    solved(obj){
        throw new Error("Function not implemented in this class");
    }

    attempted(obj){
        throw new Error("Function not implemented in this class");
    }

    eval(verdicts){
        throw new Error("Function not implemented in this class");
    }

    evalContest(submissions){
        throw new Error("Function not implemented in this class");
    }

    skipped(){
        return ["", "VERDICT_INQ", "VERDICT_JE", "VERDICT_CE", "VERDICT_FAIL",
        "VERDICT_CHTE", "VERDICT_UE", "VERDICT_CTE"];
    }

    hasSkipped(verdicts){
        let toSkip = this.skipped();
        for(let key in verdicts){
            if(!verdicts.hasOwnProperty(key)) continue;
            let verdict = verdicts[key];
            if(toSkip.indexOf(verdict.verdict) !== -1)
              return true;
        }

        return false;
    }

    evalContext(submissions){
        return this.evalContest(
          submissions
            .filter((s) => s.timeInContest >= 0)
            .filter((s) => !this.hasSkipped(s.verdict))
            .sort(submissionComparator)
        );
    }

    static mergeEvaluations(evals){
        throw new Error("Function not implemented in this class");
    }
}

class ProductScoring extends Scoring {
    static isTaskValid(tk){
        return true
    }

    static hasWeight(){
        return true;
    }

    static hasPenalty(){
        return true;
    }

    solved(obj){
        return obj.score == this.task.getWeight();
    }

    attempted(obj){
        return obj.affect || obj.fails > 0;
    }

    fails(obj){
        return obj.fails;
    }

    eval(verdicts){
        let res = 1;
        for(let key in verdicts){
            if(!verdicts.hasOwnProperty(key)) continue;
            let verdict = verdicts[key];
            if(verdict.verdict == "VERDICT_INQ"){
                return {score: 0, affect: false, penalty: 0, fails: 0};
            }
            res *= (verdict.verdict == "VERDICT_AC" ? 1 : 0);
        }

        return {score: parseInt(res*this.task.getWeight()), penalty: 0, affect: true, fails: 0};
    }

    evalContest(submissions){
        submissions.sort(submissionComparator);

        let fails = 0;
        let penalty = 0;
        let opts = this.opts;

        for(let submission of submissions){
            let evaluation = this.eval(submission.verdict);
            if(!evaluation.affect) continue;
            if(evaluation.score == 0) {
                penalty += (opts.penalty || 20);
                fails++;
            }
            else{
                return {
                    "score": evaluation.score,
                    "penalty": penalty+submission.timeInContest,
                    "affect": true,
                    "fails": fails
                }
            }
        }

        return {score: 0, penalty: 0, affect: false, fails};
    }

    static mergeEvaluations(evals){
        return evals.reduce((old, cur) => {
            return {score: old.score + cur.score, penalty: old.penalty + cur.penalty};
        }, {score: 0, penalty: 0});
    }
}

class IcpcScoring extends Scoring {
    static isTaskValid(tk){
        return true;
    }

    static hasWeight(){
        return false;
    }

    static hasPenalty(){
        return true;
    }

    solved(obj){
        return obj.score > 0;
    }

    attempted(obj){
        return obj.affect || obj.fails > 0;
    }

    fails(obj){
        return obj.fails;
    }

    eval(verdicts){
        let res = 1;
        for(let key in verdicts){
            if(!verdicts.hasOwnProperty(key)) continue;
            let verdict = verdicts[key];
            if(verdict.verdict == "VERDICT_INQ"){
                return {score: 0, affect: false, penalty: 0, fails: 0};
            }
            res *= (verdict.verdict == "VERDICT_AC" ? 1 : 0);
        }

        return {score: res, penalty: 0, affect: true, fails: 0};
    }

    evalContest(submissions){
        submissions.sort(submissionComparator);

        let fails = 0;
        let penalty = 0;
        let opts = this.opts;

        for(let submission of submissions){
            let evaluation = this.eval(submission.verdict);
            if(!evaluation.affect) continue;
            if(evaluation.score == 0) {
                penalty += (opts.penalty || 20);
                fails++;
            }
            else{
                return {
                    "score": 1,
                    "penalty": penalty+submission.timeInContest,
                    "affect": true,
                    "fails": fails
                }
            }
        }

        return {score: 0, penalty: 0, affect: false, fails};
    }

    static mergeEvaluations(evals){
        return evals.reduce((old, cur) => {
            return {score: old.score + cur.score, penalty: old.penalty + cur.penalty};
        }, {score: 0, penalty: 0});
    }
}

module.exports = {
    _Scoring: Scoring,
    ProductScoring,
    IcpcScoring
}