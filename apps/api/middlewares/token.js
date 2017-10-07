var jwt = require("jsonwebtoken");
var config = require("../../../config/config");

exports.verify = function (req, res, next) {
    var token = req.headers["authorization"];

    jwt.verify(token, config.authen.secret, function (err, decoded) {
        if (err) return res.status(401).send({ error: "Unauthorized" });
        else {
            req.authen_user = decoded;
            next();
        }
    });
}