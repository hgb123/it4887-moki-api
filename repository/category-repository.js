var dependencies = {
    db_context: null,
    Category: null
}

var CategoryRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.Category = db_context.Category
}

CategoryRepository.prototype.find_all = function (condition, page, limit, callback) {
    dependencies.Category
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

CategoryRepository.prototype.find_by = function (condition, callback) {
    dependencies.Category
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

CategoryRepository.prototype.create = function (category_obj, callback) {
    dependencies.Category
        .create(category_obj)
        .then(function (result) {
            var result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

CategoryRepository.prototype.update = function (condition, category_obj, callback) {
    dependencies.Category
        .update(category_obj, {
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

CategoryRepository.prototype.delete = function (condition, callback) {
    dependencies.Category
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

module.exports = CategoryRepository;
