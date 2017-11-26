/**
 * Created by rsalesc on 15/06/16.
 */

function submissionComparator(a, b) {
  if (a.timeInContest === b.timeInContest)
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  return a.timeInContest - b.timeInContest;
}

class Scoring {
  constructor(task, opts = {}) {
    //if (new.target == Scoring)
    //  throw `Cannot instantiate abstract class Scoring`;
    this._task = task;
    this._opts = opts;
  }

  get task() {
    return this._task;
  }

  get opts() {
    return this._opts;
  }

  // eslint-disable-next-line no-unused-vars
   isTaskValid(tk) {
    throw new Error("Function not implemented in this class");
  }

   hasWeight() {
    throw new Error("Function not implemented in this class");
  }

   hasPenalty() {
    throw new Error("Function not implemented in this class");
  }

  // eslint-disable-next-line no-unused-vars
  solved(obj) {
    throw new Error("Function not implemented in this class");
  }

  // eslint-disable-next-line no-unused-vars
  attempted(obj) {
    throw new Error("Function not implemented in this class");
  }

  // eslint-disable-next-line no-unused-vars
  eval(verdicts) {
    throw new Error("Function not implemented in this class");
  }

  // eslint-disable-next-line no-unused-vars
  evalContest(submissions) {
    throw new Error("Function not implemented in this class");
  }

  skipped() {
    return ["", "VERDICT_INQ", "VERDICT_JE", "VERDICT_CE", "VERDICT_FAIL",
            "VERDICT_CHTE", "VERDICT_UE", "VERDICT_CTE"];
  }

  hasSkipped(verdicts) {
    const toSkip = this.skipped();
    for (const key of Object.keys(verdicts)) {
      const verdict = verdicts[key];
      if (toSkip.indexOf(verdict.verdict) !== -1)
        return true;
    }

    return false;
  }

  evalContext(submissions) {
    return this.evalContest(
      submissions
        .filter(s => s.timeInContest >= 0)
        .filter(s => !this.hasSkipped(s.verdict))
        .sort(submissionComparator)
    );
  }

  // eslint-disable-next-line no-unused-vars
   mergeEvaluations(evals) {
    throw new Error("Function not implemented in this class");
  }
}

class ProductScoring extends Scoring {
  // eslint-disable-next-line no-unused-vars
   isTaskValid(tk) {
    return true;
  }

   hasWeight() {
    return true;
  }

   hasPenalty() {
    return true;
  }

  solved(obj) {
    return obj.score === this.task.getWeight();
  }

  attempted(obj) {
    return obj.affect || obj.fails > 0;
  }

  fails(obj) {
    return obj.fails;
  }

  eval(verdicts) {
    let res = 1;
    for (const key of Object.keys(verdicts)) {
      const verdict = verdicts[key];
      if (verdict.verdict === "VERDICT_INQ") {
        return {
          score: 0, affect: false, penalty: 0, fails: 0
        };
      }

      res *= verdict.verdict === "VERDICT_AC"
        ? 1
        : 0;
    }

    return {
      score: parseInt(res * this.task.getWeight(), 10), penalty: 0, affect: true, fails: 0
    };
  }

  evalContest(submissions) {
    submissions.sort(submissionComparator);

    let fails = 0;
    let penalty = 0;
    const { opts } = this;

    for (const submission of submissions) {
      const evaluation = this.eval(submission.verdict);
      if (evaluation.affect) {
        if (evaluation.score === 0) {
          penalty += opts.penalty || 20;
          fails++;
        } else {
          return {
            score: evaluation.score,
            penalty: penalty + submission.timeInContest,
            affect: true,
            fails
          };
        }
      }
    }

    return {
      score: 0, penalty: 0, affect: false, fails
    };
  }

   mergeEvaluations(evals) {
    return evals.reduce((old, cur) => ({
      score: old.score + cur.score,
      penalty: old.penalty + cur.penalty
    }), { score: 0, penalty: 0 });
  }
}

