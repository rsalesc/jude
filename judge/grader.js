/**
 * Created by rsalesc on 24/06/16.
 */

var Promise =  require('bluebird')
var async = require('asyncawait/async')
var await = require('asyncawait/await')

const fs = require("fs");

const path = require('path');
var verdict = require(path.join(__dirname, 'verdict'));
var utils = require(path.join(__dirname, 'utils'));
var logger = require(path.join(__dirname, 'logger'));
var sandbox = require(path.join(__dirname, 'sandbox'));
var environment = require(path.join(__dirname, 'environment'));

const loader = require(path.join(__dirname, 'loader'));
const Profiler = require(path.join(__dirname, 'profiler'));

var Verdict = verdict.Verdict;
var VerdictConst = verdict.VerdictConst;
var Isolate = sandbox.Isolate
var IsolateConst = sandbox.IsolateConst
var IsolatePool = sandbox.IsolatePool;
var Storage = require(path.join(__dirname, "storage")).MemoryStorage
var JudgeEnvironment = environment.JudgeEnvironment
var JudgeConfig = environment.JudgeConfig
var JudeLoader = loader.JudeLoader

const policyPath = "/etc/java-sandbox/security.policy";
const javaExecutorPath = "/etc/java-sandbox/executor.jar";

function evaluate(iso, store, command, input, output="output", error="error"){
    if(input)
        iso.stdin = input
    iso.stdout = output
    iso.stderr = error

    let res = iso.executeBufferized(command); // remove stdout and stderr, only for dbg
    //iso.removeFile(iso.stdout)
    //iso.removeFile(iso.stderr)

    return res
}

let Evaluation = {
    "CPP": function(iso, store, execPath, test, timelimit=null, wtlimit=null, memorylimit=null,
                    input="input", output="output",
                    error="error"){
        iso.timelimit = timelimit
        iso.wallclockLimit = wtlimit
        iso.memorySize = memorylimit
        iso.createFileFromStorage(input, test)
        iso.createFileFromStorage("eval", execPath, true)

        let res = evaluate(iso, store, ["./eval"], input, output, error)
        iso.removeFile("eval")
        iso.removeFile(input)

        return res
    },
    "Py2": function(iso, store, execPath, test, timelimit=null, wtlimit=null, memorylimit=null,
                    input="input", output="output",
                    error="error"){
        iso.timelimit = timelimit
        iso.wallclockLimit = wtlimit
        iso.memorySize = memorylimit
        iso.setEnv["HOME"] = "./";
        iso.dirs.push({in: "/usr"});
        iso.dirs.push({in: "/etc"});
        iso.createFileFromStorage(input, test)
        iso.createFileFromStorage("sol.pyc", "sol.pyc", true)

        let res = evaluate(iso, store, ["/usr/bin/python2", "sol.pyc"], input, output, error)
        iso.dirs.pop();
        iso.dirs.pop();

        iso.removeFile("sol.pyc");
        iso.removeFile(input)

        return res
    },
    "Py3": function(iso, store, execPath, test, timelimit=null, wtlimit=null, memorylimit=null,
                    input="input", output="output",
                    error="error"){
        iso.timelimit = timelimit
        iso.wallclockLimit = wtlimit
        iso.memorySize = memorylimit
        iso.setEnv["HOME"] = "./";
        iso.dirs.push({in: "/usr"});
        iso.dirs.push({in: "/etc"});
        iso.createFileFromStorage(input, test)
        iso.createFileFromStorage("sol.pyc", "sol.pyc", true)

        let res = evaluate(iso, store, ["/usr/bin/python3", "sol.pyc"], input, output, error)
        iso.dirs.pop();
        iso.dirs.pop();

        iso.removeFile("sol.pyc");
        iso.removeFile(input)

        return res
    },
    "Java": function(iso, store, execPath, test, timelimit=null, wtlimit=null, memorylimit=null,
                    input="input", output="output",
                    error="error"){
        let oldProc = iso.maxProcesses;
        let oldEnv = iso.setEnv;
        let oldCgTiming = iso.cgTiming;
        let oldCgMemory = iso.cgMemorySize;
        let oldCg = iso.cgroup;

        iso.setEnv["MALLOC_ARENA_MAX"] = "1";
        iso.maxProcesses = null;
        iso.timelimit = timelimit
        iso.wallclockLimit = wtlimit
        iso.dirs.push({in: "/etc"});
        iso.dirs.push({in: "/usr/lib/jvm"});
        iso.memorySize = iso.cgMemorySize = 1300*1024 + memorylimit;
        iso.cgTiming = true;
        iso.cgroup = true;

        iso.createFileFromStorage(input, test)
        iso.globFromStorage("*.class", path.basename);

        const command = [
            "/usr/bin/java",
            "-client",
           `-javaagent:${javaExecutorPath}=policy:${policyPath}`,
            "-Xss128m",
            `-Xmx${(memorylimit/1024)|0}m`,
            "-XX:MaxMetaspaceSize=256m",
            "-XX:CompressedClassSpaceSize=64m",
            "-XX:ErrorFile=submission_jvm_crash.log",
            "Main"
        ];

        //console.log(iso.getRunArgs());
        let res = evaluate(iso, store, command, input, output, error)
        //console.log(fs.readFileSync(iso.resolvePath("output"), "utf8"));
        //console.log(fs.readFileSync(iso.resolvePath("error"), "utf8"));
        //console.log(fs.readFileSync(iso.resolvePath("run.log.0"), "utf8"));

        // console.log(fs.readFileSync(iso.resolvePath("submission_jvm_crash.log")));
        //console.log(fs.readFileSync(iso.resolvePath("state"), "utf8"));

        // require("sleep").sleep(20);

        if(!iso.fileExists("state"))
            throw new Error("State file not found");
        
        if(iso.fileExists("submission_jvm_crash.log"))
            throw new Error("JVM somehow crashed");

        iso.removeFile(input);
        iso.dirs.pop();
        iso.dirs.pop();
        iso.setEnv = oldEnv;
        iso.maxProcesses = oldProc;
        iso.cgTiming = oldCgTiming;
        iso.cgMemorySize = oldCgMemory;
        iso.cgroup = oldCg;

        return res
    }
}
Evaluation["C"] = Evaluation["CPP"]

