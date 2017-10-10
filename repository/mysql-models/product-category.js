module.exports = function (sequelize, DataTypes) {
    return sequelize.define("ProductCategory", {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    }, {
            underscored: true
        });
}