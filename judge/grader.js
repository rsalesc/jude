/**
 * Created by rsalesc on 24/06/16.
 */

// eslint-disable-next-line no-unused-vars
const fs = require("fs");
const path = require("path");
const promiseReflect = require("promise-reflect");

const verdict = require("./verdict");
const utils = require("./utils");
const logger = require("./logger");
const sandbox = require("./sandbox");
const environment = require("./environment");

const loader = require("./loader");
const Profiler = require("./profiler");

const Storage = require("./storage").MemoryStorage;

const { Verdict } = verdict;
const { Isolate, IsolateConst } = sandbox;
const { JudgeEnvironment, JudgeConfig } = environment;
const { JudeLoader } = loader;

const policyPath = "/etc/java-sandbox/security.policy";
const javaExecutorPath = "/etc/java-sandbox/executor.jar";

async function evaluate(iso, store, command, input, output = "output", error = "error") {
  if (input)
    iso.stdin = input;
  iso.stdout = output;
  iso.stderr = error;

  // remove stdout and stderr, only for dbg
  const res = await iso.execute(command);
  // iso.removeFile(iso.stdout)
  // iso.removeFile(iso.stderr)

  return res;
}

const Evaluation = {
  async CPP(iso, store, execPath, test, timelimit = null, wtlimit = null, memorylimit = null,
            input = "input", output = "output",
            error = "error") {
    iso.timelimit = timelimit;
    iso.wallclockLimit = wtlimit;
    iso.memorySize = memorylimit;
    await iso.createFileFromStorage(input, test);
    await iso.createFileFromStorage("eval", execPath, true);

    const res = await evaluate(iso, store, ["./eval"], input, output, error);
    await iso.removeFile("eval");
    await iso.removeFile(input);

    return res;
  },
  async Py2(iso, store, execPath, test, timelimit = null, wtlimit = null, memorylimit = null,
            input = "input", output = "output",
            error = "error") {
    iso.timelimit = timelimit;
    iso.wallclockLimit = wtlimit;
    iso.memorySize = memorylimit;
    iso.setEnv.HOME = "./";
    iso.dirs.push({ in: "/usr" });
    iso.dirs.push({ in: "/etc" });
    await iso.createFileFromStorage(input, test);
    await iso.createFileFromStorage("sol.pyc", "sol.pyc", true);

    const res = await evaluate(iso, store, ["/usr/bin/python2", "sol.pyc"], input, output, error);
    iso.dirs.pop();
    iso.dirs.pop();

    await iso.removeFile("sol.pyc");
    await iso.removeFile(input);

    return res;
  },
  async Py3(iso, store, execPath, test, timelimit = null, wtlimit = null, memorylimit = null,
            input = "input", output = "output",
            error = "error") {
    iso.timelimit = timelimit;
    iso.wallclockLimit = wtlimit;
    iso.memorySize = memorylimit;
    iso.setEnv.HOME = "./";
    iso.dirs.push({ in: "/usr" });
    iso.dirs.push({ in: "/etc" });
    await iso.createFileFromStorage(input, test);
    await iso.createFileFromStorage("sol.pyc", "sol.pyc", true);

    const res = await evaluate(iso, store, ["/usr/bin/python3", "sol.pyc"], input, output, error);
    iso.dirs.pop();
    iso.dirs.pop();

    await iso.removeFile("sol.pyc");
    await iso.removeFile(input);

    return res;
  },
  async Java(iso, store, execPath, test, timelimit = null, wtlimit = null, memorylimit = null,
             input = "input", output = "output",
             error = "error") {
    const oldProc = iso.maxProcesses;
    const oldEnv = iso.setEnv;
    const oldCgTiming = iso.cgTiming;
    const oldCgMemory = iso.cgMemorySize;
    const oldCg = iso.cgroup;

    iso.setEnv.MALLOC_ARENA_MAX = "1";
    iso.maxProcesses = null;
    iso.timelimit = timelimit;
    iso.wallclockLimit = wtlimit;
    iso.dirs.push({ in: "/etc" });
    iso.dirs.push({ in: "/usr/lib/jvm" });
    iso.memorySize = (1300 * 1024) + memorylimit;
    iso.cgMemorySize = iso.memorySize;
    iso.cgTiming = true;
    iso.cgroup = true;

    await iso.createFileFromStorage(input, test);
    await iso.globFromStorage("*.class", path.basename);

    const command = [
      "/usr/bin/java",
      "-client",
      `-javaagent:${javaExecutorPath}=policy:${policyPath}`,
      "-Xss128m",
      `-Xmx${memorylimit / 1024 | 0}m`,
      "-XX:MaxMetaspaceSize=256m",
      "-XX:CompressedClassSpaceSize=64m",
      "-XX:ErrorFile=submission_jvm_crash.log",
      "Main"
    ];

    // console.log(iso.getRunArgs());
    const res = await evaluate(iso, store, command, input, output, error);
    // console.log(fs.readFileSync(iso.resolvePath("output"), "utf8"));
    // console.log(fs.readFileSync(iso.resolvePath("error"), "utf8"));
    // console.log(fs.readFileSync(iso.resolvePath("run.log.0"), "utf8"));

    // console.log(fs.readFileSync(iso.resolvePath("submission_jvm_crash.log")));
    // console.log(fs.readFileSync(iso.resolvePath("state"), "utf8"));

    // require("sleep").sleep(20);

    if (await iso.fileExists("submission_jvm_crash.log"))
      throw new Error("JVM somehow crashed");

    //if (!await iso.fileExists("state"))
      //throw new Error("State file not found");

    await iso.removeFile(input);
    iso.dirs.pop();
    iso.dirs.pop();
    iso.setEnv = oldEnv;
    iso.maxProcesses = oldProc;
    iso.cgTiming = oldCgTiming;
    iso.cgMemorySize = oldCgMemory;
    iso.cgroup = oldCg;

    return res;
  }
};
Evaluation.C = Evaluation.CPP;

