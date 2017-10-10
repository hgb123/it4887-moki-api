var dependencies = {
    db_context: null,
    ProductCategory: null
}

var ProductCategoryRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.ProductCategory = db_context.ProductCategory
}

ProductCategoryRepository.prototype.find_all = function (condition, page, limit, callback) {
    dependencies.ProductCategory
        .findAll({
            where: condition,
            limit: limit,
            offset: page * limit
        })
        .then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i]) result[i] = result[i].dataValues;
            }
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ProductCategoryRepository.prototype.find_by = function (condition, callback) {
    dependencies.ProductCategory
        .findOne({
            where: condition
        })
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ProductCategoryRepository.prototype.create = function (prod_cate_obj, callback) {
    dependencies.ProductCategory
        .create(prod_cate_obj)
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ProductCategoryRepository.prototype.update = function (condition, prod_cate_obj, callback) {
    dependencies.ProductCategory
        .update(prod_cate_obj, {
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

ProductCategoryRepository.prototype.delete = function (condition, callback) {
    dependencies.ProductCategory
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

module.exports = ProductCategoryRepository;
