var dependencies = {
    notification_service: null
}

var NotificationController = function (notification_service) {
    dependencies.notification_service = notification_service;
}

NotificationController.prototype.retrieve_all = function (req, res, next) {
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;

    dependencies.notification_service.retrieve_all(req.authen_user.id, page, limit, function (err, notifications) {
        if (err) {
            next(err);
        } else {
            res.notifications = notifications;
            next();
        }
    });
}

NotificationController.prototype.read_all = function (req, res, next) {
    dependencies.notification_service.read_all(req.authen_user.id, function (err, all_notifications_read) {
        if (err) {
            next(err);
        } else {
            res.all_notifications_read = all_notifications_read;
            next();
        }
    });
}

NotificationController.prototype.count_badges = function (req, res, next) {
    dependencies.notification_service.count_badges(req.authen_user.id, function (err, badges) {
        if (err) {
            next(err);
        } else {
            res.badges = badges;
            next();
        }
    });
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

NotificationController.prototype.create_setting = function (req, res, next) {
    dependencies.notification_service.create_setting(req.user_obj.id, function (err, push_setting) {
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