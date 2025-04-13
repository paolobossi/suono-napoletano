
const fs = require('fs-extra');
const path = require('path');

// Copy from assets directory
const assetsSourceDir = path.join(__dirname, 'assets');
const assetsTargetDir = path.join(__dirname, 'dist/public/assets');

// Copy from public directory
const publicSourceDir = path.join(__dirname, 'public');
const publicTargetDir = path.join(__dirname, 'dist/public');

// Ensure target directories exist
fs.ensureDirSync(assetsTargetDir);
fs.ensureDirSync(publicTargetDir);

// Copy assets
fs.copySync(assetsSourceDir, assetsTargetDir, { overwrite: true });
console.log('Assets copied successfully');

// Copy public files (including ads.txt)
fs.copySync(publicSourceDir, publicTargetDir, { overwrite: true });
console.log('Public files copied successfully');
