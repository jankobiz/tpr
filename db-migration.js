/* eslint-disable no-unused-expressions */

require('events').EventEmitter.defaultMaxListeners = 100;
const MSSQL = require('mssql');
const MYSQL = require('mysql');
const Util = require('util');
const _ = require('lodash');
const winston = require('winston');

const logger = winston.createLogger({
	format: winston.format.json(),
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.File({ filename: 'info.log', level: 'info' }),
	],
});

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
		user: 'root',
		password: 'root',
		database: 'bm4',
		// database: 'autogf',
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
		user: 'root',
		// password: 'ivica',
		database: 'bm4',
		// database: 'autogf',
		timezone: 'utc',
		pool: {
			min: 1,
			max: 10000,
		},
	},
});

const uniqueTokenToMarkParameters = 'd177ce10-cc80-11e8-a994-eb4a5af7e834';

const migrateData = async (rangeBegining) => {
	MSSQL.close();
	const mysqlConnection = MYSQL.createConnection(mysqlDB.connection);
	await mysqlConnection.connect();
	logger.info('Connected to MySQL!');
	// mysqlConnection.query = Util.promisify(mysqlConnection.query);
	// const result = await MSSQL.query(`select * from testsites where siteid = '${siteid}'`);
	// console.dir(result.recordset[0]);
	// process.exit(1);
	MSSQL.connect(CsDb.connection, (err) => {
		if (err) {
			logger.error('MS SQL connection error', err);
		}
		const request = new MSSQL.Request();
		request.stream = true;
		let min = rangeBegining;
		const max = rangeBegining + 100000;
		if (min === 2300000) {
			min = 2354276;
		}
		// const query = `SELECT  * FROM (SELECT TOP 4000000 t.*, ROW_NUMBER() OVER (ORDER BY siteid) AS rownumber FROM testsites t ORDER BY siteid) t WHERE rownumber > ${min} and rownumber <= ${max}`;
		const query = `select * from testsites where siteid in ('505740c910d', '507bab9e13b', '50c1b5b38', '52220fea2', '54912e3f5', '58c4bff00','58c38cad0', '58c4bff00', 
            '58c604533', '58c6b9770', '58e3b8e70', '58e3bedb0', '5910d2500', '595d03e60', '595d16cc0', '595d5a010', '595d6ffa1b', '598c70fd0', '5991dc5d0')`;
		logger.info('QUERY', query);
		request.query(query);
		let i = 0;
		request.on('row', (row) => {
			// const r = JSON.parse(row);
			// console.log(`Row ${i}:\n`, row);
			logger.info('Row :\n', row);
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
						if (property === 'sitetitle') {
							logger.info(`${i}: `, row[property]);
						}
					}
				}
			});
			let sqlQueryParams = [];
			// let q = mysqlConnectKnex('localtestsites').insert(row);
			let q = mysqlConnectKnex('localtestsites').insert(row);
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
				q = q.replace(uniqueTokenToMarkParameters, `'${parameter}'`);
			});
			q = q.replace(/'null'/g, 'null');
			q = q.replace(/eae25c80-ebed-11e8-886f-b3991063a847/g, '$');
			q = q.replace(/d4571ee0-ebfe-11e8-a206-e705b46026da/g, '\\\\');
			logger.info('BUILT QUERY', q);
			// await mysqlConnectKnex.raw(q);
			mysqlConnection.query(q, (error) => {
				if (error) {
					// console.log('MYSQL Error ocurred: ', error);
					logger.error('MYSQL Error ocurred: ', error);
				}
			});
			i += 1;
		});
		request.on('done', (result) => {
			logger.info('Reading from MSSQL completed!');
		});
	});

	MSSQL.on('error', (err) => {
		logger.error('CS MSSQL Error ocurred: ', err);
	});
};

migrateData(1);

// let timeout = 0;
// let i = 23;
// for (i = 23; i < 36; i++) {
//     (function (ind) {
//         console.log(`Method with delay ${timeout} started`);
//     setTimeout(() => {
//         migrateData(ind * 100000);
//     }, timeout);}(i));
//     timeout += 900000;
// }
