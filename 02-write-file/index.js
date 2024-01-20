const fs = require('fs');
const stream = require('stream');
const path = require('path');
const pathTextFile = path.resolve('02-write-file', 'text.txt');
const greetingMessage = 'Hello! Write something... \u000A';

const findExitWord = new stream.Transform({
  transform: function (chunk, encoding, cb) {
    if (chunk.toString().trim() === 'exit') {
      console.log('Bye! See you later!');
      process.exit();
    } else {
      const newString = chunk.toString();
      cb(null, newString);
    }
  },
});

process.stdout.write(greetingMessage);

const writeStream = fs.createWriteStream(pathTextFile);
process.stdin.pipe(findExitWord).pipe(writeStream);

process.on('SIGINT', function () {
  console.log('\u000A Bye! See you later!');
  process.exit();
});
