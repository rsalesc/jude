var express = require('express');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require("connect-flash");
var router = express.Router();
// var methodOverride = require('method-override');
const restify = require('express-restify-mongoose');
const apiRoutes = require(path.join(__dirname, "routes/api"));

// expose db object globally
require('./db');

var app = express();
var routes = require('./routes/index')
const auth = require('./auth');
const auth2 = require('./auth2');
var models = require('./models');

app.use(express.static(path.join(__dirname, 'public')));

// setup auth method
// configure session
app.use(session({
  secret: 'truesecretmofos',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: db})
}));

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
app.use(flash());
// app.use(methodOverride('X-HTTP-Method-Override'));

// setup cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "X-Total-Count");
  if(req.method == "OPTIONS")
    return res.sendStatus(200);
  next();
});

// configure api auth
app.use(auth2.initialize({
  db: db,
  usernameField: "handle",
  usernameSchema: "handle",
  model: models.User,
  roleFn: (user) => {
    let roles = [];
    if(user.role) roles.push(user.role);
    if(!user.contest) roles.push("root");
    return roles;
  },
  passwordFn: (user, req) => user.matchPasswords(req.getPassword()),
  requiredFieldsFn: (model, req) => {
    return req.getUsername() && req.getPassword() &&
      (!req.body.contest || mongoose.Types.ObjectId.isValid(req.body.contest));
  },
  filterFn: (model, req) => {
    const { opts } = req.auth2;
    let qs = {};
    qs[opts.usernameSchema] = req.getUsername();
    qs["contest"] = req.body.contest || null;
    return qs;
  }
}));

// setup routes here
app.use('/', routes);

const restifyShared = {
  runValidators: true,
  totalCountHeader: true,
  findOneAndRemove: false,
  preMiddleware: (req, res, next) => {
    auth2.isAuth("root")(req, res, next);
    if(req.body.id)
      req.body._id = req.body.id;
    if(req.params.id)
      req.params._id = req.params.id;
    if(req.query.id)
      req.query._id = req.query.id;
    if(req.query.query && req.query.query.id)
      req.query.query._id = req.query.query.id;

    /*if(req.query) {
      for(let prop in req.query) {
        if(req.query.hasOwnProperty(prop)) {
          try {
            req.query[prop] = JSON.parse(req.query[prop]);
          } catch(ex) {}
        }
      }
    }*/
    
    /*if(req.query.query) {
        for(let prop in req.query.query) {
          if(req.query.query.hasOwnProperty(prop)
            && mongoose.Types.ObjectId.isValid(req.query.query[prop]))
              req.query.query[prop] = new mongoose.Types.ObjectId(req.query.query[prop]);
        }
    }*/

    console.log(req.query);

    next();
  },
  outputFn: (req, res, next) => {
    let result = req.erm.result;
    const statusCode = req.erm.statusCode;

    const fixEntry = entry => {  
      if(entry && entry._id)
        return Object.assign({}, entry, { id: entry._id });
      else
        return entry;
    };
    
    if(Array.isArray(result)) {
      res.status(statusCode).json(result.map(fixEntry));
    } else {
      res.status(statusCode).json(fixEntry(result));
    }
  }
};

restify.serve(router, models.Problem, Object.assign({}, { name: "problems" }, restifyShared));
restify.serve(router, models.User, Object.assign({}, { name: "users", findOneAndUpdate: false }, restifyShared));
restify.serve(router, models.Submission, Object.assign({}, { name: "submissions" }, restifyShared));
restify.serve(router, models.Contest, Object.assign({}, { name : "contests", findOneAndUpdate: false }, restifyShared));

// extra api routes
router.use("/api/v1", apiRoutes);

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
