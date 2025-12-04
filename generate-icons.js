const sharp = require('sharp');
const fs = require('fs');

const svgBuffer = fs.readFileSync('./public/logo.svg');

async function generateIcons() {
  // Generate favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile('./public/favicon.ico');
  
  // Generate logo192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .toFile('./public/logo192.png');
  
  // Generate logo512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile('./public/logo512.png');
  
  console.log('✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
