var dependencies = {
    db_context: null,
    Block: null
}

var BlockRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.Block = db_context.Block
}

BlockRepository.prototype.find_all = function (condition, callback) {
    dependencies.Block
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

BlockRepository.prototype.find_by = function (condition, callback) {
    dependencies.Block
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

BlockRepository.prototype.create = function (block_obj, callback) {
    dependencies.Block
        .create(block_obj)
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

BlockRepository.prototype.update = function (condition, block_obj, callback) {
    dependencies.Block
        .update(block_obj, {
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

BlockRepository.prototype.delete = function (condition, callback) {
    dependencies.Block
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

module.exports = BlockRepository;
