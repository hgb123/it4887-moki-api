var express = require("express");
var body_parser = require("body-parser");
var config = require("../../config/config");

/* ===== Express setup ===== */
var app = express();
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json({
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));
/* ===== End Express setup ===== */

/* ===== Components setup ===== */
// Datacontext
// var mysql_data_context = require("../../repository/mysql-context")(config.mysql);

// Repository

// Service

// Controller


/* ===== End Components setup  ===== */

require("./routes/authen-routes")(app);
// require("./routes/user-routes")(app, user_controller);
// require("./routes/product-routes")(app, product_controller);
// require("./routes/order-routes")(app, user_controller);

app.use(function (err, req, res, next) {
    console.error(new Date());
    console.error(err);
    if (err.message) {
        switch (err.message) {
            case "Spam.":
                err.code = 9991; return res.status(500).send(err);
            case "Product is not existed.":
                err.code = 9992; return res.status(500).send(err);
            case "Code verify is incorrect.":
                err.code = 9993; return res.status(500).send(err);
            case "No data or end of list data.":
                err.code = 9994; return res.status(500).send(err);
            case "User is not validated.":
                err.code = 9995; return res.status(500).send(err);
            case "User is existed.":
                err.code = 9996; return res.status(500).send(err);
            case "Method is invalid.":
                err.code = 9997; return res.status(500).send(err);
            case "Token is invalid.":
                err.code = 9998; return res.status(500).send(err);
            case "Exception error.":
                err.code = 9999; return res.status(500).send(err);
            case "Can not connect to database.":
                err.code = 1001; return res.status(500).send(err);
            case "Parameter is not enough.":
                err.code = 1002; return res.status(500).send(err);
            case "Parameter type is invalid.":
                err.code = 1003; return res.status(500).send(err);
            case "Parameter value is invalid.":
                err.code = 1004; return res.status(500).send(err);

            case "File size is too big.":
                err.code = 1006; return res.status(500).send(err);
            case "Upload file failed.":
                err.code = 1007; return res.status(500).send(err);
            case "Maximum number of images.":
                err.code = 1008; return res.status(500).send(err);
            case "Not access.":
                err.code = 1009; return res.status(500).send(err);
            case "Action has been done previously by this user.":
                err.code = 1010; return res.status(500).send(err);
            case "The product has been sold.":
                err.code = 1011; return res.status(500).send(err);
            case "Address does not support shipping.":
                err.code = 1012; return res.status(500).send(err);
            case "Url User\'s is exist.":
                err.code = 1013; return res.status(500).send(err);
            case "Promotional code expired.":
                err.code = 1014; return res.status(500).send(err);
        }
    } else {
        err.message = "Unknown error.";
        err.code = 1005;
        return res.status(500).send(err);
    }
});

var port = config.port;
app.listen(port, function () {
    console.log("Environment: ", process.env.NODE_ENV);
    console.log("Server is listening on port: ", port);
});

module.exports = app;