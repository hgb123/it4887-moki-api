var token_middleware = require("../middlewares/token");

module.exports = function (app, brand_controller, product_controller) {
    app.get("/api/brands",
        brand_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.brands);
        }
    );

    app.get("/api/brands/:brand_id",
        function (req, res, next) {
            if (req.headers["authorization"]) token_middleware.verify(req, res, next);
            else next();
        },
        brand_controller.retrieve_one,
        product_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.brand);
        }
    );
}