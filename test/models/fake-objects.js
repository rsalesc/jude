import { Task } from "@judge/task";

const defaultScoring = "ProductScoring";

const fakeTaskTmpl = {
  scoring: defaultScoring,
  weight: 1,
  limits: {
    time: 1000,
    memory: 256
  },
  datasets: []
};

export function getFakeTask(obj = {}) {
  return new Task({ ...fakeTaskTmpl, ...obj });
}

const fakeProblemTmpl = {
  _id: "fake-problem-id",
  code: "",
  name: "fake-problem",
  fid: "fake-problem-fid",
  attr: getFakeTask().toJSON()
};

export function getFakeProblem(obj = {}, attr = {}) {
  return { ...fakeProblemTmpl, ...obj, ...{ attr: getFakeTask(attr).toJSON() }};
}

export function getFakeContestProblem(fakeProblem, i = 0) {
  return {
    letter: `P${i}`,
    problem: fakeProblem,
    color: "000"
  };
}

export function getFakeContestProblems(fakeProblems = []) {
  return fakeProblems.map(getFakeContestProblem);
}

const fakeContestTmpl = {
  _id: "fake-contest-id",
  name: "fake-contest",
  start_time: new Date(0).toString(),
  end_time: new Date(parseInt(1e16, 10)).toString(),
  problems: [],
  hidden: false,
  upseeing: true
};

export function getFakeContest(obj = {}, fakeProblems = []) {
  return {
    ...fakeContestTmpl,
    ...obj,
    ...{ problems: getFakeContestProblems(fakeProblems) }
  };
}

const fakeSubmissionTmpl = {
  _id: "fake-submission-id",
  _creator: "fake-submission-creator",
  contest: "fake-contest-id",
  problem: "fake-problem-id",
  time: new Date(0).toString(),
  timeInContest: 0,
  language: "",
  code: "",
  codeHash: "",
  verdict: {}
};

export function getFakeSubmission(obj = {}, verdict = {}) {
  return {
    ...fakeSubmissionTmpl,
    ...obj,
    ...{ verdict }
  };
}
