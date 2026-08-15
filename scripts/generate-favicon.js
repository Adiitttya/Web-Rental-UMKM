const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const logoPath = path.join(__dirname, '../public/Logo/DsterGameLogo.png');
  const srcAppDir = path.join(__dirname, '../src/app');
  const publicDir = path.join(__dirname, '../public');

  console.log('Reading source logo:', logoPath);

  // 1. Get trimmed bounding box of logo so there is no wasted padding
  const trimmedBuffer = await sharp(logoPath)
    .trim()
    .toBuffer();

  // Helper to generate square centered image
  async function generateSquareIcon(size, paddingPercent = 0.08) {
    const innerSize = Math.round(size * (1 - paddingPercent * 2));
    const resizedLogo = await sharp(trimmedBuffer)
      .resize({
        width: innerSize,
        height: innerSize,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    return await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .png({ compressionLevel: 9, quality: 90 })
      .toBuffer();
  }

  // Generate PNG sizes
  const icon32 = await generateSquareIcon(32, 0.05);
  const icon48 = await generateSquareIcon(48, 0.05);
  const icon180 = await generateSquareIcon(180, 0.08);
  const icon192 = await generateSquareIcon(192, 0.08);
  const icon512 = await generateSquareIcon(512, 0.08);

  // Helper to build a multi-image ICO file from PNG buffers (32x32 and 48x48)
  function createIco(images) {
    const count = images.length;
    let headerSize = 6 + count * 16;
    let offset = headerSize;
    
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // ICO type
    header.writeUInt16LE(count, 4); // Number of images

    const dirEntries = [];
    const imageBuffers = [];

    for (const img of images) {
      const entry = Buffer.alloc(16);
      entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
      entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
      entry.writeUInt8(0, 2); // Color palette
      entry.writeUInt8(0, 3); // Reserved
      entry.writeUInt16LE(1, 4); // Color planes
      entry.writeUInt16LE(32, 6); // Bits per pixel
      entry.writeUInt32LE(img.buffer.length, 8); // Image size in bytes
      entry.writeUInt32LE(offset, 12); // Offset of image data

      dirEntries.push(entry);
      imageBuffers.push(img.buffer);
      offset += img.buffer.length;
    }

    return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
  }

  const icoBuffer = createIco([
    { width: 32, height: 32, buffer: icon32 },
    { width: 48, height: 48, buffer: icon48 }
  ]);

  // Write outputs
  fs.writeFileSync(path.join(srcAppDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  fs.writeFileSync(path.join(srcAppDir, 'icon.png'), icon192);
  fs.writeFileSync(path.join(srcAppDir, 'apple-icon.png'), icon180);

  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), icon180);

  console.log('Favicon generation completed successfully:');
  console.log('- favicon.ico size:', (icoBuffer.length / 1024).toFixed(2), 'KB');
  console.log('- icon.png (192x192) size:', (icon192.length / 1024).toFixed(2), 'KB');
  console.log('- apple-icon.png (180x180) size:', (icon180.length / 1024).toFixed(2), 'KB');
  console.log('- icon-512.png (512x512) size:', (icon512.length / 1024).toFixed(2), 'KB');
}

generateFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
