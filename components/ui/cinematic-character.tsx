"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   CinematicCharacter — Animated 2D Companion Guide
   Replaced the heavy 3D GLB model with a 100% lightweight,
   highly performant 2D vector/pixel animation canvas:
   - Floating retro terminal/CRT robot companion ("Signal Guide")
   - Animated blinking eyes, breathing console sways, and antenna signals
   - Look-at-cursor behavior: face screen slides relative to mouse coordinates
   - Click response: triggers screen glitches, spins, and shockwaves
───────────────────────────────────────────────────────────── */

const DIALOGUES: Record<string, string[]> = {
  home: [
    "System diagnostics active. Tap me to trigger a dimensional bypass!",
    "Ready to compile. Scroll down to enter the next coordinates.",
    "Grid integrity at 100%. Watching for incoming telemetry packets...",
  ],
  about: [
    "Searching local assets... Yes, 800+ solved DSA nodes found!",
    "Processing identity sequence. Ready to build full-stack Next.js systems.",
    "Open-source libraries synced. I adapt to any developer framework.",
  ],
  experience: [
    "Accessing history log... Tracing CSE student timelines at BIT Mesra.",
    "Prognostics mode activated. Predicting Remaining Useful Life of bearings...",
    "NSS web lead record retrieved: 3K+ student verifications secure.",
  ],
  skills: [
    "Luminance faders online. Hover a skill on the right to light up the stack!",
    "Compiling tools... Java, C++, TypeScript, Node, and SQL variables loaded.",
    "Warning: JavaScript runtime levels exceeding standard margins!",
  ],
  projects: [
    "Classified repository unlocked: BlogOnSpot, ResumeBuilder, and WebRTC.",
    "Click the live demo tags to test my live deployments in real-time.",
    "Warning: High WebGL density detected. Interactive flow field running.",
  ],
  contact: [
    "Establishing Patna-Mesra gateway. Input your name to transmit.",
    "Awaiting message packets. Type a command to broadcast to my signal.",
    "Coordinates locked. Click send to dispatch a packet into the void.",
  ],
};

