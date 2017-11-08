var token_middleware = require("../middlewares/token");

module.exports = function (app, notification_controller) {
    app.get("/api/push_setting",
        token_middleware.verify,
        notification_controller.retrieve_setting,
        function (req, res) {
            return res.status(200).send(res.push_setting);
        }
    );

    app.put("/api/push_setting",
        token_middleware.verify,
        get_client_input,
        notification_controller.update_setting,
        function (req, res) {
            return res.status(200).send(res.push_setting_updated);
        }
    );
}

function get_client_input(req, res, next) {
    var push_setting_props = ["like", "comment", "conversation", "following", "announcement", "sound_on", "sound_default"];
    req.push_setting_obj = {};
    push_setting_props.forEach(function (prop) {
        if (req.body.hasOwnProperty("push_setting_" + prop)) req.push_setting_obj[prop] = req.body["push_setting_" + prop];
    });

    next();
}