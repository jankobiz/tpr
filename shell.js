const shell = require('shelljs');

if (!shell.which('git')) {
	shell.echo('Sorry, this script requires git');
	shell.exit(1);
}

// Run external tool synchronously
if (shell.exec('').code !== 1) {
	console.log(shell.exec('dir').code);
	shell.exit(1);
}

