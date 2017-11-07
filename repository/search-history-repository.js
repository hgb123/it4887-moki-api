var object_assign = require("object-assign");
var dependencies = {
    db_context: null,
    SearchHistory: null
}

var SearchHistoryRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.SearchHistory = db_context.SearchHistory
}


var parse_search_history = function (search_history) {
    if (!search_history) return search_history;

    var tmp = search_history;
    if (tmp.condition) tmp.condition = JSON.parse(tmp.condition);
    return tmp.dataValues;
}

var stringify_search_history = function (search_history) {
    if (!search_history) return search_history;

    var tmp = object_assign({}, search_history);
    if (tmp.condition) tmp.condition = JSON.stringify(tmp.condition);
    return tmp;
}

SearchHistoryRepository.prototype.find_all = function (condition, page, limit, callback) {
    dependencies.SearchHistory
        .findAll({
            where: condition,
            limit: limit,
            offset: page * limit,
            order: [["created_at", "DESC"]]
        })
        .then(function (result) {
            for (var i = 0; i < result.length; i++) {
                result[i] = parse_search_history(result[i]);
            }
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

SearchHistoryRepository.prototype.count = function (condition, callback) {
    dependencies.SearchHistory
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

SearchHistoryRepository.prototype.find_by = function (condition, callback) {
    dependencies.SearchHistory
        .findOne({
            where: condition
        })
        .then(function (result) {
            var result = parse_search_history(result);
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

SearchHistoryRepository.prototype.create = function (search_obj, callback) {
    var search_obj = stringify_search_history(search_obj);
    dependencies.SearchHistory
        .create(search_obj)
        .then(function (result) {
            var result = parse_search_history(result);
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

SearchHistoryRepository.prototype.update = function (condition, search_obj, callback) {
    dependencies.SearchHistory
        .update(search_obj, {
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

SearchHistoryRepository.prototype.delete = function (condition, callback) {
    dependencies.SearchHistory
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

module.exports = SearchHistoryRepository;
