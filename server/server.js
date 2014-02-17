var express = require('express');
    flash = require('express-flash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('./config/config');

mongoose.connect(config.mongodb.uri);
require('mongoose-pager')(mongoose);
require('./config/passport')(passport);

// Configure express
var app = express();
require('./config/express')(app);

// Routes
require('./config/routes')(app);

// Start Server
app.listen(app.get('port'), function() {
    console.log("✔ CuteFlow server listening on port %d in %s mode", app.get('port'), app.settings.env);
    console.log("-> Open in Browser with http://localhost:%d", app.get('port'));
});