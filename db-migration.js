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

const migrateData = async (range) => {
    const siteid = '3b5fad211c';
	try {
        // await MSSQL.connect(CsDb.connection);
        MSSQL.close();
		const mysqlConnection = MYSQL.createConnection(mysqlDB.connection);
		await mysqlConnection.connect();
		console.log('Connected to MySQL!');
		// mysqlConnection.query = Util.promisify(mysqlConnection.query);
		// console.log('Connected to CrawlStats DB!');
		// const result = await MSSQL.query(`select * from testsites where siteid = '${siteid}'`);
		// console.dir(result.recordset[0]);
        // process.exit(1);
        MSSQL.connect(CsDb.connection, (err) => {
            const request = new MSSQL.Request();
            request.stream = true; // You can set streaming differently for each request
            // request.query('select top 500000 * from testsites order by siteid'); // or request.execute(procedure)
            // request.query('SELECT  * FROM (SELECT TOP 4000000 t.*, ROW_NUMBER() OVER (ORDER BY siteid) AS rownumber FROM testsites t ORDER BY siteid) t WHERE rownumber > 1300000 and rownumber <= 1400000');
            const min = range;
            const max = range + 100000;
            const query = `SELECT  * FROM (SELECT TOP 4000000 t.*, ROW_NUMBER() OVER (ORDER BY siteid) AS rownumber FROM testsites t ORDER BY siteid) t WHERE rownumber > ${min} and rownumber <= ${max}`;
            console.log('QUERY', query);
            request.query(query);
            let i = 0;
            request.on('row', (row) => {
                // const r = JSON.parse(row);
                // console.log(`Row ${i}:\n`, row);
                // Emitted once for each row in a query
                // try {
                const columns = [];
                const columnValues = [];
                let currentColumnValue;
                delete row.rownumber;
                Object.keys(row).forEach((property) => {
                    if (property !== 'rn') {
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
                                console.log(i + ': ', row[property]);
                            }
                        }
                    }
                });
                // const sql = `INSERT INTO localtestsites (${columns.concat()}) VALUES (${columnValues.concat()})`;
                // console.log('SQL', sql);
                // process.exit(1);
                // await mysqlConnection.query(sql);
                // const checkInsert = await mysqlConnection.query('select * from localtestsites');
                // console.log('SELECT MYSQL', checkInsert);
                let sqlQueryParams = [];
                // let q = mysqlConnectKnex('localtestsites').insert(row);
                let q = mysqlConnectKnex('bulktestsites').insert(row);
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
                // console.log('BUILT QUERY', q);
                // await mysqlConnectKnex.raw(q);
                // setTimeout(() => {
				mysqlConnection.query(q, (error) => {
					if (error) {
                        console.log('MYSQL Error ocurred: ', error);
                        throw error;
                    }
				});
                // if (error) throw error;
                // });
                // }, i);
                i += 1;
                // if (i === 100000) {
                // 	process.exit(1);
                // }
                // } catch (error) {
                //     console.error('MySQL Error: ', error);
                // }
                // console.log(row);
            });
            request.on('done', (result) => {
                console.log('Reading from MSSQL completed!');
                // process.exit(1);
                // Always emitted as the last one
            });
        });

        MSSQL.on('error', (err) => {
            console.log('CS MSSQL Error ocurred: ', err);
        });
	} catch (err) {
		console.error('MS SQL Error: ', err);
		// process.exit(1);
	}
};

// migrateData();

let timeout = 0;
let i = 0;
for (i = 0; i < 36; i++) {
    (function (ind) {
        console.log(`Method with delay ${timeout} started`);
    setTimeout(() => {
        migrateData(ind * 100000);
    }, timeout);}(i));
    timeout += 900000;
}
