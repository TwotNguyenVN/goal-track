const fs = require('fs');
const html = fs.readFileSync('vnexpress_full.html', 'utf8');
const cheerio = require('cheerio'); // I can use regex if cheerio is not installed. Let's see if cheerio is installed.

// Instead of cheerio, let's use regex to find dates.
// usually it's something like <div class="date-header"> or something similar.
const lines = html.split('\n');
const index = lines.findIndex(l => l.includes('Paraguay vs Pháp'));
if (index !== -1) {
    console.log("Looking upwards for date header:");
    for (let i = index; i >= Math.max(0, index - 50); i--) {
        if (lines[i].includes('class="title-day"') || lines[i].includes('class="date"') || lines[i].includes('class="day"')) {
            console.log(`${i}: ${lines[i].trim()}`);
        }
    }
}
