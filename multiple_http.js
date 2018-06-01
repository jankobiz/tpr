
const request = require('request-promise');

const urls = ['http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced',
	'http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced'];

// const urls = [];
for (let i = 1; i <= 100; i++) {
	urls.push('http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced');
}
// console.log(urlss);
const promises = urls.map(url => request(url));
Promise.all(promises).then((data) => {
	// data = [promise1,promise2];
	const result = JSON.parse(JSON.stringify(data));
	result.forEach((element, key) => {
		console.log(`${key} number ${element}`);
	});
	console.log('Before');
	// console.log(JSON.stringify(data));
}).catch((error) => {
	console.error(`Error ocurred ${error}`);
});
