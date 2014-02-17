var _ = require('lodash');

var AuthController = function AuthController(passport) {
    _.bindAll(this);
    this.passport = passport;
};

AuthController.prototype.index = function(req, res) {
    res.render('auth/login');
};

AuthController.prototype.login = function(req, res, next) {
    var self = this;

    this.passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);

        if (!user) {
            req.flash('errors', { msg: info.message });
            return res.redirect('/login');
        }

        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
}

AuthController.prototype.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}

module.exports = AuthController;