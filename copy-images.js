const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'images');
fs.mkdirSync(targetDir, { recursive: true });

const filesToCopy = [
  {
    src: 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\91fa8400-577b-4a19-ac99-03459c65ba27\\.user_uploaded\\media_1794063830175_f5763b6f.png',
    dest: 'hero-banner-main.png'
  },
  {
    src: 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\46c9df57-3d26-47fa-9f7d-f657dffdcbf8\\.user_uploaded\\media_1792418980717_5eeac56a.jpg',
    dest: 'banner-seasonal-1.jpg'
  },
  {
    src: 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\46c9df57-3d26-47fa-9f7d-f657dffdcbf8\\.user_uploaded\\media_1792418992971_414a1f85.jpg',
    dest: 'banner-seasonal-2.jpg'
  }
];

for (const item of filesToCopy) {
  if (fs.existsSync(item.src)) {
    const destPath = path.join(targetDir, item.dest);
    fs.copyFileSync(item.src, destPath);
    console.log('Copied:', item.dest, fs.statSync(destPath).size, 'bytes');
  } else {
    console.log('Source not found:', item.src);
  }
}