const Checking = {
  async CPP(iso, store, execPath,
            input = "input", output = "output", answer = "answer",
            checkerInput = null, checkerOutput = "checker_output", checkerError = "checker_error") {
    iso.timelimit = JudgeConfig.CHECKING_TL;
    iso.wallclockLimit = JudgeConfig.CHECKING_WTL;
    iso.memorySize = JudgeConfig.CHECKING_ML * 1024;

    await iso.createFileFromStorage("eval", execPath, true);

    const res = await evaluate(iso, store, ["./eval", input, output, answer],
                               checkerInput, checkerOutput, checkerError);
    await iso.removeFile("eval");
    await iso.removeFile(input);

    res.stdout = await iso.getFileToString(checkerOutput);
    res.stderr = await iso.getFileToString(checkerError);
    return res;
  }
};
Checking.C = Checking.CPP;

const Compilation = {
  async CPP(iso, store, file, execPath) {
    const sourceFile = "source.cpp";
    await iso.createFileFromStorage(sourceFile, file);

    const oldEnv = iso.preserveEnv;
    const oldProc = iso.maxProcesses;
    const oldTL = iso.timelimit;
    const oldWTL = iso.wallclockLimit;
    iso.preserveEnv = true;
    iso.maxProcesses = null;
    iso.dirs.push({ in: "/etc" });
    iso.timelimit = JudgeConfig.COMPILATION_TL;
    iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

    const res = await evaluate(iso, store, ["/usr/bin/g++", "-static", "-lm", "-std=c++11",
                                            sourceFile, "-O2"]);

    iso.maxProcesses = oldProc;
    iso.preserveEnv = oldEnv;
    iso.timelimit = oldTL;
    iso.wallclockLimit = oldWTL;
    iso.dirs.pop();

    await iso.removeFile(sourceFile);

    if (res.code === 0 && execPath) {
      await iso.getFileToStorage("a.out", execPath);
      await iso.removeFile("a.out");
    }

    res.stdout = await iso.getFileToString("output");
    res.stderr = await iso.getFileToString("error");
    await iso.removeFile("output");
    await iso.removeFile("error");
    return res;
  },
  async C(iso, store, file, execPath) {
    const sourceFile = "source.c";
    await iso.createFileFromStorage(sourceFile, file);

    const oldEnv = iso.preserveEnv;
    const oldProc = iso.maxProcesses;
    const oldTL = iso.timelimit;
    const oldWTL = iso.wallclockLimit;
    iso.preserveEnv = true;
    iso.maxProcesses = null;
    iso.dirs.push({ in: "/etc" });
    iso.timelimit = JudgeConfig.COMPILATION_TL;
    iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

    const res = await evaluate(iso, store, ["/usr/bin/gcc", "-static", "-lm", "-std=c11",
                                            sourceFile, "-O2"]);


    iso.maxProcesses = oldProc;
    iso.preserveEnv = oldEnv;
    iso.timelimit = oldTL;
    iso.wallclockLimit = oldWTL;
    iso.dirs.pop();

    await iso.removeFile(sourceFile);

    if (res.code === 0 && execPath) {
      await iso.getFileToStorage("a.out", execPath);
      await iso.removeFile("a.out");
    }

    res.stdout = await iso.getFileToString("output");
    await iso.removeFile("output");
    return res;
  },
  async Java(iso, store, file) {
    const sourceFile = "Main.java";
    await iso.createFileFromStorage(sourceFile, file);

    const oldEnv = iso.preserveEnv;
    const oldProc = iso.maxProcesses;
    const oldTL = iso.timelimit;
    const oldWTL = iso.wallclockLimit;
    iso.preserveEnv = true;
    iso.maxProcesses = null;
    iso.dirs.push({ in: "/etc" });
    iso.dirs.push({ in: "/usr/lib/jvm" });
    iso.timelimit = JudgeConfig.COMPILATION_TL;
    iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

    const res = await evaluate(iso, store,
                               ["/usr/bin/javac", "-Xlint", "-encoding", "UTF-8", sourceFile]);

    iso.maxProcesses = oldProc;
    iso.preserveEnv = oldEnv;
    iso.timelimit = oldTL;
    iso.wallclockLimit = oldWTL;
    iso.dirs.pop();
    iso.dirs.pop();

    await iso.removeFile(sourceFile);

    if (res.code === 0)
      await iso.globToStorage("*.class", path.basename);


    res.stdout = await iso.getFileToString("output");
    res.stderr = await iso.getFileToString("error");
    await iso.removeFile("output");
    await iso.removeFile("error");
    return res;
  },
  async Py2(iso, store, file, execPath) {
    const sourceFile = "sol.py";
    await iso.createFileFromStorage(sourceFile, file);

    const oldEnv = iso.preserveEnv;
    const oldProc = iso.maxProcesses;
    const oldTL = iso.timelimit;
    const oldWTL = iso.wallclockLimit;
    iso.preserveEnv = true;
    iso.maxProcesses = null;
    iso.dirs.push({ in: "/etc" });
    iso.dirs.push({ in: "/usr" });
    iso.timelimit = JudgeConfig.COMPILATION_TL;
    iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

    const res = await evaluate(iso, store, ["/usr/bin/python2", "-m", "py_compile",
                                            sourceFile]);

    iso.maxProcesses = oldProc;
    iso.preserveEnv = oldEnv;
    iso.timelimit = oldTL;
    iso.wallclockLimit = oldWTL;
    iso.dirs.pop();
    iso.dirs.pop();

    await iso.removeFile(sourceFile);

    if (res.code === 0 && execPath)
      await iso.globToStorage("**/*.pyc", _ => "sol.pyc");

    res.stdout = await iso.getFileToString("output");
    res.stderr = await iso.getFileToString("error");
    await iso.removeFile("output");
    await iso.removeFile("error");
    return res;
  },
  async Py3(iso, store, file, execPath) {
    const sourceFile = "sol.py";
    await iso.createFileFromStorage(sourceFile, file);

    const oldEnv = iso.preserveEnv;
    const oldProc = iso.maxProcesses;
    const oldTL = iso.timelimit;
    const oldWTL = iso.wallclockLimit;
    iso.preserveEnv = true;
    iso.maxProcesses = null;
    iso.dirs.push({ in: "/etc" });
    iso.dirs.push({ in: "/usr" });
    iso.timelimit = JudgeConfig.COMPILATION_TL;
    iso.wallclockLimit = JudgeConfig.COMPILATION_TL;

    const res = await evaluate(iso, store, ["/usr/bin/python3", "-m", "py_compile",
                                            sourceFile]);

    iso.maxProcesses = oldProc;
    iso.preserveEnv = oldEnv;
    iso.timelimit = oldTL;
    iso.wallclockLimit = oldWTL;
    iso.dirs.pop();
    iso.dirs.pop();

    await iso.removeFile(sourceFile);

    if (res.code === 0 && execPath)
      await iso.globToStorage("**/*.pyc", _ => "sol.pyc");


    res.stdout = await iso.getFileToString("output");
    res.stderr = await iso.getFileToString("error");
    await iso.removeFile("output");
    await iso.removeFile("error");
    return res;
  }
};

