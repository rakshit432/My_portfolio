import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Copy the generated 3D avatar PNG asset to public folder during Next.js startup
try {
  const src = "C:/Users/BIT/.gemini/antigravity-ide/brain/8294d09c-4e3e-4484-9ffa-f0f8b17991e9/cyber_developer_1783967100718.png";
  const dest = path.join(process.cwd(), "public/developer_3d_avatar.png");
  
  const publicDir = path.dirname(dest);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
} catch (e) {
  console.error("Asset sync failed:", e);
}

// Copy the generated Dustin formal asset to public folder during Next.js startup
try {
  const src = "C:/Users/BIT/.gemini/antigravity-ide/brain/8294d09c-4e3e-4484-9ffa-f0f8b17991e9/dustin_formal_1783966719172.png";
  const dest = path.join(process.cwd(), "public/dustin_formal.png");
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log("Synced dustin_formal.png successfully!");
  }
} catch (e) {
  console.error("Dustin asset sync failed:", e);
}

// Copy dp.jpg from app/components to public so it can be served as a static asset
try {
  const dpSrc = path.join(process.cwd(), "app/components/dp.jpg");
  const dpDest = path.join(process.cwd(), "public/dp.jpg");
  if (fs.existsSync(dpSrc) && !fs.existsSync(dpDest)) {
    fs.copyFileSync(dpSrc, dpDest);
  }
} catch (e) {
  console.error("dp.jpg copy failed:", e);
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
};

export default nextConfig;
