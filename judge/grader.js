/**
 * Created by rsalesc on 24/06/16.
 */

var Promise =  require('bluebird')
var async = require('asyncawait/async')
var await = require('asyncawait/await')

var utils = require('./utils')
var logger = require('./logger')
var sandbox = require('./sandbox')
var sleep = require('sleep').sleep
var environment = require('./environment')

var Isolate = sandbox.Isolate
var IsolateConst = sandbox.IsolateConst
var Storage = require('./storage').MemoryStorage
var JudgeEnvironment = environment.JudgeEnvironment
var JudgeConfig = environment.JudgeConfig
var JudeLoader = require('./loader').JudeLoader

function evaluate(iso, store, command, input, output="output", error="error"){
    if(input)
        iso.stdin = input
    iso.stdout = output
    iso.stderr = error

    let res = iso.execute(command)
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
    }
}

const VerdictConst = {
    VERDICT_INQ: "in queue",
    VERDICT_SKIP: "skipped",

    VERDICT_WA: "wrong answer",
    VERDICT_RTE: "runtime error",
    VERDICT_MLE: "memory limit exceeded",
    VERDICT_TLE: "time limit exceeded",
    VERDICT_WTE: "walltime limit exceeded",

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
        this.verdict = VerdictConst.hasOwnProperty(verdict) ? VerdictConst[verdict] : verdict
        this.passed = passed
        if(typeof info === 'string' || info instanceof String)
            info = {text: info}
        this.info = info
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


/* Path constants to be used in the grading steps */
const SOURCE_PATH = "_/sol"
const SOURCE_EXEC_PATH = "_/sol_exec"
const CHECKER_PATH = "_/checker"
const CHECKER_EXEC_PATH = "_/checker_exec"

/*
*   Compile the solution
*   @param {JudgeEnvironment}
*   @param {Storage}
*   @param {string} solution language
*   @param {string} path of the solution code in the storage
*   @param {string} path of the resulting executable file in the storage
*   @retuns {Object} compilation output/verdict (Isolate.execute() result + Isolate.getLog() result)
 */
function compilationStep(env, store, lang, sol=SOURCE_PATH, solExec=SOURCE_EXEC_PATH){
    // init sandbox used during the compilation process
    // compiles
    let iso = new Isolate(env, store)
    try {
        iso.init()
        let result = Compilation[lang](iso, store, sol, solExec)

        // get log
        result.log = iso.getLog()

        // cleanup
        iso.cleanup()

        return result
    }catch(e){
        logger.error("compilation step failed - %s", e.toString())
        try{
            iso.cleanup()
        }catch(e){}

        return {code: 2}
    }
}

/*
*   Promisified testCase
 */
function testCaseAsync(env, store, task, lang, dataset, testcase){
    return new Promise(function(resolve, reject){
        async(function() {
            logger.debug(`running on testcase ${testcase.in}`)
            let timelimit = task.getTimelimit()     // to seconds
            let memorylimit = task.getMemorylimit() * 1024   // to mb

            let iso = new Isolate(env, store)
            let evaluationResult = {}
            let checkingResult = {}
            let execTime = undefined
            let exitWith = function (verdict) {
                try {
                    iso.cleanup()
                } catch(e){
                    logger.warn("isolate box could not be cleared properly")
                }
                resolve(verdict)
                return
            }

            // grading step
            try {
                iso.init()

                evaluationResult = Evaluation[lang](iso, store, SOURCE_EXEC_PATH,
                    testcase.in, timelimit, timelimit * JudgeConfig.WT_MULTIPLIER, memorylimit)
                evaluationResult.log = iso.getLog()

                // sandbox crashed
                if (!Isolate.translateBoxExitCode(evaluationResult.code))
                    return exitWith(new Verdict(0, "VERDICT_JE"))

                let dummy = new Isolate(env, store, evaluationResult.log)
                execTime = dummy.getRunningTime()

                // execution failed, do something and return
                if (evaluationResult.code == 1) {
                    let exitStatus = dummy.getExitStatus()
                    let exitCode = dummy.getExitCode()
                    //let output = evaluationResult.output

                    if (exitStatus == IsolateConst.EXIT_TIMEOUT)
                        return exitWith(new Verdict(0, "VERDICT_TLE"))
                    else if (exitStatus == IsolateConst.EXIT_TIMEOUT_WALL)
                        return exitWith(new Verdict(0, "VERDICT_WTE"))

                    // TODO: add sandbox information about RTE
                    return exitWith(new Verdict(0, "VERDICT_RTE", -1, {text: `exited with code ${exitCode}`,
                                                                        time: execTime}))
                }
            } catch (e) {
                logger.error("execution step failed - %s", e.toString())
                return exitWith(new Verdict(0, "VERDICT_JE"))
            }

            try {
                // recreate file to avoid input modification when checking
                iso.createFileFromStorage("input", testcase.in)
                iso.createFileFromStorage("answer", testcase.out)

                checkingResult = Checking[task.getCheckerLanguage()](iso, store,
                    CHECKER_EXEC_PATH)
                checkingResult.log = iso.getLog()

                if (!Isolate.translateBoxExitCode(checkingResult.code))
                    return exitWith(new Verdict(0, "VERDICT_JE"))

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
        })()
    })
}

/*
*   Test to-be-executed solution against testcases of the given dataset
*   Files expected to be created beforehand are: _/checker_exec, _/sol_exec
*   @param {JudgeEnvironment}
*   @param {Storage}
*   @param {Task}   task
*   @param {string} language of the to-be-executed solution
*   @param {Object} dataset
 */
function testDataset(env, store, task, lang, dataset){
    let execTime = 0
    try {
        let n = dataset.testcases.length
        for (let i = 0; i < n; i += JudgeConfig.MAX_SIMUL_TESTS) {
            let cases = []
            for(let j = 0; j < JudgeConfig.MAX_SIMUL_TESTS && i+j < n; j++)
                cases.push(testCaseAsync(env, store, task, lang,
                    dataset, dataset.testcases[i+j]))

            let res = await(cases)
            for(let j = 0; j < JudgeConfig.MAX_SIMUL_TESTS && i+j < n; j++){
                let caseResult = res[j]
                if(caseResult.info.hasOwnProperty("time") && caseResult.info.time !== undefined)
                    execTime = Math.max(execTime, caseResult.info.time)

                if(caseResult.verdict != VerdictConst["VERDICT_AC"]){
                    caseResult.passed = i+j
                    caseResult.info.time = execTime
                    return caseResult
                }
            }
        }
    } catch (e){
        logger.error("dataset test failed - %s", e.toString())
        return new Verdict(0, "VERDICT_JE")
    }

    return new Verdict(1, "VERDICT_AC", dataset.testcases.length, {time: execTime})
}

/*
*   Test code against testcases of the given task, in the given language.
*   Created files in storage are: _/checker_exec, _/sol_exec
*
*   @param {JudgeEnvironment}
*   @param {Task}
*   @param {string} the submitted code
*   @param {string} language of the submitted code
*   @returns {Verdict} evalution output/verdict
 */
function testTask(env, task, code, lang){
    let store = new Storage()

    // load task into the storage
    store.load(task.getDirectory())

    // create solution source in the storage
    store.createFileFromContent(SOURCE_PATH, code)

    // compile solution
    let compilationResult = compilationStep(env, store, lang)

    // sandbox crashed
    if(!Isolate.translateBoxExitCode(compilationResult.code))
        return utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount())

    // compilation failed
    if(compilationResult.code == 1){
        let dummy = new Isolate(env, null, compilationResult.log)
        let exitStatus = dummy.getExitStatus()
        let output = compilationResult.stderr

        if(exitStatus == IsolateConst.EXIT_TIMEOUT || exitStatus == IsolateConst.EXIT_TIMEOUT_WALL)
            return utils.fillUpTo([new Verdict(0, "VERDICT_CTE")], task.getDatasetsCount())

        return utils.fillUpTo([new Verdict(0, "VERDICT_CE", -1, output)], task.getDatasetsCount())
    }

    // compile checker
    let checkerCompilationResult =
        compilationStep(env, store, task.getCheckerLanguage(), task.getChecker(), CHECKER_EXEC_PATH)

    // sandbox crashed
    if(!Isolate.translateBoxExitCode(checkerCompilationResult.code))
        return utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount())

    // checker compilation failed, do something and return
    if(checkerCompilationResult.code == 1){
        let dummy = new Isolate(env, null, compilationResult.log)
        let exitStatus = dummy.getExitStatus()
        let exitCode = dummy.getExitCode()
        let output = compilationResult.stderr

        logger.error("checker compilation failed with error %s (%d):\n%s", exitStatus, exitCode, output)

        return utils.fillUpTo([new Verdict(0, "VERDICT_JE")], task.getDatasetsCount())
    }

    // now run solution against each of the datasets in ladder fashion
    let verdicts = []
    for(let dataset of task.getDatasets()){
        let datasetVerdict = testDataset(env, store, task, lang, dataset)
        verdicts.push(datasetVerdict)

        // if it was not accepted, break here (ladder effect)
        if(datasetVerdict.verdict != VerdictConst["VERDICT_AC"])
            break
    }

    // push skip verdict to enforce ladder effect
    verdicts.push(new Verdict(0, "VERDICT_SKIP"))
    return utils.fillUpTo(verdicts, task.getDatasetsCount())
}

// testing
if(!module.parent){
    async(function(){
        let env = new JudgeEnvironment()
        let loader = new JudeLoader("test_contest/")
        let task = loader.load()
        let code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}"
        let slow_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000/2; i++) cerr << 129312 << '\\n'; int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}"
        let tle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000000000LL; i++);}"
        let fake_mle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){vector<int> v(1000000000);}"
        let slow2_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int acc = 0; for(int i = 0; i < 1000000000; i++) acc += i; cout << acc << endl;}"
        //console.log(code)
        utils.logInspect(testTask(env, task, slow2_code, "CPP"))

        // var sleep = require('sleep').sleep
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
