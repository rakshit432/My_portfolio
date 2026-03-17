"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SKILLS = [
  {
    category: "Languages",
    items: [
      { name: "Java", level: 90 },
      { name: "C++", level: 85 },
      { name: "Python", level: 90 },
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 85 }
    ]
  },
  {
    category: "Frontend",
    items: [
      { name: "React.js", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Three.js", level: 70 },
      { name: "GSAP", level: 80 }
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 85 },
      { name: "Express.js", level: 85 },
      { name: "MongoDB", level: 80 },
      { name: "MySQL", level: 75 }
    ]
  },
  {
    category: "Tools & DevOps",
    items: [
      { name: "Git & GitHub", level: 90 },
      { name: "Linux", level: 80 },
      { name: "Docker", level: 70 },
      { name: "Postman", level: 85 }
    ]
  },
  {
    category: "Data Science",
    items: [
      { name: "NumPy", level: 75 },
      { name: "Pandas", level: 75 },
      { name: "Jupyter", level: 80 }
    ]
  }
];

const BackgroundGrid = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Gradients */}
    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
    <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />

    {/* Animated Grid */}
    <div
      className="absolute inset-0 opacity-[0.15]"
      style={{
        backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
      }}
    >
      {/* Moving Beam Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent"
        animate={{ top: ['-100%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ height: '50%', opacity: 0.5 }}
      />
    </div>
  </div>
);

const FloatingBadge = ({ text, x, y, delay }: { text: string, x: string, y: string, delay: number }) => (
  <motion.div
    className="absolute z-0 px-3 py-1 rounded-full border border-white/5 bg-black/40 backdrop-blur-md text-[10px] uppercase tracking-widest text-white/30"
    initial={{ opacity: 0, x: 0, y: 0 }}
    animate={{
      opacity: [0, 0.5, 0],
      y: [0, -40],
      // eslint-disable-next-line react-hooks/purity
      x: [0, Math.random() * 20 - 10]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    style={{ left: x, top: y }}
  >
    {text}
  </motion.div>
);

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!overlayRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    overlayRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 40%)`;
  };

  return (
    <section ref={containerRef} id="skills" className="relative w-full py-32 px-6 md:px-12 bg-transparent overflow-hidden">
      <BackgroundGrid />

      {/* Floating Animated Badges for Depth */}
      <FloatingBadge text="{ code }" x="10%" y="20%" delay={0} />
      <FloatingBadge text="< dev />" x="80%" y="15%" delay={2} />
      <FloatingBadge text="git push" x="15%" y="70%" delay={4} />
      <FloatingBadge text="npm i" x="85%" y="80%" delay={1} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          style={{ y }}
          className="flex flex-col md:flex-row gap-12 md:gap-24 mb-20 items-start"
        >
          <div className="flex-1">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                TECHNICAL <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
                  ARSENAL
                </span>
              </h2>
              <p className="text-white/70 max-w-lg font-medium tracking-wide leading-relaxed text-lg pb-4">
                Curated suite of technologies I leverage to build scalable, high-performance digital solutions.
              </p>
          </div>

          {/* Stats with Counters */}
          <div className="flex-1 flex justify-end items-end">
            <div className="flex gap-12 text-right">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <span className="block text-4xl font-bold text-white">20+</span>
                <span className="text-xs uppercase tracking-widest text-white/40">Technologies</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <span className="block text-4xl font-bold text-white">100%</span>
                <span className="text-xs uppercase tracking-widest text-white/40">Commitment</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setOpacity(1)}
          onMouseLeave={() => setOpacity(0)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
        >
          {/* Spotlight Overlay */}
          <div
            ref={overlayRef}
            className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0 rounded-3xl"
            style={{
              opacity,
              background: `radial-gradient(600px circle at 0px 0px, rgba(255,255,255,0.08), transparent 40%)`
            }}
          />

          {SKILLS.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative z-10 group p-6 md:p-8 rounded-[24px] border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.06] transition-all duration-700 overflow-hidden hover:border-white/20 shadow-xl hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] hover:-translate-y-2"
            >
              {/* Inner Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 group-hover:from-white group-hover:to-white transition-all duration-300">
                  {group.category}
                </h3>
                {/* Animated Icon/Dot */}
                <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-indigo-400 transition-colors animate-pulse" />
              </div>

              <div className="space-y-6 relative z-10">
                {group.items.map((skill, sIdx) => (
                  <div key={sIdx} className="group/skill">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-md font-medium text-white/80 group-hover/skill:text-white transition-colors">
                        {skill.name}
                      </span>
                    </div>
                    <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 + (sIdx * 0.1) }}
                        className="h-full bg-gradient-to-r from-indigo-500 rounded-full group-hover:to-purple-500 group-hover:from-white transition-all duration-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
