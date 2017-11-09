module.exports = function (sequelize, DataTypes) {
    return sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        is_online: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 1
        },
        avatar: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        hash: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        device_token: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
            underscored: true
        });
}