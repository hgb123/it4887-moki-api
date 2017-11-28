module.exports = {
    port: 3000,
    mysql: {
        username: "hgb123",
        password: "Haha123456789",
        database: "moki",
        host: "baoserver.cra3yvihlrzl.us-east-2.rds.amazonaws.com",
        dialect: "mysql",
        logging: false
    },
    authen: {
        secret: "localtest",
        token_expires_in: "7d"
    },
    firebase: {
        service_account: require("../key/it4887-moki-cm-firebase-adminsdk-serviceacc"),
        database_url: "https://it4887-moki-cm.firebaseio.com"
    }
}