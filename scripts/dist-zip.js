/*
 * @Description: 将 dist 目录打包为 zip。没有使用 rollup 的 zip 插件，因为它只能打包 pipeline 里的东西，无法自定义范围
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const SOURCE_PATH = path.join(__dirname, '../dist');
const TARGET_PATH = path.join(__dirname, '../releases');

const { name, version } = require('../package.json');
const fileName = `${name}-${version}.zip`;

if (!fs.existsSync(SOURCE_PATH)) {
  console.error('未找到打包源！');
  return;
}

if (!fs.existsSync(TARGET_PATH)) {
  fs.mkdirSync(TARGET_PATH);
}

const writeStream = fs.createWriteStream(path.join(TARGET_PATH, fileName));
writeStream.on('close', () => {
  console.log(`已打包为 ${fileName}`);
});

const archive = archiver('zip');
archive.pipe(writeStream);
archive.directory(SOURCE_PATH, false);
archive.finalize();
