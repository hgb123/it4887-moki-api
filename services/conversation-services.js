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

        async.each(conversations_list, function (conversation, e_cb) {
            async.parallel([
                // Get receiver's info
                function (cb) {
                    var condition = { id: conversation.receiver_id };
                    dependencies.user_repository.find_by(condition, function (err, user) {
                        cb(err, user);
                    });
                },
                // Count unseen message
                function (cb) {
                    var condition = {
                        sender_id: conversation.receiver_id,
                        receiver_id: p_uid,
                        is_seen: false
                    };
                    dependencies.conversation_repository.count_message(condition, function (err, unseen_messages) {
                        cb(err, unseen_messages);
                    });
                }
            ], function (err, results) {
                if (err) e_cb(err);
                else {
                    var user = results[0];
                    var receiver = !user ? null : {
                        id: user.id,
                        user_name: user.user_name,
                        avatar: user.avatar
                    };
                    delete conversation.receiver_id;
                    conversation.receiver = receiver;
                    conversation.unseen_messages = results[1];
                    e_cb();
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
        conversations.sort(function (a, b) {
            return a.created_at > b.created_at;
        });

        if (page == 0)
            self.seen(p_uid, n_uid, function (err, seen) {
                return callback(null, { conversations });
            });
        return callback(null, { conversations });
    });

}

ConversationService.prototype.create = function (p_uid, n_uid, prod_id, message, callback) {
    var self = this;
    var conversation_obj = new Conversation({
        sender_id: p_uid,
        receiver_id: n_uid,
        message: message
    });
    async.waterfall([
        // Append new message
        function (cb) {
            dependencies.conversation_repository.create_message(conversation_obj, function (err, conversation) {
                cb(err, conversation);
            });
        },
        // Seen previous messages
        function (conversation, cb) {
            self.seen(p_uid, n_uid, function (err, seen) {
                cb(err, conversation);
            });
        },
        // Check if receiver is on same chat
        function (conversation, cb) {
            self.is_on_same_conversation(n_uid, p_uid, function (err, res) {
                cb(err, conversation, res.is_on_same_conversation);
            });
        },
        // Set latest message in ChatList (step 1: del old)
        function (conversation, is_on_same_conversation, cb) {
            var condition = {
                $or: [
                    { sender_id: p_uid, receiver_id: n_uid },
                    { sender_id: n_uid, receiver_id: p_uid }
                ]
            }
            dependencies.conversation_repository.delete_list(condition, function (err, deleted) {
                cb(err, conversation, is_on_same_conversation);
            });
        },
        // Set latest message in ChatList (step 2: add new)
        function (conversation, is_on_same_conversation, cb) {
            var chat_list_objs = [
                { sender_id: p_uid, receiver_id: n_uid, latest_message: message, latest_product_id: prod_id, is_joined: true },
                { sender_id: n_uid, receiver_id: p_uid, latest_message: message, latest_product_id: prod_id, is_joined: is_on_same_conversation }
            ]
            async.each(chat_list_objs, function (chat_list_obj, e_cb) {
                dependencies.conversation_repository.create_list(chat_list_obj, function (err, created) {
                    if (err) e_cb(err);
                    else e_cb();
                });
            }, function (err) {
                cb(err, conversation, is_on_same_conversation);
            });
        }
    ], function (err, conversation, is_on_same_conversation) {
        if (err) return callback(err);

        return callback(null, { conversation, is_on_same_conversation });
    });
}

ConversationService.prototype.seen = function (p_uid, n_uid, callback) {
    var condition = {
        sender_id: n_uid,
        receiver_id: p_uid
    };
    var conversation_updated = { is_seen: true };
    dependencies.conversation_repository.update_message(condition, conversation_updated, function (err, seen) {
        if (err) return callback(err);

        return callback(null, { message: "Conversation has been seen." });
    });
}

ConversationService.prototype.is_on_same_conversation = function (p_uid, n_uid, callback) {
    var condition = {
        sender_id: p_uid,
        receiver_id: n_uid
    }
    dependencies.conversation_repository.find_list_by(condition, function (err, list) {
        if (err) return callback(err);

        var is_on_same_conversation = list ? list.is_joined : false;
        return callback(null, { is_on_same_conversation });
    });
}

ConversationService.prototype.join = function (p_uid, n_uid, is_joined, callback) {
    var condition = {
        sender_id: p_uid,
        receiver_id: n_uid
    };
    var updated_list = { is_joined };
    dependencies.conversation_repository.update_list(condition, updated_list, function (err, updated) {
        if (err) return callback(err);

        return callback(null, {
            message: "Successfully " + (is_joined ? "join" : "leave") + " the conversation."
        });
    });
}

ConversationService.prototype.count_badges = function (user_id, callback) {
    var condition = {
        receiver_id: user_id,
        is_seen: false
    }
    dependencies.conversation_repository.count_badges(condition, function (err, badges) {
        if (err) return callback(err);

        return callback(null, { badges });
    });
}

module.exports = ConversationService;