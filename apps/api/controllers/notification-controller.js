var dependencies = {
    notification_service: null
}

var NotificationController = function (notification_service) {
    dependencies.notification_service = notification_service;
}

NotificationController.prototype.retrieve_setting = function (req, res, next) {
    dependencies.notification_service.retrieve_setting(req.authen_user.id, function (err, push_setting) {
        if (err) {
            next(err);
        } else {
            res.push_setting = push_setting;
            next();
        }
    });
}

NotificationController.prototype.create_setting = function(req, res, next) {
    dependencies.notification_service.create_setting(req.user_obj.id, function(err, push_setting){
        if (err) {
            next(err);
        } else {
            res.push_setting = push_setting;
            next();
        }
    });
}

NotificationController.prototype.update_setting = function (req, res, next) {
    dependencies.notification_service.update_setting(req.authen_user.id, req.push_setting_obj, function (err, push_setting_updated) {
        if (err) {
            next(err);
        } else {
            res.push_setting_updated = push_setting_updated;
            next();
        }
    });
}


module.exports = NotificationController;