var async = require("async");
var dependencies = {
    conversation_service: null
}

var ChatApp = function (server, conversation_service) {
    dependencies.conversation_service = conversation_service;
    dependencies.io = require("socket.io").listen(server);
    dependencies.io.sockets.on("connection", handler);
}

function handler(socket) {
    console.log("One client connected");

    socket.on("join-conversation", function (data) {
        var sender_id = data.sender_id;
        var receiver_id = data.receiver_id;
        dependencies.conversation_service.join(sender_id, receiver_id, true, function (err, joined) {
            if (err) throw err;
            console.log(sender_id + " has joined the conversation with " + receiver_id);
        });
    });

    socket.on("is-typing", function (data) {
        var sender_id = data.sender_id;
        var receiver_id = data.receiver_id;
        var is_typing = data.is_typing;
        socket.broadcast.emit("is-typing-" + receiver_id, { is_typing });
    });

    socket.on("send-message", function (data) {
        // var data = JSON.parse(data);
        var sender_id = data.sender_id;
        var receiver_id = data.receiver_id;
        var product_id = data.product_id;
        var message = data.message;

        dependencies.conversation_service.create(sender_id, receiver_id, product_id, message, function (err, res) {
            if (err) throw err;

            var is_on_same_conversation = res.is_on_same_conversation;
            data.created_at = res.conversation.created_at;
            var event = "receive-mesage-" + receiver_id;
            console.log(sender_id + " sent a message to " + receiver_id);
            console.log("Message emmited to event " + event);
            dependencies.io.sockets.emit(event, data);
        });
    });

    socket.on("leave-conversation", function (data) {
        var sender_id = data.sender_id;
        var receiver_id = data.receiver_id;
        dependencies.conversation_service.join(sender_id, receiver_id, false, function (err, joined) {
            if (err) throw err;
            console.log(sender_id + " left the conversation with " + receiver_id);
        });
    });

    socket.on("disconnect", function () {
        console.log("A client has disconnected");
    });
}

module.exports = ChatApp;