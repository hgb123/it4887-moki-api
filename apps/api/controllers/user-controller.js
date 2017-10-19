var dependencies = {
    user_service: null
}

var UserController = function (user_service) {
    dependencies.user_service = user_service;
}

UserController.prototype.retrieve_information = function (req, res, next) {
    var retriever_id = req.authen_user ? req.authen_user.id : null;
    dependencies.user_service.retrieve_information(retriever_id, req.params.user_id, function (err, user) {
        if (err) {
            next(err);
        } else {
            res.user = user;
            next();
        }
    });
}

UserController.prototype.update_information = function (req, res, next) {
    req.user_obj.id = req.authen_user.id;
    dependencies.user_service.update_information(req.user_obj, function (err, user_updated) {
        if (err) {
            next(err);
        } else {
            res.user_updated = user_updated;
            next();
        }
    });
}

module.exports = UserController;
