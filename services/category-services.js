var dependencies = {
    category_repository: null
}

var CategoryService = function (category_repository) {
    dependencies.category_repository = category_repository;
}

CategoryService.prototype.retrieve_all = function (page, limit, callback) {
    dependencies.category_repository.find_all({}, page, limit, function (err, categories) {
        if (err) return callback(err);

        return callback(null, { categories });
    });
}

CategoryService.prototype.retrieve_one = function (id, callback) {
    var condition = { id: id };
    if (id == 0) return callback(null, { category: { id: 0, name: "Tất cả", created_at: null, updated_at: null } });
    dependencies.category_repository.find_by(condition, function (err, category) {
        if (err) return callback(err);

        if (!category) return callback({ type: "Not Found" });
        return callback(null, { category });
    });
}

module.exports = CategoryService;
