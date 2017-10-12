var object_assign = require("object-assign");
var dependencies = {
    db_context: null,
    Product: null
}

var ProductRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.Product = db_context.Product
}

var parse_product = function (product) {
    if (!product) return product;

    var tmp = product;
    if (tmp.images) tmp.images = JSON.parse(tmp.images);
    if (tmp.video) tmp.video = JSON.parse(tmp.video);
    if (tmp.description) tmp.description = JSON.parse(tmp.description);
    return tmp.dataValues;
}

var stringify_product = function (product) {
    if (!product) return product;

    var tmp = object_assign({}, product);
    if (tmp.images) tmp.images = JSON.stringify(tmp.images);
    if (tmp.video) tmp.video = JSON.stringify(tmp.video);
    if (tmp.description) tmp.description = JSON.stringify(tmp.description);
    return tmp;
}

ProductRepository.prototype.find_all = function (condition, page, limit, callback) {
    dependencies.Product
        .findAll({
            where: condition,
            limit: limit,
            offset: page * limit
        })
        .then(function (result) {
            for (var i = 0; i < result.length; i++) {
                result[i] = parse_product(result[i]);
            }
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ProductRepository.prototype.find_by = function (condition, callback) {
    dependencies.Product
        .findOne({
            where: condition
        })
        .then(function (result) {
            var result = parse_product(result);
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ProductRepository.prototype.create = function (product_obj, callback) {
    var product = stringify_product(product_obj);
    dependencies.Product
        .create(product)
        .then(function (result) {
            var result = parse_product(result);
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ProductRepository.prototype.update = function (condition, product_obj, callback) {
    var product = stringify_product(product_obj);
    dependencies.Product
        .update(product, {
            where: condition
        })
        .then(function (result) {
            if (result.every(function (val) {
                return val == 1;
            })) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ProductRepository.prototype.delete = function (condition, callback) {
    dependencies.Product
        .destroy({
            where: condition
        })
        .then(function (row_deleted) {
            console.log("Row(s) deleted: ", row_deleted);
            callback(null, row_deleted);
        }, function (err) {
            callback(err, null);
        });
}

module.exports = ProductRepository;
