var dependencies = {
    db_context: null,
    Notification: null
}

var NotificationRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.Notification = db_context.Notification
}

NotificationRepository.prototype.find_all = function (condition, page, limit, callback) {
    dependencies.Notification
        .findAll({
            where: condition,
            limit: limit,
            offset: page * limit,
            order: [["created_at", "DESC"]]
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

NotificationRepository.prototype.count = function (condition, callback) {
    dependencies.Notification
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

NotificationRepository.prototype.find_by = function (condition, callback) {
    dependencies.Notification
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

NotificationRepository.prototype.create = function (noti_obj, callback) {
    dependencies.Notification
        .create(noti_obj)
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

NotificationRepository.prototype.update = function (condition, noti_obj, callback) {
    dependencies.Notification
        .update(noti_obj, {
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

NotificationRepository.prototype.delete = function (condition, callback) {
    dependencies.Notification
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

module.exports = NotificationRepository;