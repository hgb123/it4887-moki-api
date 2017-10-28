var token_middleware = require("../middlewares/token");

module.exports = function (app, conversation_controller) {
    app.get("/conversations",
        token_middleware.verify,
        conversation_controller.retrieve_list,
        function (req, res) {
            return res.status(200).send(res.conversations_list);
        }
    );

    app.get("/conversations/t/:user_id",
        token_middleware.verify,
        conversation_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.conversations);
        }
    );

    app.post("/conversations/t/:user_id",
        token_middleware.verify,
        conversation_controller.create,
        function (req, res) {
            return res.status(200).send(res.conversation);
        }
    );

    app.post("/conversations/t/:user_id/seen",
        token_middleware.verify,
        conversation_controller.seen,
        function (req, res) {
            return res.status(200).send(res.conversation_seen);
        }
    );
}