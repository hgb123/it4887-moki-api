var async = require("async");
var bcrypt = require("bcryptjs");
var config = require("../config/config");
var User = require("../domain-models/user");
var dependencies = {
    user_repository: null
}

var AuthenService = function (user_repository) {
    dependencies.user_repository = user_repository;
}

AuthenService.prototype.signup = function (phone_number, password, callback) {
    dependencies.user_repository.find_by({ phone_number: phone_number }, function (err, existed) {
        if (err) return callback(err);

        if (existed) return callback({ type: "Duplicated" });

        async.waterfall([
            function (cb) {
                bcrypt.genSalt(function (err, salt) {
                    cb(err, salt);
                });
            },
            function (salt, cb) {
                bcrypt.hash(password, salt, function (err, hash) {
                    cb(err, hash, salt);
                });
            },
            function (hash, salt, cb) {
                var user_obj = new User({
                    phone_number: phone_number,
                    hash: hash,
                    salt: salt
                });
                dependencies.user_repository.create(user_obj, function (err, user) {
                    cb(err, user);
                });
            }
        ], function (err, user) {
            if (err) return callback(err);

            return callback(null, user);
        });
    });
}

AuthenService.prototype.login = function (phone_number, password, callback) {
    async.waterfall([
        function (cb) {
            var condition = { phone_number: phone_number }
            dependencies.user_repository.find_by(condition, function (err, user) {
                if (err) cb(err);
                else if (!user) cb({ type: "Unauthorized" });
                else cb(err, user);
            });
        },
        function (user, cb) {
            bcrypt.compare(password, user.hash, function (err, match) {
                if (err) cb(err);
                else if (!match) cb({ type: "Unauthorized" });
                else cb(err, user);
            });
        }
    ], function (err, user) {
        if (err) return callback(err);

        return callback(null, user);
    });
}

AuthenService.prototype.logout = function (id, callback) {
    var condition = { id: id };
    dependencies.user_repository.update(condition, { is_online: false }, function (err, logout) {
        if (err) return callback(err);

        return callback(null, { message: "Successfully logged out." });
    });
}

module.exports = AuthenService;
