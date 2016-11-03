const VerdictConst = {
    "": "won't be judged",
    VERDICT_INQ: "in queue",
    VERDICT_SKIP: "skipped",

    VERDICT_WA: "wrong answer",
    VERDICT_RTE: "runtime error",
    VERDICT_MLE: "memory limit exceeded",
    VERDICT_TLE: "time limit exceeded",
    VERDICT_WTE: "walltime limit exceeded",
    VERDICT_OLE: "output limit exceeded",

    VERDICT_CE: "compilation error",
    VERDICT_CTE: "compilation timed out",

    VERDICT_FAIL: "checker failed",
    VERDICT_CHTE: "checker timed out",

    VERDICT_JE: "judge crashed",
    VERDICT_UE: "unknown error",

    VERDICT_AC: "accepted"
}

class Verdict{
    constructor(score, verdict, passed = -1, info = {}){
        this.score = score || 0
        this.verdict = verdict;
        this.passed = passed;
        if(typeof info === 'string')
            info = {text: info};
        this.info = info;
    }

    wasExecuted(){
        return this.passed >= 0;
    }

    getTextInfo(){
        return this.info.text || "";
    }

    getVerdictCode(){
        return this.verdict;
    }

    getVerdictText(){
        return VerdictConst.hasOwnProperty(this.verdict) ? VerdictConst[this.verdict] : this.verdict;
    }

    getScore(){
        return this.score;
    }

    getPassed(){
        return Math.max(0, this.passed);
    }

    toJSON(){
        return {
            score: this.score,
            verdict: this.verdict,
            passed: this.passed,
            info: this.info
        }
    }

    static fromJSON(json){
        return new Verdict(json.score || 0, json.verdict, json.passed || -1, json.info || {})
    }
}

module.exports = {
    Verdict,
    VerdictConst
}