/* Path constants to be used in the grading steps */
const SOURCE_PATH = "_/sol";
const SOURCE_EXEC_PATH = "_/sol_exec";
const CHECKER_PATH = "_/checker";
const CHECKER_EXEC_PATH = "_/checker_exec";

/**
*   Compile the solution
*   @param {JudgeEnvironment}
*   @param {Storage}
*   @param {string} solution language
*   @param {string} path of the solution code in the storage
*   @param {string} path of the resulting executable file in the storage
*   @retuns {Object} compilation output/verdict (Isolate.execute() result
*     + Isolate.getLog() result)
 */
async function compilationStepAsync(env, store, lang, sol = SOURCE_PATH,
                                    solExec = SOURCE_EXEC_PATH) {
  const iso = new Isolate(env, store);
  try {
    await iso.init();
    const result = await Compilation[lang](iso, store, sol, solExec);

    // get log
    result.log = await iso.getLog();

    // cleanup
    try {
      await iso.cleanup();
    } catch (e) {
      console.error(e);
    }

    return result;
  } catch (e) {
    logger.error("compilation step failed - %s", e.toString());
    try {
      await iso.cleanup();
    } catch (e2) {
      console.error(e2);
    }

    throw { code: 2 };
  }
}

/*
*   Promisified testCase
 */
