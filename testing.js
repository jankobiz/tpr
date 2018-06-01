const assert = require('assert');

function addTwoNumbers(x, y) {
	return x + y;
}

function testAddTwoNumbers() {
	const x = 5;
	const y = 1;
	const sum1 = x + y;
	const sum2 = addTwoNumbers(x, y);

	console.log('addTwoNumbers() should return the sum of its two parameters.');
	console.log(`Expect ${sum1} to equal ${sum2}.`);

	try {
		assert.equal(sum1, sum2);

		console.log('Passed.');
	} catch (error) {
		console.error('Failed.');
	}
}

testAddTwoNumbers();

const http = require('http');

const urls = ['http://www.google.com', 'http://www.example.com'];
// const responses = [];
// let completedRequests = 0;

async function requests() {
	// for (i in urls) {
	// 	await http.get(urls[i], (res) => {
	// 		responses.push(res);
	// 		completedRequests++;
	// 		if (completedRequests == urls.length) {
	// 			// All download done, process responses array
	// 			console.log(responses);
	// 		}
	// 	});
	// }
	const value = await Promise
		.resolve(setTimeout(() => 1, 1000))
		.then(x => x * 3)
		.then(x => x * 3)
		.then(x => x * 3);
	console.log('Inside await!');
	return value;
}

requests().then(x => console.log(`x: ${x}`));
console.log('After http call!');

const rp = require('request-promise');

rp('http://www.google.com')
	.then(html => console.log(html)) // Process html...
	.catch(err => console.error(err)); // Crawling failed...

async function f() {
	const promise = new Promise((resolve, reject) => {
		setTimeout(() => resolve('done!'), 4000);
	});

	const promiseRequest = rp('http://www.google.com');

	const requestResult = await promiseRequest;

	console.log('In between ' + );

	const result = await promise; // wait till the promise resolves (*)

	console.log(result); // "done!"
	console.log();
}

f();
