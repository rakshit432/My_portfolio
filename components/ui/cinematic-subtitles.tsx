"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   CinematicSubtitles
   A movie-style subtitle HUD that sits at the bottom of the viewport.
   Uses an IntersectionObserver to detect the scrolled section and
   plays animated movie subtitles (transcribing thoughts/status alerts).
───────────────────────────────────────────────────────────── */

const SUBTITLES: Record<string, string> = {
  home: '[CARRIER SIGNAL] "Rakshit Kumar: B.Tech CSE student at BIT Mesra. Initialising stack transmission..."',
  about: '[DECODER PROCESS] "Translating bio coordinates: MERN stack, Next.js architecture, and 800+ solved algorithmic nodes..."',
  experience: '[ARCHIVE RETRIEVAL] "Tracing professional timeline: web team leadership, academic milestones, and bearing RUL prognostics..."',
  skills: '[HARDWARE SCAN] "Compiling technical stack assets: React/Next, Node, Express, Databases, and time-series analytical tools..."',
  projects: '[DATABASE HOOK] "Accessing classified incident files. Active deployments: BlogOnSpot, ResumeBuilder, WebRTC portals..."',
  contact: '[BROADCAST MODULE] "Establishing secure output gateway.पटना and Mesra nodes online. Awaiting carrier connection packet..."',
};

export function CinematicSubtitles() {
  const [activeSection, setActiveSection] = useState("home");
  const [text, setText] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Set up IntersectionObserver to detect scrolled section
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveSection(e.target.id);
            // Dispatch global event for CRT static tracking switch
            const changeEvent = new CustomEvent("sectionChange", { detail: e.target.id });
            window.dispatchEvent(changeEvent);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-25% 0px -25% 0px" }
    );

    const sections = ["home", "about", "experience", "skills", "projects", "contact"];
    sections.forEach((s) => {
      const el = document.getElementById(s);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const subtitleText = SUBTITLES[activeSection] || "";

  // Typewriter effect simulation
  useEffect(() => {
    let active = true;
    let idx = 0;
    setText("");

    const tick = () => {
      if (!active) return;
      if (idx <= subtitleText.length) {
        setText(subtitleText.substring(0, idx));
        idx++;
        setTimeout(tick, 18);
      }
    };

    tick();

    return () => {
      active = false;
    };
  }, [subtitleText]);

  return (
    <div className="fixed bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-[9990] w-[calc(100%-3rem)] max-w-2xl pointer-events-none text-center">
      <AnimatePresence mode="wait">
        {text && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-2.5 rounded-lg bg-black/85 border border-white/5 backdrop-blur-md inline-block shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
          >
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wide leading-relaxed text-[#FACC15] select-none">
              {text}
              <span className="w-1.5 h-3 bg-[#FACC15] inline-block ml-1 animate-pulse align-middle" />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
