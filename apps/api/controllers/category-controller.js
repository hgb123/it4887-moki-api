var dependencies = {
    category_service: null
}

var CategoryController = function (category_service) {
    dependencies.category_service = category_service;
}

CategoryController.prototype.retrieve_all = function (req, res, next) {
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;

    dependencies.category_service.retrieve_all(page, limit, function (err, categories) {
        if (err) {
            next(err);
        } else {
            res.categories = categories;
            next();
        }
    });
}

CategoryController.prototype.retrieve_one = function (req, res, next) {
    dependencies.category_service.retrieve_one(req.params.category_id, function (err, category) {
        if (err) {
            next(err);
        } else {
            res.category = category;
            next();
        }
    });
}

module.exports = CategoryController;
