var dependencies = {
    db_context: null,
    Brand: null
}

var BrandRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.Brand = db_context.Brand
}

BrandRepository.prototype.find_all = function (condition, page, limit, callback) {
    dependencies.Brand
        .findAll({
            where: condition,
            order: [["name", "ASC"]],
            limit: limit,
            offset: page * limit
        })
        .then(function (result) {
            for (var i = 0; i < result.length; i++) {
                result[i] = result[i].dataValues;
            }
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

BrandRepository.prototype.find_by = function (condition, callback) {
    dependencies.Brand
        .findOne({
            where: condition
        })
        .then(function (result) {
            var result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

BrandRepository.prototype.create = function (brand_obj, callback) {
    dependencies.Brand
        .create(brand_obj)
        .then(function (result) {
            var result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

BrandRepository.prototype.update = function (condition, brand_obj, callback) {
    dependencies.Brand
        .update(brand_obj, {
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

BrandRepository.prototype.delete = function (condition, callback) {
    dependencies.Brand
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

module.exports = BrandRepository;
