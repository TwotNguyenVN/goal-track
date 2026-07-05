const fs = require('fs');
const path = require('path');

const matchesPath = path.join(__dirname, '../data/matches.json');
const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

let updated = false;

matches.forEach(m => {
    if (m.home_team === 'Bosnia & Herz.') {
        m.home_flag_local = 'img/flags/Bosnia__amp__Herz_.png';
        m.home_flag = 'https://is.vnecdn.net/objects/teams/5527.png?v=1'; // placeholder or correct if known
        updated = true;
    }
    if (m.away_team === 'Bosnia & Herz.') {
        m.away_flag_local = 'img/flags/Bosnia__amp__Herz_.png';
        m.away_flag = 'https://is.vnecdn.net/objects/teams/5527.png?v=1'; 
        updated = true;
    }
});

if (updated) {
    fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
    console.log('Fixed Bosnia flags.');
}
