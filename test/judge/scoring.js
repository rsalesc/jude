import { describe, it } from "mocha";
import { expect } from "chai";
import { getFakeSubmission } from "@test/models/fake-objects";

import {
  _Scoring,
  ProductScoring,
  IcpcScoring
} from "@judge/scoring";
import { VerdictConst } from "@judge/verdict";
import { Task } from "@judge/task";

describe("Scoring classes", function () {
  describe("Scoring", function () {
    describe("hasSkipped()", function () {
      const tests = [
        {
          name: "no verdict",
          verdicts: {},
          want: false
        }
      ];

      // Dynamically generated test for each non-skippable verdict
      const verdicts = {};
      for (const verdict of Object.keys(VerdictConst)) {
        if (new _Scoring().skipped().indexOf(verdict) === -1)
          verdicts[verdict] = verdict;
      }
      tests.push({
        name: "skippable verdicts",
        verdicts,
        want: false
      });

      // Dynamically generated tests for each skip reason
      for (const skipReason of new _Scoring().skipped()) {
        tests.push({
          name: `skippable '${skipReason}' verdict`,
          verdicts: {
            dummy: {
              verdict: "VERDICT_AC"
            },
            skippable: {
              verdict: skipReason
            }
          },
          want: true
        });
      }

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = new _Scoring().hasSkipped(tc.verdicts);
          expect(got).to.equal(tc.want);
        });
      });
    });
  });

  describe("ProductScoring", function () {
    describe("solved()", function () {
      const tests = [
        {
          name: "zero score",
          attr: { weight: 1 },
          evaluation: { score: 0 },
          want: false
        },
        {
          name: "one score",
          attr: { weight: 1 },
          evaluation: { score: 1 },
          want: true
        },
        {
          name: "full score",
          attr: { weight: 10 },
          evaluation: { score: 10 },
          want: true
        },
        {
          name: "less score",
          attr: { weight: 10 },
          evaluation: { score: 9 },
          want: false
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const task = new Task(tc.attr);
          const got = new ProductScoring(task).solved(tc.evaluation);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("attempted()", function () {
      const tests = [
        {
          name: "affect is true",
          evaluation: { affect: true, fails: 0 },
          want: true
        },
        {
          name: "has fails",
          evaluation: { affect: false, fails: 1 },
          want: true
        },
        {
          name: "not attempted",
          evaluation: { affect: false, fails: 0 },
          want: false
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = new ProductScoring(null).attempted(tc.evaluation);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("fails()", function () {
      const tests = [
        {
          name: "no fails",
          evaluation: { fails: 0 },
          want: 0
        },
        {
          name: "has fails",
          evaluation: { fails: 2 },
          want: 2
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = new ProductScoring(null).fails(tc.evaluation);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("eval()", function () {
      const tests = [
        {
          name: "no verdict",
          attr: { weight: 10 },
          verdicts: {},
          want: {
            score: 10,
            penalty: 0,
            affect: true,
            fails: 0
          }
        },
        {
          name: "has VERDICT_INQ",
          attr: { weight: 10 },
          verdicts: {
            good: { verdict: "VERDICT_AC" },
            inq: { verdict: "VERDICT_INQ" }
          },
          want: {
            score: 0,
            penalty: 0,
            affect: false,
            fails: 0
          }
        },
        {
          name: "has non-VERDICT_AC",
          attr: { weight: 10 },
          verdicts: {
            good: { verdict: "VERDICT_AC" },
            wa: { verdict: "VERDICT_WA" }
          },
          want: {
            score: 0,
            penalty: 0,
            affect: true,
            fails: 0
          }
        },
        {
          name: "has only VERDICT_AC",
          attr: { weight: 10 },
          verdicts: {
            good: { verdict: "VERDICT_AC" },
            better: { verdict: "VERDICT_AC" }
          },
          want: {
            score: 10,
            penalty: 0,
            affect: true,
            fails: 0
          }
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const task = new Task(tc.attr);
          const got = new ProductScoring(task).eval(tc.verdicts);
          expect(got).to.deep.equal(tc.want);
        });
      });
    });

    describe("evalContest()", function () {
      const tests = [
        {
          name: "no submission",
          attr: {},
          submissions: [],
          want: {
            score: 0,
            penalty: 0,
            affect: false,
            fails: 0
          }
        },
        {
          name: "one pending submission",
          attr: { weight: 10 },
          submissions: [
            getFakeSubmission({}, {
              inq: { verdict: "VERDICT_INQ" }
            })
          ],
          want: {
            score: 0,
            penalty: 0,
            affect: false,
            fails: 0
          }
        },
        {
          name: "one failed submission",
          attr: { weight: 10 },
          submissions: [
            getFakeSubmission({}, {
              wa: { verdict: "VERDICT_WA" }
            })
          ],
          want: {
            score: 0,
            penalty: 0,
            affect: false,
            fails: 1
          }
        },
        {
          name: "one AC submission",
          attr: { weight: 10 },
          submissions: [
            getFakeSubmission({ timeInContest: 42 }, {
              ac: { verdict: "VERDICT_AC" }
            })
          ],
          want: {
            score: 10,
            penalty: 42,
            affect: true,
            fails: 0
          }
        },
        {
          name: "one AC submission after one WA",
          attr: { weight: 10 },
          submissions: [
            getFakeSubmission({}, {
              ds: { verdict: "VERDICT_WA" }
            }),
            getFakeSubmission({ timeInContest: 42 }, {
              ds: { verdict: "VERDICT_AC" }
            })
          ],
          want: {
            score: 10,
            penalty: 42,
            affect: true,
            fails: 1
          }
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const task = new Task(tc.attr);
          const got = new ProductScoring(task).evalContest(tc.submissions);
          expect(got).to.deep.equal(tc.want);
        });
      });
    });

    describe("evalContest()", function () {
      const tests = [
        {
          name: "no evals",
          attr: {},
          opts: {},
          evaluations: [],
          want: {
            score: 0,
            penalty: 0
          }
        },
        {
          name: "one failed eval, no opts",
          attr: {},
          opts: {},
          evaluations: [{
            score: 0,
            penalty: 0,
            affect: true,
            fails: 1
          }],
          want: {
            score: 0,
            penalty: 20
          }
        },
        {
          name: "one failed eval, opts with custom penalty",
          attr: {},
          opts: { penalty: 42 },
          evaluations: [{
            score: 0,
            penalty: 0,
            affect: true,
            fails: 1
          }],
          want: {
            score: 0,
            penalty: 42
          }
        },
        {
          name: "one failed eval, one AC, opts with custom penalty",
          attr: {},
          opts: { penalty: 7 },
          evaluations: [
            {
              score: 0,
              penalty: 0,
              affect: true,
              fails: 2
            },
            {
              score: 10,
              penalty: 5,
              affect: true,
              fails: 1
            }
          ],
          want: {
            score: 10,
            penalty: 26
          }
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const task = new Task(tc.attr);
          const got = new ProductScoring(task, tc.opts).mergeEvaluations(tc.evaluations);
          expect(got).to.deep.equal(tc.want);
        });
      });
    });
  });

  describe("IcpcScoring", function () {
    describe("solved()", function () {
      const tests = [
        {
          name: "zero score",
          attr: { weight: 1 },
          evaluation: { score: 0 },
          want: false
        },
        {
          name: "one score",
          attr: { weight: 1 },
          evaluation: { score: 1 },
          want: true
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const task = new Task(tc.attr);
          const got = new IcpcScoring(task).solved(tc.evaluation);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("attempted()", function () {
      const tests = [
        {
          name: "affect is true",
          evaluation: { affect: true, fails: 0 },
          want: true
        },
        {
          name: "has fails",
          evaluation: { affect: true, fails: 1 },
          want: true
        },
        {
          name: "not attempted",
          evaluation: { affect: false, fails: 0 },
          want: false
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = new IcpcScoring(null).attempted(tc.evaluation);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("fails()", function () {
      const tests = [
        {
          name: "no fails",
          evaluation: { fails: 0 },
          want: 0
        },
        {
          name: "has fails",
          evaluation: { fails: 2 },
          want: 2
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = new IcpcScoring(null).fails(tc.evaluation);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("eval()", function () {
      const tests = [
        {
          name: "no verdict",
          attr: { weight: 10 },
          verdicts: {},
          want: {
            score: 1,
            penalty: 0,
            affect: true,
            fails: 0
          }
        },
        {
          name: "has VERDICT_INQ",
          attr: { weight: 10 },
          verdicts: {
            good: { verdict: "VERDICT_AC" },
            inq: { verdict: "VERDICT_INQ" }
          },
          want: {
            score: 0,
            penalty: 0,
            affect: false,
            fails: 0
          }
        },
        {
          name: "has non-VERDICT_AC",
          attr: { weight: 10 },
          verdicts: {
            good: { verdict: "VERDICT_AC" },
            wa: { verdict: "VERDICT_WA" }
          },
          want: {
            score: 0,
            penalty: 0,
            affect: true,
            fails: 0
          }
        },
        {
          name: "has only VERDICT_AC",
          attr: { weight: 10 },
          verdicts: {
            good: { verdict: "VERDICT_AC" },
            better: { verdict: "VERDICT_AC" }
          },
          want: {
            score: 1,
            penalty: 0,
            affect: true,
            fails: 0
          }
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const task = new Task(tc.attr);
          const got = new IcpcScoring(task).eval(tc.verdicts);
          expect(got).to.deep.equal(tc.want);
        });
      });
    });

    describe("evalContest()", function () {
      const tests = [
        {
          name: "no submission",
          attr: {},
          submissions: [],
          want: {
            score: 0,
            penalty: 0,
            affect: false,
            fails: 0
          }
        },
        {
          name: "one pending submission",
          attr: { weight: 10 },
          submissions: [
            getFakeSubmission({}, {
              inq: { verdict: "VERDICT_INQ" }
            })
          ],
          want: {
            score: 0,
            penalty: 0,
            affect: false,
            fails: 0
          }
        },
        {
          name: "one failed submission",
          attr: { weight: 10 },
          submissions: [
            getFakeSubmission({}, {
              wa: { verdict: "VERDICT_WA" }
            })
          ],
          want: {
            score: 0,
            penalty: 0,
            affect: false,
            fails: 1
          }
        },
        {
          name: "one AC submission",
          attr: { weight: 10 },
          submissions: [
            getFakeSubmission({ timeInContest: 42 }, {
              ac: { verdict: "VERDICT_AC" }
            })
          ],
          want: {
            score: 1,
            penalty: 42,
            affect: true,
            fails: 0
          }
        },
        {
          name: "one AC submission after one WA",
          attr: { weight: 10 },
          submissions: [
            getFakeSubmission({}, {
              ds: { verdict: "VERDICT_WA" }
            }),
            getFakeSubmission({ timeInContest: 42 }, {
              ds: { verdict: "VERDICT_AC" }
            })
          ],
          want: {
            score: 1,
            penalty: 42,
            affect: true,
            fails: 1
          }
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const task = new Task(tc.attr);
          const got = new IcpcScoring(task).evalContest(tc.submissions);
          expect(got).to.deep.equal(tc.want);
        });
      });
    });

    describe("mergeEvaluations()", function () {
      const tests = [
        {
          name: "no evals",
          attr: {},
          opts: {},
          evaluations: [],
          want: {
            score: 0,
            penalty: 0
          }
        },
        {
          name: "one failed eval, no opts",
          attr: {},
          opts: {},
          evaluations: [{
            score: 0,
            penalty: 0,
            affect: true,
            fails: 1
          }],
          want: {
            score: 0,
            penalty: 20
          }
        },
        {
          name: "one failed eval, opts with custom penalty",
          attr: {},
          opts: { penalty: 42 },
          evaluations: [{
            score: 0,
            penalty: 0,
            affect: true,
            fails: 1
          }],
          want: {
            score: 0,
            penalty: 42
          }
        },
        {
          name: "one failed eval, one AC, opts with custom penalty",
          attr: {},
          opts: { penalty: 7 },
          evaluations: [
            {
              score: 0,
              penalty: 0,
              affect: true,
              fails: 2
            },
            {
              score: 1,
              penalty: 5,
              affect: true,
              fails: 1
            }
          ],
          want: {
            score: 1,
            penalty: 26
          }
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const task = new Task(tc.attr);
          const got = new IcpcScoring(task, tc.opts).mergeEvaluations(tc.evaluations);
          expect(got).to.deep.equal(tc.want);
        });
      });
    });
  });
});
