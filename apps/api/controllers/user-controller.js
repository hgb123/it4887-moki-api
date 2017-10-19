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

UserController.prototype.retrieve_followers = function (req, res, next) {
    var retriever_id = req.authen_user ? req.authen_user.id : null;
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;
    var is_getting_followers = true;
    dependencies.user_service.retrieve_follow(is_getting_followers, retriever_id, req.params.user_id, page, limit, function (err, users) {
        if (err) {
            next(err);
        } else {
            res.users = users;
            next();
        }
    });
}

UserController.prototype.retrieve_following = function (req, res, next) {
    var retriever_id = req.authen_user ? req.authen_user.id : null;
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;
    var is_getting_followers = false;
    dependencies.user_service.retrieve_follow(is_getting_followers, retriever_id, req.params.user_id, page, limit, function (err, users) {
        if (err) {
            next(err);
        } else {
            res.users = users;
            next();
        }
    });
}

UserController.prototype.follow = function (req, res, next) {
    dependencies.user_service.follow(req.authen_user.id, req.params.user_id, function (err, user_followed) {
        if (err) {
            next(err);
        } else {
            res.user_followed = user_followed;
            next();
        }
    });
}

module.exports = UserController;
