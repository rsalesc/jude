/**
 * Created by rsalesc on 24/06/16.
 */

var async = require('asyncawait/async')
var await = require('asyncawait/await')

var sandbox = require('./sandbox')
var Isolate = sandbox.Isolate
var IsolateConst = sandbox.IsolateConst
var Storage = require('./storage').MemoryStorage
var JudgeEnvironment = require('./environment').JudgeEnvironment

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

        evaluate(iso, store, ["./eval"], input, output, error)
        iso.removeFile("eval")
        iso.removeFile(input)
    }
}
Evaluation["C"] = Evaluation["CPP"]

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
        iso.timelimit = 20
        iso.wallclockLimit = 20

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
        iso.removeFile("output")
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
        iso.timelimit = 20
        iso.wallclockLimit = 20

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

/*
*   Compile the solution
*   @param {JudgeEnvironment}
*   @param {Storage}
*   @param {string} solution language
*   @param {string} path of the solution code in the storage
*   @param {string} path of the resulting executable file in the storage
*   @retuns {Object} compilation output/verdict (Isolate.execute() result)
 */
function compilationStep(env, store, lang, sol="_/sol", solExec="_/sol_exec"){
    // init sandbox used during the compilation process
    let iso = new Isolate(env, store)
    iso.init()

    // compiles
    let result = Compilation[lang](iso, store, sol, solExec)

    // cleanup
    iso.cleanup()

    return result
}

/*
*   Test code against testcases of the given task, in the given language.
*   Created files in storage are: _/checker_exec, _/sol_exec
*
*   @param {JudgeEnvironment}
*   @param {Task}
*   @param {string} the submitted code
*   @param {string} language of the submitted code
*   @returns {Object} evalution output/verdict
 */
function testTask(env, task, code, lang){
    let store = new Storage()

    // load task into the storage
    store.load(task.getDirectory())

    // create solution source in the storage
    store.createFileFromContent("_/sol", code)

    // compile solution
    let compilationResult = compilationStep(env, store, lang)

    // compilation failed, do something and return
    if(!Isolate.translateBoxExitCode(compilationResult.code)){
        return
    }

    // compile checker
    let checkerCompilationResult =
        compilationStep(env, store, task.getCheckerLanguage(), task.getChecker(), "_/checker_exec")

    // checker compilation failed, do something and return
    if(!Isolate.translateBoxExitCode(checkerCompilationResult.code)){
        return
    }

    // now run solution against each of the datasets in ladder fashion
}


if(!module.parent){
    async(function(){
        var sleep = require('sleep').sleep

        let env = new JudgeEnvironment()
        let store = new Storage()
        store.load("test_contest/")

        let iso = new Isolate(env, store)
        iso.init()

        Compilation.CPP(iso, store, "checker.cpp", "_/checker")
        console.log(iso.getLog())
        Compilation.CPP(iso, store, "sol.cpp", "_/sol")
        console.log(iso.getLog())

        iso.cleanup()

        iso = new Isolate(env, store)
        iso.init()

        Evaluation.CPP(iso, store, "_/sol", "tests/set1/3.in")
        
        iso.createFileFromStorage("input", "tests/set1/3.in")
        iso.createFileFromStorage("answer", "tests/set1/3.out")
        iso.createFileFromStorage("checker", "_/checker", true)

        console.log(evaluate(iso, store, [
            "./checker", "input", "output", "answer"
        ], null, "checker_output", "checker_error"))

        console.log(iso.getLog())
        console.log(iso.getFileToString("checker_output"))

        //sleep(10)

        iso.cleanup()
    })()
}
