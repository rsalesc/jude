const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const flash = require('connect-flash');
const mongoose = require('mongoose');
var models = require('./models');
var User = models.User;

module.exports = function(app){

    // Configure passport middleware
    app.use(passport.initialize());
    app.use(flash());
    app.use(passport.session());

    // CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
    passport.use('custom', new CustomStrategy((req, done) => {
        if(!req.body.handle || !req.body.password ||
          (req.body.contest && !mongoose.Types.ObjectId.isValid(req.body.contest)))
            return done(null, false, req.flash('error', 'Provided parameters are not valid'));

        User.findOne({
            'handle': req.body.handle,
            'contest': req.body.contest || null
        }, (err, user) => {
            if(err)
                return done(err, false, req.flash('error', 'There was an error while processing your request'));
            if(!user || !user.matchPasswords(req.body.password))
                return done(err, false, req.flash('error', 'Invalid credentials'));
            done(null, user);
        });
    }));

    passport.serializeUser(function(user, done){
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id, (err, user) => {
           done(err, user);
        });
    });
}