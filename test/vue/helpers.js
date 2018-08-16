import { describe, it, setup, teardown } from "mocha";
import { expect } from "chai";
import {
  getFakeTask,
  getFakeContestProblem,
  getFakeProblem
} from "@test/models/fake-objects";
import sinon from "sinon";

import * as Helper from "@front/helpers";
import * as Scoring from "@judge/scoring";
import ts from "@front/ts";
import moment from "moment";

describe("helpers", function () {
  describe("checkRole()", function () {
    const tests = [
      {
        name: "no roles",
        roles: [],
        needle: "admin",
        want: false
      },
      {
        name: "matching role",
        roles: ["frango", "admin"],
        needle: "admin",
        want: true
      },
      {
        name: "null roles",
        roles: null,
        needle: "admin",
        want: false
      },
      {
        name: "non-array matching role",
        roles: "admin",
        needle: "admin",
        want: true
      },
      {
        name: "no matching role",
        roles: ["frango", "carne"],
        needle: "admin",
        want: false
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const got = Helper.checkRole(tc.roles, tc.needle);
        expect(got).to.equal(tc.want);
      });
    });
  });

  describe("getScoringString()", function () {
    const tests = [
      {
        name: "no contest + IcpcScoring",
        contest: null,
        contestProblem: getFakeContestProblem(
          getFakeProblem({}, { scoring: "IcpcScoring" })
        ),
        want: "IcpcScoring"
      },
      {
        name: "no contest + ProductScoring",
        contest: null,
        contestProblem: getFakeContestProblem(
          getFakeProblem({}, { scoring: "ProductScoring" })
        ),
        want: "ProductScoring"
      },
      {
        name: "with contest but no contest scoring",
        contest: {},
        contestProblem: getFakeContestProblem(
          getFakeProblem({}, { scoring: "IcpcScoring" })
        ),
        want: "IcpcScoring"
      },
      {
        name: "with contest and contest scoring",
        contest: { scoring: "SubtaskScoring" },
        contestProblem: getFakeContestProblem(
          getFakeProblem({}, { scoring: "IcpcScoring" })
        ),
        want: "SubtaskScoring"
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const got = Helper.getScoringString(tc.contestProblem, tc.contest);
        expect(got).to.equal(tc.want);
      });
    });
  });

  describe("getScoringFromString methods", function () {
    const tests = [
      {
        name: "ProductScoring",
        want: Scoring.ProductScoring
      },
      {
        name: "IcpcScoring",
        want: Scoring.IcpcScoring
      },
      {
        name: "SubtaskMaxScoring",
        want: Scoring.SubtaskMaxScoring
      },
      {
        name: "SubtaskSumScoring",
        want: Scoring.SubtaskSumScoring
      },
      {
        // backwards compatibility
        name: "SubtaskScoring",
        want: Scoring.SubtaskMaxScoring
      },
      {
        name: "UnsupportedScoring",
        want: Scoring.ProductScoring
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const got = Helper.getScoringClassFromString(tc.name);
        expect(got).to.equal(tc.want);

        const problem = { attr: { weight: 1 }};
        const gotInstance = Helper.getScoringFromString(tc.name, problem);
        expect(gotInstance).to.be.instanceof(tc.want);
      });
    });
  });

  describe("getMainVerdict()", function () {
    const tests = [
      {
        name: "empty task, some junky verdict",
        datasets: [],
        verdicts: { main: { verdict: "VERDICT_AC" }},
        want: ""
      },
      {
        name: "single dataset, AC",
        datasets: [{ name: "main" }],
        verdicts: { main: { verdict: "VERDICT_AC" }},
        want: "VERDICT_AC"
      },
      {
        name: "single dataset, AC but verdict from removed dataset",
        datasets: [{ name: "main" }],
        verdicts: {
          removed: { verdict: "VERDICT_WA" },
          main: { verdict: "VERDICT_AC" }
        },
        want: "VERDICT_AC"
      },
      {
        name: "two datasets, AC but one missing verdict (missing rejudge)",
        datasets: [{ name: "dummy" }, { name: "main" }],
        verdicts: {
          main: { verdict: "VERDICT_AC" }
        },
        want: "VERDICT_AC"
      },
      {
        name: "two datasets, AC but one skipped",
        datasets: [{ name: "dummy" }, { name: "main" }],
        verdicts: {
          dummy: { verdict: "VERDICT_SKIP" },
          main: { verdict: "VERDICT_AC" }
        },
        want: "VERDICT_AC"
      },
      {
        name: "one dataset, skipped",
        datasets: [{ name: "main" }],
        verdicts: {
          main: { verdict: "VERDICT_SKIP" }
        },
        want: ""
      },
      {
        name: "one dataset, no verdict",
        datasets: [{ name: "main" }],
        verdicts: {},
        want: ""
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const task = getFakeTask({ datasets: tc.datasets });
        const got = Helper.getMainVerdict(tc.verdicts, task);
        expect(got).to.equal(tc.want);
      });
    });
  });

  describe("getPassed()", function () {
    const tests = [
      { name: "positive", n: 10, want: "10" },
      { name: "zero", n: 0, want: "0" },
      { name: "negative", n: -1, want: "-" }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const got = Helper.getPassed(tc.n);
        expect(got).to.equal(tc.want);
      });
    });
  });

  describe("getExecTime()", function () {
    const tests = [
      {
        name: "has time",
        verdict: { info: { time: 3.1415 }},
        want: "3141 ms"
      },
      {
        name: "no time",
        verdict: { info: {}},
        want: null
      },
      {
        name: "no info",
        verdict: {},
        want: null
      },
      {
        name: "zero time",
        verdict: { info: { time: 0 }},
        want: "0 ms"
      }
    ];

    tests.forEach((tc) => {
      it(tc.name, function () {
        const got = Helper.getExecTime(tc.verdict);
        expect(got).to.equal(tc.want);
      });
    });
  });

  describe("test with fake timers", function () {
    const clockBase = 1000000;

    setup(function () {
      this.clock = sinon.useFakeTimers(new Date(clockBase));
      this.ts = sinon.stub(ts, "now").returns(clockBase);
    });

    teardown(function () {
      this.clock.restore();
      this.ts.restore();
    });

    describe("getCountDown()", function () {
      const tests = [
        {
          name: "one day remaining",
          m: moment(clockBase).add(1, "d"),
          want: "in a day"
        },
        {
          name: "two days remaining",
          m: moment(clockBase).add(2, "d"),
          want: "in 2 days"
        },
        {
          name: "zero remaining",
          m: moment(clockBase),
          want: "0:00:00"
        },
        {
          name: "one second remaining",
          m: moment(clockBase).add(1, "s"),
          want: "0:00:01"
        },
        {
          name: "one minute remaining",
          m: moment(clockBase).add(1, "m"),
          want: "0:01:00"
        },
        {
          name: "one hour remaining",
          m: moment(clockBase).add(1, "h"),
          want: "1:00:00"
        },
        {
          name: "23 hours remaining, 15 minutes, 42 seconds",
          m: moment(clockBase).add(23, "h")
            .add(15, "m")
            .add(42, "s"),
          want: "23:15:42"
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = Helper.getCountdown(tc.m);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("getRemainingTime()", function () {
      const tests = [
        {
          name: "has ended",
          contest: {
            start_time: clockBase - 10,
            end_time: clockBase
          },
          want: "contest has ended"
        },
        {
          name: "will start",
          contest: {
            start_time: moment(clockBase).add(1, "h").unix() * 1000,
            end_time: moment(clockBase).add(2, "h").unix() * 1000
          },
          want: "contest will start 1:00:00"
        },
        {
          name: "will end",
          contest: {
            start_time: moment(clockBase).subtract(1, "h").unix() * 1000,
            end_time: moment(clockBase).add(2, "h").unix() * 1000
          },
          want: "contest will end 2:00:00"
        },
        {
          name: "will end in 1 day",
          contest: {
            start_time: moment(clockBase).subtract(1, "h").unix() * 1000,
            end_time: moment(clockBase).add(1, "d").unix() * 1000
          },
          want: "contest will end in a day"
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = Helper.getRemainingTime(tc.contest);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("getFormattedContestTime()", function () {
      // t is given in minutes
      const tests = [
        {
          name: "upsolving",
          t: -1,
          want: "upsolving"
        },
        {
          name: "zero",
          t: 0,
          want: "0:00"
        },
        {
          name: "one hour",
          t: 60,
          want: "1:00"
        },
        {
          name: "one hour and a half",
          t: 90,
          want: "1:30"
        },
        {
          name: "59 minutes",
          t: 59,
          want: "0:59"
        },
        {
          name: "25 hours",
          t: 25 * 60,
          want: "25:00"
        }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = Helper.getFormattedContestTime(tc.t);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("hasContestStarted()", function () {
      const tests = [
        { name: "will start", contest: { start_time: clockBase + 1 }, want: false },
        { name: "just started", contest: { start_time: clockBase }, want: true },
        { name: "past started", contest: { start_time: clockBase - 1 }, want: true }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = Helper.hasContestStarted(tc.contest);
          expect(got).to.equal(tc.want);
        });
      });
    });

    describe("hasContestEnded()", function () {
      const tests = [
        { name: "will end", contest: { end_time: clockBase + 1 }, want: false },
        { name: "just ended", contest: { end_time: clockBase }, want: true },
        { name: "past ended", contest: { end_time: clockBase - 1 }, want: true }
      ];

      tests.forEach((tc) => {
        it(tc.name, function () {
          const got = Helper.hasContestEnded(tc.contest);
          expect(got).to.equal(tc.want);
        });
      });
    });
  });
});
