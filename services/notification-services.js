var async = require("async");
var config = require("../config/config");
var Activity = require("../domain-models/activity");
var PushSetting = require("../domain-models/push-setting");
var dependencies = {
    self: null,
    admin: null,
    messaging: null,
    user_repository: null,
    following_repository: null,
    product_repository: null,
    push_setting_repository: null,
    notification_repository: null
}

var NotificationService = function (user_repository, following_repository, product_repository, push_setting_repository) {
    dependencies.self = this;
    dependencies.admin = require("firebase-admin");
    dependencies.admin.initializeApp({
        credential: dependencies.admin.credential.cert(config.firebase.service_account),
        databaseURL: config.firebase.database_url
    });
    dependencies.messaging = dependencies.admin.messaging();
    dependencies.user_repository = user_repository;
    dependencies.following_repository = following_repository;
    dependencies.product_repository = product_repository;
    dependencies.push_setting_repository = push_setting_repository;
}


NotificationService.prototype.handle = function (params, callback) {
    switch (params.activity) {
        case Activity.PRODUCT_LIKED:
            send_liked_notification(params, function (err, sent) {
                return callback(err, sent);
            });
            break;
        case Activity.PRODUCT_COMMENTED:
            send_commented_notification(params, function (err, sent) {
                return callback(err, sent);
            });
            break;
        case Activity.PRODUCT_POSTED:
            send_posted_notification(params, function (err, sent) {
                return callback(err, sent);
            });
            break;
        case Activity.CONVERSATION_REQUESTED:
            send_chat_notification(params, function (err, sent) {
                return callback(err, sent);
            });
            break;
        default:
            return callback(null, false);
            break;
    }
}

var send_liked_notification = function (params, callback) {
    var user_id = params.user_id;
    var product_id = params.product_id;
    async.waterfall([
        // Get push setting
        function (cb) {
            dependencies.self.retrieve_setting(user_id, function (err, res) {
                cb(err, res.push_setting);
            });
        },
        // Get user
        function (setting, cb) {
            if (!setting.like) cb({ type: "Unauthorized (push setting)" });
            else {
                dependencies.user_repository.find_by({ id: user_id }, function (err, user) {
                    if (err) cb(err);
                    else if (!user) cb({ type: "Not Found" });
                    else cb(null, setting, user);
                });
            }
        },
        // Get product
        function (setting, user, cb) {
            dependencies.product_repository.find_by({ id: product_id }, function (err, product) {
                if (err) cb(err);
                else if (!product) cb({ type: "Not Found" });
                else cb(null, setting, user, product);
            });
        },
        // Send notification
        function (setting, user, product, cb) {
            var notification_obj = {
                type: params.activity,
                sound: setting.sound_on ? params.activity : "mute",
                alert: user.user_name + " đã thích sản phẩm " + product.name + " của bạn",
                data: { product_id }
            }
            dependencies.self.send_to_device(user.device_token, notification_obj, function (err, res) {
                cb(err, true);
            })
        }
    ], function (err, sent) {
        if (err && err.type == "Unauthorized (push setting)") return callback(null, false);
        if (err) return callback(err);

        return callback(null, sent);
    });
}

var send_commented_notification = function (params, callback) {
    var user_id = params.user_id;
    var product_id = params.product_id;
    async.waterfall([
        // Get push setting
        function (cb) {
            dependencies.self.retrieve_setting(user_id, function (err, res) {
                cb(err, res.push_setting);
            });
        },
        // Get user
        function (setting, cb) {
            if (!setting.comment) cb({ type: "Unauthorized (push setting)" });
            else {
                dependencies.user_repository.find_by({ id: user_id }, function (err, user) {
                    if (err) cb(err);
                    else if (!user) cb({ type: "Not Found" });
                    else cb(null, setting, user);
                });
            }
        },
        // Get product
        function (setting, user, cb) {
            dependencies.product_repository.find_by({ id: product_id }, function (err, product) {
                if (err) cb(err);
                else if (!product) cb({ type: "Not Found" });
                else cb(null, setting, user, product);
            });
        },
        // Send notification
        function (setting, user, product, cb) {
            var notification_obj = {
                type: params.activity,
                sound: setting.sound_on ? params.activity : "mute",
                alert: user.user_name + " đã bình luận vào sản phẩm " + product.name + " của bạn",
                data: { product_id }
            }
            dependencies.self.send_to_device(user.device_token, notification_obj, function (err, res) {
                cb(err, true);
            })
        }
    ], function (err, sent) {
        if (err && err.type == "Unauthorized (push setting)") return callback(null, false);
        if (err) return callback(err);

        return callback(null, sent);
    });
}

