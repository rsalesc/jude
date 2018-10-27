import { VerdictGhost } from "@judge/verdict.js";
import * as Helper from "@front/helpers.js";

export default class GhostExtractor {
  constructor(contest, teams, problems, submissions) {
    this.contest = contest;
    this.teams = teams;
    this.problems = problems;
    this.submissions = submissions;
  }

  verdict(v) {
    return VerdictGhost[v] || VerdictGhost[""];
  }

  extract(opts = {}) {
    const res = ["\x1A"];
    const { contest, teams, problems, submissions } = this;

    const hasTag = opts.tag || false;

    let duration = new Date(contest.end_time).getTime()
      - new Date(contest.start_time).getTime();

    duration /= 60 * 1000;
    duration = parseInt(duration, 10);

    res.push(`@contest "${contest.name}"`);
    res.push(`@problems ${problems.length}`);
    res.push(`@contlen ${duration}`);
    res.push(`@teams ${teams.length}`);
    res.push(`@submissions ${submissions.length}`);

    const dicts = {};

    for (const prob of problems) {
      dicts[prob.problem._id] = {
        problem: prob.problem,
        letter: prob.letter,
        attempts: {}
      };
      res.push(`@p ${prob.letter},"${prob.problem.name}",20,0`);
    }

    for (const team of teams) {
      const shouldTag = hasTag && (team.description || "").trim().length > 0;
      const name = shouldTag ? `[${team.description}] ${team.name}` : team.name;
      res.push(`@t ${team._id},0,1,"${name}"`);
    }

    for (const sub of submissions.filter(s => s.timeInContest !== -1
                                              && s.timeInContest < duration)) {
      const probDict = dicts[sub.problem];
      const attempts = probDict.attempts[sub._creator] || 0;
      const v = Helper.getMainVerdict(sub.verdict, probDict.problem);
      res.push(`@s ${sub._creator},${probDict.letter},${attempts + 1},${sub.timeInContest},${this.verdict(v)}`);

      dicts[sub.problem].attempts[sub._creator] = attempts + 1;
    }

    return res.join("\n");
  }
}
