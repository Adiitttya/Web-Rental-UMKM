const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const publicDir = path.join(__dirname, '../public');

  // 2. Optimize LandingPage.jpg safely
  const lpPath = path.join(publicDir, 'LandingPage.jpg');
  if (fs.existsSync(lpPath)) {
    const origLp = fs.statSync(lpPath).size;
    if (origLp > 300 * 1024) {
      const lpBuffer = await sharp(lpPath)
        .resize({ width: 1440, height: 900, fit: 'inside' })
        .jpeg({ quality: 82, progressive: true })
        .toBuffer();
      const tmpPath = path.join(publicDir, 'LandingPage.tmp.jpg');
      fs.writeFileSync(tmpPath, lpBuffer);
      fs.copyFileSync(tmpPath, lpPath);
      fs.unlinkSync(tmpPath);
      console.log(`- LandingPage.jpg: ${(origLp / 1024 / 1024).toFixed(2)} MB -> ${(fs.statSync(lpPath).size / 1024).toFixed(2)} KB`);
    }
  }

  // 3. Optimize LogitechLogo.png & NintendoLogo.png
  const logoDir = path.join(publicDir, 'Logo');
  const logitechPath = path.join(logoDir, 'LogitechLogo.png');
  if (fs.existsSync(logitechPath)) {
    const orig = fs.statSync(logitechPath).size;
    if (orig > 200 * 1024) {
      const buf = await sharp(logitechPath)
        .resize({ width: 400, fit: 'inside' })
        .png({ quality: 85, compressionLevel: 9 })
        .toBuffer();
      const tmpPath = path.join(logoDir, 'LogitechLogo.tmp.png');
      fs.writeFileSync(tmpPath, buf);
      fs.copyFileSync(tmpPath, logitechPath);
      fs.unlinkSync(tmpPath);
      console.log(`- LogitechLogo.png: ${(orig / 1024 / 1024).toFixed(2)} MB -> ${(fs.statSync(logitechPath).size / 1024).toFixed(2)} KB`);
    }
  }

  const nintendoPath = path.join(logoDir, 'NintendoLogo.png');
  if (fs.existsSync(nintendoPath)) {
    const orig = fs.statSync(nintendoPath).size;
    if (orig > 100 * 1024) {
      const buf = await sharp(nintendoPath)
        .resize({ width: 400, fit: 'inside' })
        .png({ quality: 85, compressionLevel: 9 })
        .toBuffer();
      const tmpPath = path.join(logoDir, 'NintendoLogo.tmp.png');
      fs.writeFileSync(tmpPath, buf);
      fs.copyFileSync(tmpPath, nintendoPath);
      fs.unlinkSync(tmpPath);
      console.log(`- NintendoLogo.png: ${(orig / 1024 / 1024).toFixed(2)} MB -> ${(fs.statSync(nintendoPath).size / 1024).toFixed(2)} KB`);
    }
  }

  console.log('All remaining image optimizations completed!');
}

optimizeImages().catch(console.error);
