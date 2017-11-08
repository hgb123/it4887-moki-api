var token_middleware = require("../middlewares/token");

module.exports = function (app, authen_controller, notification_controller) {
    app.post("/api/signup",
        authen_controller.signup,
        notification_controller.create_setting,
        authen_controller.generate_token,
        function (req, res) {
            return res.status(201).send(res.authen_obj);
        }
    );

    app.post("/api/login",
        authen_controller.login,
        authen_controller.generate_token,
        function (req, res) {
            return res.status(200).send(res.authen_obj);
        }
    );

    app.post("/api/logout",
        token_middleware.verify,
        authen_controller.logout,
        function (req, res) {
            return res.status(200).send(res.logout)
        }
    );

}