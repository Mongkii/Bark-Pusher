/*
 * @Description: 将 dist 目录打包为 zip。没有使用 rollup 的 zip 插件，因为它只能打包 pipeline 里的东西，无法自定义范围
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const getPath = (relativePath) => path.join(__dirname, relativePath);
const PACKAGE_PATH = getPath('../package.json');
const RELEASE_PATH = getPath('../releases');
const DIST_PATH = getPath('../dist');

const packageStr = fs.readFileSync(PACKAGE_PATH, 'utf-8');
const packageObj = JSON.parse(packageStr);
const { name, version } = packageObj;
const fileName = `${name}-${version}.zip`;

if (!fs.existsSync(RELEASE_PATH)) {
  fs.mkdirSync(RELEASE_PATH);
}

const writeStream = fs.createWriteStream(path.join(RELEASE_PATH, fileName));
writeStream.on('close', () => {
  console.log(`已打包为 ${fileName}`);
});

const archive = archiver('zip');
archive.pipe(writeStream);
archive.directory(DIST_PATH, false);
archive.finalize();
