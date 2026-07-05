const fs = require('fs');
const html = fs.readFileSync('vnexpress_full.html', 'utf8');

// Find all script tags
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
console.log(`Found ${scripts.length} script tags.`);

let foundMatches = false;
for (const script of scripts) {
    const content = script[1];
    if (content.includes('matches') || content.includes('schedule') || content.includes('fixture')) {
        console.log('--- Found potential JSON block ---');
        console.log(content.substring(0, 500));
        foundMatches = true;
    }
}
if (!foundMatches) {
    console.log("No JSON block with matches found in scripts.");
}