// eslint-disable-next-line require-await
async function testCaseAsync(env, store, iso, task, lang, dataset, testcase) {
  return new Promise(async (resolve) => {
    console.log(testcase);
    logger.debug(`running on testcase ${testcase.in}`);

    // to seconds
    const timelimit = task.getTimelimit();

    // to KB
    const memorylimit = task.getMemorylimit() * 1024;

    let evaluationResult = {};
    let checkingResult = {};
    let execTime;
    const exitWith = v => resolve(v);

    let execLog = {};
    // grading step
    try {
      await iso.init();
      evaluationResult = await Evaluation[lang](iso, store, SOURCE_EXEC_PATH,
                                                testcase.in, timelimit,
                                                timelimit * JudgeConfig.WT_MULTIPLIER, memorylimit);

      evaluationResult.log = await iso.getLog();
      execLog = evaluationResult.log;

      // sandbox crashed
      if (!Isolate.translateBoxExitCode(evaluationResult.code)) {
        console.log("sandbox crashed in evaluation step");
        console.log(evaluationResult);
        return exitWith(new Verdict(0, "VERDICT_JE"));
      }

      const dummy = new Isolate(env, store, evaluationResult.log);
      execTime = dummy.getRunningTime();

      // execution failed, do something and return
      if (evaluationResult.code === 1) {
        const exitStatus = dummy.getExitStatus();
        const exitCode = dummy.getExitCode();

        if (exitStatus === IsolateConst.EXIT_TIMEOUT)
          return exitWith(new Verdict(0, "VERDICT_TLE", -1, { time: timelimit }));
        else if (exitStatus === IsolateConst.EXIT_TIMEOUT_WALL)
          return exitWith(new Verdict(0, "VERDICT_WTE", -1, { time: execTime }));
        else if (exitStatus === IsolateConst.EXIT_OUTPUT_LIMIT)
          return exitWith(new Verdict(0, "VERDICT_OLE", -1, { time: execTime }));


        // TODO: add sandbox information about RTE
        return exitWith(new Verdict(0, "VERDICT_RTE", -1, {
          text: `exited with code ${exitCode}`,
          time: execTime
        }));
      }
    } catch (e) {
      logger.error("execution step failed - %s", e.toString());
      return exitWith(new Verdict(0, "VERDICT_JE"));
    }

    try {
      // recreate file to avoid input modification when checking
      await iso.createFileFromStorage("input", testcase.in);
      await iso.createFileFromStorage("answer", testcase.out);

      checkingResult = await Checking[task.getCheckerLanguage()](iso, store,
                                                                 CHECKER_EXEC_PATH);
      checkingResult.log = await iso.getLog();

      if (!Isolate.translateBoxExitCode(checkingResult.code)) {
        console.log("error in checking step right after grading");
        console.log(checkingResult);
        return exitWith(new Verdict(0, "VERDICT_JE"));
      }

      iso.log = execLog;
      const output = checkingResult.stderr;

      if (checkingResult.code === 1) {
        const dummy = new Isolate(env, store, checkingResult.log);
        const exitStatus = dummy.getExitStatus();
        const exitCode = dummy.getExitCode();

        if (exitStatus === IsolateConst.EXIT_TIMEOUT
          || exitStatus === IsolateConst.EXIT_TIMEOUT_WALL)
          return exitWith(new Verdict(0, "VERDICT_CHTE"));


        if (exitCode === 1 || exitCode === 2)
          return exitWith(new Verdict(0, "VERDICT_WA", 0, { text: output, time: execTime }));

        return exitWith(new Verdict(0, "VERDICT_FAIL", 0, { text: output, time: execTime }));
      }

      return exitWith(new Verdict(1, "VERDICT_AC", 0, { text: output, time: execTime }));
    } catch (e) {
      logger.error("checker step failed - %s", e.toString());
      console.log(e);
      return exitWith(new Verdict(0, "VERDICT_JE"));
    }
  });
}

