const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
	EventEmitter.call(this);

	// use nextTick to emit the event once a handler is assigned
	process.nextTick(() => {
		this.emit('event');
	});
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
	console.log('an event occurred!');
});

function apiCall(arg, callback) {
	if (typeof arg !== 'string') {
		process.nextTick(callback, new TypeError('argument should be string'));
	}
	console.log('Before argument should be string');
}

apiCall(1, err => console.log(err.message));

class TheEmitter extends EventEmitter {}

class AnotherEmitter extends EventEmitter {

	constructor() {
	}
}

const theEmitter = new TheEmitter();
myEmitter.on('event', function (a, b) {
	console.log(a, b, this);
	// Prints:
	//   a b MyEmitter {
	//     domain: null,
	//     _events: { event: [Function] },
	//     _eventsCount: 1,
	//     _maxListeners: undefined }
});
theEmitter.emit('event', 'Technoetics', 'Club');