let Checking = {
    "CPP": function(iso, store, execPath,
                    input="input", output="output", answer="answer",
                    checker_input=null, checker_output="checker_output", checker_error="checker_error"){

        iso.timelimit = JudgeConfig.CHECKING_TL
        iso.wallclockLimit = JudgeConfig.CHECKING_WTL
        iso.memorySize = JudgeConfig.CHECKING_ML*1024

        iso.createFileFromStorage("eval", execPath, true)

        let res = evaluate(iso, store, ["./eval", input, output, answer],
            checker_input, checker_output, checker_error)
        iso.removeFile("eval")
        iso.removeFile(input)

        res.stdout = iso.getFileToString(checker_output)
        res.stderr = iso.getFileToString(checker_error)
        return res
    }
}
Checking["C"] = Checking["CPP"]

let Compilation = {
    "CPP" : function(iso, store, file, execPath){
        let sourceFile = "source.cpp"
        iso.createFileFromStorage(sourceFile, file)

        let oldEnv = iso.preserveEnv
        let oldProc = iso.maxProcesses
        let oldTL = iso.timelimit
        let oldWTL = iso.wallclockLimit
        iso.preserveEnv = true
        iso.maxProcesses = null
        iso.dirs.push({in: "/etc"})
        iso.timelimit = JudgeConfig.COMPILATION_TL
        iso.wallclockLimit = JudgeConfig.COMPILATION_TL

        let res = evaluate(iso, store, ["/usr/bin/g++", "-static", "-lm", "-std=c++11",
            sourceFile, "-O2"])

        iso.maxProcesses = oldProc
        iso.preserveEnv = oldEnv
        iso.timelimit = oldTL
        iso.wallclockLimit = oldWTL
        iso.dirs.pop()

        iso.removeFile(sourceFile)

        if(res.code == 0 && execPath) {
            iso.getFileToStorage("a.out", execPath)
            iso.removeFile("a.out")
        }

        res.stdout = iso.getFileToString("output")
        res.stderr = iso.getFileToString("error")
        iso.removeFile("output")
        iso.removeFile("error")
        return res
    },
    "C" : function(iso, store, file, execPath) {
        let sourceFile = "source.c"
        iso.createFileFromStorage(sourceFile, file)

        let oldEnv = iso.preserveEnv
        let oldProc = iso.maxProcesses
        let oldTL = iso.timelimit
        let oldWTL = iso.wallclockLimit
        iso.preserveEnv = true
        iso.maxProcesses = null
        iso.dirs.push({in: "/etc"})
        iso.timelimit = JudgeConfig.COMPILATION_TL
        iso.wallclockLimit = JudgeConfig.COMPILATION_TL

        let res = evaluate(iso, store, ["/usr/bin/gcc", "-static", "-lm", "-std=c11",
            sourceFile, "-O2"])


        iso.maxProcesses = oldProc
        iso.preserveEnv = oldEnv
        iso.timelimit = oldTL
        iso.wallclockLimit = oldWTL
        iso.dirs.pop()

        iso.removeFile(sourceFile)

        if (res.code == 0 && execPath) {
            iso.getFileToStorage("a.out", execPath)
            iso.removeFile("a.out")
        }

        res.stdout = iso.getFileToString("output")
        iso.removeFile("output")
        return res
    },
    "Java" : function(iso, store, file, execPath){
        let sourceFile = "Main.java"
        iso.createFileFromStorage(sourceFile, file)

        let oldEnv = iso.preserveEnv
        let oldProc = iso.maxProcesses
        let oldTL = iso.timelimit
        let oldWTL = iso.wallclockLimit
        iso.preserveEnv = true
        iso.maxProcesses = null
        iso.dirs.push({in: "/etc"})
        iso.dirs.push({in: "/usr/lib/jvm" });
        iso.timelimit = JudgeConfig.COMPILATION_TL
        iso.wallclockLimit = JudgeConfig.COMPILATION_TL

        let res = evaluate(iso, store, 
            ["/usr/bin/javac", "-Xlint", "-encoding", "UTF-8", sourceFile]);

        iso.maxProcesses = oldProc
        iso.preserveEnv = oldEnv
        iso.timelimit = oldTL
        iso.wallclockLimit = oldWTL
        iso.dirs.pop();
        iso.dirs.pop();

        iso.removeFile(sourceFile)

        if(res.code == 0) {
            iso.globToStorage("*.class", path.basename);
        }

        res.stdout = iso.getFileToString("output")
        res.stderr = iso.getFileToString("error")
        iso.removeFile("output")
        iso.removeFile("error")
        return res
    },
    "Py2" : function(iso, store, file, execPath){
        let sourceFile = "sol.py"
        iso.createFileFromStorage(sourceFile, file)

        let oldEnv = iso.preserveEnv
        let oldProc = iso.maxProcesses
        let oldTL = iso.timelimit
        let oldWTL = iso.wallclockLimit
        iso.preserveEnv = true
        iso.maxProcesses = null
        iso.dirs.push({in: "/etc"})
        iso.dirs.push({in: "/usr"});
        iso.timelimit = JudgeConfig.COMPILATION_TL
        iso.wallclockLimit = JudgeConfig.COMPILATION_TL

        let res = evaluate(iso, store, ["/usr/bin/python2", "-m", "py_compile",
            sourceFile])

        iso.maxProcesses = oldProc
        iso.preserveEnv = oldEnv
        iso.timelimit = oldTL
        iso.wallclockLimit = oldWTL
        iso.dirs.pop()
        iso.dirs.pop();

        iso.removeFile(sourceFile)

        if(res.code == 0 && execPath) {
            iso.globToStorage("**/*.pyc", (file) => "sol.pyc");
        }

        res.stdout = iso.getFileToString("output")
        res.stderr = iso.getFileToString("error")
        iso.removeFile("output")
        iso.removeFile("error")
        return res
    },
    "Py3" : function(iso, store, file, execPath){
        let sourceFile = "sol.py"
        iso.createFileFromStorage(sourceFile, file)

        let oldEnv = iso.preserveEnv
        let oldProc = iso.maxProcesses
        let oldTL = iso.timelimit
        let oldWTL = iso.wallclockLimit
        iso.preserveEnv = true
        iso.maxProcesses = null
        iso.dirs.push({in: "/etc"})
        iso.dirs.push({in: "/usr"});
        iso.timelimit = JudgeConfig.COMPILATION_TL
        iso.wallclockLimit = JudgeConfig.COMPILATION_TL

        let res = evaluate(iso, store, ["/usr/bin/python3", "-m", "py_compile",
            sourceFile])

        iso.maxProcesses = oldProc
        iso.preserveEnv = oldEnv
        iso.timelimit = oldTL
        iso.wallclockLimit = oldWTL
        iso.dirs.pop()
        iso.dirs.pop();

        iso.removeFile(sourceFile)

        if(res.code == 0 && execPath) {
            iso.globToStorage("**/*.pyc", (file) => "sol.pyc");
        }

        res.stdout = iso.getFileToString("output")
        res.stderr = iso.getFileToString("error")
        iso.removeFile("output")
        iso.removeFile("error")
        return res
    }
}

