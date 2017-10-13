var dependencies = {
    authen_service: null,
    token_service: null
}

var AuthenController = function (authen_service, token_service) {
    dependencies.authen_service = authen_service;
    dependencies.token_service = token_service;
};


AuthenController.prototype.signup = function (req, res, next) {
    dependencies.authen_service.signup(req.body.phone_number, req.body.password, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user_obj = { id: user.id };
            next();
        }
    });
}

AuthenController.prototype.login = function (req, res, next) {
    dependencies.authen_service.login(req.body.phone_number, req.body.password, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user_obj = { id: user.id };
            next();
        }
    });
}

AuthenController.prototype.logout = function (req, res, next) {
    dependencies.authen_service.logout(req.authen_user.id, function (err, logout) {
        if (err) {
            next(err);
        } else {
            res.logout = logout;
            next();
        }
    });
}

AuthenController.prototype.generate_token = function (req, res, next) {
    dependencies.token_service.generate_token(req.user_obj, function (err, authen_obj) {
        if (err) {
            next(err);
        } else {
            res.authen_obj = authen_obj;
            next();
        }
    });
}

module.exports = AuthenController;
