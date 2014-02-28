var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var fieldSchema = new mongoose.Schema({
    name: String,
    type: String,
    readOnly: Boolean,

    configuration: Object
});

fieldSchema.plugin(timestamps);
module.exports = mongoose.model('Field', fieldSchema);