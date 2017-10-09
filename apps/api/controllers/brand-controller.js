var dependencies = {
    brand_service: null
}

var BrandController = function (brand_service) {
    dependencies.brand_service = brand_service;
}

BrandController.prototype.retrieve_all = function (req, res, next) {
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;

    dependencies.brand_service.retrieve_all(page, limit, function (err, brands) {
        if (err) {
            next(err);
        } else {
            res.brands = brands;
            next();
        }
    });
}

BrandController.prototype.retrieve_one = function (req, res, next) {
    dependencies.brand_service.retrieve_one(req.params.brand_id, function (err, brand) {
        if (err) {
            next(err);
        } else {
            res.brand = brand;
            next();
        }
    });
}

module.exports = BrandController;
