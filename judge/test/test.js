const async = require('asyncawait/async');
const await = require('asyncawait/await');
const mongodb = require('mongodb');
const environment = require('./../environment');
const db = require('../../db')
var mongodbQueue = require('mongodb-queue')

const JudgeEnvironment = environment.JudgeEnvironment;
const JudgeConfig = environment.JudgeConfig;

// 7,01028d1821

if(!module.parent){
    let code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}"
    let slow_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000/2; i++) cerr << 129312 << '\\n'; int x, y; cin >> x >> y; cout << x+y << ' ' << x*y << endl;}"
    let tle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){for(int i = 0; i < 1000000000000LL; i++);}"
    let fake_mle_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){vector<int> v(1000000000);}"
    let slow2_code = "\#include \<bits/stdc++.h>\nusing namespace std;\nint main(){int acc = 0; for(int i = 0; i < 1000000000; i++) acc += i; cout << acc << endl;}"

    let queue = mongodbQueue(db, "jude-queue")
    queue.add({id: "oloko", fid: "7,01028d1821", code: code, lang: "CPP"}, (err) => {
        if(err)
            console.log("[test] error adding to queue")
    })

    queue.add({id: "oloko", fid: "7,01028d1821", code: slow_code, lang: "CPP"}, (err) => {
        if(err)
            console.log("[test] error adding to queue")
    })

    queue.add({id: "oloko", fid: "7,01028d1821", code: tle_code, lang: "CPP"}, (err) => {
        if(err)
            console.log("[test] error adding to queue")
    })

    queue.add({id: "oloko", fid: "7,01028d1821", code: fake_mle_code, lang: "CPP"}, (err) => {
        if(err)
            console.log("[test] error adding to queue")
    })

    queue.add({id: "oloko", fid: "7,01028d1821", code: slow2_code, lang: "CPP"}, (err) => {
        if(err)
            console.log("[test] error adding to queue")
    })
    
}