var dependencies = {
    db_context: null,
    ChatList: null,
    Conversation: null
}

var ConversationRepository = function (db_context) {
    dependencies.db_context = db_context;
    dependencies.ChatList = db_context.ChatList;
    dependencies.Conversation = db_context.Conversation
}

// Conversations
ConversationRepository.prototype.find_all_message = function (condition, page, limit, callback) {
    dependencies.Conversation
        .findAll({
            where: condition,
            limit: limit,
            offset: page * limit,
            order: [["created_at", "DESC"]]
        })
        .then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i]) result[i] = result[i].dataValues;
            }
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.count_message = function (condition, callback) {
    dependencies.Conversation
        .count({
            where: condition
        })
        .then(function (result) {
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.count_badges = function (condition, callback) {
    dependencies.Conversation
        .aggregate("sender_id", "count", { distinct: true, where: condition })
        .then(function (result) {
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.find_message_by = function (condition, callback) {
    dependencies.Conversation
        .findOne({
            where: condition
        })
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.create_message = function (conversation, callback) {
    dependencies.Conversation
        .create(conversation)
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.update_message = function (condition, conversation, callback) {
    dependencies.Conversation
        .update(conversation, {
            where: condition
        })
        .then(function (result) {
            if (result.every(function (val) {
                return val == 1;
            })) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.delete_message = function (condition, callback) {
    dependencies.Conversation
        .destroy({
            where: condition
        })
        .then(function (row_deleted) {
            console.log("Row(s) deleted: ", row_deleted);
            callback(null, row_deleted);
        }, function (err) {
            callback(err, null);
        });
}

// Chat lists
ConversationRepository.prototype.find_all_list = function (condition, page, limit, callback) {
    dependencies.ChatList
        .findAll({
            where: condition,
            limit: limit,
            offset: page * limit,
            order: [["updated_at", "DESC"]]
        })
        .then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i]) result[i] = result[i].dataValues;
            }
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.find_list_by = function (condition, callback) {
    dependencies.ChatList
        .findOne({
            where: condition
        })
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.create_list = function (list, callback) {
    dependencies.ChatList
        .create(list)
        .then(function (result) {
            if (result) result = result.dataValues;
            callback(null, result);
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.update_list = function (condition, list, callback) {
    dependencies.ChatList
        .update(list, {
            where: condition
        })
        .then(function (result) {
            if (result.every(function (val) {
                return val == 1;
            })) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        })
        .catch(function (err) {
            callback(err, null);
        });
}

ConversationRepository.prototype.delete_list = function (condition, callback) {
    dependencies.ChatList
        .destroy({
            where: condition
        })
        .then(function (row_deleted) {
            console.log("Row(s) deleted: ", row_deleted);
            callback(null, row_deleted);
        }, function (err) {
            callback(err, null);
        });
}

module.exports = ConversationRepository;
