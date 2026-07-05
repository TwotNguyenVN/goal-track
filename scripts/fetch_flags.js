const fs = require('fs');
const path = require('path');
const http = require('https'); // assuming https URLs

const htmlPath = path.join(__dirname, '../vnexpress_full.html');
const matchesPath = path.join(__dirname, '../data/matches.json');

const html = fs.readFileSync(htmlPath, 'utf8');
const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

// Find all team name and flag pairs
// Usually looks like: <img src="https://is.vnecdn.net/objects/teams/5529.png?v=1" alt="Canada"
// Or: <span class="avatar"><img src="..." alt="Canada"
const regex = /<img[^>]*src="([^"]+)"[^>]*alt="([^"]+)"/g;
let match;
const teamFlags = {};

while ((match = regex.exec(html)) !== null) {
    let url = match[1];
    let name = match[2].replace(' flag', '').trim();
    if (!teamFlags[name] && url.includes('teams')) {
        teamFlags[name] = url;
    }
}

// Map them to matches
matches.forEach(m => {
    if (teamFlags[m.home_team]) {
        m.home_flag = teamFlags[m.home_team];
    }
    if (teamFlags[m.away_team]) {
        m.away_flag = teamFlags[m.away_team];
    }
});

// Update matches.json
fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));

// Download images
const imgDir = path.join(__dirname, '../img/flags');
if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
}

async function downloadFlags() {
    for (const [team, url] of Object.entries(teamFlags)) {
        // Safe filename
        const safeName = team.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
        const dest = path.join(imgDir, safeName);
        
        // Skip if exists
        if (fs.existsSync(dest)) continue;
        
        await new Promise((resolve, reject) => {
            http.get(url, (res) => {
                if (res.statusCode === 200) {
                    const file = fs.createWriteStream(dest);
                    res.pipe(file);
                    file.on('finish', () => {
                        file.close(resolve);
                    });
                } else {
                    console.log(`Failed to download ${url} for ${team}`);
                    resolve(); // just skip
                }
            }).on('error', (err) => {
                console.log(`Error downloading ${team}: ${err.message}`);
                resolve();
            });
        });
        
        // Also update the matches to use local URL
        matches.forEach(m => {
            if (m.home_team === team) m.home_flag_local = `img/flags/${safeName}`;
            if (m.away_team === team) m.away_flag_local = `img/flags/${safeName}`;
        });
    }
    
    fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
    console.log(`Successfully processed flags for ${Object.keys(teamFlags).length} teams.`);
}

downloadFlags();
