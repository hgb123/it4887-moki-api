var object_assign = require("object-assign");

var Notification = function(params) {
    var self = this;

    var props = object_assign({
        is_read: false
    }, params);

    self.user_id = props.user_id;
    self.product_id = props.product_id;
    self.type = props.type;
    self.image = props.image;
    self.content = props.content;
    self.is_read = props.is_read;
}

module.exports = Notification;
