var async = require("async");
var io = require("socket.io");
var dependencies = {
    conversation_service: null
}

var ChatApp = function (server, conversation_service) {
    dependencies.conversation_service = conversation_service;
    io.listen(server).on("connection", handler);
}

function handler(socket) {
    console.log("One client connected");

    socket.on("join-conversation", function (data) {
        var sender_id = data.sender_id;
        var receiver_id = data.receiver_id;
        dependencies.conversation_service.join(sender_id, receiver_id, callback);
    });

    socket.on("typing", function (data) {
        // good-to-have: "is typing" experience
    });

    socket.on("send-message", function (data) {
        var sender_id = data.sender_id;
        var receiver_id = data.receiver_id;
        var message = data.message;
        async.series([
            // Append message
            function (cb) {
                dependencies.conversation_service.create(sender_id, receiver_id, message, function (err, sent) {
                    cb(err, send);
                });
            },
            // Check if both are on the same conversation
            function (cb) {
                dependencies.conversation_service.is_on_same_conversation(sender_id, receiver_id, function (err, res) {
                    cb(err, res.is_on_same_conversation);
                });
            },
            // Update chat list of receiver
            function (cb) {
                dependencies.conversation_service.retrieve_list(receiver_id, 0, 1000, function (err, res) {
                    cb(err, res.conversations_list);
                });
            }
        ], function (err, results) {
            var is_on_same_conversation = results[1];
            var conversations_list = results[2];
            var res = { is_on_same_conversation, conversations_list };
            socket.emit("receive_mesage", res);
        });
    });

    socket.on("leave-conversation", function (data) {
        var sender_id = data.sender_id;
        var receiver_id = data.receiver_id;
        dependencies.conversation_service.join(sender_id, receiver_id, callback);
    });

    socket.on("disconnect", function () {
        console.log("A client has disconnected");
    });
}

module.exports = ChatApp;