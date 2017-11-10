var async = require("async");
var config = require("../config/config");
var Activity = require("../domain-models/activity");
var Product = require("../domain-models/product");
var dependencies = {
    product_repository: null,
    category_repository: null,
    product_category_repository: null,
    brand_repository: null,
    like_repository: null,
    comment_repository: null,
    user_repository: null,
    block_repository: null,
    notification_service: null
}

var ProductService = function (product_repository, category_repository, product_category_repository, brand_repository, like_repository, comment_repository, user_repository, block_repository, notification_service) {
    dependencies.product_repository = product_repository;
    dependencies.category_repository = category_repository;
    dependencies.product_category_repository = product_category_repository;
    dependencies.brand_repository = brand_repository;
    dependencies.like_repository = like_repository;
    dependencies.comment_repository = comment_repository;
    dependencies.user_repository = user_repository;
    dependencies.block_repository = block_repository;
    dependencies.notification_service = notification_service;
}

ProductService.prototype.retrieve_all = function (user_id, owner_id, brand_id, category_id, user_likes_id, page, limit, callback) {
    if (brand_id && category_id) return callback({ type: "Bad Request" });
    async.waterfall([
        function (cb) {
            var condition = {};
            cb(null, condition);
        },
        // Check if query by owner_id
        function (condition, cb) {
            if (owner_id != null) condition.user_id = owner_id;
            cb(null, condition);
        },
        // Check if query by brand_id
        function (condition, cb) {
            if (brand_id != null) condition.brand_id = brand_id;
            cb(null, condition);
        },
        // Check if query by category_id
        function (condition, cb) {
            if (category_id != null)
                dependencies.product_category_repository.find_all({ category_id: category_id }, page, limit, function (err, prod_cats) {
                    if (err) cb(err);
                    else {
                        var ids = prod_cats.map(function (prod_cat) {
                            return prod_cat.product_id;
                        });
                        condition.id = { $in: ids };
                        cb(null, condition);
                    }
                });
            else cb(null, condition);
        },
        // Check if query by user's likes
        function (condition, cb) {
            if (user_likes_id != null)
                dependencies.like_repository.find_all({ user_id: user_likes_id }, page, limit, function (err, likes) {
                    if (err) cb(err);
                    else {
                        var ids = likes.map(function (like) {
                            return like.product_id;
                        });
                        condition.id = { $in: ids };
                        cb(null, condition);
                    }
                });
            else cb(null, condition);
        },
    ], function (err, condition) {
        if (err) return callback(err);

        dependencies.product_repository.find_all(condition, page, limit, function (err, res) {
            if (err) return callback(err);

            var products = [];
            async.each(res, function (p, cb) {
                add_more_properties(user_id, p, function (err, p) {
                    if (err) cb(err);
                    else {
                        products.push(p);
                        cb();
                    };
                });
            }, function (err) {
                if (err) return callback(err);

                return callback(null, { products });
            });
        });
    });
}

ProductService.prototype.retrieve_some = function (user_id, pre_condition, order_by, page, limit, callback) {
    var condition = {};
    if (pre_condition.keyword) condition.keyword = pre_condition.keyword;
    async.waterfall([
        // Check if query in price range
        function (cb) {
            if (pre_condition.min_price || pre_condition.max_price) condition.price = {};
            if (pre_condition.min_price) condition.price = { $gte: pre_condition.min_price };
            if (pre_condition.max_price) condition.price = { $lte: pre_condition.max_price };
            cb(null, condition);
        },
        // Check if query by brand_id
        function (condition, cb) {
            if (pre_condition.brand_id) condition.brand_id = pre_condition.brand_id;
            cb(null, condition);
        },
        // Check if query by category_id
        function (condition, cb) {
            if (pre_condition.category_id)
                dependencies.product_category_repository.find_all({ category_id: pre_condition.category_id }, page, limit, function (err, prod_cats) {
                    if (err) cb(err);
                    else {
                        var ids = prod_cats.map(function (prod_cat) {
                            return prod_cat.product_id;
                        });
                        condition.id = { $in: ids };
                        cb(null, condition);
                    }
                });
            else cb(null, condition);
        }
    ], function (err, condition) {
        if (err) return callback(err);

        dependencies.product_repository.find_some(condition, order_by, page, limit, function (err, res) {
            if (err) return callback(err);

            var products = [];
            async.each(res, function (p, cb) {
                add_more_properties(user_id, p, function (err, p) {
                    if (err) cb(err);
                    else {
                        products.push(p);
                        cb();
                    };
                });
            }, function (err) {
                if (err) return callback(err);

                return callback(null, { products }, pre_condition);
            });
        });
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

        var noti_obj = {
            activity: Activity.PRODUCT_POSTED,
            product: product
        }
        dependencies.notification_service.handle(noti_obj, function (err, sent) {
            if (err) return callback(err);

            product.category_ids = category_ids;
            return callback(null, product);
        });
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

        var noti_obj = {
            activity: Activity.PRODUCT_LIKED,
            user_id: user_id,
            product_id: product_id
        }
        dependencies.notification_service.handle(noti_obj, function (err, sent) {
            if (err) return callback(err);

            return callback(null, {
                message: "Product is " + (liked ? "liked." : "unliked.")
            });
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