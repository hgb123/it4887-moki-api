module.exports = function (sequelize, DataTypes) {
    return sequelize.define("PushSetting", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            unique: true,
            allowNull: false
        },
        like: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        comment: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        conversation: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        following: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        announcement: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        sound_on: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        sound_default: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
            underscored: true
        });
}