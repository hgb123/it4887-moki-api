var object_assign = require("object-assign");

var PushSetting = function(params) {
    var self = this;

    var props = object_assign({
        like: true,
        comment: true,
        conversation: true,
        following: true,
        announcement: true,
        sound_on: true,
        sound_default: "default.mp3"
    }, params);

    self.user_id = props.user_id;
    self.like = props.like;
    self.comment = props.comment;
    self.conversation = props.conversation;
    self.following = props.following;
    self.announcement = props.announcement;
    self.sound_on = props.sound_on;
    self.sound_default = props.sound_default;
}

module.exports = PushSetting;
