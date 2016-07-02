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

        if(!iso.translateBoxExitCode(res.code)) throw res.message
        if(res.code == 0 && execPath) {
            iso.getFileToStorage("a.out", execPath)
            iso.removeFile("a.out")
        }

        res.stdout = iso.getFileToString("output")
        iso.removeFile("output")
        return res
    },
    "C" : function(iso, store, file, execPath){
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

        if(!iso.translateBoxExitCode(res.code)) throw res.message
        if(res.code == 0 && execPath) {
            iso.getFileToStorage("a.out", execPath)
            iso.removeFile("a.out")
        }

        res.stdout = iso.getFileToString("output")
        iso.removeFile("output")
        return res
    }
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
