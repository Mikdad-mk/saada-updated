const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Next.js cache...');

const cacheDir = path.join(process.cwd(), '.next');
const nodeModulesDir = path.join(process.cwd(), 'node_modules');

// Remove .next directory
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('✅ Removed .next directory');
}

// Remove node_modules/.cache if it exists
const nodeModulesCache = path.join(nodeModulesDir, '.cache');
if (fs.existsSync(nodeModulesCache)) {
  fs.rmSync(nodeModulesCache, { recursive: true, force: true });
  console.log('✅ Removed node_modules/.cache directory');
}

console.log('🎉 Cache cleared successfully!');
console.log('📝 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run dev'); 