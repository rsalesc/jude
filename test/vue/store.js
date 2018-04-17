import { describe, it } from "mocha";
import { expect } from "chai";

import { computed, getters } from "@front/store/main";
import {
  getFakeContest,
  getFakeProblem,
  getFakeContestProblem,
  getFakeSubmission
} from "@test/models/fake-objects";
import { resolveGetters } from "@test/vue/utils";
import * as Scoring from "@judge/scoring";
import { Task } from "@judge/task";

describe("getters", function () {
  describe("getRawProblem()", function () {
    const tests = [
      {
        name: "no contest",
        state: { rawContest: null },
        id: "dummy",
        want: undefined
      },
      {
        name: "no match",
        state: { rawContest: getFakeContest({}, [
          getFakeProblem({ _id: "A" }),
          getFakeProblem({ _id: "B" })
        ]) },
        id: "dummy",
        want: null
      },
      {
        name: "match first",
        state: { rawContest: getFakeContest({}, [
          getFakeProblem({ _id: "A" }),
          getFakeProblem({ _id: "B" })
        ]) },
        id: "A",
        want: getFakeContestProblem(getFakeProblem({ _id: "A" }), 0)
      },
      {
        name: "match second",
        state: { rawContest: getFakeContest({}, [
          getFakeProblem({ _id: "A" }),
          getFakeProblem({ _id: "B" })
        ]) },
        id: "B",
        want: getFakeContestProblem(getFakeProblem({ _id: "B" }), 1)
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const got = getters.getRawProblem(tc.state, {})(tc.id);
        expect(got).to.deep.equal(tc.want);
      });
    });
  });
});

