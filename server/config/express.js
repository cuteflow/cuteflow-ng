var AuthenticationMiddleware = require('../middleware/PassportMiddleware'),
    express = require('express'),
    path = require('path'),
    i18n = require("i18next"),
    helpers = require('../helpers/viewhelpers'),
    expressValidator = require('express-validator');

module.exports = function(app) {
    i18n.init({ lng: "en",
        resGetPath: 'server/locales/__lng__/__ns__.json',
        debug: true,
        fallbackLng: 'en'
    });

    app.configure(function() {
        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(__dirname+'/../', 'views'));
        app.set('view engine', 'jade');

        app.use(express.compress({
            filter: function (req, res) {
                return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
            },
            level: 9
        }));

        app.use(express.favicon(path.join(__dirname, '../../public/favicon.ico')));
        app.use(express.cookieParser());
        app.use(helpers());
        app.use(i18n.handle);
        app.use(express.session({ secret: config.sessionSecret }));
        app.use(flash());
        app.use(express.bodyParser());
        app.use(expressValidator({}));
        app.use(express.methodOverride());
        app.use(express.static('public/', { maxAge: 'week' }));
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(AuthenticationMiddleware({ ignoreRoutes:['/login', '/logout'] }));
        app.use(app.router);

        app.use(function(req, res, next){
            console.log("404", req.originalUrl);
            return res.status(404).render('404', { url: req.originalUrl, error: 'Not found' })
        });

        app.use(function(err, req, res, next){
            res.status(500).render('500', { error: err.stack })
        })
    });

    app.configure('development', function() {
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        app.locals.pretty = true;

    });

    app.configure('production', function() {
        app.use(express.errorHandler());
    });

    i18n.registerAppHelper(app);
}