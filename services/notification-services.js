var admin = require("firebase-admin");
var config = require("../config/config");
var dependencies = {
    admin: null,
    messaging: null
}

var FCMService = function () {
    dependencies.admin = admin.initializeApp({
        credential: admin.credential.cert(config.firebase.service_account),
        databaseURL: config.firebase.database_url
    });
    dependencies.messaging = admin.messaging();
}

FCMService.prototype.send_to_device = function (callback) {
    dependencies.messaging.sendToDevice(registration_tokens, payload, function (err, res) {
        if (err) return callback(err);
        
        return callback(null, res);
    });
}

FCMService.prototype.send_to_topic = function (callback) {
    dependencies.messaging.sendToTopic(topic, payload, function (err, res) {
        if (err) return callback(err);

        return callback(null, res);
    });
}

module.exports = FCMService;