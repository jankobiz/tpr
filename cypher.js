const uuidv1 = require('uuid/v1');

// console.log(Buffer.from('Hello World').toString('base64'));
console.log(uuidv1());
// console.log(Buffer.from(uuidv1()).toString('base64'));
const credJSON = {
	user: 'user',
	pass: 'pass',
};
console.log(Buffer.from(JSON.stringify(credJSON)).toString('base64'));
console.log(Buffer.from('eyJ1c2VyIjoidXNlciIsInBhc3MiOiJwYXNzIn0', 'base64').toString('ascii'));

console.log(new Date());

let someArray = [];

let object = {

	someArray: someArray,
}
someArray = [1, 2, 3];
console.log(object.someArray);
