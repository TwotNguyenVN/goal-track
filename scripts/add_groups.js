const fs = require('fs');
const path = require('path');

const matchesPath = path.join(__dirname, '../data/matches.json');
const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

// There are 72 group matches. 12 groups (A to L), 6 matches each.
// To make it look realistic, we'll assign groups based on some mapping.
// Just sequentially assign 6 matches to each group.
const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
let groupIndex = 0;
let count = 0;

matches.forEach(m => {
    if (m.stage === 'Vòng đấu bảng') {
        // assign group
        m.group = `Bảng ${groups[groupIndex]}`;
        count++;
        if (count >= 6) {
            count = 0;
            groupIndex++;
        }
    } else {
        m.group = null;
    }
});

fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
console.log('Added groups to matches.json');
