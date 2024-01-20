const fs = require('fs'),
  fsp = fs.promises;
const path = require('path');

const stylesDir = path.resolve('06-build-page/styles');
const distDir = path.resolve('06-build-page/project-dist');
const componentsDir = path.resolve('06-build-page/components');
const dir = path.resolve('06-build-page');
const template = path.resolve('06-build-page/template.html');
const assetsDir = path.resolve('06-build-page/assets');

const filesArray = [];

async function example(elementPath) {
  const stats = await fsp.stat(elementPath);
  if (stats.isFile()) {
    const [name, extName] = path.basename(elementPath).split('.');
    if (extName === 'html') {
      filesArray.push(element);
    }
  }
}

async function newTextFile(elementPath) {
  const textNewFile = await fsp.readFile(elementPath, 'utf8');
  return textNewFile;
}

async function ex(elementPath) {
  const stats = await fsp.stat(elementPath);
  if (stats.isFile()) {
    const filePath = path.join(assetsDir, file);
    const copyFilePath = path.join(`${distDir}/assets`, file);
    console.log(copyFilePath);

    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(copyFilePath);

    readStream.pipe(writeStream);
  }

  if (stats.isDirectory()) {
    await fsp.mkdir(`${distDir}/assets/${file}`);

    const newFiles = await fsp.readdir(`${assetsDir}/${file}`);

    for (item of newFiles) {
      const filePath = path.join(`${dir}/assets/${file}`, item);
      const copyFilePath = path.join(`${distDir}/assets/${file}`, item);

      const readStream = fs.createReadStream(filePath);
      const writeStream = fs.createWriteStream(copyFilePath);

      readStream.pipe(writeStream);
    }
  }
}

fsp
  .readdir(dir)
  .then(async (data) => {
    if (data.find((item) => item === 'project-dist')) {
      await fsp.rm(distDir, { recursive: true });
    }
  })
  .then(async () => {
    await fsp.mkdir(distDir, { recursive: true });
  })
  .then(async () => {
    return fsp.readdir(componentsDir);
  })
  .then(async (data) => {
    for (element of data) {
      const elementPath = `${componentsDir}/${element}`;
      await example(elementPath);
    }

    return filesArray;
  })
  .then(async (data) => {
    const text = await fsp.readFile(template, 'utf8');
    let newText = text;
    for (item of data) {
      const textNewFile = await newTextFile(`${componentsDir}/${item}`);
      const key = `{{${item.split('.')[0]}}}`;
      const keyIndexOf = newText.indexOf(key);
      newText =
        newText.slice(0, keyIndexOf) +
        textNewFile +
        newText.slice(keyIndexOf + key.length);
    }
    const ff = await fsp.appendFile(`${distDir}/index.html`, newText);
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
                `${distDir}/style.css`,
                `${fileContent} \u000A \u000A `,
                function (error) {},
              );
            });
          }
        }
      });
    });
  })
  .then(async () => {
    await fsp.mkdir(`${distDir}/assets`);
    return await fsp.readdir(assetsDir);
  })
  .then(async (data) => {
    for (file of data) {
      const elementPath = `${assetsDir}/${file}`;
      await ex(elementPath);
    }
  });
