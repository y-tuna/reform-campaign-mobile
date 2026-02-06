const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');

  // Add type="module" to script tags that don't have it
  html = html.replace(
    /<script src="(.*?)" defer><\/script>/g,
    '<script type="module" src="$1"></script>'
  );

  fs.writeFileSync(indexPath, html);
  console.log('✅ Added type="module" to script tags in dist/index.html');
} else {
  console.error('❌ dist/index.html not found');
  process.exit(1);
}
