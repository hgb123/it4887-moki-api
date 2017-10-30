module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Conversation", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            unique: true,
            autoIncrement: true,
            allowNull: false
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        is_seen: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
            underscored: true
        });
}