export function CinematicCharacter() {
  const [activeSection, setActiveSection] = useState("home");
  const [dialogue, setDialogue] = useState("");
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [spinCount, setSpinCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track mouse coordinates for looks
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Monitor section transitions to update character dialogue
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveSection(e.target.id);
            const remarks = DIALOGUES[e.target.id] || ["Systems stable."];
            const chosen = remarks[Math.floor(Math.random() * remarks.length)];
            setDialogue(chosen);
            setIsBubbleOpen(true);

            // Auto-hide bubble after 5.5s
            const timer = setTimeout(() => setIsBubbleOpen(false), 5500);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-20% 0px -20% 0px" }
    );

    const sections = ["home", "about", "experience", "skills", "projects", "contact"];
    sections.forEach((s) => {
      const el = document.getElementById(s);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // 2D Vector Animation Rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Coordinates setup
      const cx = w / 2;
      const cy = h / 2 + 15;

      // Mouse tracking values
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // 1. Draw floating shadow
      ctx.fillStyle = "rgba(8,7,12,0.4)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 50, 24 + Math.sin(time) * 3, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base console box body (bobbing animation)
      const bob = Math.sin(time * 1.5) * 4;
      const robotY = cy + bob;

      // Draw Neck
      ctx.strokeStyle = "rgba(241, 237, 228, 0.15)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, robotY + 15);
      ctx.lineTo(cx, robotY + 32);
      ctx.stroke();

      // Draw Main Terminal Head (rounded box)
      const rw = 56;
      const rh = 46;
      ctx.fillStyle = "#120D1E"; // void-2
      ctx.strokeStyle = "#C4183C"; // crimson border
      ctx.lineWidth = 2.5;

      // Draw head container
      ctx.beginPath();
      ctx.roundRect(cx - rw / 2, robotY - rh / 2, rw, rh, 10);
      ctx.fill();
      ctx.stroke();

      // Antenna on top
      ctx.strokeStyle = "rgba(241, 237, 228, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, robotY - rh / 2);
      ctx.lineTo(cx + Math.sin(time * 2) * 6, robotY - rh / 2 - 16);
      ctx.stroke();

      // Antenna tip signal bulb
      ctx.fillStyle = Math.sin(time * 4) > 0 ? "#7C3AED" : "#C4183C";
      ctx.beginPath();
      ctx.arc(cx + Math.sin(time * 2) * 6, robotY - rh / 2 - 16, 4, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw face screen (inner CRT screen)
      const sw = 44;
      const sh = 34;
      ctx.fillStyle = "#08070C"; // void-1 screen
      ctx.beginPath();
      ctx.roundRect(cx - sw / 2, robotY - sh / 2, sw, sh, 6);
      ctx.fill();

      // Scanline effect inside screen
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      const scan = (time * 15) % sh;
      ctx.fillRect(cx - sw / 2, robotY - sh / 2 + scan, sw, 1);

      // 4. Look-at face animation (vector eyes/face elements sliding)
      const lookX = mx * 4;
      const lookY = my * 3;

      // Render pixel eyes (represented as green LED dashes)
      ctx.fillStyle = "#4ADE80"; // terminal green

      // Blinking simulation
      const isBlinking = Math.floor(time * 0.4) % 4 === 0 && Math.sin(time * 10) > 0.7;
      if (isBlinking) {
        // Closed blink lines
        ctx.fillRect(cx - 14 + lookX, robotY - 2 + lookY, 8, 2);
        ctx.fillRect(cx + 6 + lookX, robotY - 2 + lookY, 8, 2);
      } else {
        // Open pixel block eyes
        ctx.fillRect(cx - 14 + lookX, robotY - 4 + lookY, 6, 6);
        ctx.fillRect(cx + 8 + lookX, robotY - 4 + lookY, 6, 6);
      }

      // Small digital mouth / signal bar
      ctx.fillStyle = "#7C3AED";
      ctx.fillRect(cx - 4 + lookX, robotY + 6 + lookY, 8, 2 + Math.abs(Math.sin(time * 3)) * 3);

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  const handleCharacterClick = () => {
    setSpinCount((prev) => prev + 1);

    const clickRemarks = [
      "Bypassing dimensional firewall... Warning: Shockwave incoming!",
      "Acknowledge: diagnostic telemetry triggered.",
      "Lofi signals playing. Dimensions are fully stable.",
      "Accessing Patna-Mesra network pipeline... OK.",
      "Glitch levels elevated. Try clicking my logo!",
    ];
    setDialogue(clickRemarks[Math.floor(Math.random() * clickRemarks.length)]);
    setIsBubbleOpen(true);

    const shockEvent = new CustomEvent("avatarShockwave");
    window.dispatchEvent(shockEvent);
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9985] flex flex-col items-end pointer-events-none">
      {/* Typewriter speech bubble */}
      <AnimatePresence>
        {isBubbleOpen && dialogue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mb-3 mr-2 p-3 sm:p-4 rounded-xl bg-black/90 border border-white/10 text-left pointer-events-auto max-w-[220px] shadow-[0_12px_30px_rgba(0,0,0,0.85)]"
          >
            <span className="font-mono text-[7px] text-[#C4183C] uppercase tracking-wider block mb-1">Guide // Console</span>
            <p className="font-mono text-[9px] text-[#F1EDE4] leading-relaxed select-none">{dialogue}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating 2D Vector Canvas Wrapper */}
      <motion.div
        className="w-[110px] h-[150px] sm:w-[130px] sm:h-[180px] rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md pointer-events-auto cursor-pointer relative overflow-hidden group shadow-[0_15px_45px_rgba(0,0,0,0.9)]"
        style={{
          borderColor: "rgba(196, 24, 60, 0.2)",
        }}
        onClick={handleCharacterClick}
        whileHover={{ scale: 1.05, borderColor: "rgba(124, 58, 237, 0.4)" }}
        animate={{
          rotateY: spinCount * 360,
        }}
        transition={{
          rotateY: { type: "spring", stiffness: 120, damping: 20 },
        }}
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
        
        {/* Active rim glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#C4183C]/10 via-transparent to-transparent opacity-60 group-hover:from-[#7C3AED]/15 transition-all duration-300" />

        <canvas
          ref={canvasRef}
          width={130}
          height={180}
          className="w-full h-full block"
        />
      </motion.div>
    </div>
  );
}
