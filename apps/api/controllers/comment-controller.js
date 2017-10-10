var dependencies = {
    comment_service: null
}

var CommentController = function (comment_service) {
    dependencies.comment_service = comment_service;
}

CommentController.prototype.retrieve_all = function (req, res, next) {
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;

    dependencies.comment_service.retrieve_all(page, limit, function (err, comments) {
        if (err) {
            next(err);
        } else {
            res.comments = comments;
            next();
        }
    });
}

CommentController.prototype.create = function (req, res, next) {
    dependencies.comment_service.create(req.comment_obj, function (err, comment) {
        if (err) {
            next(err);
        } else {
            res.comment = comment;
            next();
        }
    });
}

CommentController.prototype.block = function (req, res, next) {
    dependencies.comment_service.block(req.params.comment_id, function (err, comment_blocked) {
        if (err) {
            next(err);
        } else {
            res.comment_blocked = comment_blocked;
            next();
        }
    });
}

module.exports = CommentController;
