var _ = require('lodash'),
    User = require('../models/User.js'),
    validator = require('validator');

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

UserController.prototype.delete = function(req, res) {
    if (!req.query.id || req.query.id == "") return res.send(404);

    User.findById(req.query.id, function(err, user) {
        if (err || !user) return res.send(404);
        user.remove();

        req.flash('success', { msg: "Removed User '"+user.username+"' successfully" });
        res.redirect('/user');
    });
}

UserController.prototype.create = function(req, res) {
    res.render('user/create', {user: new User()});
}

UserController.prototype.edit = function(req, res) {
    if (!req.query.id || req.query.id == "") return res.send(404);

    User.findById(req.query.id, function(err, user) {
        if (err || !user) return res.send(404);

        res.render('user/edit', {user: user});
    });
}

UserController.prototype.save = function(req, res) {

    var values = {
        username: req.body.username,
        password: req.body.password,
        profile: {
            'firstName': req.body.firstname,
            'lastName': req.body.lastname
        }
    }

    if (!req.query.id || req.query.id == "") {
        var user = new User(values);
        user.save();

        req.flash('success', {msg: "User saved successfully"});
        res.redirect('/user');
    }
    else {
        User.findOneAndUpdate({"_id": req.query.id}, values, function(err, user) {
            if (!user) return res.send(404);

            req.flash('success', {msg: "User saved successfully"});
            res.redirect('/user');
        });
    }
}

module.exports = UserController;