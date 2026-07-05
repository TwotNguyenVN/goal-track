const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../vnexpress_full.html');
const matchesPath = path.join(__dirname, '../data/matches.json');

const html = fs.readFileSync(htmlPath, 'utf8');
const existingMatches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

let updateCount = 0;

// Simple regex to parse the date and matches
// <div class="_wc2026_day_group" data-day-key="2026-07-07">
const dayGroupRegex = /<div class="_wc2026_day_group"\s+data-day-key="([^"]+)"([\s\S]*?)<\/div><div class="_wc2026_day_group"/g;
let match;
let lastIndex = 0;

// The regex above might be brittle. Let's just split by data-day-key
const parts = html.split('data-day-key="');
for (let i = 1; i < parts.length; i++) {
    const dayKey = parts[i].substring(0, 10); // 2026-07-07
    
    // get everything until the next part or end
    const chunk = parts[i];
    
    // find all doidau
    const matchBlocks = chunk.split('class="doidau');
    for (let j = 1; j < matchBlocks.length; j++) {
        const block = matchBlocks[j];
        
        // extract home team (doi-1 .name)
        const homeMatch = block.match(/class="doibong doi-1[^>]*>[\s\S]*?<span class="name">([^<]+)<\/span>/);
        const awayMatch = block.match(/class="doibong doi-2[^>]*>[\s\S]*?<span class="name">([^<]+)<\/span>/) || block.match(/class="doibong doi-2[^>]*>[\s\S]*?<span class="avatar">[\s\S]*?<\/span>\s*<span class="name">([^<]+)<\/span>/);
        const timeMatch = block.match(/class="ti-so"><span class="so">([^<]+)<\/span><\/div>/);
        
        if (homeMatch && awayMatch && timeMatch) {
            const homeTeam = homeMatch[1].trim();
            const awayTeam = awayMatch[1] ? awayMatch[1].trim() : awayMatch[2].trim();
            const timeStr = timeMatch[1].trim();
            
            if (timeStr.includes(':')) {
                const dateStr = `${dayKey}T${timeStr}:00+07:00`;
                const dateObj = new Date(dateStr);
                
                const existing = existingMatches.find(m => m.home_team === homeTeam && m.away_team === awayTeam);
                if (existing) {
                    const oldDate = new Date(existing.date);
                    if (oldDate.getTime() !== dateObj.getTime()) {
                        existing.date = dateObj.toISOString();
                        updateCount++;
                    }
                }
            }
        }
    }
}

if (updateCount > 0) {
    fs.writeFileSync(matchesPath, JSON.stringify(existingMatches, null, 2));
    console.log(`Updated dates for ${updateCount} matches.`);
} else {
    console.log('No dates needed updating.');
}
