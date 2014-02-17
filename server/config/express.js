var AuthenticationMiddleware = require('../middleware/PassportMiddleware'),
    express = require('express'),
    path = require('path');

module.exports = function(app) {
    app.configure(function() {
        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(__dirname+'/../', 'views'));
        app.set('view engine', 'jade');

        app.use(express.compress());
        app.use(express.favicon());
        app.use(express.cookieParser());
        app.use(express.session({ secret: config.sessionSecret }));
        app.use(flash());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.static('public/', { maxAge: 'week' }));
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(AuthenticationMiddleware({ ignoreRoutes:['/login', '/logout'] }));
    });

    app.configure('development', function() {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        app.locals.pretty = true;

    });

    app.configure('production', function() {
        app.use(express.errorHandler());
    });
}