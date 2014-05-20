var LocalStrategy = require('passport-local').Strategy,
    User = require('../models/User');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            User.findOne({ username: username }, function(err, user) {
                if (!user) return done(null, false, { message: 'Invalid username or password.' });

                user.comparePassword(password, function(err, isMatch) {
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid username or password.' });
                    }
                });
            });
        })
    );
};
