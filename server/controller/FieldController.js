var _ = require('lodash'),
    Field = require('../models/Field.js'),
    i18n = require('i18next');

var FieldController = function FieldController() {
    _.bindAll(this);
};

FieldController.prototype.index = function(req, res) {
    var page = req.query.id || 0;
    var pagesize = 10;

    Field.find().sort({ 'name': 'asc' }).paginate(page, pagesize, function(err, fields, pageCount){
                    res.render('field/index', {
                        fields: fields,
                        page: page,
                        pages: pageCount / pagesize
                    })
                });
};

FieldController.prototype.delete = function(req, res, next) {
    if (!req.query.id || req.query.id == "") return next();

    Field.findById(req.query.id, function(err, field) {
        if (err || !field) return next();
        field.remove();

        req.flash('success', { msg: i18n.t("fields.remove.success", field.name) });
        res.redirect('/field');
    });
}

FieldController.prototype.create = function(req, res) {
    res.render('field/create', {field: new Field()});
}

FieldController.prototype.edit = function(req, res, next) {
    if (!req.query.id || req.query.id == "") return next();

    Field.findById(req.query.id, function(err, field) {
        if (err || !field) return next();

        res.render('field/edit', {field: field});
    });
}

FieldController.prototype.save = function(req, res, next) {
    req.assert('fieldname', i18n.t('field.save.validation.name'));

    var values = {
        name: req.body.fieldname,
        type: req.body.type,
        readOnly: req.body.readonly
    }

    var errors = req.validationErrors(true);
    if (!errors) {
        if (!req.query.id || req.query.id == "") {
            var field = new Field(values);
            field.save();

            req.flash('success', {msg: i18n.t("fields.save.success")});
            res.redirect('/field');
        }
        else {
            Field.findOneAndUpdate({"_id": req.query.id}, values, function(err, field) {
                if (!field) return next();

                req.flash('success', {msg: i18n.t("fields.save.success")});
                res.redirect('/field');
            });
        }
    }
    else {
        var field = new Field(values);
        var template = (!req.query.id || req.query.id == "") ? "field/create" : "field/edit";
        res.render(template, {field: field, errors: errors});
    }
}

module.exports = FieldController;