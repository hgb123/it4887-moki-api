var dependencies = {
    db_context: null,
    Follow: null
}

var FollowRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.Follow = db_context.Follow
}

FollowRepository.prototype.find_all = function (condition, callback) {
    dependencies.Follow
        .findAll({
            where: condition,
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

FollowRepository.prototype.find_by = function (condition, callback) {
    dependencies.Follow
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

FollowRepository.prototype.create = function (follow_obj, callback) {
    dependencies.Follow
        .create(follow_obj)
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

FollowRepository.prototype.update = function (condition, follow_obj, callback) {
    dependencies.Follow
        .update(follow_obj, {
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

FollowRepository.prototype.delete = function (condition, callback) {
    dependencies.Follow
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

module.exports = FollowRepository;