/* Path constants to be used in the grading steps */
const SOURCE_PATH = "_/sol"
const SOURCE_EXEC_PATH = "_/sol_exec"
const CHECKER_PATH = "_/checker"
const CHECKER_EXEC_PATH = "_/checker_exec"

/**
*   Compile the solution
*   @param {JudgeEnvironment}
*   @param {Storage}
*   @param {string} solution language
*   @param {string} path of the solution code in the storage
*   @param {string} path of the resulting executable file in the storage
*   @retuns {Object} compilation output/verdict (Isolate.execute() result + Isolate.getLog() result)
 */
function compilationStepAsync(env, store, lang, sol=SOURCE_PATH, solExec=SOURCE_EXEC_PATH){
    return new Promise((resolve, reject) => {
        async(() => {
            let iso = new Isolate(env, store)
            try {
                iso.init()
                let result = Compilation[lang](iso, store, sol, solExec)

                // get log
                result.log = iso.getLog()

                // cleanup
                try {
                    iso.cleanup()
                }catch(e){}

                resolve(result)
            }catch(e){
                logger.error("compilation step failed - %s", e.toString())
                try{
                    iso.cleanup()
                }catch(e){}

                resolve({code: 2})
            }
        })()
    })
}

/*
*   Promisified testCase
 */
