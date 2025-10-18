const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// --- Configuration ---
const contentPath = 'content.json';
const templatePath = 'views/index.ejs';
const distPath = 'dist';
const assets = ['style.css', 'script.js', 'images', 'videos'];

// --- Clean and Create dist Directory ---
if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
}
fs.mkdirSync(distPath);

// --- Render HTML ---
try {
    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = ejs.render(template, { projects: content.projects });
    fs.writeFileSync(path.join(distPath, 'index.html'), html);
    console.log('✅ HTML generated successfully.');
} catch (error) {
    console.error('❌ Error rendering HTML:', error);
    process.exit(1);
}

// --- Copy Assets ---
assets.forEach(asset => {
    const sourcePath = path.join(__dirname, asset);
    const destPath = path.join(__dirname, distPath, asset);
    if (fs.existsSync(sourcePath)) {
        try {
            fs.cpSync(sourcePath, destPath, { recursive: true });
            console.log(`✅ Copied asset: ${asset}`);
        } catch (error) {
            console.error(`❌ Error copying asset ${asset}:`, error);
        }
    } else {
        console.warn(`⚠️ Asset not found, skipping: ${sourcePath}`);
    }
});

console.log('\nBuild successful! Your website is ready in the dist/ folder.');