var token_middleware = require("../middlewares/token");

module.exports = function (app, product_controller, user_controller) {
    app.get("/api/products",
        product_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.products);
        }
    );

    app.get("/api/products/:product_id",
        product_controller.retrieve_one,
        user_controller.retrieve_all_likes,
        function (req, res) {
            return res.status(200).send(res.product);
        }
    );

    app.post("/api/products",
        token_middleware.verify,
        get_client_input,
        product_controller.create,
        function (req, res) {
            return res.status(201).send(res.product);
        }
    );

    app.put("/api/products/:product_id",
        token_middleware.verify,
        product_controller.update,
        function (req, res) {
            return res.status(200).send(res.product_updated);
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

function get_client_input(req, res, next) {
    var product_props = ["name", "price", "discount_percent", "condition", "images", "video", "weight", "dimension", "is_banned"];
    req.product_obj = {};
    product_props.forEach(function (prop) {
        if (req.body.hasOwnProperty("product_" + prop)) req.product_obj[prop] = req.body["product_" + prop];
    });

    next();
}