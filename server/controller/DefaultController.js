var DefaultController = function DefaultController() {

};

DefaultController.prototype.index = function(req, res) {
    res.render('default/index');
};

module.exports = DefaultController;