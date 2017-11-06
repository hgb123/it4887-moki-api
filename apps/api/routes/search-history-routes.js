var token_middleware = require("../middlewares/token");

module.exports = function (app, search_history_controller) {
    app.get("/api/search_histories",
        token_middleware.verify,
        search_history_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.search_histories);
        }
    );

    app.get("/api/search_histories/:search_history_id",
        token_middleware.verify,
        search_history_controller.retrieve_one,
        function (req, res) {
            return res.status(200).send(res.search_history);
        }
    );

    app.delete("/api/search_histories",
        token_middleware.verify,
        search_history_controller.delete_all,
        function (req, res) {
            return res.status(200).send(res.all_search_histories_deleted);
        }
    );
}