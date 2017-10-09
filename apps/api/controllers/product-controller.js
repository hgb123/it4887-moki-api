var dependencies = {
    product_service: null
}

var ProductController = function (product_service) {
    dependencies.product_service = product_service;
}

ProductController.prototype.retrieve_all = function (req, res, next) {
    var category_id = req.body.category_id ? req.body.category_id : null;
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;

    dependencies.product_service.retrieve_all(category_id, page, limit, function (err, products) {
        if (err) {
            next(err);
        } else {
            res.products = products;
            next();
        }
    });
}

ProductController.prototype.retrieve_one = function (req, res, next) {
    dependencies.product_service.retrieve_one(req.params.product_id, function (err, product) {
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
    dependencies.product_service.update(req.product_obj, function (err, product) {
        if (err) {
            next(err);
        } else {
            res.product = product;
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

module.exports = ProductController;
