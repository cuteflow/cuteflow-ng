var DashboardController = function DashboardController() {

};

DashboardController.prototype.index = function(req, res) {
    res.render('dashboard/index');
};

module.exports = DashboardController;