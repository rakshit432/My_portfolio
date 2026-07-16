const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\BIT\\.gemini\\antigravity-ide\\brain\\941fb357-655f-4d1d-91fe-18ce095b36b9\\rakshit_anime_portal_1784195530741.png";
const dest = path.join(__dirname, 'public', 'rakshit_anime_portal.png');

try {
  fs.copyFileSync(src, dest);
  console.log("SUCCESS: Image copied to " + dest);
} catch (err) {
  console.error("ERROR copying file:", err);
}