class SubtaskScoring extends Scoring {
  // eslint-disable-next-line no-unused-vars
   isTaskValid(tk) {
    return true;
  }

   hasWeight() {
    return true;
  }

   hasPenalty() {
    return true;
  }

  solved(obj) {
    return obj.score > 0;
  }

  attempted(obj) {
    return obj.affect || obj.fails > 0;
  }

  fails(obj) {
    return obj.fails;
  }

  eval(verdicts) {
    let res = 0;

    for (const key of Object.keys(verdicts)) {
      const verdict = verdicts[key];
      if (verdict.verdict === "VERDICT_INQ") {
        return {
          score: 0, affect: false, penalty: 0, fails: 0
        };
      }

      res += verdict.verdict === "VERDICT_AC"
        ? this.task.getDatasetFromName(key).percentage
        : 0;
    }

    return {
      score: parseInt(res * this.task.getWeight(), 10), penalty: 0, affect: true, fails: 0
    };
  }

  evalContest(submissions) {
    submissions.sort(submissionComparator);

    let bestIndex = submissions.length;
    let bestScore = 0;

    for(let i = 0; i < submissions.length; i++) {
      const evaluation = this.eval(submissions[i].verdict);
      if(evaluation.affect && evaluation.score > bestScore) {
        bestScore = evaluation.score;
        bestIndex = i;
      }
    }

    let fails = 0;
    const { opts } = this;

    for (let i = 0; i < bestIndex; i++) {
      const submission = submissions[i];

      const evaluation = this.eval(submission.verdict);
      if (evaluation.affect) {
        fails++
      }
    }

    if(bestScore > 0) {
      const submission = submissions[bestIndex];
      return {
        score: bestScore,
        penalty: submission.timeInContest,
        affect: true,
        fails
      }
    }

    return {
      score: 0, penalty: 0, affect: false, fails
    };
  }

   mergeEvaluations(evals) {

    return evals.reduce((old, cur) => ({
      score: old.score + cur.score,
      penalty: !cur.affect ? old.penalty : old.penalty + cur.penalty + cur.fails // TODO: change
    }), { score: 0, penalty: 0 });
  }
}

class IcpcScoring extends Scoring {
  // eslint-disable-next-line no-unused-vars
   isTaskValid(tk) {
    return true;
  }

   hasWeight() {
    return false;
  }

   hasPenalty() {
    return true;
  }

  solved(obj) {
    return obj.score > 0;
  }

  attempted(obj) {
    return obj.affect || obj.fails > 0;
  }

  fails(obj) {
    return obj.fails;
  }

  eval(verdicts) {
    let res = 1;
    for (const key of Object.keys(verdicts)) {
      const verdict = verdicts[key];
      if (verdict.verdict === "VERDICT_INQ") {
        return {
          score: 0, affect: false, penalty: 0, fails: 0
        };
      }

      res *= verdict.verdict === "VERDICT_AC"
        ? 1
        : 0;
    }

    return {
      score: res, penalty: 0, affect: true, fails: 0
    };
  }

  evalContest(submissions) {
    submissions.sort(submissionComparator);

    let fails = 0;
    let penalty = 0;
    const { opts } = this;

    for (const submission of submissions) {
      const evaluation = this.eval(submission.verdict);
      if (evaluation.affect) {
        if (evaluation.score === 0) {
          penalty += opts.penalty || 20;
          fails++;
        } else {
          return {
            score: 1,
            penalty: penalty + submission.timeInContest,
            affect: true,
            fails
          };
        }
      }
    }

    return {
      score: 0, penalty: 0, affect: false, fails
    };
  }

   mergeEvaluations(evals) {
    return evals.reduce((old, cur) => ({
      score: old.score + cur.score,
      penalty: old.penalty + cur.penalty
    }), { score: 0, penalty: 0 });
  }
}

module.exports = {
  _Scoring: Scoring,
  ProductScoring,
  IcpcScoring,
  SubtaskScoring
};
