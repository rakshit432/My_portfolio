import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/providers/smooth-scroll";

export const metadata: Metadata = {
  title: "Rakshit Kumar — Aspiring Software Engineer | BIT Mesra",
  description:
    "Portfolio of Rakshit Kumar — Aspiring Software Engineer and Full Stack Developer at BIT Mesra. Building with React, Next.js, Node.js, MongoDB. 800+ DSA problems solved. Open to opportunities.",
  keywords: [
    "Rakshit Kumar",
    "Aspiring Software Engineer",
    "Full Stack Developer",
    "BIT Mesra",
    "React",
    "Next.js",
    "MERN Stack",
    "Portfolio",
    "Patna",
    "Java",
    "C++",
    "Node.js",
    "MongoDB",
  ],
  authors: [{ name: "Rakshit Kumar" }],
  openGraph: {
    title: "Rakshit Kumar — Aspiring Software Engineer",
    description: "Full Stack Developer at BIT Mesra. MERN stack, 700+ DSA problems solved.",
    type: "website",
  },
};

import StudioBootOverlay from "./components/providers/StudioBootOverlay";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StudioBootOverlay />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
