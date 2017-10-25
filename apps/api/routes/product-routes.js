var token_middleware = require("../middlewares/token");

module.exports = function (app, product_controller, comment_controller) {
    // Basic
    app.get("/api/products",
        function (req, res, next) {
            if (req.headers["authorization"]) token_middleware.verify(req, res, next);
            else next();
        },
        product_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.products);
        }
    );

    app.get("/api/products/:product_id",
        function (req, res, next) {
            if (req.headers["authorization"]) token_middleware.verify(req, res, next);
            else next();
        },
        product_controller.retrieve_one,
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
        get_client_input,
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

    // Comments
    app.get("/api/products/:product_id/comments",
        comment_controller.retrieve_all,
        function (req, res) {
            return res.status(200).send(res.comments);
        }
    );

    app.post("/api/products/:product_id/comments",
        token_middleware.verify,
        function (req, res, next) {
            var comment_obj = {
                user_id: req.authen_user.id,
                product_id: req.params.product_id,
                content: req.body.comment_content
            }
            req.comment_obj = comment_obj;

            next();
        },
        comment_controller.create,
        function (req, res) {
            return res.status(201).send(res.comment);
        }
    );

    app.put("/api/products/:product_id/comments/:comment_id/block",
        token_middleware.verify,
        comment_controller.block,
        function (req, res) {
            return res.status(200).send(res.comment_blocked);
        }
    );

    // Like / Unlike
    app.post("/api/products/:product_id/like",
        token_middleware.verify,
        product_controller.like,
        function (req, res) {
            return res.status(200).send(res.product_liked);
        }
    );
}

function get_client_input(req, res, next) {
    var product_props = ["name", "price", "discount_percent", "condition", "images", "video", "description", "category_ids", "brand_id", "weight", "size", "ship_from"];
    req.product_obj = {};
    product_props.forEach(function (prop) {
        if (req.body.hasOwnProperty("product_" + prop)) req.product_obj[prop] = req.body["product_" + prop];
    });

    next();
}
