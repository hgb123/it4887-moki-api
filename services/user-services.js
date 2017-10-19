var async = require("async");
var config = require("../config/config");
var dependencies = {
    user_repository: null,
    follow_repository: null,
    block_repository: null
}

var UserService = function (user_repository, follow_repository, block_repository) {
    dependencies.user_repository = user_repository;
    dependencies.follow_repository = follow_repository;
    dependencies.block_repository = block_repository;
}

UserService.prototype.retrieve_information = function (retriever_id, id, callback) {
    var condition = { id: id };
    dependencies.user_repository.find_by(condition, function (err, user) {
        if (err) return callback(err);

        if (!user) return callback({ type: "Not Found" });

        add_more_properties(retriever_id, id, user, function (err, user) {
            if (err) return callback(err);

            return callback(null, { user });
        });
    });
}

UserService.prototype.update_information = function (user_obj, callback) {
    var condition = { id: user_obj.id };
    delete user_obj.id;
    dependencies.user_repository.update(condition, user_obj, function (err, updated) {
        if (err) return callback(err);

        if (!updated) return callback({ type: "Something is wrong." });
        return callback(null, { message: "User's information is successfully updated." });
    });
}

function add_more_properties(retriever_id, id, user, callback) {
    // Default supplement props for both guest and user 
    user.is_followed = null;
    user.is_blocked = null;
    user.is_editable = false;
    delete user.hash;
    delete user.salt;

    if (!retriever_id) return callback(null, user);
    // Check if editable
    if (retriever_id == id) user.is_editable = true;
    async.series([
        // Check if followed
        function (cb) {
            var condition = {
                user_id1: retriever_id,
                user_id2: id
            }
            dependencies.follow_repository.find_by(condition, function (err, follow) {
                cb(err, follow != null);
            });
        },
        // Check if blocked
        function (cb) {
            var condition = {
                $or: [
                    { user_id1: retriever_id, user_id2: id },
                    { user_id2: retriever_id, user_id1: id }
                ]
            }
            dependencies.block_repository.find_all(condition, function (err, blocks) {
                cb(err, blocks.length > 0);
            });
        }
    ], function (err, results) {
        if (err) return callback(err);

        user.is_followed = results[0];
        user.is_blocked = results[1];
        return callback(null, user);
    });
}

module.exports = UserService;
