const fs = require('fs');
const html = fs.readFileSync('vnexpress_full.html', 'utf8');

// The class containing "name" or "team-name" was found. Let's find the parent container.
// It seems each match might be wrapped in something. Let's find the text around "Canada" and "Morocco"
const index = html.indexOf('Canada');
if (index !== -1) {
    const context = html.substring(Math.max(0, index - 300), index + 300);
    console.log("Context around Canada:");
    console.log(context);
}
