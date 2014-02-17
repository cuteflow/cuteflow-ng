var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var workflowSchema = new mongoose.Schema({
    name: String
});

workflowSchema.plugin(timestamps);
module.exports = mongoose.model('Field', workflowSchema);