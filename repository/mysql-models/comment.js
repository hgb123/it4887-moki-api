module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Comment", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            unique: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
            underscored: true
        });
}