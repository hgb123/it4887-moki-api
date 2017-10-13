var token_middleware = require("../middlewares/token");

module.exports = function (app, authen_controller) {
    app.post("/signup",
        authen_controller.signup,
        authen_controller.generate_token,
        function (req, res) {
            return res.status(201).send(res.authen_obj);
        }
    );

    app.post("/login",
        authen_controller.login,
        authen_controller.generate_token,
        function (req, res) {
            return res.status(200).send(res.authen_obj);
        }
    );

    app.post("/logout",
        token_middleware.verify,
        authen_controller.logout,
        function (req, res) {
            return res.status(200).send(res.logout)
        }
    );

}