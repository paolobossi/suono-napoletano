
const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, 'assets');
const targetDir = path.join(__dirname, 'dist/public/assets');

fs.copySync(sourceDir, targetDir, { overwrite: true });
console.log('Assets copied successfully');
