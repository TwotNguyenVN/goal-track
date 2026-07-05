const fs = require('fs');
const html = fs.readFileSync('vnexpress_full.html', 'utf8');

const regex = /<[^>]+class="[^"]*match[^"]*"[^>]*>[\s\S]{0,300}Paraguay[\s\S]{0,300}<\/[^>]+>/i;
const match = html.match(regex);
if (match) {
    console.log("Found match container with Paraguay:");
    console.log(match[0]);
} else {
    console.log("No match container found with Paraguay. Let's find any text containing Paraguay.");
    const lines = html.split('\n');
    lines.forEach((line, i) => {
        if (line.includes('Paraguay')) {
            console.log(`Line ${i}:`, line.trim().substring(0, 150));
        }
    });
}
