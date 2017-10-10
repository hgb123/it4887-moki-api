var object_assign = require('object-assign');

var Comment = function(params) {
    var self = this;

    var props = object_assign({
        is_blocked: false
    }, params);

    self.user_id = props.user_id;
    self.product_id = props.product_id;
    self.content = props.content;
    self.is_blocked = props.is_blocked;
}

module.exports = Comment;
