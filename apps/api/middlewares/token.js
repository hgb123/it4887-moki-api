var jwt = require("jsonwebtoken");
var config = require("../../../config/config");

exports.verify = function (req, res, next) {
    var token = req.headers["authorization"];

    jwt.verify(token, config.authen.secret, function (err, decoded) {
        if (err) return res.status(401).send({ error: "Unauthorized" });
        else {
            if (!decoded.id) return res.status(400).send({ error: "Bad Request" });
            req.authen_user = decoded;
            next();
        }
    });
}