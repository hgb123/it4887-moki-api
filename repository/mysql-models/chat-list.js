module.exports = function (sequelize, DataTypes) {
    return sequelize.define("ChatList", {
        sender_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        latest_message: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        latest_product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_joined: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
            underscored: true
        });
}