describe("computed properties", function () {
  describe("problems()", function () {
    const tests = [
      {
        name: "no problem, no submissions",
        state: {
          user: "me",
          rawContest: getFakeContest(),
          rawSubmissions: []
        },
        want: []
      },
      {
        name: "one problem, no submissions",
        state: {
          user: "me",
          rawContest: getFakeContest({ scoring: "ProductScoring" }, [
            getFakeProblem()
          ]),
          rawSubmissions: []
        },
        want: [
          {
            ...getFakeContestProblem(getFakeProblem()),
            scoringClass: Scoring.ProductScoring,
            scoring: new Scoring.ProductScoring(new Task({
              datasets: [],
              limits: {
                time: 1000,
                memory: 256
              },
              weight: 1,
              scoring: "ProductScoring"
            })),
            points: 0,
            solved: false,
            attempted: false,
            pending: false
          }
        ]
      },
      {
        name: "one problem, two submissions",
        state: {
          user: "me",
          rawContest: getFakeContest({ scoring: "ProductScoring" }, [
            getFakeProblem()
          ]),
          rawSubmissions: [
            getFakeSubmission({ _creator: "me" }),
            getFakeSubmission({ _creator: "me" })
          ]
        },
        want: [
          {
            ...getFakeContestProblem(getFakeProblem()),
            scoringClass: Scoring.ProductScoring,
            scoring: new Scoring.ProductScoring(new Task({
              datasets: [],
              limits: {
                time: 1000,
                memory: 256
              },
              scoring: "ProductScoring",
              weight: 1
            })),
            points: 1,
            solved: true,
            attempted: true,
            pending: false
          }
        ]
      },
      {
        name: "two problems, two submissions",
        state: {
          user: "me",
          rawContest: getFakeContest({ scoring: "ProductScoring" }, [
            getFakeProblem(),
            getFakeProblem({ _id: "other" })
          ]),
          rawSubmissions: [
            getFakeSubmission({ _creator: "me" }),
            getFakeSubmission({ _creator: "me", problem: "other" })
          ]
        },
        want: [
          {
            ...getFakeContestProblem(getFakeProblem(), 0),
            scoringClass: Scoring.ProductScoring,
            scoring: new Scoring.ProductScoring(new Task({
              datasets: [],
              limits: {
                time: 1000,
                memory: 256
              },
              scoring: "ProductScoring",
              weight: 1
            })),
            points: 1,
            solved: true,
            attempted: true,
            pending: false
          },
          {
            ...getFakeContestProblem(getFakeProblem({ _id: "other" }), 1),
            scoringClass: Scoring.ProductScoring,
            scoring: new Scoring.ProductScoring(new Task({
              datasets: [],
              limits: {
                time: 1000,
                memory: 256
              },
              scoring: "ProductScoring",
              weight: 1
            })),
            points: 1,
            solved: true,
            attempted: true,
            pending: false
          }
        ]
      },
      {
        name: "one problem, two submissions from different user",
        state: {
          user: "me",
          rawContest: getFakeContest({ scoring: "ProductScoring" }, [
            getFakeProblem()
          ]),
          rawSubmissions: [
            getFakeSubmission(),
            getFakeSubmission()
          ]
        },
        want: [
          {
            ...getFakeContestProblem(getFakeProblem()),
            scoringClass: Scoring.ProductScoring,
            scoring: new Scoring.ProductScoring(new Task({
              datasets: [],
              limits: {
                time: 1000,
                memory: 256
              },
              scoring: "ProductScoring",
              weight: 1
            })),
            points: 0,
            solved: false,
            attempted: false,
            pending: false
          }
        ]
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const resolved = resolveGetters({
          ...getters,
          ...computed
        }, tc.state);
        const got = resolved.problems;
        expect(got).to.deep.equal(tc.want);
      });
    });
  });

  describe("my()", function () {
    const tests = [
      {
        name: "two submissions, one from the user",
        state: {
          user: "me",
          rawContest: getFakeContest({ scoring: "IcpcScoring" }, [
            getFakeProblem({}, { scoring: "SubtaskScoring" })
          ]),
          rawSubmissions: [
            getFakeSubmission({ _creator: "me" }),
            getFakeSubmission({ _creator: "other" })
          ]
        },
        want: {
          scoringClass: Scoring.IcpcScoring,
          scoring: new Scoring.IcpcScoring(null),
          submissions: [
            {
              ...getFakeSubmission({ _creator: "me" }),
              score: {
                affect: true,
                fails: 0,
                penalty: 0,
                score: 1
              }
            }
          ],
          languages: {}
        }
      },
      {
        name: "no contest-level scoring",
        state: {
          user: "me",
          rawContest: getFakeContest({}, [
            getFakeProblem({}, { scoring: "SubtaskScoring" })
          ]),
          rawSubmissions: [
            getFakeSubmission({ _creator: "me" })
          ]
        },
        want: {
          submissions: [],
          languages: {}
        }
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const resolved = resolveGetters({
          ...getters,
          ...computed
        }, tc.state);
        const got = resolved.my;
        expect(got).to.deep.equal(tc.want);
      });
    });
  });

  describe("submissions()", function () {
    const tests = [
      {
        name: "no submission",
        state: {
          rawContest: getFakeContest(),
          rawSubmissions: null
        },
        want: []
      },
      {
        name: "no contest",
        state: {
          rawContest: null,
          rawSubmissions: null
        },
        want: []
      },
      {
        name: "empty submissions",
        state: {
          rawContest: getFakeContest(),
          rawSubmissions: []
        },
        want: []
      },
      {
        name: "problem removed from the contest",
        state: {
          rawContest: getFakeContest(),
          rawSubmissions: [getFakeSubmission()]
        },
        want: []
      },
      {
        name: "single problem",
        state: {
          rawContest: getFakeContest({}, [
            getFakeProblem()
          ]),
          rawSubmissions: [getFakeSubmission()]
        },
        want: [{
          ...getFakeSubmission(),
          score: {
            affect: true,
            fails: 0,
            penalty: 0,
            score: 1
          }
        }]
      },
      {
        name: "two submissions, ensure ordered by time",
        state: {
          rawContest: getFakeContest({}, [
            getFakeProblem()
          ]),
          rawSubmissions: [
            getFakeSubmission({ time: new Date(0) }),
            getFakeSubmission({ time: new Date(10) })
          ]
        },
        want: [
          {
            ...getFakeSubmission({ time: new Date(10) }),
            score: {
              affect: true,
              fails: 0,
              penalty: 0,
              score: 1
            }
          },
          {
            ...getFakeSubmission({ time: new Date(0) }),
            score: {
              affect: true,
              fails: 0,
              penalty: 0,
              score: 1
            }
          }
        ]
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const resolved = resolveGetters({
          ...getters,
          ...computed
        }, tc.state);
        const got = resolved.submissions;
        expect(got).to.deep.equal(tc.want);
      });
    });
  });

  describe("groupedSubs()", function () {
    const tests = [
      {
        name: "one submission, one user",
        state: {
          rawContest: getFakeContest({}, [
            getFakeProblem()
          ]),
          rawSubmissions: [getFakeSubmission()]
        },
        want: {
          "fake-submission-creator": [
            {
              ...getFakeSubmission(),
              score: {
                affect: true,
                fails: 0,
                penalty: 0,
                score: 1
              }
            }
          ]
        }
      },
      {
        name: "two submissions, one user",
        state: {
          rawContest: getFakeContest({}, [
            getFakeProblem()
          ]),
          rawSubmissions: [getFakeSubmission(), getFakeSubmission({ _id: "other" })]
        },
        want: {
          "fake-submission-creator": [
            {
              ...getFakeSubmission(),
              score: {
                affect: true,
                fails: 0,
                penalty: 0,
                score: 1
              }
            },
            {
              ...getFakeSubmission({ _id: "other" }),
              score: {
                affect: true,
                fails: 0,
                penalty: 0,
                score: 1
              }
            }
          ]
        }
      },
      {
        name: "two submissions, two users",
        state: {
          rawContest: getFakeContest({}, [
            getFakeProblem()
          ]),
          rawSubmissions: [
            getFakeSubmission(),
            getFakeSubmission({ _id: "other", _creator: "dummy" })
          ]
        },
        want: {
          "fake-submission-creator": [
            {
              ...getFakeSubmission(),
              score: {
                affect: true,
                fails: 0,
                penalty: 0,
                score: 1
              }
            }
          ],
          dummy: [
            {
              ...getFakeSubmission({ _id: "other", _creator: "dummy" }),
              score: {
                affect: true,
                fails: 0,
                penalty: 0,
                score: 1
              }
            }
          ]
        }
      },
      {
        name: "problem removed from the contest",
        state: {
          rawContest: getFakeContest(),
          rawSubmissions: [getFakeSubmission()]
        },
        want: {}
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const resolved = resolveGetters({
          ...getters,
          ...computed
        }, tc.state);
        const got = resolved.groupedSubs;
        expect(got).to.deep.equal(tc.want);
      });
    });
  });

  describe("languages()", function () {
    const tests = [
      {
        name: "no contest",
        state: { rawContest: null },
        want: {}
      },
      {
        name: "no languages",
        state: { rawContest: { languages: null }},
        want: {}
      },
      {
        name: "empty languages",
        state: { rawContest: { languages: {}}},
        want: {}
      },
      {
        name: "some languages",
        state: { rawContest: { languages: { PT: "pt", BR: "br"  }}},
        want: { PT: "pt", BR: "br" }
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const resolved = resolveGetters({
          ...getters,
          ...computed
        }, tc.state);
        const got = resolved.languages;
        expect(got).to.deep.equal(tc.want);
      });
    });
  });
});
