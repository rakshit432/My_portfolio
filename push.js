const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Copy image first
console.log("-> Copying generated image asset...");
const src = "C:\\Users\\BIT\\.gemini\\antigravity-ide\\brain\\941fb357-655f-4d1d-91fe-18ce095b36b9\\rakshit_anime_portal_1784195530741.png";
const dest = path.join(__dirname, 'public', 'rakshit_anime_portal.png');

try {
  fs.copyFileSync(src, dest);
  console.log("SUCCESS: Image copied to " + dest);
} catch (err) {
  console.error("ERROR copying file. Make sure the file exists:", err);
  process.exit(1);
}

// 2. Git steps
const runCmd = (cmd) => {
  console.log(`-> Running: ${cmd}`);
  try {
    execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (err) {
    console.error(`ERROR running command "${cmd}":`, err.message);
    process.exit(1);
  }
};

runCmd("git add .");
runCmd('git commit -m "feat: complete interactive About clearance levels, 10s retro anime scan, and portal image drift"');
runCmd("git push origin main");

console.log("\n==========================================");
console.log("ALL STAGES COMPLETED & DEPLOYED SUCCESSFULLY!");
console.log("==========================================");
