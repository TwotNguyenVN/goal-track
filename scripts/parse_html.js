const fs = require('fs');
const html = fs.readFileSync('vnexpress_full.html', 'utf8');

// The matches are likely stored in a JSON object in the script tag or within typical HTML structure.
// Let's try to extract match entries.
let matches = html.match(/class="item-match"|class="match-box"|data-match-id/g) || [];
console.log(`Found ${matches.length} possible match containers by CSS class/data.`);

// Let's see if we can find teams
const teams = [...html.matchAll(/class="name"[^>]*>([^<]+)<\/span>|class="team-name"[^>]*>([^<]+)<\/span>/g)];
if (teams.length > 0) {
    console.log(`Extracted ${teams.length} team names.`);
    console.log(teams.map(t => t[1] || t[2]).slice(0, 20).map(t => t.trim()));
} else {
    // maybe other structure
    const texts = html.match(/Paraguay|Canada|Morocco|Pháp|Brazil|Tây Ban Nha/g) || [];
    console.log(`Found keywords: ${texts.length}`);
}

// See if there's any state inside a JSON object
const matchJson = html.match(/"matches":\s*(\[[^\]]+\])/);
if (matchJson) {
   console.log("Found matches JSON in page");
}
