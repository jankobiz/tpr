const Rx = require('rxjs/Rx');

const data = [];
const foo = Rx.Observable.create((observer) => {
	console.log('inside');
	observer.next(42);
	observer.next(100);
	observer.next(200);
	let i = 0;
	let timeout = 0;
	function sendObservable() {
		return function (index) {
			setTimeout(() => observer.next(index), timeout);
		};
	}
	while (i < 10) {
		(sendObservable(observer, timeout)(i));
		timeout += 500;
		i += 1;
	}
	setTimeout(() => {
		observer.next(300); // happens asynchronously
	}, 1000);
	// observer.error('The end!');
	setTimeout(() => {
		observer.complete('Observable completed!');
	}, 10000);
});

console.log('before');
foo.subscribe(
(x) => {
	console.log(x);
	data.push(x);
},
(error) => { console.log(`An error occured!${  error}`); },
() => {
	console.log('Observable closed!');
	console.log(`Observable ended ${  data}`);
},
);
console.log('after');
