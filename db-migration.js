const MSSQL = require('mssql');
const MYSQL = require('mysql');
const Util = require('util');

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
		// timezone: 'utc',
	},
};

const migrateData = async () => {
	const siteid = '3b5fad211c';
	try {
		await MSSQL.connect(CsDb.connection);
		// console.log('Connected to CrawlStats DB!');
		// const result = await MSSQL.query(`select * from testsites where siteid = '${siteid}'`);
		// console.dir(result.recordset[0]);
		// try {
		// 	const mysqlConnection = MYSQL.createConnection(mysqlDB.connection);
		// 	await mysqlConnection.connect();
		// 	console.log('Connected to MySQL!');
		// 	mysqlConnection.query = Util.promisify(mysqlConnection.query);
		// 	const columns = [];
		// 	const columnValues = [];
		// 	let currentColumnValue;
		// 	Object.keys(result.recordset[0]).forEach((property) => {
		// 		currentColumnValue = result.recordset[0][property];
		// 		if (currentColumnValue !== null) {
		// 			if (property === 'dateadded' || property === 'dateupdated' || property === 'lastcrawl' ||
		//             property === 'autogf_lastrun' || property === 'autogf_lastsync') {
		// 				currentColumnValue = new Date(currentColumnValue).toISOString().replace(/Z$/, '');
		// 			}
		// 			columns.push(property);
		// 			columnValues.push(`'${currentColumnValue}'`);
		// 		}
		// 	});
		// 	const sql = `INSERT INTO localtestsites (${columns.concat()}) VALUES (${columnValues.concat()})`;
		// 	console.log('SQL', sql);
		// 	// process.exit(1);
		// 	await mysqlConnection.query(sql);
		// 	const checkInsert = await mysqlConnection.query('select * from localtestsites');
		// 	console.log('SELECT MYSQL', checkInsert);
		// } catch (error) {
		// 	console.error('MySQL Error: ', error);
		// }
		// process.exit(1);
		const request = new MSSQL.Request();
		request.stream = true; // You can set streaming differently for each request
		request.query('select top 100000 * from testsites'); // or request.execute(procedure)

		request.on('row', (row) => {
			// Emitted once for each recordset in a query
			console.log(row);
		});
		request.on('done', (result) => {
			process.exit(1);
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
