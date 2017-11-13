var async = require("async");
var config = require("../config/config");
var Activity = require("../domain-models/activity");
var Comment = require("../domain-models/comment");
var dependencies = {
    comment_repository: null,
    user_repository: null,
    notification_service: null
}

var CommentService = function (comment_repository, user_repository, notification_service) {
    dependencies.comment_repository = comment_repository;
    dependencies.user_repository = user_repository;
    dependencies.notification_service = notification_service;
}

CommentService.prototype.retrieve_all = function (product_id, page, limit, callback) {
    dependencies.comment_repository.find_all({ product_id: product_id }, page, limit, function (err, comments) {
        if (err) return callback(err);

        async.each(comments, function (comment, cb) {
            var condition = { id: comment.user_id };
            dependencies.user_repository.find_by(condition, function (err, user) {
                if (err) cb(err);
                else {
                    var poster = !user ? null : {
                        id: user.id,
                        user_name: user.user_name,
                        avatar: user.avatar
                    };
                    comment.poster = poster;
                    cb();
                }
            });
        }, function (err) {
            if (err) return callback(err);

            return callback(null, { comments });
        });
    });
}

CommentService.prototype.create = function (comment_obj, callback) {
    var comment_obj = new Comment(comment_obj);
    dependencies.comment_repository.create(comment_obj, function (err, comment) {
        if (err) return callback(err);

        var noti_obj = {
            activity: Activity.PRODUCT_COMMENTED,
            user_id: comment.user_id,
            product_id: comment.product_id
        }
        dependencies.notification_service.handle(noti_obj, function (err, sent) {
            if (err) return callback(err);

            return callback(null, comment);
        });
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