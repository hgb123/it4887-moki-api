var dependencies = {
    db_context: null,
    Comment: null
}

var CommentRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.Comment = db_context.Comment
}

CommentRepository.prototype.find_all = function (condition, page, limit, callback) {
    dependencies.Comment
        .findAll({
            where: condition,
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

CommentRepository.prototype.find_by = function (condition, callback) {
    dependencies.Comment
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

CommentRepository.prototype.create = function (cmt_obj, callback) {
    dependencies.Comment
        .create(cmt_obj)
        .then(function (result) {
            var result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

CommentRepository.prototype.update = function (condition, cmt_obj, callback) {
    dependencies.Comment
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

CommentRepository.prototype.delete = function (condition, callback) {
    dependencies.Comment
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

module.exports = CommentRepository;
