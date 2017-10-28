var async = require("async");
var Conversation = require("../domain-models/conversation");
var dependencies = {
    conversation_repository: null,
    user_repository: null
}

var ConversationService = function (conversation_repository, user_repository) {
    dependencies.conversation_repository = conversation_repository;
    dependencies.user_repository = user_repository;
}

ConversationService.prototype.retrieve_list = function (p_uid, page, limit, callback) {
    var condition = { sender_id: p_uid };
    dependencies.conversation_repository.find_all_list(condition, page, limit, function (err, conversations_list) {
        if (err) return callback(err);

        async.each(conversations_list, function (conversation, cb) {
            var condition = { id: conversation.receiver_id };
            dependencies.user_repository.find_by(condition, function (err, user) {
                if (err) cb(err);
                else {
                    var receiver = !user ? null : {
                        id: user.id,
                        name: user.user_name,
                        avatar: user.avatar
                    };
                    conversation.receiver = receiver;
                    delete conversation.receiver_id;
                    cb();
                }
            });
        }, function (err) {
            if (err) return callback(err);

            return callback(null, { conversations_list });
        });
    });
}

ConversationService.prototype.retrieve_all = function (p_uid, n_uid, page, limit, callback) {
    var self = this;
    var condition = {
        $or: [
            { sender_id: p_uid, receiver_id: n_uid },
            { sender_id: n_uid, receiver_id: p_uid }
        ]
    }
    dependencies.conversation_repository.find_all_message(condition, page, limit, function (err, conversations) {
        if (err) return callback(err);
        conversations.sort(function(a, b) {
            return a.created_at > b.created_at; 
        });

        return callback(null, { conversations });
        // TODO: set seen if page == 0
    });

}

ConversationService.prototype.create = function (p_uid, n_uid, message, callback) {
    // Set all previous message to seen
    // Set latest message in ChatList
    return callback(null, null);
}

ConversationService.prototype.seen = function (p_uid, n_uid, callback) {
    // Set all message of relevant sender receiver to seen
    return callback(null, null);
}



module.exports = ConversationService;
