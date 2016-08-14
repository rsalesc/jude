const storage = require('../storage')
const async = require('asyncawait/async')
const await = require('asyncawait/await')
const wildcard = require('node-wildcard')
const loader = require('../loader')

if(!module.parent)
    async(() => {
        var store = new storage.MemoryStorage()
        store.loadZip("test_contest.zip")
        var DetectedLoader = loader.autoDetect(store)
        var Loader = new DetectedLoader(store)
        console.log(Loader.load())
    })()