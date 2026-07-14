const fs = require("fs");
const path = require("path");

const src = "C:/Users/BIT/.gemini/antigravity-ide/brain/8294d09c-4e3e-4484-9ffa-f0f8b17991e9/dustin_formal_1783966719172.png";
const dest = path.join(__dirname, "public", "dustin_formal.png");

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log("Success: Image copied to public/dustin_formal.png");
} else {
  console.error("Error: Source file does not exist");
}
