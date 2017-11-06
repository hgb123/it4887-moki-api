module.exports = function (sequelize, DataTypes) {
    return sequelize.define("SearchHistory", {
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
        keyword: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        condition: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
            underscored: true
        });
}