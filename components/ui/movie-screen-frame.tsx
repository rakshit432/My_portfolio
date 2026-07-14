"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   MovieScreenFrame
   Frames the portfolio like a widescreen cinema monitor.
   - Widescreen black letterboxes (2.39:1 CinemaScope feel)
   - Real-time VHS scanlines & flicker overlay
   - Diagnostics overlays at screen corners (e.g. REC indicator, FPS, and timecodes)
───────────────────────────────────────────────────────────── */

export function MovieScreenFrame() {
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const ms = Math.floor((diff % 1000) / 10).toString().padStart(2, "0");
      const sec = Math.floor((diff / 1000) % 60).toString().padStart(2, "0");
      const min = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, "0");
      const hr = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");
      setTimecode(`${hr}:${min}:${sec}:${ms}`);
    }, 33);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeoutId: any = null;
    const handleSectionChange = () => {
      setIsGlitching(true);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsGlitching(false);
      }, 250);
    };

    window.addEventListener("sectionChange", handleSectionChange);
    return () => {
      window.removeEventListener("sectionChange", handleSectionChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {/* Cinematic Widescreen Letterbox Bars */}
      <div className="fixed top-0 left-0 right-0 h-4 sm:h-5 bg-[#030303] z-[9995] pointer-events-none border-b border-white/5" />
      <div className="fixed bottom-0 left-0 right-0 h-4 sm:h-5 bg-[#030303] z-[9995] pointer-events-none border-t border-white/5" />

      {/* CRT Scanline / VHS static overlay with dynamic glitching class */}
      <div className={`crt-overlay pointer-events-none ${isGlitching ? "glitching" : ""}`} />

      {/* Cinematic HUD Overlay: Top-Left REC indicator */}
      <div className="fixed top-7 left-6 sm:left-10 z-[9990] flex items-center gap-2 pointer-events-none select-none">
        <span className="w-2.5 h-2.5 rounded-full bg-[#C4183C] animate-[ping_1.5s_infinite] shrink-0" />
        <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-[#F1EDE4] font-bold">REC [TRANSMITTING]</span>
      </div>

      {/* Cinematic HUD Overlay: Top-Right Timecode */}
      <div className="fixed top-7 right-20 sm:right-10 z-[9990] text-right pointer-events-none select-none font-mono text-[8px] sm:text-[9px] tracking-wider text-white/50">
        TC {timecode}
      </div>

      {/* Cinematic HUD Overlay: Bottom-Left diagnostic coordinates */}
      <div className="fixed bottom-7 left-6 sm:left-10 z-[9990] pointer-events-none select-none font-mono text-[7px] sm:text-[8px] tracking-widest text-white/30 uppercase">
        SIGNAL // 829.4D // LATENCY 14MS
      </div>

      {/* Cinematic HUD Overlay: Bottom-Right volume/sound bars */}
      <div className="fixed bottom-7 right-6 sm:right-10 z-[9990] flex items-center gap-0.5 h-2 pointer-events-none select-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-[2px] bg-[#C4183C] rounded-sm"
            style={{
              height: `${Math.floor(Math.random() * 8 + 3)}px`,
              animation: `bounce-eq 0.8s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
