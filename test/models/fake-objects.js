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

export function getFakeTask(obj) {
  return new Task({ ...fakeTaskTmpl, ...obj });
}

const fakeProblemTmpl = {
  _id: "fake-problem-id",
  code: "",
  name: "fake-problem",
  fid: "fake-problem-fid",
  attr: getFakeTask({}).toJSON()
};

export function getFakeProblem(obj, attr = {}) {
  return { fakeProblemTmpl, ...obj, ...{ attr: getFakeTask(attr).toJSON() }};
}

export function getFakeContestProblem(fakeProblem, i = 0) {
  return {
    letter: `P${i}`,
    problem: fakeProblem,
    color: "000"
  };
}

export function getFakeContestProblems(fakeProblems) {
  return fakeProblems.map(getFakeContestProblem);
}

const fakeContestTmpl = {
  name: "fake-contest",
  start_time: 0,
  end_time: parseInt(1e16, 10),
  scoring: defaultScoring,
  problems: [],
  hidden: false,
  upseeing: true
};

export function getFakeContest(obj, fakeProblems = []) {
  return {
    ...fakeContestTmpl,
    ...obj,
    ...{ problems: getFakeContestProblems(fakeProblems) }
  };
}
