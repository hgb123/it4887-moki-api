var admin = require("firebase-admin");
var config = require("../config/config");
var PushSetting = require("../domain-models/push-setting");
var dependencies = {
    admin: null,
    messaging: null,
    push_setting_repository: null,
    notification_repository: null
}

var NotificationService = function (push_setting_repository) {
    dependencies.admin = admin.initializeApp({
        credential: admin.credential.cert(config.firebase.service_account),
        databaseURL: config.firebase.database_url
    });
    dependencies.messaging = admin.messaging();
    dependencies.push_setting_repository = push_setting_repository;
}

NotificationService.prototype.send_to_device = function (callback) {
    dependencies.messaging.sendToDevice(registration_tokens, payload, function (err, res) {
        if (err) return callback(err);

        return callback(null, res);
    });
}

NotificationService.prototype.send_to_topic = function (callback) {
    dependencies.messaging.sendToTopic(topic, payload, function (err, res) {
        if (err) return callback(err);

        return callback(null, res);
    });
}

NotificationService.prototype.retrieve_setting = function (user_id, callback) {
    var self = this;
    var condition = { user_id };
    dependencies.push_setting_repository.find_by(condition, function (err, push_setting) {
        if (err) return callback(err);

        if (push_setting) return callback(null, { push_setting });
        else {
            self.create_setting(user_id, function (err, res) {
                if (err) return callback(err);

                var push_setting = res.push_setting;
                return callback(null, { push_setting });
            });
        }
    });
}

NotificationService.prototype.create_setting = function (user_id, callback) {
    var push_setting_obj = new PushSetting({ user_id });
    dependencies.push_setting_repository.create(push_setting_obj, function (err, push_setting) {
        if (err) return callback(err);

        return callback(null, { push_setting });
    });
}

NotificationService.prototype.update_setting = function (user_id, setting_obj, callback) {
    var condition = { user_id };
    delete setting_obj.user_id;
    dependencies.push_setting_repository.update(condition, setting_obj, function (err, updated) {
        if (err) return callback(err);

        return callback(null, {
            message: "Your push setting is successfully updated."
        });
    });
}

module.exports = NotificationService;