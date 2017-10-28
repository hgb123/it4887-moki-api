var object_assign = require("object-assign");

var Conversation = function(params) {
    var self = this;

    var props = object_assign({
        is_seen: false
    }, params);

    self.sender_id = props.sender_id;
    self.receiver_id = props.receiver_id;
    self.message = props.message;
    self.is_seen = props.is_seen;
}

module.exports = Conversation;
