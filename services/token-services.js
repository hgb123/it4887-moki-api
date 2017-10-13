var jwt = require("jsonwebtoken");
var config = require("../config/config");

var TokenService = function () { };

TokenService.prototype.generate_token = function (user_obj, callback) {
    return callback(null, {
        token_expires_in: config.authen.token_expires_in,
        access_token: jwt.sign(user_obj, config.authen.secret, {
            expiresIn: config.authen.token_expires_in
        })
    });
};

module.exports = TokenService;
