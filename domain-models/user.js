var shortid = require("shortid");
var object_assign = require("object-assign");

var User = function(params) {
    var self = this;

    var props = object_assign({
        user_name: "Unnamed " + shortid.generate(),
        is_online: true,
        avatar: null,
        address: null
    }, params);

    self.user_name = props.user_name;
    self.is_online = props.is_online;
    self.avatar = props.avatar;
    self.phone_number = props.phone_number;
    self.address = props.address;
    self.hash = props.hash;
    self.salt = props.salt;
}

module.exports = User;
