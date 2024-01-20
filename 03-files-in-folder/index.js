const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const dir = path.resolve('03-files-in-folder/secret-folder');

fsp.readdir(dir).then((data) => {
  data.forEach((element) => {
    const elementPath = `${dir}/${element}`;
    fs.stat(elementPath, function (err, stats) {
      if (stats.isFile()) {
        const [name, extName] = path.basename(elementPath).split('.');
        console.log(`${name} - ${extName} - ${stats['size']}`);
      }
    });
  });
});
