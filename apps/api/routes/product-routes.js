var token_middleware = require("../middlewares/token");

module.exports = function (app, product_controller) {
    app.get("/api/products",
        product_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.products);
        }
    );

    app.get("/api/products/:product_id",
        product_controller.retrieve_one,
        function (req, res) {
            return res.status(200).send(res.product);
        }
    );

    app.post("/api/products",
        token_middleware.verify,
        product_controller.create,
        function (req, res) {
            return res.status(201).send(res.product);
        }
    );

    app.put("/api/products/:product_id",
        token_middleware.verify,
        product_controller.update,
        function (req, res) {
            return res.status(200).send(res.product);
        }
    );

    app.delete("/api/products/:product_id",
        token_middleware.verify,
        product_controller.delete,
        function (req, res) {
            return res.status(200).send(res.product_deleted);
        }
    );
}