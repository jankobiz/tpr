/* eslint-disable no-unused-expressions */
/* eslint-disable indent */
const MSSQL = require('mssql');
const MYSQL = require('mysql');
const Util = require('util');
const _ = require('lodash');

const CsDb = {
	connection: {
		server: '192.168.7.210',
		user: 'cs_readonly',
		password: 'CrawlingStats',
		database: 'CrawlingStats',
		requestTimeout: 300000,
		pool: {
			max: 10,
			min: 0,
			idleTimeoutMillis: 300000,
		},
	},
};

const mysqlDB = {
	connection: {
        host: 'localhost',
        user: 'ivica',
        password: 'ivica',
        database: 'autogf',
        timezone: 'utc',
        connectTimeout: 200000,
        acquireTimeout: 200000,
    },
};

const mysqlConnectKnex = require('knex')({
	client: 'mysql',
	connection: {
		server: 'localhost',
		port: '3306',
		user: 'ivica',
		password: 'ivica',
		database: 'autogf',
		timezone: 'utc',
		pool: {
			min: 1,
			max: 10000,
		},
	},
});

const uniqueTokenToMarkParameters = 'd177ce10-cc80-11e8-a994-eb4a5af7e834';

const migrateData = async () => {
    const siteid = '3b5fad211c';
	try {
		// await MSSQL.connect(CsDb.connection);
		const mysqlConnection = MYSQL.createConnection(mysqlDB.connection);
		await mysqlConnection.connect();
		console.log('Connected to MySQL!');
		mysqlConnection.query = Util.promisify(mysqlConnection.query);
		// console.log('Connected to CrawlStats DB!');
		// const result = await MSSQL.query(`select * from testsites where siteid = '${siteid}'`);
		// console.dir(result.recordset[0]);
        (async function () {
            try {
                const pool = await MSSQL.connect(CsDb.connection);
                // const selectQuery = 'SELECT  * FROM (SELECT TOP 4000000 t.*, ROW_NUMBER() OVER (ORDER BY siteid) AS rownumber FROM testsites t ORDER BY siteid) t WHERE rownumber > 200000 and rownumber <= 300000';
                const result = await pool.request().query('SELECT TOP 100 * FROM testsites');
                // console.dir(result.recordset);
                const columns = [];
                const columnValues = [];
                let currentColumnValue;
                const queries = [];
                // delete row.rownumber;
                result.recordset.forEach((row, index) => {
                    Object.keys(row).forEach((property) => {
                        currentColumnValue = row[property];
                        if (currentColumnValue !== null) {
                            currentColumnValue = currentColumnValue.toString().replace(/\$/g, 'eae25c80-ebed-11e8-886f-b3991063a847');
                            currentColumnValue = currentColumnValue.toString().replace(/\\/g, 'd4571ee0-ebfe-11e8-a206-e705b46026da');
                            if (property === 'dateadded' || property === 'dateupdated' || property === 'lastcrawl' ||
                                property === 'autogf_lastrun' || property === 'autogf_lastsync' || property === 'hardcodedate' ||
                                property === 'datenewdata' || property === 'awis_updated' || property === 'datesubmitted') {
                                currentColumnValue = new Date(currentColumnValue).toISOString().replace(/Z$/, '');
                            }
                            columns.push(property);
                            columnValues.push(`'${currentColumnValue}'`);
                            // eslint-disable-next-line no-param-reassign
                            row[property] = currentColumnValue;
                            if (property === 'siteid') {
                                console.log(`${index}: `, row[property]);
                            }
                        }
                    });
                    // console.log(row);
                });
                let sqlQueryParams = [];
                let q = mysqlConnectKnex('bulktestsites').insert(result.recordset);
                // queries.push(q);
                sqlQueryParams = sqlQueryParams.concat(q.toSQL().bindings);
                q = q.toSQL().sql;
                q = q.replace(/\?/g, uniqueTokenToMarkParameters);
                sqlQueryParams.forEach((param) => {
                    let parameter = param;
                    // escape single quote in string
                    if (_.isString(parameter)) {
                        parameter = parameter.replace(/'/g, '\'\'');
                    }
                    // console.log('Param', parameter);
                    q = q.replace(uniqueTokenToMarkParameters, '\'' + parameter + '\'');
                });
                q = q.replace(/'null'/g, 'null');
                q = q.replace(/eae25c80-ebed-11e8-886f-b3991063a847/g, '$');
                q = q.replace(/d4571ee0-ebfe-11e8-a206-e705b46026da/g, '\\\\');

                console.log('BUILT QUERY', q);
                try {
                    // await mysqlConnection.query(q);
                    await mysqlConnectKnex.raw(q);
                    console.log('Data inserted!');
                    process.exit(1);
                } catch (error) {
                    console.log('MySQL Inser Error ', error);
                }
            } catch (err) {
                // ... error checks
            }
        }());
        MSSQL.on('error', (err) => {
            // ... error handler
        });
	} catch (err) {
		console.error('MS SQL Error: ', err);
		// process.exit(1);
	}
};

migrateData();
