
const fs = require('fs');

function readFile(file, encoding) {
	return new Promise((resolve) => {
		fs.readFile(file, encoding, (err, data) => {
			if (err) throw err;

			resolve(data);
		});
	});
}

function writeFile(file, data, encoding) {
	return new Promise((resolve) => {
		fs.writeFile(file, data, encoding, (err) => {
			if (err) throw err;

			resolve();
		});
	});
}


function* processFile(inputFilePath, outputFilePath, encoding) {
	try {
		const text = yield readFile(inputFilePath, encoding);
		const processedText = text.toUpperCase();

		yield writeFile(outputFilePath, processedText, encoding);

		return processedText;
	} catch (e) {
		console.error(String(e));
	}
}

function execute(generator, yeildValue) {
	const next = generator.next(yeildValue);

	if (!next.done) {
		next.value.then(result => execute(generator, result))
			.catch(err => generator.throw(err));
	} else {
		console.log(next.value);
	}
}

process.nextTick(() => execute(processFile('./input.txt', './output.txt', 'utf-8')));


function cb() {
	console.log('Processed in next iteration');
}
process.nextTick(cb);
console.log('Processed in the first iteration');

let bar;

// this has an asynchronous signature, but calls callback synchronously
function someAsyncApiCall(callback) { callback(); }

// the callback is called before `someAsyncApiCall` completes.
someAsyncApiCall(() => {
	// since someAsyncApiCall has completed, bar hasn't been assigned any value
	console.log('bar', bar); // undefined
});

bar = 1;
