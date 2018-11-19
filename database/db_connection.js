var dbConfig = require('../config/database_config');

var mysqlConnect = require('knex')({
        client: dbConfig.mysql.client,
        connection: {
          server      : dbConfig.mysql.server,
          port        : dbConfig.mysql.port,
          user        : dbConfig.mysql.user,
          password    : dbConfig.mysql.password,
          database    : dbConfig.mysql.database
        }
});

module.exports = {
    mysqlConnect: mysqlConnect,

    mssqlConnect: require('knex')({
        client: dbConfig.mssql.client,
        connection: {
          server      : dbConfig.mssql.server,
          port        : dbConfig.mssql.port,
          user        : dbConfig.mssql.user,
          password    : dbConfig.mssql.password,
          database    : dbConfig.mssql.database
        }
    }),
    closemssql: function () {        
        mssqlConnect.destroy();
        console.log('MSSQL database connection closed!');
    },
    closemysql: function () {
        mysqlConnect.destroy();
        console.log('MySQL database connection closed!');
    }
};