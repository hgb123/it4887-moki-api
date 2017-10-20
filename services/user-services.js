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

UserService.prototype.retrieve_follow = function (is_getting_followers, retriever_id, id, page, limit, callback) {
    var self = this;
    async.waterfall([
        function (cb) {
            var condition = is_getting_followers ? { user_id2: id } : { user_id1: id };
            dependencies.follow_repository.find_all(condition, page, limit, function (err, follows) {
                cb(err, follows);
            });
        },
        function (follows, cb) {
            var f_ids = follows.map(function (follow) {
                return is_getting_followers ? follow.user_id1 : follow.user_id2;
            });
            var users = [];
            async.each(f_ids, function (f_id, e_cb) {
                self.retrieve_information(retriever_id, f_id, function (err, res) {
                    if (err) e_cb(err);
                    else {
                        var user = res.user;
                        delete user.is_online;
                        delete user.phone_number;
                        delete user.address;
                        delete user.is_editable;
                        users.push(user);
                        e_cb();
                    }
                });
            }, function (err) {
                return cb(err, users);
            });
        }
    ], function (err, users) {
        if (err) return callback(err);

        return callback(null, { users });
    });
}

UserService.prototype.follow = function (follower_id, id, callback) {
    var condition = {
        user_id1: follower_id,
        user_id2: id
    };
    async.waterfall([
        function (cb) {
            // Check if followed yet
            dependencies.follow_repository.find_by(condition, function (err, res) {
                cb(err, res);
            });
        },
        function (followed, cb) {
            if (followed) {
                // Unfollow
                dependencies.follow_repository.delete(condition, function (err, deleted) {
                    cb(err, false);
                });
            } else {
                // Follow
                dependencies.follow_repository.create(condition, function (err, created) {
                    cb(err, true);
                });
            }
        }
    ], function (err, followed) {
        if (err) return callback(err);

        return callback(null, {
            message: "User is successfully " + (followed ? "followed." : "unfollowed.")
        });
    });
}

UserService.prototype.retrieve_block = function (retriever_id, id, page, limit, callback) {
    if (retriever_id != id) return callback({ type: "Unauthorized" });

    var self = this;
    var condition = { user_id1: id };
    dependencies.block_repository.find_all(condition, page, limit, function (err, blocks) {
        if (err) return callback(err);

        var b_ids = blocks.map(function (block) {
            return block.user_id2;
        });
        var users = [];
        async.each(b_ids, function (b_id, cb) {
            self.retrieve_information(null, b_id, function (err, res) {
                if (err) cb(err);
                else {
                    var user = {
                        id: res.user.id,
                        user_name: res.user.user_name
                    }
                    users.push(user);
                    cb();
                }
            });
        }, function (err) {
            if (err) return callback(err);

            return callback(null, { users });
        });
    });
}

UserService.prototype.block = function (blocker_id, id, callback) {
    var condition = {
        user_id1: blocker_id,
        user_id2: id
    };
    async.waterfall([
        function (cb) {
            // Check if blocked yet
            dependencies.block_repository.find_by(condition, function (err, res) {
                cb(err, res);
            });
        },
        function (blocked, cb) {
            if (blocked) {
                // Unblock
                dependencies.block_repository.delete(condition, function (err, deleted) {
                    cb(err, false);
                });
            } else {
                // Follow
                dependencies.block_repository.create(condition, function (err, created) {
                    cb(err, true);
                });
            }
        }
    ], function (err, blocked) {
        if (err) return callback(err);

        return callback(null, {
            message: "User is successfully " + (blocked ? "blocked." : "unblocked.")
        });
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