function testCaseAsync(env, store, iso, task, lang, dataset, testcase, prof){
    return new Promise(function(resolve, reject){
        async(function() {
            logger.debug(`running on testcase ${testcase.in}`)
            let timelimit = task.getTimelimit()     // to seconds
            let memorylimit = task.getMemorylimit() * 1024   // to KB

            let evaluationResult = {};
            let checkingResult = {};
            let execTime = undefined;
            let exitWith = function (verdict) {
                return resolve(verdict);
            };

            let execLog = {};
            prof.fire("eval_trycatch");
            // grading step
            try {
                iso.init()

                prof.fire("eval");
                evaluationResult = Evaluation[lang](iso, store, SOURCE_EXEC_PATH,
                    testcase.in, timelimit, timelimit * JudgeConfig.WT_MULTIPLIER, memorylimit)
                prof.stop("eval");
                evaluationResult.log = execLog = iso.getLog()

                // sandbox crashed
                if (!Isolate.translateBoxExitCode(evaluationResult.code)) {
                    console.log("sandbox crashed in evaluation step");
                    console.log(evaluationResult);
                    return exitWith(new Verdict(0, "VERDICT_JE"))
                }

                let dummy = new Isolate(env, store, evaluationResult.log)
                execTime = dummy.getRunningTime()

                // execution failed, do something and return
                if (evaluationResult.code == 1) {
                    let exitStatus = dummy.getExitStatus();
                    let exitCode = dummy.getExitCode();
                    //let output = evaluationResult.output

                    if (exitStatus == IsolateConst.EXIT_TIMEOUT)
                        return exitWith(new Verdict(0, "VERDICT_TLE", -1, {time: timelimit}));
                    else if (exitStatus == IsolateConst.EXIT_TIMEOUT_WALL)
                        return exitWith(new Verdict(0, "VERDICT_WTE", -1, {time: execTime}));
                    else if (exitStatus == IsolateConst.EXIT_OUTPUT_LIMIT)
                        return exitWith(new Verdict(0, "VERDICT_OLE", -1, {time: execTime}));

                    // TODO: add sandbox information about RTE
                    return exitWith(new Verdict(0, "VERDICT_RTE", -1, {text: `exited with code ${exitCode}`,
                                                                        time: execTime}))
                }
            } catch (e) {
                logger.error("execution step failed - %s", e.toString())
                return exitWith(new Verdict(0, "VERDICT_JE"))
            }
            prof.stop("eval_trycatch");
            prof.fire("check_trycatch");
            try {
                // recreate file to avoid input modification when checking
                iso.createFileFromStorage("input", testcase.in)
                iso.createFileFromStorage("answer", testcase.out)

                prof.fire("check");
                checkingResult = Checking[task.getCheckerLanguage()](iso, store,
                    CHECKER_EXEC_PATH)
                prof.stop("check");
                checkingResult.log = iso.getLog()

                if (!Isolate.translateBoxExitCode(checkingResult.code)) {
                    console.log("error in checking step right after grading");
                    console.log(checkingResult);
                    return exitWith(new Verdict(0, "VERDICT_JE"))
                }

                iso.log = execLog;

                let output = checkingResult.stderr

                if (checkingResult.code == 1) {
                    let dummy = new Isolate(env, store, checkingResult.log)
                    let exitStatus = dummy.getExitStatus()
                    let exitCode = dummy.getExitCode()

                    if (exitStatus == IsolateConst.EXIT_TIMEOUT || exitStatus == IsolateConst.EXIT_TIMEOUT_WALL)
                        return exitWith(new Verdict(0, "VERDICT_CHTE"))

                    if (exitCode == 1 || exitCode == 2)
                        return exitWith(new Verdict(0, "VERDICT_WA", 0, {text: output, time: execTime}))
                    else
                        return exitWith(new Verdict(0, "VERDICT_FAIL", 0, {text: output, time: execTime}))
                }

                return exitWith(new Verdict(1, "VERDICT_AC", 0, {text: output, time: execTime}))
            } catch (e) {
                logger.error("checker step failed - %s", e.toString())
                console.log(e)
                return exitWith(new Verdict(0, "VERDICT_JE"))
            }

            prof.stop("check_trycatch");
        })()
    })
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
function testDataset(env, store, task, lang, dataset){
    let execTime = -1;
    try {
        let prof = new Profiler();
        let n = dataset.testcases.length;
        let totalTime = 0;
        let wallTime = 0;

        prof.fire("general");
        for (let i = 0; i < n; i += JudgeConfig.MAX_SIMUL_TESTS) {
            let cases = [];
            let boxes = [];
            for(let j = 0; j < JudgeConfig.MAX_SIMUL_TESTS && i+j < n; j++) {
                let iso = new Isolate(env, store);
                boxes.push(iso);
                cases.push(testCaseAsync(env, store, iso, task, lang,
                    dataset, dataset.testcases[i+j], prof))
            }

            let res = await(cases);
            for(let j = 0; j < JudgeConfig.MAX_SIMUL_TESTS && i+j < n; j++){
                let caseResult = res[j];
                totalTime += boxes[j].getRunningTime();
                wallTime += boxes[j].getWallTime();
                boxes[j].cleanup();
                if(caseResult.info.hasOwnProperty("time"))
                    execTime = Math.max(execTime, caseResult.info.time);

                if(caseResult.verdict != "VERDICT_AC"){
                    caseResult.passed = i+j;
                    if(execTime >= 0) caseResult.info.time = execTime;
                    return caseResult
                }
            }
        }

        prof.stop("general");
        prof.dump();
        console.log("rt", totalTime);
        console.log("wt", wallTime);
        
    } catch (e){
        logger.error("dataset test failed - %s", e.toString());
        return new Verdict(0, "VERDICT_JE");
    }

    return new Verdict(1, "VERDICT_AC", dataset.testcases.length, {time: execTime});
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
function testTask(env, task, store, code, lang){

    // create solution source in the storage
    store.createFileFromContent(SOURCE_PATH, code)

    // compile solution
    let [compilationResult, checkerCompilationResult]
        =   await([compilationStepAsync(env, store, lang),
            compilationStepAsync(env, store, task.getCheckerLanguage(),
                task.getChecker(), CHECKER_EXEC_PATH)])


    // sandbox crashed
    if(!Isolate.translateBoxExitCode(compilationResult.code)) {
        console.log("sandbox crashed in compilation step");
        console.log(compilationResult);
        return utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount())
    }

    // compilation failed
    if(compilationResult.code == 1){
        let dummy = new Isolate(env, null, compilationResult.log)
        let exitStatus = dummy.getExitStatus();
        let output = compilationResult.stderr;

        if(exitStatus == IsolateConst.EXIT_TIMEOUT || exitStatus == IsolateConst.EXIT_TIMEOUT_WALL)
            return utils.fillUpTo([new Verdict(0, "VERDICT_CTE")], task.getDatasetsCount())

        return utils.fillUpTo([new Verdict(0, "VERDICT_CE", -1, output)], task.getDatasetsCount())
    }

    // sandbox crashed
    if(!Isolate.translateBoxExitCode(checkerCompilationResult.code)) {
        console.log("sandbox crashed in checker compilation step");
        console.log(checkerCompilationResult);
        return utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount())
    }

    // checker compilation failed, do something and return
    if(checkerCompilationResult.code == 1){
        let dummy = new Isolate(env, null, compilationResult.log)
        let exitStatus = dummy.getExitStatus()
        let exitCode = dummy.getExitCode()
        let output = compilationResult.stderr

        logger.error("checker compilation failed with error %s (%d):\n%s", exitStatus, exitCode, output)

        return utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount());
    }

    // now run solution against each of the datasets in ladder fashion
    let verdicts = []
    for(let dataset of task.getDatasets()){
        let datasetVerdict = testDataset(env, store, task, lang, dataset)
        verdicts.push(datasetVerdict)

        // if it was not accepted, break here (ladder effect)
        if(datasetVerdict.verdict != "VERDICT_AC")
            break
    }

    // push skip verdict to enforce ladder effect
    verdicts.push(new Verdict(0, "VERDICT_SKIP"))
    return utils.fillUpTo(verdicts, task.getDatasetsCount())
}

