var async = require("async");
var config = require("../config/config");
var dependencies = {
    product_repository: null,
    category_repository: null,
    product_category_repository: null,
    brand_repository: null,
    like_repository: null,
    comment_repository: null,
    user_repository: null
}

var ProductService = function (product_repository, category_repository, product_category_repository, brand_repository, like_repository, comment_repository, user_repository) {
    dependencies.product_repository = product_repository;
    dependencies.category_repository = category_repository;
    dependencies.product_category_repository = product_category_repository;
    dependencies.brand_repository = brand_repository;
    dependencies.like_repository = like_repository;
    dependencies.comment_repository = comment_repository;
    dependencies.user_repository = user_repository;
}

ProductService.prototype.retrieve_all = function (category_id, page, limit, callback) {
    // TODO: case when category_id || brand != null

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
        product = add_more_properties(product);
        return callback(null, { product });
    });
}

ProductService.prototype.create = function (user_id, product_obj, callback) {
    product_obj.user_id = user_id;
    dependencies.product_repository.create(product_obj, function (err, product) {
        if (err) return callback(err);

        return callback(null, product);
    });
}

ProductService.prototype.update = function (product_obj, callback) {
    var condition = { id: product_obj.id };
    dependencies.product_repository.update(condition, product_obj, function (err, updated) {
        if (err) return callback(err);

        if (!updated) return callback({ type: "Something is wrong." });
        return callback(null, { message: "Product is successfully updated." });
    });
}

ProductService.prototype.delete = function (id, callback) {
    var condition = { id: id };
    dependencies.product_repository.delete(condition, function (err, deleted) {
        if (err) return callback(err);

        return callback(null, {});
    });
}

function add_more_properties(product) {
    
}

module.exports = ProductService;
