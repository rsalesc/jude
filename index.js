var app = require('./app')
var port = process.env.PORT || 3001

app.listen(port, () => {
  console.log(`application is listening in port ${port}!`)
});