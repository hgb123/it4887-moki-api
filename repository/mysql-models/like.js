module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Like", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    }, {
            underscored: true
        });
}