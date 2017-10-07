var express = require("express");
var queryhandler = require("express-api-queryhandler");
var body_parser = require("body-parser");
var config = require("../../config/config");

/* ===== Express setup ===== */
var app = express();
app.use(queryhandler.pagination({ limit: 1000 }));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json({
    verify: function (req, res, buf, encoding) {
        req.raw_body = buf;
    }
}));
/* ===== End Express setup ===== */

/* ===== Components setup ===== */
// DataContext
var mysql_data_context = require("../../repository/mysql-context")(config.mysql);

// Repository
var ProductRepository = require("../../repository/product-repository");
var product_repository = new ProductRepository(mysql_data_context);

// Service
var ProductService = require("../../services/product-services");
var product_service = new ProductService(product_repository);

// Controller
var ProductController = require("./controllers/product-controller");
var product_controller = new ProductController(product_service);

/* ===== End Components setup  ===== */

// require("./routes/authen-routes")(app, authen_controller);
// require("./routes/user-routes")(app, user_controller);
require("./routes/product-routes")(app, product_controller);
// require("./routes/order-routes")(app, user_controller);

app.use(function (err, req, res, next) {
    console.error(new Date());
    console.error(err);
    if (err.type) {
        switch (err.type) {
            case "Bad Request":
                return res.status(400).send({ error: "Bad Request" });
            case "Unauthorized":
                return res.status(401).send({ error: "Unauthorized" });
            case "Request Failed":
                return res.status(402).send({ error: "Request Failed" });
            case "Not Found":
                return res.status(404).send({ error: "Not Found" });
            case "Duplicate":
                return res.status(409).send({ error: "Duplicate" });
        }
    }

    return res.status(500).send({ error: "Something Failed" });
});

var port = config.port;
var env = process.env.NODE_ENV
app.listen(port, function () {
    console.log("Environment:", env);
    console.log("Server is listening on port:", port);
});

module.exports = app;