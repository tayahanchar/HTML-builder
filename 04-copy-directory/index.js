const fs = require('fs');
const fsp = fs.promises;

const path = require('path');

const filesDir = path.resolve('04-copy-directory/files');
const copyFilesDir = path.resolve('04-copy-directory/files-copy');
const dir = path.resolve('04-copy-directory');

fsp
  .readdir(dir)
  .then(async (data) => {
    if (data.find((item) => item === 'files-copy')) {
      await fsp.rm(copyFilesDir, { recursive: true });
    }
  })
  .then(async () => {
    await fsp.mkdir(copyFilesDir, { recursive: true });
  })
  .then(async () => {
    return fsp.readdir(filesDir);
  })
  .then((data) => {
    data.forEach((file) => {
      const filePath = path.join(filesDir, file);
      const copyFilePath = path.join(copyFilesDir, file);
      const readStream = fs.createReadStream(filePath);
      const writeStream = fs.createWriteStream(copyFilePath);
      readStream.pipe(writeStream);
    });
  });
