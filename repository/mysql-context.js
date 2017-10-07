var Sequelize = require("sequelize");

var DataContext = function(config) {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);

    var Product = sequelize.import("./mysql-models/product");
    // var Comment = require("./mysql-models/comment");
    // var Brand = require("./mysql-models/brand");
    // var ProductBrand = require("./mysql-models/product-brand");
    // var Category = require("./mysql-models/category");
    // var ProductCategory = require("./mysql-models/product-category");

    return {
        Product: Product,
        sequelize: sequelize
    }
}

module.exports = DataContext;