var send_posted_notification = function (params, callback) {
    var poster_id = params.product.user_id;
    async.waterfall([
        // Get poster's info
        function (outer_cb) {
            dependencies.user_repository.find_by({ id: poster_id }, function (err, poster) {
                if (err) outer_cb(err);
                else if (!poster) outer_cb({ type: "Not Found" });
                else outer_cb(null, poster);
            });
        },
        // Get followers' ids
        function (poster, outer_cb) {
            dependencies.following_repository.find_all({ user_id2: poster_id }, 0, 1000, function (err, followers) {
                outer_cb(err, poster, followers);
            });
        },
        // Send notification to each
        function (poster, followers, outer_cb) {
            async.each(followers, function (follower, e_cb) {
                var user_id = follower.user_id1;

                async.waterfall([
                    // Get push setting
                    function (cb) {
                        dependencies.self.retrieve_setting(user_id, function (err, res) {
                            cb(err, res.push_setting);
                        });
                    },
                    // Get user
                    function (setting, cb) {
                        if (!setting.following) cb({ type: "Unauthorized (push setting)" });
                        else {
                            dependencies.user_repository.find_by({ id: user_id }, function (err, user) {
                                if (err) cb(err);
                                else if (!user) cb({ type: "Not Found" });
                                else cb(null, setting, user);
                            });
                        }
                    },
                    // Send notification
                    function (setting, user, cb) {
                        var notification_obj = {
                            type: params.activity,
                            sound: setting.sound_on ? params.activity : "mute",
                            alert: poster.user_name + " đăng sản phẩm mới có tên " + params.product.name,
                            data: { product_id: params.product.id }
                        }
                        dependencies.self.send_to_device(user.device_token, notification_obj, function (err, res) {
                            cb(err, true);
                        })
                    }
                ], function (err, sent) {
                    if (err && err.type == "Unauthorized (push setting)") e_cb();
                    else if (err) e_cb(err);
                    else e_cb();
                });
            }, function (err) {
                outer_cb(err, true);
            });
        }
    ], function (err, sent) {
        if (err) return callback(err);

        return callback(null, sent);
    });
}

var send_chat_notification = function (params, callback) {
    var user_id = params.user_id;
    var product_id = params.product_id;
    async.waterfall([
        // Get push setting
        function (cb) {
            dependencies.self.retrieve_setting(user_id, function (err, res) {
                cb(err, res.push_setting);
            });
        },
        // Get user
        function (setting, cb) {
            if (!setting.conversation) cb({ type: "Unauthorized (push setting)" });
            else {
                dependencies.user_repository.find_by({ id: user_id }, function (err, user) {
                    if (err) cb(err);
                    else if (!user) cb({ type: "Not Found" });
                    else cb(null, setting, user);
                });
            }
        },
        // Get product
        function (setting, user, cb) {
            dependencies.product_repository.find_by({ id: product_id }, function (err, product) {
                if (err) cb(err);
                else if (!product) cb({ type: "Not Found" });
                else cb(null, setting, user, product);
            });
        },
        // Send notification
        function (setting, user, product, cb) {
            var notification_obj = {
                type: params.activity,
                sound: setting.sound_on ? params.activity : "mute",
                alert: user.user_name + " đã gửi tin nhắn cho bạn",
                data: {
                    product_id,
                    id: user.id,
                    user_name: user.user_name,
                    avatar: user.avatar
                }
            }
            dependencies.self.send_to_device(user.device_token, notification_obj, function (err, res) {
                cb(err, true);
            })
        }
    ], function (err, sent) {
        if (err && err.type == "Unauthorized (push setting)") return callback(null, false);
        if (err) return callback(err);

        return callback(null, sent);
    });
}

NotificationService.prototype.send_to_device = function (registration_tokens, notification_obj, callback) {
    notification_obj.data = JSON.stringify(notification_obj.data);
    var payload = {
        data: notification_obj
    };
    dependencies.messaging.sendToDevice(registration_tokens, payload)
        .then(function (res) {
            console.log("Successfully sent message.");
            callback(null, true);
        })
        .catch(function (err) {
            console.error("Successfully sending message.");
            callback(err);
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