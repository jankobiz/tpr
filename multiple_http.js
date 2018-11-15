
const request = require('request-promise');
const got = require('got');

const urls = ['http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced'];

// const urls = [];
for (let i = 1; i <= 10; i++) {
	urls.push('http://localhost:3000/autogf/v1/sites?pageSize=10&page=1&gfStatus=synced');
}
// // console.log(urlss);
// let promises = urls.map(url => request(url));
// Promise.all(promises).then((data) => {
// 	// data = [promise1,promise2];
// 	const result = JSON.parse(JSON.stringify(data));
// 	result.forEach((element, key) => {
// 		console.log(`${key} number ${element}`);
// 	});
// 	console.log('Before');
// 	// console.log(JSON.stringify(data));
// }).catch((error) => {
// 	console.error(`Error ocurred ${error}`);
// });

const promises = urls.map(url => got(url, { json: true }));

Promise.all(promises).then((result) => {
	// data = [promise1,promise2];
	// const result = JSON.parse(JSON.stringify(data));
	result.forEach((element, key) => {
		console.log(`${key} number ${element.body.data[0].siteUrl}`);
	});
	console.log('Before');
	got('https://httpbin.org/get', { json: true }).then((res) => {
		console.log(res.url);
	// console.log(response.body);
	}).catch((error) => {
		console.log(error.response.body);
	});
	// console.log(JSON.stringify(data));
}).catch((error) => {
	console.error(`Error ocurred ${error}`);
});
