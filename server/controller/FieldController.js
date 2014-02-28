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

    var configuration = {}
    switch(req.body.type) {
        case 'text': configuration = this._extractTypeTextConfig(req); break;
        case 'textarea': configuration = this._extractTypeTextareaConfig(req); break;
        case 'number': configuration = this._extractTypeNumberConfig(req); break;
        case 'file': configuration = this._extractTypeFileConfig(req); break;
        case 'checkbox': configuration = this._extractTypeCheckboxConfig(req); break;
        case 'date': configuration = this._extractTypeDateConfig(req); break;
    }

    console.log(configuration);

    var values = {
        name: req.body.fieldname,
        type: req.body.type,
        readOnly: req.body.readonly,

        configuration: configuration
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

FieldController.prototype._extractTypeTextConfig = function(req) {
    return {
        default: req.body.text_default,
        validationRegexp: req.body.text_validation
    };
}

FieldController.prototype._extractTypeTextareaConfig = function(req) {
    return {
        default: req.body.textarea_default
    };
}

FieldController.prototype._extractTypeFileConfig = function(req) {
    return {
        validationRegexp: req.body.file_validation
    };
}

FieldController.prototype._extractTypeCheckboxConfig = function(req) {
    console.log("req", req.body);
    return {
        default: req.body.checkbox_default
    };
}

FieldController.prototype._extractTypeNumberConfig = function(req) {
    return {
        default: req.body.number_default,
        validationRegexp: req.body.number_validation
    };
}

FieldController.prototype._extractTypeDateConfig = function(req) {
    return {
        default: req.body.date_default,
        dateFormat: req.body.date_format,
        validationRegexp: req.body.date_validation
    };
}

module.exports = FieldController;