import { NextResponse } from "next/server";
import fs from "fs";
import https from "https";
import path from "path";

export async function GET() {
  const dest = path.join(process.cwd(), "public", "avatar.glb");
  const publicDir = path.dirname(dest);

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Check if file already exists and is valid
  if (fs.existsSync(dest)) {
    const stats = fs.statSync(dest);
    if (stats.size > 1000000) {
      return NextResponse.json({ success: true, message: "Avatar already downloaded", size: stats.size });
    }
  }

  const url = "https://raw.githubusercontent.com/wass08/r3f-lipsync-tutorial/main/public/models/646d9dcdc8a5f5bddbfac913.glb";

  console.log("Next.js Server: Downloading GLB from:", url);

  return new Promise<NextResponse>((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        resolve(NextResponse.json({ success: false, error: `Status code ${response.statusCode}` }, { status: 500 }));
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close(() => {
          const stats = fs.statSync(dest);
          console.log("Next.js Server: Download complete. Size:", stats.size);
          resolve(NextResponse.json({ success: true, size: stats.size }));
        });
      });
    }).on("error", (err) => {
      file.close();
      fs.unlink(dest, () => {});
      resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }));
    });
  });
}
