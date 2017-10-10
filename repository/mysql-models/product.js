module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Product", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount_percent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        condition: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        images: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        video: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        brand: {
            type: DataType.STRING(50),
            allowNull: true
        },
        weight: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        size: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        dimension: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        ship_from: {
            type: DataType.STRING(200),
            allowNull: true
        },
        is_banned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
            underscored: true
        });
}