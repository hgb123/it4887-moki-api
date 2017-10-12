var dependencies = {
    db_context: null,
    Like: null
}

var LikeRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.Like = db_context.Like
}

LikeRepository.prototype.find_all = function (condition, page, limit, callback) {
    dependencies.Like
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

LikeRepository.prototype.count = function (condition, callback) {
    dependencies.Like
        .count({
            where: condition
        })
        .then(function (result) {
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

LikeRepository.prototype.find_by = function (condition, callback) {
    dependencies.Like
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

LikeRepository.prototype.create = function (like_obj, callback) {
    dependencies.Like
        .create(like_obj)
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

LikeRepository.prototype.update = function (condition, like_obj, callback) {
    dependencies.Like
        .update(like_obj, {
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

LikeRepository.prototype.delete = function (condition, callback) {
    dependencies.Like
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

module.exports = LikeRepository;
