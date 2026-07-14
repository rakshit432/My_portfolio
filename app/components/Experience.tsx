"use client";

import { useRef, memo, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Briefcase, Calendar, GraduationCap, MapPin, CheckCircle2 } from "lucide-react";

interface TimelineItem {
  id: string;
  type: "work" | "edu";
  role: string;
  company: string;
  period: string;
  desc: string;
  tech: string[];
  color: string;
  glow: string;
  metrics: string[];
}

const ITEMS: TimelineItem[] = [
  {
    id: "research_intern",
    type: "work",
    role: "Research Intern",
    company: "Birla Institute of Technology, Mesra",
    period: "2026",
    desc: "Conducted machine learning research to predict the Remaining Useful Life (RUL) of bearings. Developed deep learning architectures (LSTMs and CNNs) to analyze time-series vibration datasets for prognostics and health management.",
    tech: ["Python", "Deep Learning", "LSTMs/CNNs", "Time-Series Analysis", "Predictive Maintenance"],
    color: "#7C3AED",
    glow: "rgba(124, 58, 237, 0.25)",
    metrics: ["Focus: RUL Prediction", "Data: Vibration Signals", "Models: DL Architectures"],
  },
  {
    id: "nss",
    type: "work",
    role: "Cyber & Web Lead",
    company: "NSS Executive Body, BIT Mesra",
    period: "Sept 2023 – Present",
    desc: "Led a team of 6 developers building official web modules, event dashboards, and digital verification systems. Architected Next.js frontends and RESTful APIs for real-world deployment serving 3,000+ student verifications.",
    tech: ["Next.js", "React.js", "REST APIs", "Web Architecture", "Dashboard UI"],
    color: "#C4183C",
    glow: "rgba(196, 24, 60, 0.25)",
    metrics: ["Team: 6 Devs", "Verifications: 3K+", "Event Reach: +35%"],
  },
  {
    id: "bit",
    type: "edu",
    role: "B.Tech in Computer Science & Engineering",
    company: "Birla Institute of Technology, Mesra",
    period: "Sept 2023 – Present",
    desc: "Core coursework: Data Structures & Algorithms, Operating Systems, DBMS, Object-Oriented Programming, Computer Networks, and Web Engineering. Active problem-solver across competitive programming platforms.",
    tech: ["Java / C++", "DSA & Algorithms", "DBMS & SQL", "Operating Systems", "OOP"],
    color: "#C4183C",
    glow: "rgba(196, 24, 60, 0.25)",
    metrics: ["800+ DSA Problems solved", "Focus: CSE / Web Architecture", "Status: Active student"],
  },
];

