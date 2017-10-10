var async = require("async");
var config = require("../config/config");
var Comment = require("../domain-models/comment");
var dependencies = {
    comment_repository: null,
    user_repository: null
}

var CommentService = function (comment_repository, user_repository) {
    dependencies.comment_repository = comment_repository;
    dependencies.user_repository = user_repository;
}

CommentService.prototype.retrieve_all = function (page, limit, callback) {
    dependencies.comment_repository.find_all({}, page, limit, function (err, comments) {
        if (err) return callback(err);

        return callback(null, { comments });
    });
}

CommentService.prototype.create = function (comment_obj, callback) {
    var comment_obj = new Comment(comment_obj);
    dependencies.comment_repository.create(comment_obj, function (err, comment) {
        if (err) return callback(err);

        return callback(null, comment);
    });
}

CommentService.prototype.block = function (id, callback) {
    var condition = { id: id };
    async.waterfall([
        function (cb) {
            // Check if blocked yet
            dependencies.comment_repository.find_by(condition, function (err, comment) {
                cb(err, comment.is_blocked);
            });
        },
        function (is_blocked, cb) {
            dependencies.comment_repository.update(condition, { is_blocked: !is_blocked }, function (err, blocked) {
                cb(err, !is_blocked);
            });
        }
    ], function (err, blocked) {
        if (err) return callback(err);

        return callback(null, {
            message: "Comment is " + (blocked ? "blocked." : "unblocked.")
        });
    });
}

module.exports = CommentService;
