"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { prompt: "$", text: "node portfolio.js --env=production", delay: 200 },
  { prompt: ">", text: "Initialising runtime...", delay: 600, type: "dim" },
  { prompt: ">", text: "Loading modules  [react, next, three, gsap]", delay: 1000 },
  { prompt: "✓", text: "Dependencies resolved", delay: 1500, type: "success" },
  { prompt: ">", text: "Compiling experience data...", delay: 1900 },
  { prompt: "✓", text: "Build successful  (0 errors, 0 warnings)", delay: 2300, type: "success" },
  { prompt: ">", text: "Starting dev server on localhost:3000", delay: 2700 },
  { prompt: "✓", text: "READY  — welcome to rakshit.dev", delay: 3100, type: "accent" },
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
      }, line.delay);
      return () => clearTimeout(t);
    });

    const finish = setTimeout(() => setDone(true), 3700);
    return () => clearTimeout(finish);
  }, []);

  const handleComplete = useCallback(() => onComplete(), [onComplete]);

  return (
    <AnimatePresence mode="wait" onExitComplete={handleComplete}>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: ["inset(0 0 0% 0)", "inset(0 0 100% 0)"],
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between p-8 md:p-16"
          style={{ background: "var(--bg)" }}
        >
          {/* Top: Logo */}
          <div className="flex items-center justify-between">
            <span
              className="text-sm font-mono font-bold tracking-widest uppercase"
              style={{ color: "var(--accent)" }}
            >
              RK.
            </span>
            <span className="label" style={{ color: "var(--fg-dim)" }}>
              portfolio / v3.0
            </span>
          </div>

          {/* Center: Terminal */}
          <div className="max-w-xl w-full">
            {BOOT_LINES.map((line, i) => (
              <div
                key={i}
                className="terminal-line"
                style={{
                  opacity: visibleLines.includes(i) ? 1 : 0,
                  transform: visibleLines.includes(i) ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 0.3s, transform 0.3s",
                  transitionDelay: "0ms",
                }}
              >
                <span
                  className="prompt shrink-0"
                  style={{
                    color:
                      line.type === "success"
                        ? "#4ade80"
                        : line.type === "accent"
                        ? "var(--accent)"
                        : "var(--accent)",
                    fontWeight: 700,
                    width: "1rem",
                    display: "inline-block",
                  }}
                >
                  {line.prompt}
                </span>
                <span
                  style={{
                    color:
                      line.type === "success"
                        ? "#4ade80"
                        : line.type === "accent"
                        ? "var(--accent)"
                        : line.type === "dim"
                        ? "var(--fg-dim)"
                        : "var(--fg)",
                    fontWeight: line.type === "accent" ? 700 : 400,
                  }}
                >
                  {line.text}
                </span>
                {/* Blinking cursor on last visible line */}
                {visibleLines[visibleLines.length - 1] === i && !done && (
                  <span className="blink ml-1" style={{ color: "var(--accent)" }}>
                    ▌
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Bottom: Progress */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="label">Compiling</span>
              <span
                className="font-mono text-sm font-bold tabular-nums"
                style={{ color: "var(--accent)" }}
              >
                {progress}%
              </span>
            </div>
            {/* Progress track */}
            <div
              className="w-full h-[1px] relative"
              style={{ background: "var(--border)" }}
            >
              <motion.div
                className="absolute left-0 top-0 h-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ background: "var(--accent)" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
