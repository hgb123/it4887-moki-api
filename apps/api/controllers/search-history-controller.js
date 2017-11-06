var dependencies = {
    search_history_service: null
}

var SearchHistoryController = function (search_history_service) {
    dependencies.search_history_service = search_history_service;
}

SearchHistoryController.prototype.retrieve_all = function (req, res, next) {
    var user_id = req.authen_user ? req.authen_user.id : null;
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;

    dependencies.search_history_service.retrieve_all(user_id, page, limit, function (err, search_histories) {
        if (err) {
            next(err);
        } else {
            res.search_histories = search_histories;
            next();
        }
    });
}

SearchHistoryController.prototype.retrieve_one = function (req, res, next) {
    var user_id = req.authen_user ? req.authen_user.id : null;
    dependencies.search_history_service.retrieve_one(user_id, req.params.search_history_id, function (err, search_history) {
        if (err) {
            next(err);
        } else {
            res.search_history = search_history;
            next();
        }
    });
}

SearchHistoryController.prototype.create = function (req, res, next) {
    var user_id = req.authen_user ? req.authen_user.id : null;
    dependencies.search_history_service.create(user_id, req.search_condition, function (err, search_history) {
        if (err) {
            next(err);
        } else {
            res.search_history = search_history;
            next();
        }
    });
}

SearchHistoryController.prototype.delete_all = function (req, res, next) {
    var user_id = req.authen_user ? req.authen_user.id : null;
    dependencies.search_history_service.delete_all(user_id, function (err, all_search_histories_deleted) {
        if (err) {
            next(err);
        } else {
            res.all_search_histories_deleted = all_search_histories_deleted;
            next();
        }
    });
}

module.exports = SearchHistoryController;