var dependencies = {
    product_service: null
}

var ProductController = function (product_service) {
    dependencies.product_service = product_service;
}

ProductController.prototype.retrieve_all = function (req, res, next) {
    var user_id = req.authen_user ? req.authen_user.id : null;
    var owner_id = req.params.user_id ? req.params.user_id : null;
    var brand_id = req.params.brand_id ? req.params.brand_id : null;
    var category_id = req.params.category_id ? req.params.category_id : null;
    var user_likes_id = req.params.user_id ? req.params.user_id : null;
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;

    dependencies.product_service.retrieve_all(user_id, owner_id, brand_id, category_id, user_likes_id, page, limit, function (err, products) {
        if (err) {
            next(err);
        } else {
            res.products = products;
            if (res.brand) res.brand.brand.products = products.products;
            if (res.category) res.category.category.products = products.products;
            next();
        }
    });
}

ProductController.prototype.retrieve_some = function (req, res, next) {
    var user_id = req.authen_user ? req.authen_user.id : null;
    var condition = Object.keys(req.where).length ? req.where : {};
    var order_by = req.options.sort;
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;
    if (order_by) order_by = Object.keys(order_by).map(function (key) {
        return [key, order_by[key] == -1 ? "DESC" : "ASC"];
    });

    dependencies.product_service.retrieve_some(user_id, condition, order_by, page, limit, function (err, products) {
        if (err) {
            next(err);
        } else {
            res.products = products;
            req.search_condition = condition;
            next();
        }
    });
}

ProductController.prototype.retrieve_one = function (req, res, next) {
    var user_id = req.authen_user ? req.authen_user.id : null;
    dependencies.product_service.retrieve_one(user_id, req.params.product_id, function (err, product) {
        if (err) {
            next(err);
        } else {
            res.product = product;
            next();
        }
    });
}

ProductController.prototype.create = function (req, res, next) {
    dependencies.product_service.create(req.authen_user.id, req.product_obj, function (err, product) {
        if (err) {
            next(err);
        } else {
            res.product = product;
            next();
        }
    });
}

ProductController.prototype.update = function (req, res, next) {
    req.product_obj.id = req.params.product_id;
    dependencies.product_service.update(req.product_obj, function (err, product_updated) {
        if (err) {
            next(err);
        } else {
            res.product_updated = product_updated;
            next();
        }
    });
}

ProductController.prototype.delete = function (req, res, next) {
    dependencies.product_service.delete(req.params.product_id, function (err, product_deleted) {
        if (err) {
            next(err);
        } else {
            res.product_deleted = product_deleted;
            next();
        }
    });
}

ProductController.prototype.like = function (req, res, next) {
    dependencies.product_service.like(req.authen_user.id, req.params.product_id, function (err, product_liked) {
        if (err) {
            next(err);
        } else {
            res.product_liked = product_liked;
            next();
        }
    });
}

module.exports = ProductController;