/**
*   Test to-be-executed solution against testcases of the given dataset
*   Files expected to be created beforehand are: _/checker_exec, _/sol_exec
*   @param {JudgeEnvironment}
*   @param {Storage}
*   @param {Task}   task
*   @param {string} language of the to-be-executed solution
*   @param {Object} dataset
 */
async function testDataset(env, store, task, lang, dataset) {
  let execTime = -1;
  try {
    const n = dataset.testcases.length;
    let totalTime = 0;
    let wallTime = 0;

    for (let i = 0; i < n; i += JudgeConfig.MAX_SIMUL_TESTS) {
      const cases = [];
      const boxes = [];
      for (let j = 0; j < JudgeConfig.MAX_SIMUL_TESTS && i + j < n; j++) {
        const iso = new Isolate(env, store);
        boxes.push(iso);
        cases.push(testCaseAsync(env, store, iso, task, lang,
                                 dataset, dataset.testcases[i + j]));
      }

      // eslint-disable-next-line no-await-in-loop
      const res = await Promise.all(cases.map(promiseReflect));
      env.pingCurrent().then(() => null).catch(console.error);

      for (let j = 0; j < JudgeConfig.MAX_SIMUL_TESTS && i + j < n; j++) {
        const { status } = res[j];

        if (status === "rejected")
          throw res[j].error;

        const caseResult = res[j].data;
        totalTime += boxes[j].getRunningTime();
        wallTime += boxes[j].getWallTime();
        if (caseResult.info.hasOwnProperty("time"))
          execTime = Math.max(execTime, caseResult.info.time);

        if (caseResult.verdict !== "VERDICT_AC") {
          caseResult.passed = i + j;
          if (execTime >= 0)
            caseResult.info.time = execTime;
          return caseResult;
        }
      }

      // eslint-disable-next-line require-await, no-await-in-loop
      await Promise.all(boxes.map(async box => box.cleanup()));
    }

    console.log("rt", totalTime);
    console.log("wt", wallTime);
  } catch (e) {
    logger.error("dataset test failed - %s", e.toString());
    return new Verdict(0, "VERDICT_JE");
  }

  return new Verdict(1, "VERDICT_AC", dataset.testcases.length, { time: execTime });
}