/**
 * Test solution against package test cases
 * @param env
 * @param pack
 * @param code
 * @param lang
 */
function testPackage(env, pack, code, lang){
    let store = new Storage();
    store.loadZip(pack);

    let loade = loader.autoDetect(store);
    if(loade === null)
        throw new Error("Package is not loadable");

    let task = new loade(store).load();

    let datasets = task.getDatasets();
    let verdicts = testTask(env, task, store, code, lang);
    
    let res = {};
    for(let i = 0; i < datasets.length; i++){
        res[datasets[i].name] = verdicts[i];
    }

    return res;
}

// testing
if(!module.parent){
    async(function(){
        let env = new JudgeEnvironment()
        let store = new Storage()
        store.loadZip("test/test_contest.zip")

        let loader = new JudeLoader(store)
        let task = loader.load()

        let code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}"
        let slow_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000/2; i++) cerr << 129312 << '\\n'; int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}"
        let tle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000000000LL; i++);}"
        let fake_mle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){vector<int> v(1000000000);}"
        let slow2_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int acc = 0; for(int i = 0; i < 1000000000; i++) acc += i; cout << acc << endl;}"
        //console.log(code)
        // utils.logInspect(testTask(env, task, store, slow_code, "CPP"))

        let java_wacode = `
        public class Main {
            public static void main(String[] args) {
                System.out.println("Hello!");
            }
        }`;

        let java_mlecode = `
        public class Main {
            public static void main(String[] args) {
                long a[] = new long[1024*1024*21];
                for(int i = 0; i < 1024*1024*21; i++) a[i] = i;
                System.out.println("Hello!");
            }
        }`;

        let crazy_code = `import java.io.OutputStream;
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

        let pycode = "print '5'";

        utils.logInspect(testTask(env, task, store, pycode, "Py2"))

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
    })()
}

let availableLanguages = {
    CPP: "C++ 11",
    C: "C 11",
    Java: "Java 8",
    Py2: "Python 2",
    Py3: "Python 3"
};

module.exports = {testTask, testPackage, availableLanguages};
