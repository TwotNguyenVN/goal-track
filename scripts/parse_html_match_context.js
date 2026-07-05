const fs = require('fs');
const html = fs.readFileSync('vnexpress_full.html', 'utf8');

const lines = html.split('\n');
const index = lines.findIndex(l => l.includes('Paraguay vs Pháp'));
if (index !== -1) {
    console.log("Context around 'Paraguay vs Pháp':");
    for (let i = Math.max(0, index - 15); i <= Math.min(lines.length - 1, index + 15); i++) {
        console.log(`${i}: ${lines[i].trim()}`);
    }
}
