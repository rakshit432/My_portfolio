const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://raw.githubusercontent.com/wass08/r3f-lipsync-tutorial/main/public/models/646d9dcdc8a5f5bddbfac913.glb';
const dest = path.join(__dirname, 'public', 'avatar.glb');

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Downloading from:', url);
console.log('Saving to:', dest);

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: Status Code ${response.statusCode}`);
    file.close();
    fs.unlink(dest, () => {});
    process.exit(1);
  }

  response.pipe(file);

  file.on('finish', () => {
    file.close(() => {
      console.log('Download completed successfully!');
      // Check file size
      const stats = fs.statSync(dest);
      console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      process.exit(0);
    });
  });
}).on('error', (err) => {
  console.error('Error downloading file:', err.message);
  fs.unlink(dest, () => {});
  process.exit(1);
});
