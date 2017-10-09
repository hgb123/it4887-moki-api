module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Category", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        }
    }, {
            underscored: true
        });
}