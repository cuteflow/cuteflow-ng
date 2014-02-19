var _ = require('lodash'),
    User = require('../models/User.js'),
    i18n = require('i18next');

var UserController = function UserController() {
    _.bindAll(this);
};

UserController.prototype.index = function(req, res) {
    var page = req.query.id || 0;
    var pagesize = 10;

    User.find().sort({ 'username': 'asc' }).paginate(page, pagesize, function(err, users, pageCount){
                    res.render('user/index', {
                        users: users
                        , page: page
                        , pages: pageCount / pagesize
                    })
                });
};

UserController.prototype.delete = function(req, res, next) {
    if (!req.query.id || req.query.id == "") return next();

    User.findById(req.query.id, function(err, user) {
        if (err || !user) return next();
        user.remove();

        req.flash('success', { msg: i18n.t("fields.remove.success", user.username) });
        res.redirect('/user');
    });
}

UserController.prototype.create = function(req, res) {
    res.render('user/create', {user: new User(), password: "", errors: {}});
}

UserController.prototype.edit = function(req, res, next) {
    if (!req.query.id || req.query.id == "") return next();

    User.findById(req.query.id, function(err, user) {
        if (err || !user) return next();

        res.render('user/edit', {user: user, password: "cfpwd-hasnotchanged-$§!", errors: {}});
    });
}

UserController.prototype.save = function(req, res, next) {

    req.assert('password', i18n.t('user.save.validation.password')).len(6,20);
    req.assert('email', i18n.t('user.save.validation.email')).isEmail();
    req.assert('username', i18n.t('user.save.validation.username')).notEmpty();
    req.assert('firstname', i18n.t('user.save.validation.firstname')).notEmpty();
    req.assert('lastname', i18n.t('user.save.validation.lastname')).notEmpty();

    var values = {
        username: req.body.username,
        email: req.body.email,
        profile: {
            'firstName': req.body.firstname,
            'lastName': req.body.lastname
        }
    }

    var errors = req.validationErrors(true);
    if (!errors) {
        if (req.body.password != "cfpwd-hasnotchanged-$§!") {
            values.password = req.body.password;
        }

        if (!req.query.id || req.query.id == "") {
            var user = new User(values);
            user.save();

            req.flash('success', {msg: i18n.t("user.save.success")});
            res.redirect('/user');
        }
        else {
            User.findOneAndUpdate({"_id": req.query.id}, values, function(err, user) {
                if (!user) return next();

                req.flash('success', {msg: i18n.t("user.save.success")});
                res.redirect('/user');
            });
        }
    }
    else {
        var user = new User(values);

        var template = (!req.query.id || req.query.id == "") ? "user/create" : "user/edit";
        var password = (!req.query.id || req.query.id == "") ? "" : "cfpwd-hasnotchanged-$§!";

        res.render(template, {user: user, password: password, errors: errors});
    }
}

module.exports = UserController;