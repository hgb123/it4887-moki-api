var dependencies = {
    db_context: null,
    PushSetting: null
}

var PushSettingRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.PushSetting = db_context.PushSetting
}

PushSettingRepository.prototype.find_by = function (condition, callback) {
    dependencies.PushSetting
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

PushSettingRepository.prototype.create = function (cmt_obj, callback) {
    dependencies.PushSetting
        .create(cmt_obj)
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

PushSettingRepository.prototype.update = function (condition, cmt_obj, callback) {
    dependencies.PushSetting
        .update(cmt_obj, {
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

PushSettingRepository.prototype.delete = function (condition, callback) {
    dependencies.PushSetting
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

module.exports = PushSettingRepository;
