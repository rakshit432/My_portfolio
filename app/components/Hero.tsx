"use client";

import NeuralBackground from "@/components/ui/flow-field-background";
import GlassmorphismProfileCard from "@/components/ui/glassmorphism-profile-card";
import { useRef, useEffect } from "react";
import { useReducedMotion, motion } from "framer-motion";
import { Github, Linkedin, Terminal } from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
/* ---------------- Hero ---------------- */

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  /* ---------------- GSAP Scroll Magic ---------------- */
  useEffect(() => {
    if (reduceMotion || !sectionRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })
        .to(cardRef.current, {
          scale: 0.92,
          y: -60,
          opacity: 0,
          ease: "none",
        });
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative overflow-hidden min-h-screen flex items-center justify-center px-6 scroll-mt-32"
    >
      <NeuralBackground
        className="absolute top-0 left-0 h-full w-full -z-10 pointer-events-none"
        color="#818cf8"
        speed={0.8}
        trailOpacity={0.15}
      />

      <div ref={cardRef} className="relative z-10 w-full flex justify-center">
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="relative">
            <GlassmorphismProfileCard
              name="Rakshit K."
              role="Full-stack Developer"
              email="rakshitkumar.5905@gmail.com"
            />

            {/* DESKTOP SIDEBARS - Positioned relative to the card */}
            <div className="hidden md:flex absolute left-[105%] top-0 bottom-0 flex-row gap-4 h-full py-4 ml-2">
              {/* GitHub Sidebar */}
              <a href="https://github.com/rakshit432" target="_blank" rel="noopener noreferrer" className="relative group w-12 h-full bg-white/5 border border-white/10 rounded-full flex flex-col items-center justify-start py-6 hover:bg-white/10 hover:border-white/20 transition-all">
                <Github size={20} className="text-white/60 group-hover:text-white transition-colors" />
                <span className="mt-auto mb-12 -rotate-90 text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-colors whitespace-nowrap">
                  GitHub
                </span>
              </a>

              {/* LeetCode Sidebar */}
              <a href="https://leetcode.com/u/Rakshit_kr/" target="_blank" rel="noopener noreferrer" className="relative group w-12 h-full bg-white/5 border border-white/10 rounded-full flex flex-col items-center justify-start py-6 hover:bg-white/10 hover:border-white/20 transition-all">
                <SiLeetcode size={20} className="text-white/60 group-hover:text-[#FFA116] transition-colors" />
                <span className="mt-auto mb-12 -rotate-90 text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-colors whitespace-nowrap">
                  LeetCode
                </span>
              </a>

              {/* TUF Sidebar */}
              <a href="https://takeuforward.org/profile/raks432" target="_blank" rel="noopener noreferrer" className="relative group w-12 h-full bg-white/5 border border-white/10 rounded-full flex flex-col items-center justify-start py-6 hover:bg-white/10 hover:border-white/20 transition-all">
                <Terminal size={20} className="text-white/60 group-hover:text-red-500 transition-colors" />
                <span className="mt-auto mb-12 -rotate-90 text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-colors whitespace-nowrap">
                  TUF
                </span>
              </a>
            </div>
          </div>

          {/* MOBILE LINKS */}
          <div className="flex md:hidden gap-4 justify-center mt-8">
            <a href="https://github.com/rakshit432" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/rakshit-kumar-9979b1292/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white">
              <Linkedin size={20} />
            </a>
            <a href="https://leetcode.com/u/Rakshit_kr/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white">
              <SiLeetcode size={20} />
            </a>
            <a href="https://takeuforward.org/profile/raks432" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white">
              <Terminal size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}