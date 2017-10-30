var config = require("../config/config");
var mysql_data_context = require("../../repository/mysql-context")(config.mysql);

mysql_data_context.sequelize.sync().then(function() {
    console.log("Sync done");
    return;
});