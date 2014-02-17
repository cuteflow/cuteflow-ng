var _ = require('lodash');

module.exports = function(opts) {

    var _ignoreRoutes = opts.ignoreRoutes || [];

    return function (req, res, next) {
        if (_.some(_ignoreRoutes, function(route) { return req.url.match(route); })) { return next(); }

        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login');
    };
};