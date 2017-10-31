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
                        name: user.user_name,
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

ConversationService.prototype.create = function (p_uid, n_uid, message, callback) {
    var self = this;
    var conversation_obj = new Conversation({
        sender_id: p_uid,
        receiver_id: n_uid,
        message: message
    });
    async.series([
        // Append new message
        function (cb) {
            dependencies.conversation_repository.create_message(conversation_obj, function (err, conversation) {
                cb(err, conversation);
            });
        },
        // Seen previous messages
        function (cb) {
            self.seen(p_uid, n_uid, function (err, seen) {
                cb(err, seen);
            });
        },
        // Set latest message in ChatList (step 1: del old)
        function (cb) {
            var condition = {
                $or: [
                    { sender_id: p_uid, receiver_id: n_uid },
                    { sender_id: n_uid, receiver_id: p_uid }
                ]
            }
            dependencies.conversation_repository.delete_list(condition, function (err, deleted) {
                cb(err, deleted);
            });
        },
        // Set latest message in ChatList (step 2: add new)
        function (cb) {
            var chat_list_objs = [
                { sender_id: p_uid, receiver_id: n_uid, latest_message: message },
                { sender_id: n_uid, receiver_id: p_uid, latest_message: message }
            ]
            async.each(chat_list_objs, function (chat_list_obj, e_cb) {
                dependencies.conversation_repository.create_list(chat_list_obj, function (err, created) {
                    if (err) e_cb(err);
                    else e_cb();
                });
            }, function (err) {
                cb(err, true);
            });
        }
    ], function (err, results) {
        if (err) return callback(err);

        var conversation = results[0];
        return callback(null, { conversation });
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

Conversation.prototype.is_on_same_conversation = function (p_uid, n_uid, callback) {
    var condition = {
        $or: [
            { sender_id: p_uid, receiver_id: n_uid, is_joined: true },
            { sender_id: n_uid, receiver_id: p_uid, is_joined: true }
        ]
    }
    dependencies.conversation_repository.find_all_list(condition, 0, 2, function (err, lists) {
        if (err) return callback(err);

        var is_on_same_conversation = list[0].is_joined && lists[1].is_joined;
        return (null, { is_on_same_conversation });
    });
}

ConversationService.prototype.join = function (p_uid, n_uid, callback) {
    var condition = {
        sender_id: p_uid,
        receiver_id: n_uid
    };
    async.waterfall([
        // Check if joined yet
        function (cb) {
            dependencies.conversation_repository.find_list_by(condition, function (err, list) {
                cb(err, list.is_joined);
            });
        },
        function (joined, cb) {
            // If joind, leave, vice versa 
            var updated_list = { is_joined: !joined };
            dependencies.conversation_repository.update_list(condition, updated_list, function (err, updated) {
                cb(err, joined);
            });
        }
    ], function (err, joined) {
        if (err) return callback(err);

        return callback(null, {
            message: "Successfully " + (joined ? "leave" : "join") + " the conversation."
        });
    });
}

module.exports = ConversationService;