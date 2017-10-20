var token_middleware = require("../middlewares/token");

module.exports = function (app, user_controller) {
    app.get("/api/users/:user_id",
        function (req, res, next) {
            if (req.headers["authorization"]) token_middleware.verify(req, res, next);
            else next();
        },
        user_controller.retrieve_information,
        function (req, res) {
            return res.status(200).send(res.user);
        }
    );

    app.put("/api/users/:user_id",
        token_middleware.verify,
        get_client_input,
        user_controller.update_information,
        function (req, res) {
            return res.status(200).send(res.user_updated);
        }
    );

    app.get("/api/users/:user_id/followers",
        function (req, res, next) {
            if (req.headers["authorization"]) token_middleware.verify(req, res, next);
            else next();
        },
        user_controller.retrieve_followers,
        function (req, res) {
            return res.status(200).send(res.users);
        }
    );

    app.get("/api/users/:user_id/following",
        function (req, res, next) {
            if (req.headers["authorization"]) token_middleware.verify(req, res, next);
            else next();
        },
        user_controller.retrieve_following,
        function (req, res) {
            return res.status(200).send(res.users);
        }
    );

    app.post("/api/users/:user_id/follow",
        token_middleware.verify,
        user_controller.follow,
        function (req, res) {
            return res.status(201).send(res.user_followed);
        }
    );

    app.get("/api/users/:user_id/blocked",
        token_middleware.verify,
        user_controller.retrieve_blocked,
        function (req, res) {
            return res.status(200).send(res.users);
        }
    );

    app.post("/api/users/:user_id/block",
        token_middleware.verify,
        user_controller.block,
        function (req, res) {
            return res.status(201).send(res.user_blocked);
        }
    );
}

function get_client_input(req, res, next) {
    var user_props = ["user_name", "is_online", "avatar", "phone_number", "address"];
    req.user_obj = {};
    user_props.forEach(function (prop) {
        if (req.body.hasOwnProperty("user_" + prop)) req.user_obj[prop] = req.body["user_" + prop];
    });

    next();
}
