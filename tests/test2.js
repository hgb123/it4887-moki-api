var user_repository = {
    find_by: function (condition, callback) {
        switch (condition.id) {
            case 1:
                return callback(null, { user_name: "Chai cô", device_token: "dA1OhFMiQmc:APA91bH3ssA7XGgRXtks7wQB_GQf5ZHyrDIQ9WbjfRESXEpBhJK4-J52qjznzeEZG-gB8lHsftUgp0O-SP0bo4j1Q_9inDPMdpqSrjFITrOAAKRajRDqywSINNOv4jUwyjqL4rqiFQFL" });
                break;
            case 2:
                return callback(null, { user_name: "Xu ka", device_token: "dA1OhFMiQmc:APA91bH3ssA7XGgRXtks7wQB_GQf5ZHyrDIQ9WbjfRESXEpBhJK4-J52qjznzeEZG-gB8lHsftUgp0O-SP0bo4j1Q_9inDPMdpqSrjFITrOAAKRajRDqywSINNOv4jUwyjqL4rqiFQFL" });
                break;
            case 3:
                return callback(null, { user_name: "Xê kô" });
                break;
        }
    }
}

var following_repository = {
    find_all: function (condition, page, limit, callback) {
        return callback(null, [
            { user_id1: 1 },
            { user_id1: 2 }
        ]);
    }
}

var product_repository = {
    find_by: function (condition, callback) {
        return callback(null, { name: "Túi thần kì" });
    }
}

var push_setting_repository = {
    find_by: function (condition, callback) {
        switch (condition.user_id) {
            case 1:
                return callback(null, { comment: true, like: true, following: true, sound_on: true, sound_default: "default.mp3" });
                break;
            case 2:
                return callback(null, { comment: true, like: true, following: true, sound_on: true, sound_default: "nokia.mp3" });
                break;
        }

    }
}

var NotificationService = require("../services/notification-services");
var notification_service = new NotificationService(user_repository, following_repository, product_repository, push_setting_repository);


// notification_service.send_to_device(token, notification_obj, function (err, res) {
//     if (err) throw err;
//     console.log(res);
// });

var params = {
    activity: "PRODUCT_POSTED",
    product: {
        id: 1,
        user_id: 3,
        name: "Giấy ăn"
    }
}

notification_service.handle(params, function (err, res) {
    if (err) throw err;
    console.log(res);
});