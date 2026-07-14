"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";

/* ─────────────────────────────────────────────────────────────
   Achievements Section — "signal_log.verified"
   Two tech achievements: DSA mastery + JEE performance.
   Left: floating Three.js polyhedron with scroll-parallax.
   Right: achievement cards with cinematic entrance.
───────────────────────────────────────────────────────────── */

const ThreeAchievementCrystal = dynamic(
  () => import("@/components/ui/three-achievement-crystal").then((m) => ({ default: m.ThreeAchievementCrystal })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

const ACHIEVEMENTS = [
  {
    id: "dsa",
    eyebrow: "> dsa_mastery.log",
    num: "01",
    icon: "⚡",
    headline: "700+",
    headlineSub: "Problems Solved",
    platforms: "LeetCode · Codeforces · GFG",
    description:
      "Systematically solved 700+ algorithmic problems covering Trees, Graphs, Dynamic Programming, Greedy, Binary Search, and System Design. Accuracy improved 20% within 3 months of focused daily practice.",
    tags: ["DSA", "Algorithms", "Competitive Programming"],
    stat: "20%",
    statLabel: "Accuracy Gain in 3 Months",
    color: "#C4183C",
    glow: "rgba(196,24,60,0.25)",
  },
  {
    id: "jee",
    eyebrow: "> jee_rank.verified",
    num: "02",
    icon: "🎯",
    headline: "97.83%",
    headlineSub: "JEE Mains Percentile",
    platforms: "Among 1.5M+ National Candidates",
    description:
      "Scored 97.83 percentile in JEE Mains — the national engineering entrance, among over 1.5 million candidates. Top 2.17% nationwide. This score secured admission to BIT Mesra's CSE program.",
    tags: ["JEE Mains", "National Rank", "Engineering Entrance"],
    stat: "Top 2.17%",
    statLabel: "Among 1.5M+ Candidates",
    color: "#7C3AED",
    glow: "rgba(124,58,237,0.25)",
  },
];

function AchievementCard({ ach, index }: { ach: (typeof ACHIEVEMENTS)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(241,237,228,0.08)",
        background: "rgba(18,13,30,0.65)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Rim-light strip top */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent, ${ach.color}, transparent)`,
          opacity: 0.6,
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(circle, ${ach.glow} 0%, transparent 70%)` }}
      />

      {/* Blueprint grid on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 p-7 md:p-9">
        {/* Eyebrow */}
        <div className="font-mono text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: ach.color }}>
          <span className="w-4 h-px" style={{ background: ach.color }} />
          {ach.eyebrow}
        </div>

        {/* Main number + icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{ach.icon}</div>
          <div>
            <div
              className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                background: `linear-gradient(115deg, #F1EDE4 30%, ${ach.color} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: `0 0 60px ${ach.color}40`,
              }}
            >
              {ach.headline}
            </div>
            <div
              className="font-mono text-[11px] uppercase tracking-widest mt-1"
              style={{ color: ach.color, opacity: 0.8 }}
            >
              {ach.headlineSub}
            </div>
          </div>
        </div>

        {/* Platform / context */}
        <div className="font-mono text-[10px] text-[#8B8698] uppercase tracking-wider mb-4">
          {ach.platforms}
        </div>

        {/* Description */}
        <p className="text-[13px] leading-relaxed text-[#8B8698] mb-6">{ach.description}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {ach.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[8px] px-2 py-1 rounded border uppercase tracking-wider"
              style={{ borderColor: `${ach.color}35`, color: ach.color, background: `${ach.glow.replace("0.25", "0.08")}` }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stat badge */}
        <div
          className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border"
          style={{ borderColor: `${ach.color}35`, background: `${ach.glow.replace("0.25", "0.08")}` }}
        >
          <span
            className="text-2xl font-extrabold"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              color: ach.color,
              textShadow: `0 0 20px ${ach.color}`,
            }}
          >
            {ach.stat}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#8B8698]">
            {ach.statLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Achievements() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  // Crystal parallax on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const crystalY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const crystalYSpring = useSpring(crystalY, { stiffness: 50, damping: 16 });

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="py-24 px-6 md:px-12 relative z-10 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Portal fog */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 100%, rgba(124,58,237,0.13) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 20% 50%, rgba(196,24,60,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* ── Section header ── */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16"
      >
        <div className="font-mono text-sm text-[#C4183C] flex items-center gap-2.5 mb-4 tracking-wide">
          <span className="w-6 h-px bg-[#C4183C]" />
          &gt; achievements.log
        </div>
        <h2
          className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight"
          style={{
            fontFamily: "'Unbounded', sans-serif",
            background: "linear-gradient(115deg, #F1EDE4 28%, #C4183C 62%, #7C3AED 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Verified <span style={{ WebkitTextFillColor: "#C4183C" }}>Records</span>
        </h2>
        <p className="text-sm text-[#8B8698] mt-4 leading-relaxed max-w-md">
          Signal-verified technical milestones — algorithmic mastery and national-scale academic performance.
        </p>
      </motion.div>

      {/* ── Two-column: 3D crystal + cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* 3D Crystal (col 4) */}
        <motion.div
          style={{ y: crystalYSpring }}
          className="lg:col-span-4 flex justify-center items-center mb-8 lg:mb-0"
        >
          <div className="relative w-[240px] h-[280px] lg:w-[300px] lg:h-[360px]">
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(196,24,60,0.15) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            <ThreeAchievementCrystal />
          </div>
        </motion.div>

        {/* Achievement cards (col 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {ACHIEVEMENTS.map((ach, i) => (
            <AchievementCard key={ach.id} ach={ach} index={i} />
          ))}
        </div>
      </div>

      {/* ── Bottom stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        className="mt-16 flex flex-wrap gap-8 items-center justify-center border-t border-white/5 pt-10"
      >
        {[
          { val: "700+", label: "DSA Problems" },
          { val: "97.83%", label: "JEE Percentile" },
          { val: "8.03", label: "CGPA at BIT Mesra" },
          { val: "5", label: "Live Projects" },
          { val: "3K+", label: "Verifications Built" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="text-xl font-extrabold"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                background: "linear-gradient(115deg, #F1EDE4, #C4183C)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {s.val}
            </div>
            <div className="font-mono text-[8px] text-[#8B8698] uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
