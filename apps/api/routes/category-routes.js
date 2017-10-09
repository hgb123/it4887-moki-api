module.exports = function (app, category_controller) {
    app.get("/api/categories",
        category_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.categories);
        }
    );

    app.get("/api/categories/:category_id",
        category_controller.retrieve_one,
        function (req, res) {
            return res.status(200).send(res.category);
        }
    );
}