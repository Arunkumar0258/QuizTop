const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err,user);
        })
    })


passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},  function(req, username, password, done) {
            User.findOne({username: username}, function(err,user) {
                if(err) return done(err);
                if(!user)
                    return done(null, false, req.flash('message', 'User does not exist'))

                // if(!user.comparePassword(password))
                //     return done(null, false, req.flash('message', 'Incorrect password'));

                return done(null, user);
            })
        }
))
}
