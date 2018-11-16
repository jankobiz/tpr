function run(fn) {
	return new Worker(URL.createObjectURL(new Blob([`(${  fn  })()`])));
}

const worker = run(() => {
	let n = 1;
	const end_value = 10 ** 2;
	console.log(end_value);
	search: while (n <= end_value) {
		n++;
		for (let i = 2; i <= Math.sqrt(n); i++) {
			if (n % i === 0) {
				continue search;
			}
			// found a prime!
			postMessage(n);
		}
	}
	self.close();
});

function workerCore() {

}
worker.onmessage = (event) => {
	console.log('Worker', event.data);
};
