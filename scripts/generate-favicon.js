import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicons() {
  const logoPath = path.join(__dirname, '../public/logo/logo.webp');
  const publicDir = path.join(__dirname, '../public');
  
  try {
    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
      console.error('Logo file not found:', logoPath);
      return;
    }

    console.log('Generating favicon files from logo...');

    // Generate favicon.ico (16x16)
    await sharp(logoPath)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));
    console.log('✓ Generated favicon-16x16.png');

    // Generate 32x32 favicon
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    console.log('✓ Generated favicon-32x32.png');

    // Generate Apple touch icon (180x180)
    await sharp(logoPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png');

    // Generate main favicon.ico (32x32 as ICO format)
    await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('✓ Generated favicon.ico');

    console.log('All favicon files generated successfully!');
    
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();