const fs = require('fs');

const filePromise = new Promise(((resolve, reject) => {
    // Do async job
    fs.readFile('ini/config.ini', function (err, read) {
        if (err) {
            reject(err);
        } else {
            resolve(read);
        }
    })
}));
