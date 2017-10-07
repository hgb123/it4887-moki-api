var async = require("async");
var config = require("../config/config");
var dependencies = {
    product_repository: null
}

var ProductService = function (product_repository) {
    dependencies.product_repository = product_repository;
}

ProductService.prototype.retrieve_all = function (category_id, page, limit, callback) {
    // TODO: case when category_id != null

    dependencies.product_repository.find_all({}, page, limit, function (err, products) {
        if (err) return callback(err);

        return callback(null, { products });
    });
}

ProductService.prototype.retrieve_one = function (id, callback) {
    var condition = { id: id };
    dependencies.product_repository.find_by(condition, function (err, product) {
        if (err) return callback(err);

        if (!product) return callback({ type: "Not Found" });
        return callback(null, { product });
    })
}



module.exports = ProductService;
