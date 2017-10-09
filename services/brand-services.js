var dependencies = {
    brand_repository: null
}

var BrandService = function (brand_repository) {
    dependencies.brand_repository = brand_repository;
}

BrandService.prototype.retrieve_all = function (page, limit, callback) {
    dependencies.brand_repository.find_all({}, page, limit, function (err, brands) {
        if (err) return callback(err);

        return callback(null, { brands });
    });
}

BrandService.prototype.retrieve_one = function (id, callback) {
    var condition = { id: id };
    dependencies.brand_repository.find_by(condition, function (err, brand) {
        if (err) return callback(err);

        if (!brand) return callback({ type: "Not Found" });
        return callback(null, { brand });
    });
}

module.exports = BrandService;
