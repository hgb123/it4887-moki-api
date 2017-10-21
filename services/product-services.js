var async = require("async");
var config = require("../config/config");
var Product = require("../domain-models/product");
var dependencies = {
    product_repository: null,
    category_repository: null,
    product_category_repository: null,
    brand_repository: null,
    like_repository: null,
    comment_repository: null,
    user_repository: null,
    block_repository: null
}

var ProductService = function (product_repository, category_repository, product_category_repository, brand_repository, like_repository, comment_repository, user_repository, block_repository) {
    dependencies.product_repository = product_repository;
    dependencies.category_repository = category_repository;
    dependencies.product_category_repository = product_category_repository;
    dependencies.brand_repository = brand_repository;
    dependencies.like_repository = like_repository;
    dependencies.comment_repository = comment_repository;
    dependencies.user_repository = user_repository;
    dependencies.block_repository = block_repository;
}

ProductService.prototype.retrieve_all = function (user_id, condition, page, limit, callback) {
    // TODO: case when category_id || brand != null

    dependencies.product_repository.find_all(condition, page, limit, function (err, products) {
        if (err) return callback(err);

        return callback(null, { products });
    });
}

ProductService.prototype.retrieve_one = function (user_id, id, callback) {
    var condition = { id: id };
    dependencies.product_repository.find_by(condition, function (err, product) {
        if (err) return callback(err);

        if (!product) return callback({ type: "Not Found" });
        add_more_properties(user_id, product, function (err, product) {
            if (err) return callback(err);

            return callback(null, { product });
        });
    });
}

ProductService.prototype.create = function (user_id, product_obj, callback) {
    var category_ids = product_obj.category_ids;
    product_obj.user_id = user_id;
    var product_obj = new Product(product_obj);
    async.waterfall([
        // Create product
        function (cb) {
            dependencies.product_repository.create(product_obj, function (err, product) {
                cb(err, product);
            });
        },
        // Add to category(ies)
        function (product, cb) {
            async.each(category_ids, function (category_id, e_cb) {
                var prod_cat_obj = {
                    product_id: product.id,
                    category_id: category_id
                }
                dependencies.product_category_repository.create(prod_cat_obj, function (err, created) {
                    e_cb(err, created);
                });
            }, function (err) {
                cb(err, product);
            });
        }
    ], function (err, product) {
        if (err) return callback(err);

        product.category_ids = category_ids;
        return callback(null, product);
    });

}

ProductService.prototype.update = function (product_obj, callback) {
    var condition = { id: product_obj.id };
    delete product_obj.id;
    var category_ids = product_obj.category_ids;
    var product_id = product_obj.id;
    async.waterfall([
        // Update product
        function (cb) {
            dependencies.product_repository.update(condition, product_obj, function (err, updated) {
                cb(err, updated);
            });
        },
        // Remove old and add new category(ies)
        function (updated, cb) {
            if (!updated) cb(null, false);
            else {
                dependencies.product_category_repository.delete({ product_id: product_id }, function (err, deleted) {
                    if (err) cb(err);
                    else async.each(category_ids, function (category_id, e_cb) {
                        var prod_cat_obj = {
                            product_id: product_id,
                            category_id: category_id
                        }
                        dependencies.product_category_repository.create(prod_cat_obj, function (err, created) {
                            e_cb(err, created);
                        });
                    }, function (err) {
                        cb(err, updated);
                    });
                });
            }
        }
    ], function (err, updated) {
        if (err) return callback(err);

        if (!updated) return callback({ type: "Something is wrong." });
        return callback(null, { message: "Product is successfully updated." });
    });
}

ProductService.prototype.delete = function (id, callback) {
    async.series([
        // Delete product
        function (cb) {
            dependencies.product_repository.delete({ id: id }, function (err, deleted) {
                cb(err, deleted);
            });
        },
        // Delete in category(ies)
        function (cb) {
            dependencies.product_category_repository.delete({ product_id: id }, function (err, deleted) {
                cb(err, deleted);
            });
        },
        // Delete like(s)
        function (cb) {
            dependencies.like_repository.delete({ product_id: id }, function (err, deleted) {
                cb(err, deleted);
            });
        },
        // Delete comment(s)
        function (cb) {
            dependencies.comment_repository.delete({ product_id: id }, function (err, deleted) {
                cb(err, deleted);
            });
        }
    ], function (err, deleted) {
        if (err) return callback(err);

        return callback(null, { message: "Product is successfully removed." });
    });
}

ProductService.prototype.like = function (user_id, product_id, callback) {
    var condition = {
        user_id: user_id,
        product_id: product_id
    }
    async.waterfall([
        function (cb) {
            // Check if liked yet
            dependencies.like_repository.find_by(condition, function (err, res) {
                cb(err, res);
            });
        },
        function (liked, cb) {
            if (liked) {
                // Unlike
                dependencies.like_repository.delete(condition, function (err, deleted) {
                    cb(err, false);
                });
            } else {
                // Like
                dependencies.like_repository.create(condition, function (err, created) {
                    cb(err, true);
                });
            }
        }
    ], function (err, liked) {
        if (err) return callback(err);

        return callback(null, {
            message: "Product is " + (liked ? "liked." : "unliked.")
        });
    });
}

function add_more_properties(user_id, product, callback) {
    async.series([
        // Count like
        function (cb) {
            var condition = { product_id: product.id };
            dependencies.like_repository.count(condition, function (err, likes) {
                cb(err, likes);
            });
        },
        // Count comment
        function (cb) {
            var condition = { product_id: product.id };
            dependencies.comment_repository.count(condition, function (err, comments) {
                cb(err, comments);
            });
        },
        // Check liked
        function (cb) {
            if (user_id) {
                var condition = {
                    product_id: product.id,
                    user_id: user_id
                };
                dependencies.like_repository.find_by(condition, function (err, like) {
                    cb(err, like != null);
                });
            } else cb(null, null);
        },
        // Check blocked
        function (cb) {
            if (user_id) {
                var condition = {
                    $or: [
                        { user_id1: user_id, user_id2: product.user_id },
                        { user_id2: user_id, user_id1: product.user_id }
                    ]
                }
                dependencies.block_repository.find_all(condition, 0, 2, function (err, blocks) {
                    cb(err, blocks.length > 0);
                });
            } else cb(null, null);
        },
        // Check editable
        function (cb) {
            cb(null, user_id && user_id == product.user_id);
        },
        // Get seller info
        function (cb) {
            var condition = { id: product.user_id };
            dependencies.user_repository.find_by(condition, function (err, user) {
                cb(err, {
                    id: user.id,
                    name: user.user_name,
                    avatar: user.avatar
                });
            });
        }
    ], function (err, results) {
        if (err) return callback(err);

        product.likes = results[0];
        product.comments = results[1];
        product.is_liked = results[2];
        product.is_blocked = results[3];
        product.is_editable = results[4];
        product.seller = results[5];
        return callback(null, product);
    });
}

module.exports = ProductService;
