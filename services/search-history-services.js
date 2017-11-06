var dependencies = {
    search_history_repository: null
}

var SearchHistoryService = function (search_history_repository) {
    dependencies.search_history_repository = search_history_repository;
}

SearchHistoryService.prototype.retrieve_all = function (user_id, page, limit, callback) {
    var condition = { user_id };
    dependencies.search_history_repository.find_all(condition, page, limit, function (err, search_histories) {
        if (err) return callback(err);

        return callback(null, { search_histories });
    });
}

SearchHistoryService.prototype.retrieve_one = function (user_id, id, callback) {
    var condition = { id, user_id };
    dependencies.search_history_repository.find_by(condition, function (err, search_history) {
        if (err) return callback(err);
        if (!search_history) return callback({ type: "Not Found" });

        return callback(null, { search_history });
    });
}

SearchHistoryService.prototype.create = function (user_id, condition, callback) {
    var search_obj = { user_id, keyword: condition.keyword, condition };
    dependencies.search_history_repository.create(search_obj, function (err, search_history) {
        if (err) return callback(err);

        return callback(null, { search_history });
    });
}

SearchHistoryService.prototype.delete_all = function (user_id, callback) {
    var condition = { user_id };
    dependencies.search_history_repository.delete(condition, function (err, deleted) {
        if (err) return callback(err);

        return callback(null, {
            message: "All search histories are deleted."
        });
    });
}

module.exports = SearchHistoryService;