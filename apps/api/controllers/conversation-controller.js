var dependencies = {
    conversation_service: null
}

var ConversationController = function (conversation_service) {
    dependencies.conversation_service = conversation_service;
}

ConversationController.prototype.retrieve_list = function (req, res, next) {
    var page = req.options.offset ? req.options.offset : req.options.skip;
    var limit = req.options.limit;
    dependencies.conversation_service.retrieve_list(req.authen_user.id, page, limit, function (err, conversations_list) {
        if (err) {
            next(err);
        } else {
            res.conversations_list = conversations_list;
            next();
        }
    });
}

ConversationController.prototype.retrieve_all = function (req, res, next) {
    dependencies.conversation_service.retrieve_all(req.authen_user.id, req.params.user_id, function (err, conversations) {
        if (err) {
            next(err);
        } else {
            res.conversations = conversations;
            next();
        }
    })
}

ConversationController.prototype.create = function (req, res, next) {
    dependencies.conversation_service.create(req.authen_user.id, req.params.user_id, req.body_conversation_message, function (err, conversation) {
        if (err) {
            next(err);
        } else {
            res.conversation = conversation;
            next();
        }
    });
}

ConversationController.prototype.seen = function (req, res, next) {
    dependencies.conversation_service.seen(req.authen_user.id, req.params.user_id, function (err, conversation_seen) {
        if (err) {
            next(err);
        } else {
            res.conversation_seen = conversation_seen;
            next();
        }
    });
}



module.exports = ConversationController;
