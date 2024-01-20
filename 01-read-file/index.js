const fs = require('fs');
const path = require('path');
const pathTextFile = path.resolve('01-read-file', 'text.txt');

const readStream = fs.createReadStream(pathTextFile, 'utf-8');

readStream.on('data', (data) => {
  console.log(data);
});

readStream.on('error', (error) => {
  console.log(error);
});
