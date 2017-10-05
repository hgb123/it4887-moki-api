var jwt = require("jsonwebtoken");
var config = require("../../../config/config");

exports.verify = function(req, res, next) {
    var token = req.body.token;    
    
    jwt.verify(token, config.authen.secret, function(err, decoded) { 
        if (err) {
            return res.status(401).send({ 
                code: 401, 
                message: ["Unauthorized"]
            });
        } else {
            req.authen_user = decoded;
            next();
        }
    });
}