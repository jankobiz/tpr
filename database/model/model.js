var dbConnection = require('../db_connection');
var mssqlKnex = dbConnection.mssqlConnect;
var mysqlKnex = dbConnection.mysqlConnect;
var bookshelfMySQL = require('bookshelf')(mysqlKnex);
var bookshelfMSSQL = require('bookshelf')(mssqlKnex);

var TestsitesMSSQL = bookshelfMSSQL.Model.extend({
    tableName: 'testsites',
    idAttribute: 'siteid'
});

var TestsitesMySQL = bookshelfMySQL.Model.extend({
    tableName: 'sites',
    idAttribute: 'siteid',
});

var Queue = bookshelfMySQL.Model.extend({
    tableName: 'queue',
    idAttribute: 'id',
    jobs: function() {
        return this.hasOne(Jobs);
    }
});

var Jobs = bookshelfMySQL.Model.extend({
    tableName: 'jobs',
    idAttribute: 'id',
    queue: function() {
        return this.hasMany(Queue);
    }
});

var Results = bookshelfMySQL.Model.extend({
    tableName: 'results',
    idAttribute: 'id',
});

var Log = bookshelfMySQL.Model.extend({
    tableName: 'log',
    idAttribute: 'id',
});

var TestsitesCollection = bookshelfMySQL.Collection.extend({
        model: TestsitesMySQL
});

var JobsCollection = bookshelfMySQL.Collection.extend({
    model: Jobs
});

var QueueCollection = bookshelfMySQL.Collection.extend({
    model: Queue
});

function closeMSSQLConnection() {
    bookshelfMSSQL.knex.destroy();
    console.log('Microsoft SQL database connection closed!');
}

function closeMySQLConnection() {
    bookshelfMySQL.knex.destroy();
    console.log('MySQL database connection closed!');
}

module.exports = {
    TestsitesMSSQL: TestsitesMSSQL,
    TestsitesMySQL: TestsitesMySQL,
    Queue: Queue,
    Jobs: Jobs,
    Results: Results,
    Log: Log,
    TestsitesCollection: TestsitesCollection,
    JobsCollection: JobsCollection,
    QueueCollection: QueueCollection,
    closeMSSQLConnection: closeMSSQLConnection,
    closeMySQLConnection: closeMySQLConnection
}