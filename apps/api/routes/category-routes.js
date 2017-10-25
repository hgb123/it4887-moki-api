module.exports = function (app, category_controller, product_controller) {
    app.get("/api/categories",
        category_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.categories);
        }
    );

    app.get("/api/categories/:category_id",
        function (req, res, next) {
            if (req.headers["authorization"]) token_middleware.verify(req, res, next);
            else next();
        },
        category_controller.retrieve_one,
        product_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.category);
        }
    );
}