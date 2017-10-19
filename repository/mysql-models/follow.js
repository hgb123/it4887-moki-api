module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Follow", {
        user_id1: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        user_id2: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    }, {
            underscored: true
        });
}