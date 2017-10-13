module.exports = {
    port: 3000,
    mysql: {
        username: "root",
        password: "Haha123456789",
        database: "moki",
        host: "localhost",
        dialect: "mysql"
    },
    authen: {
        secret: "localtest",
        token_expires_in: "2h"
    }
}