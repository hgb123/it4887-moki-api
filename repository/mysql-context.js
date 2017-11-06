var Sequelize = require("sequelize");

var DataContext = function(config) {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);

    var User = sequelize.import("./mysql-models/user");
    var Follow = sequelize.import("./mysql-models/follow");
    var Block = sequelize.import("./mysql-models/block");
    var ChatList = sequelize.import("./mysql-models/chat-list");
    var Conversation = sequelize.import("./mysql-models/conversation");
    var Product = sequelize.import("./mysql-models/product");
    var Like = sequelize.import("./mysql-models/like");
    var Comment = sequelize.import("./mysql-models/comment");
    var Brand = sequelize.import("./mysql-models/brand");
    var Category = sequelize.import("./mysql-models/category");
    var ProductCategory = sequelize.import("./mysql-models/product-category");
    var SearchHistory = sequelize.import("./mysql-models/search-history");

    return {
        User: User,
        Follow: Follow,
        Block: Block,
        ChatList: ChatList,
        Conversation: Conversation,
        Product: Product,
        Like: Like,
        Comment: Comment,
        Brand: Brand,
        Category: Category,
        ProductCategory: ProductCategory,
        SearchHistory: SearchHistory,
        sequelize: sequelize
    }
}

module.exports = DataContext;