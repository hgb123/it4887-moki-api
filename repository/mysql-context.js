var Sequelize = require("sequelize");

var DataContext = function(config) {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);

    var User = sequelize.import("./mysql-models/user");
    var Block = sequelize.import("./mysql-models/block");
    var Product = sequelize.import("./mysql-models/product");
    var Like = sequelize.import("./mysql-models/like");
    var Comment = sequelize.import("./mysql-models/comment");
    var Brand = sequelize.import("./mysql-models/brand");
    var Category = sequelize.import("./mysql-models/category");
    var ProductCategory = sequelize.import("./mysql-models/product-category");

    return {
        User: User,
        Block: Block,
        Product: Product,
        Like: Like,
        Comment: Comment,
        Brand: Brand,
        Category: Category,
        ProductCategory: ProductCategory,
        sequelize: sequelize
    }
}

module.exports = DataContext;