/**
*   Test code against testcases of the given task, in the given language.
*   Created files in storage are: _/checker_exec, _/sol_exec
*
*   @param {JudgeEnvironment}
*   @param {Task}
*   @param {Storage}
*   @param {string} the submitted code
*   @param {string} language of the submitted code
*   @returns {Verdict} evalution output/verdict
 */
async function testTask(env, task, store, code, lang) {
  // create solution source in the storage
  await store.createFileFromContent(SOURCE_PATH, code);

  // compile solution
  const [compilationResult, checkerCompilationResult]
        = await Promise.all([compilationStepAsync(env, store, lang),
                             compilationStepAsync(env, store, task.getCheckerLanguage(),
                                                  task.getChecker(), CHECKER_EXEC_PATH)]);


    // sandbox crashed
  if (!Isolate.translateBoxExitCode(compilationResult.code)) {
    console.log("sandbox crashed in compilation step");
    console.log(compilationResult);
    return utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount());
  }

  // compilation failed
  if (compilationResult.code === 1) {
    const dummy = new Isolate(env, null, compilationResult.log);
    const exitStatus = dummy.getExitStatus();
    const output = compilationResult.stderr;

    if (exitStatus === IsolateConst.EXIT_TIMEOUT || exitStatus === IsolateConst.EXIT_TIMEOUT_WALL)
      return utils.fillUpTo([new Verdict(0, "VERDICT_CTE")], task.getDatasetsCount());

    return utils.fillUpTo([new Verdict(0, "VERDICT_CE", -1, output)], task.getDatasetsCount());
  }

  // sandbox crashed
  if (!Isolate.translateBoxExitCode(checkerCompilationResult.code)) {
    console.log("sandbox crashed in checker compilation step");
    console.log(checkerCompilationResult);
    return utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount());
  }

  // checker compilation failed, do something and return
  if (checkerCompilationResult.code === 1) {
    const dummy = new Isolate(env, null, compilationResult.log);
    const exitStatus = dummy.getExitStatus();
    const exitCode = dummy.getExitCode();
    const output = compilationResult.stderr;

    logger.error("checker compilation failed with error %s (%d):\n%s",
                 exitStatus, exitCode, output);

    return utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount());
  }

  // now run solution against each of the datasets in ladder fashion
  const verdicts = [];
  for (const dataset of task.getDatasets()) {
    // eslint-disable-next-line no-await-in-loop
    const datasetVerdict = await testDataset(env, store, task, lang, dataset);
    verdicts.push(datasetVerdict);

    // if it was not accepted, break here (ladder effect)
    if (datasetVerdict.verdict !== "VERDICT_AC")
      break;
  }

  // push skip verdict to enforce ladder effect
  verdicts.push(new Verdict(0, "VERDICT_SKIP"));
  return utils.fillUpTo(verdicts, task.getDatasetsCount());
}

/**
 * Test solution against package test cases
 * @param env
 * @param pack
 * @param code
 * @param lang
 */
