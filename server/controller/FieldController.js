var _ = require('lodash'),
    Field = require('../models/Field.js'),
    validator = require('validator');

var FieldController = function FieldController() {
    _.bindAll(this);
};

FieldController.prototype.index = function(req, res) {
    var page = req.query.id || 0;
    var pagesize = 10;

    Field.find().sort({ 'name': 'asc' }).paginate(page, pagesize, function(err, fields, pageCount){
                    res.render('field/index', {
                        fields: fields
                        , page: page
                        , pages: pageCount / pagesize
                    })
                });
};

FieldController.prototype.delete = function(req, res) {
    if (!req.query.id || req.query.id == "") return res.send(404);

    Field.findById(req.query.id, function(err, field) {
        if (err || !field) return res.send(404);
        field.remove();

        req.flash('success', { msg: "Removed Field '"+field.name+"' successfully" });
        res.redirect('/field');
    });
}

FieldController.prototype.create = function(req, res) {
    res.render('field/create', {field: new Field()});
}

FieldController.prototype.edit = function(req, res) {
    if (!req.query.id || req.query.id == "") return res.send(404);

    Field.findById(req.query.id, function(err, field) {
        if (err || !field) return res.send(404);

        res.render('field/edit', {field: field});
    });
}

FieldController.prototype.save = function(req, res) {

    var values = {
        name: req.body.name,
        type: req.body.type,
        readOnly: req.body.readonly
    }

    if (!req.query.id || req.query.id == "") {
        var field = new Field(values);
        field.save();

        req.flash('success', {msg: "Field saved successfully"});
        res.redirect('/field');
    }
    else {
        Field.findOneAndUpdate({"_id": req.query.id}, values, function(err, field) {
            if (!field) return res.send(404);

            req.flash('success', {msg: "Field saved successfully"});
            res.redirect('/field');
        });
    }
}

module.exports = FieldController;