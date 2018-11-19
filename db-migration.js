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
			max: 1,
		},
	},
});

const uniqueTokenToMarkParameters = 'd177ce10-cc80-11e8-a994-eb4a5af7e834';

const migrateData = async () => {
	const siteid = '3b5fad211c';
	try {
		await MSSQL.connect(CsDb.connection);
		// const mysqlConnection = MYSQL.createConnection(mysqlDB.connection);
		// await mysqlConnection.connect();
		console.log('Connected to MySQL!');
		// mysqlConnection.query = Util.promisify(mysqlConnection.query);
		// console.log('Connected to CrawlStats DB!');
		// const result = await MSSQL.query(`select * from testsites where siteid = '${siteid}'`);
		// console.dir(result.recordset[0]);
		// process.exit(1);
		const request = new MSSQL.Request();
		request.stream = true; // You can set streaming differently for each request
		request.query('select top 100000 * from testsites'); // or request.execute(procedure)
		let i = 0;
		request.on('row', async (row) => {
			// const r = JSON.parse(row);
			// console.log(`Row ${i}:\n`, row);
			// Emitted once for each row in a query
			try {
				const columns = [];
				const columnValues = [];
				let currentColumnValue;
				Object.keys(row).forEach((property) => {
					currentColumnValue = row[property];
					if (currentColumnValue !== null) {
						if (property === 'dateadded' || property === 'dateupdated' || property === 'lastcrawl' ||
							property === 'autogf_lastrun' || property === 'autogf_lastsync' || property === 'hardcodedate' ||
							property === 'datenewdata' || property === 'awis_updated' || property === 'datesubmitted') {
							currentColumnValue = new Date(currentColumnValue).toISOString().replace(/Z$/, '');
						}
						columns.push(property);
						columnValues.push(`'${currentColumnValue}'`);
						// eslint-disable-next-line no-param-reassign
						row[property] = currentColumnValue;
					}
				});
				// const sql = `INSERT INTO localtestsites (${columns.concat()}) VALUES (${columnValues.concat()})`;
				// console.log('SQL', sql);
				// process.exit(1);
				// await mysqlConnection.query(sql);
				// const checkInsert = await mysqlConnection.query('select * from localtestsites');
				// console.log('SELECT MYSQL', checkInsert);
				let sqlQueryParams = [];
				let q = mysqlConnectKnex('localtestsites').insert(row);
				sqlQueryParams = sqlQueryParams.concat(q.toSQL().bindings);
				q = q.toSQL().sql;
				q = q.replace(/\?/g, uniqueTokenToMarkParameters);
				sqlQueryParams.forEach((param) => {
					let parameter = param;
					// escape single quote in string
					if (_.isString(parameter)) {
						parameter = parameter.replace(/\'/g, '\'\'');
					}
					q = q.replace(uniqueTokenToMarkParameters, '\'' + parameter + '\'');
				});
				q = q.replace(/'null'/g, 'null');
				// console.log('BUILT QUERY', q);
				await mysqlConnectKnex.raw(q);
				i += 1;
				if (i === 100000) {
					process.exit(1);
				}
			} catch (error) {
				console.error('MySQL Error: ', error);
			}
			// console.log(row);
		});
		request.on('done', (result) => {
			// process.exit(1);
			// Always emitted as the last one
		});
		// MSSQL.connect(CsDb.connection, (err) => {
		// 	// ... error checks

		// 	const request = new MSSQL.Request();
		// 	request.stream = true; // You can set streaming differently for each request
		// 	request.query('select top 1000 * from testsites'); // or request.execute(procedure)

		// 	request.on('recordset', (columns) => {
		// 		// Emitted once for each recordset in a query
		// 	});

		// 	request.on('row', (row) => {
		//         console.log(row);
		// 		// Emitted for each row in a recordset
		// 	});

		// 	request.on('error', (err) => {
		// 		// May be emitted multiple times
		// 	});

		// 	request.on('done', (result) => {
		// 		// Always emitted as the last one
		// 	});
		// });
	} catch (err) {
		console.error('MS SQL Error: ', err);
		process.exit(1);
	}
};

migrateData();
