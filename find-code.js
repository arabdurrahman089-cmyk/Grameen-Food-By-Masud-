const fs = require('fs');
const path = require('path');

function searchDir(dir, pattern, maxDepth = 4, depth = 0) {
  if (depth > maxDepth) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'AppData') continue;
      const fullPath = path.join(dir, entry.name);
      if (pattern.test(entry.name)) {
        console.log('MATCH:', fullPath);
      }
      if (entry.isDirectory()) {
        searchDir(fullPath, pattern, maxDepth, depth + 1);
      }
    }
  } catch (err) {
    // ignore access denied
  }
}

console.log('Searching C:\\Users\\lenovo ...');
searchDir('C:\\Users\\lenovo', /grameen|AdminLoginPage/i, 4);
