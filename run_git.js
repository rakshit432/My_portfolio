const { execSync } = require("child_process");
const fs = require("fs");

try {
  const status = execSync("git status", { encoding: "utf8" });
  const diff = execSync("git diff", { encoding: "utf8" });
  fs.writeFileSync("git_report.txt", `=== STATUS ===\n${status}\n\n=== DIFF ===\n${diff}`);
  console.log("Git status and diff written to git_report.txt successfully!");
} catch (e) {
  fs.writeFileSync("git_report.txt", `Error executing git: ${e.message}`);
  console.error("Git execution failed:", e.message);
}
