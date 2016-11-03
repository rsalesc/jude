var express = require('express');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var router = express.Router();
var methodOverride = require('method-override');
const restify = require('express-restify-mongoose');

// expose db object globally
require('./db');

var app = express();
var routes = require('./routes/index')
var users = require('./routes/api/index')
const auth = require('./auth');
var models = require('./models');

app.use(express.static(path.join(__dirname, 'public')));

// setup auth method
// configure session
app.use(session({
  secret: 'kitkatz',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: db})
}));

auth(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(multer());
app.use(methodOverride('X-HTTP-Method-Override'));

// setup routes here
app.use('/', routes);

// configure api
function handleApiError(err, req, res, next){
  res.status(400).json({error: err.toString()});
}

router.use(function(req, res, next){
  if(!req.user)
    return handleApiError("not authenticated", req, res);
  if(req.user.contest !== null)
    return handleApiError("inconsistent session", req, res);

  next();
});

restify.serve(router, models.Problem, {name: "problems", runValidators: true});
restify.serve(router, models.User, {name: "users", runValidators: true, findOneAndUpdate: false});
restify.serve(router, models.Submission, {name: "submissions", runValidators: true});
restify.serve(router, models.Contest, {name : "contests", runValidators: true, findOneAndUpdate: false});

app.use(router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