async function testPackage(env, pack, code, lang) {
  const store = new Storage();
  await store.loadZip(pack);

  const Loader = await loader.autoDetect(store);
  if (Loader === null)
    throw new Error("Package is not loadable");

  const task = await new Loader(store).load();

  const datasets = task.getDatasets();
  const verdicts = await testTask(env, task, store, code, lang);

  const res = {};
  for (let i = 0; i < datasets.length; i++)
    res[datasets[i].name] = verdicts[i];


  return res;
}

// testing
if (!module.parent && false) {
  (async () => {
    const env = new JudgeEnvironment();
    const store = new Storage();
    await store.loadZip("test/test_contest.zip");

    const judeLoader = new JudeLoader(store);
    const task = await judeLoader.load();

    /* eslint-disable */
    const code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}";
    const slow_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000/2; i++) cerr << 129312 << '\\n'; int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}";
    const tle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000000000LL; i++);}";
    const fake_mle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){vector<int> v(1000000000);}";
    const slow2_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int acc = 0; for(int i = 0; i < 1000000000; i++) acc += i; cout << acc << endl;}";
        // console.log(code)
        // utils.logInspect(testTask(env, task, store, slow_code, "CPP"))

    const java_wacode = `
        public class Main {
            public static void main(String[] args) {
                System.out.println("Hello!");
            }
        }`;

    const java_mlecode = `
        public class Main {
            public static void main(String[] args) {
                long a[] = new long[1024*1024*21];
                for(int i = 0; i < 1024*1024*21; i++) a[i] = i;
                System.out.println("Hello!");
            }
        }`;
    
    const java_rtecode = `import java.util.*;
 
public class Main
{
	public static void main (String[] args)
	{
		int n;
		Scanner in = new Scanner(System.in);
		n = in.nextInt();
		if (n % 100 >= 65) 
			n = 100 * (n / 100 + 1);
		if (n % 20 > 15) 
			n = 20 * (n / 20 + 1);
		System.out.println((n / 100) * 100 + (n % 100 / 20) * 30 + 2 * (n % 20));
	}
}`;

    const crazy_code = `import java.io.OutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.StringTokenizer;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;

/**
 * Built using CHelper plug-in
 * Actual solution is at the top
 */
public class Main {
    public static void main(String[] args) {
        TaskG solver = new TaskG();
        solver.solve();
    }

    static class TaskG {
        static final long MODULO = (long) (1e9 + 7);

        public void solve() {
        	System.out.println(5);
        }

        private int gcd(int a, int b) {
            while (b > 0) {
                int t = a % b;
                a = b;
                b = t;
            }
            return a;
        }
    }
}`;

    const pycode = "print '5'";

    utils.logInspect(await testTask(env, task, store, java_rtecode, "Java"));

        //
        // let env = new JudgeEnvironment()
        // let store = new Storage()
        // store.load("test_contest/")
        //
        // let iso = new Isolate(env, store)
        // iso.init()
        //
        // Compilation.CPP(iso, store, "checker.cpp", "_/checker")
        // console.log(iso.getLog())
        // Compilation.CPP(iso, store, "sol.cpp", "_/sol")
        // console.log(iso.getLog())
        //
        // iso.cleanup()
        //
        // iso = new Isolate(env, store)
        // iso.init()
        //
        // Evaluation.CPP(iso, store, "_/sol", "tests/set1/3.in")
        //
        // iso.createFileFromStorage("input", "tests/set1/3.in")
        // iso.createFileFromStorage("answer", "tests/set1/3.out")
        // iso.createFileFromStorage("checker", "_/checker", true)
        //
        // console.log(evaluate(iso, store, [
        //     "./checker", "input", "output", "answer"
        // ], null, "checker_output", "checker_error"))
        //
        // console.log(iso.getLog())
        // console.log(iso.getFileToString("checker_output"))
        //
        // //sleep(10)
        //
        // iso.cleanup()
  })();
}

/* eslint-enable */
const availableLanguages = {
  CPP: "C++ 11",
  C: "C 11",
  Java: "Java 8",
  Py2: "Python 2",
  Py3: "Python 3"
};

module.exports = { testTask, testPackage, availableLanguages };