// Alternate sliding card component — memoized
const TimelineCard = memo(function TimelineCard({
  item,
  index,
}: {
  item: TimelineItem;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const Icon = item.type === "work" ? Briefcase : GraduationCap;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative flex flex-col md:flex-row items-center justify-between w-full mb-16 ${
      isEven ? "md:flex-row-reverse" : ""
    }`}>
      {/* Spacer to push card to correct side */}
      <div className="w-full md:w-[45%] hidden md:block" />

      {/* Dynamic chrome selector knob indicator */}
      <div className="absolute left-9 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center z-20">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="w-10 h-10 knob-dial flex items-center justify-center cursor-pointer"
          style={{ 
            borderColor: item.color, 
            boxShadow: `0 0 15px ${item.glow}`,
            transform: isHovered ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.4s ease"
          }}
        >
          {/* Subtle pointer indicator is created via CSS .knob-dial::after */}
        </motion.div>
      </div>

      {/* Floating Glassmorphism Timeline Card */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-[45%] pl-12 md:pl-0"
      >
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="glass-card p-6 md:p-8 hover:scale-[1.02] transition-all duration-300 group overflow-hidden cursor-pointer relative bg-black/40 border border-white/5 rounded-2xl"
          style={{
            borderColor: isHovered ? item.color : "var(--glass-border)",
            boxShadow: isHovered ? `0 10px 30px ${item.glow}` : "0 12px 40px var(--glass-shadow)"
          }}
        >
          {/* Studio screws */}
          <span className="rack-mount-screw absolute top-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute top-3 right-3 opacity-30" />

          {/* Blueprint grid layout overlay */}
          <div className="blueprint-grid" style={{ opacity: isHovered ? 0.35 : 0 }} />

          {/* Dotted texture mesh */}
          <div className="tech-dot-mesh" />

          <div
            className="absolute -right-24 -top-24 w-60 h-60 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: item.color }}
          />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block">
                {item.type === "work" ? "CLASSIFIED WORK LOG" : "CLASSIFIED EDUCATION LOG"}
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-1 font-mono uppercase">
                {item.role}
              </h3>
              <span className="text-sm text-white/50">@ {item.company}</span>
            </div>
            <span
              className="px-3.5 py-1.5 rounded-xl text-[10px] font-mono border"
              style={{
                borderColor: `${item.color}30`,
                color: item.color,
                background: `${item.color}08`,
              }}
            >
              {item.period}
            </span>
          </div>

          <p className="relative z-10 text-sm text-white/60 leading-relaxed">{item.desc}</p>

          <div className="relative z-10 flex flex-wrap gap-1.5 mt-5">
            {item.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white/40 border border-white/5 bg-white/2"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Expandable Blueprint Metrics Drawer */}
          <div className="relative z-10 mt-5 pt-4 border-t border-white/5 overflow-hidden max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 ease-out">
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/30 block mb-2">Metrics & Deliverables</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {item.metrics.map((m) => (
                <div key={m} className="flex items-center gap-1 font-mono text-[9px] text-[#4ade80]">
                  <CheckCircle2 size={10} className="text-[#4ade80] shrink-0" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
});

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUpsideDown, setIsUpsideDown] = useState(false);

  useEffect(() => {
    const handleDimensionChange = (e: Event) => {
      setIsUpsideDown((e as CustomEvent).detail);
    };
    window.addEventListener("dimensionShiftState", handleDimensionChange);
    if (document.body.classList.contains("alternate-dimension")) {
      setIsUpsideDown(true);
    }
    return () => window.removeEventListener("dimensionShiftState", handleDimensionChange);
  }, []);

  // Track vertical page scroll intersection for line progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const springScale = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 18,
    restDelta: 0.001,
  });

  const pipelineHeight = useTransform(springScale, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="experience"
      className="py-24 px-6 md:px-12 relative z-10 max-w-6xl mx-auto overflow-hidden"
    >
      {/* Tape Reels Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none opacity-[0.03]">
        <svg className="absolute -left-20 top-20 w-80 h-80 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="1" fill="none" strokeDasharray="5, 5" />
          <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="2" fill="none" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="white" strokeWidth="1" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="1" />
        </svg>
        <svg className="absolute -right-20 bottom-20 w-96 h-96 animate-[spin_55s_linear_infinite_reverse]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="1.5" fill="none" strokeDasharray="8, 4" />
          <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="2" fill="none" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="white" strokeWidth="1" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      {/* Background blobs */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[#7C3AED]/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full bg-[#C4183C]/5 blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-20 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-[#C4183C] block mb-3">
          &gt; career.log
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight select-text text-transparent bg-clip-text bg-gradient-to-r from-[#F1EDE4] via-[#C4183C] to-[#7C3AED]" style={{ fontFamily: "'Unbounded', sans-serif" }}>
          Work &amp; <span className="text-[#C4183C]">Education</span>
        </h2>
        <p className="text-sm text-[#8B8698] mt-4 leading-relaxed max-w-xs mx-auto">
          Technical roles, academic milestones, and the progression that led to 5 live projects.
        </p>
      </div>

      {/* Timeline Track */}
      <div className="relative w-full mt-12 pb-10">
        
        {/* Continuous magnetic recording tape ribbon */}
        <div className="magnetic-tape-ribbon left-9 md:left-1/2" />
        
        {/* Glowing record head path overlay */}
        <div className="absolute left-9 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 z-10">
          <motion.div
            style={{ height: pipelineHeight }}
            className={`w-full ${
              isUpsideDown 
                ? "bg-gradient-to-b from-[#C4183C] via-[#7C3AED] to-[#800c22] shadow-[0_0_15px_#C4183C]" 
                : "bg-gradient-to-b from-[#C4183C] via-[#7C3AED] to-[#7C3AED] shadow-[0_0_10px_rgba(124,58,237,0.4)]"
            }`}
          />
        </div>

        {/* Alternate cards list */}
        <div className="space-y-6">
          {ITEMS.map((item, idx) => (
            <TimelineCard key={item.id} item={item} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
}
