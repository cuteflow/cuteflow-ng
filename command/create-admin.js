var prompt = require('prompt');
var User = require('../server/models/User');
var mongoose = require('mongoose');
var config = require('../server/config/config');

mongoose.connect(config.mongodb.uri);

prompt.start();

var schema = {
    properties: {
        username: {
            pattern: /^[a-zA-Z\-]+$/,
            message: 'Username must be only letters or dashes',
            required: true
        },
        password: {
            hidden: true
        }
    }
};

prompt.get(schema, function (err, result) {

    var user = new User();
    user.username = result.username;
    user.password = result.password;

    user.save(function (err) {
        if (err) {
            console.log('meow');
        }
    });

    console.log("✔ Admin user created. Please press Ctrl+C".green);
});