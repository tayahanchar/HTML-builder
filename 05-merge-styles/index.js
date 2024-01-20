const fs = require('fs'),
  fsp = fs.promises;
const path = require('path');

const stylesDir = path.resolve('05-merge-styles/styles');
const distDir = path.resolve('05-merge-styles/project-dist/bundle.css');
const dir = path.resolve('05-merge-styles/project-dist/');

fsp
  .readdir(dir)
  .then(async (data) => {
    if (data.find((item) => item === 'bundle.css')) {
      await fsp.rm(distDir, { recursive: true });
    }
  })
  .then(async () => {
    return fsp.readdir(stylesDir);
  })
  .then(async (data) => {
    data.forEach((element) => {
      const elementPath = `${stylesDir}/${element}`;
      fs.stat(elementPath, function (err, stats) {
        if (stats.isFile()) {
          const [name, extName] = path.basename(elementPath).split('.');
          if (extName === 'css') {
            fs.readFile(elementPath, 'utf8', function (error, fileContent) {
              fs.appendFile(
                distDir,
                `${fileContent} \u000A \u000A `,
                function () {},
              );
            });
          }
        }
      });
    });
  });
