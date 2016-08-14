const http = require('http')
const fs = require('fs')

let req = http.request("http://localhost:9333/dir/assign", (err) => {
    if(err) console.log(err)
})

let writeStream = fs.createWriteStream("testezinho")

req.on("error", (err) => {
    writeStream.emit("error", err)
})

writeStream.on("error", (err) => {
    console.log(err)
})

req.end()