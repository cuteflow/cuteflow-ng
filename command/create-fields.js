var Field = require('../server/models/Field');
var mongoose = require('mongoose');
var config = require('../server/config/config');

mongoose.connect(config.mongodb.uri);

var field = new Field();
field.name = "Bestelltext";
field.type = "text";

field.save(function (err) {
    if (err) {
        console.log('meow');
    }
});

field = new Field();
field.name = "Preis";
field.type = "checkbox";

field.save(function (err) {
    console.log("✔ Fields created. Please press Ctrl+C".green);
});