var dependencies = {
    db_context: null,
    User: null
}

var UserRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.User = db_context.User
}

UserRepository.prototype.find_all = function (condition, callback) {
    dependencies.User
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

UserRepository.prototype.find_by = function (condition, callback) {
    dependencies.User
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

UserRepository.prototype.create = function (user_obj, callback) {
    dependencies.User
        .create(user_obj)
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

UserRepository.prototype.update = function (condition, user_obj, callback) {
    dependencies.User
        .update(user_obj, {
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

UserRepository.prototype.delete = function (condition, callback) {
    dependencies.User
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

module.exports = UserRepository;
