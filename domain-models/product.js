var object_assign = require("object-assign");

var Product = function(params) {
    var self = this;

    var props = object_assign({
        price: 0,
        discount_percent: 0,
        condition: 0,
        images: [],
        video: [],
        description: [],
        brand_id: null,
        weight: null,
        size: null,
        ship_from: null,
        is_banned: false
    }, params);

    self.user_id = props.user_id;
    self.name = props.name;
    self.price = props.price;
    self.discount_percent = props.discount_percent;
    self.condition = props.condition;
    self.images = props.images;
    self.video = props.video;
    self.description = props.description;
    self.brand_id = props.brand_id;
    self.weight = props.weight;
    self.size = props.size;
    self.ship_from = props.ship_from;
    self.is_banned = props.is_banned;
}

module.exports = Product;
