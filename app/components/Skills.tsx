"use client";

import { useState, memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Layers, Database, Cpu, ChevronRight } from "lucide-react";

interface SkillItem {
  name: string;
  level: number;
}

interface SkillCategory {
  id: string;
  label: string;
  desc: string;
  icon: any;
  color: string;
  glow: string;
  skills: SkillItem[];
}

const CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    label: "Languages",
    desc: "Core scripting and compiler languages used for algorithms, object designs, and data flow.",
    icon: Globe,
    color: "#C4183C",
    glow: "rgba(196, 24, 60, 0.4)",
    skills: [
      { name: "Python", level: 90 },
      { name: "C++", level: 85 },
      { name: "Java", level: 80 },
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Object-Oriented Design (OOD)", level: 88 },
    ],
  },
  {
    id: "frontend",
    label: "Web & MERN",
    desc: "Libraries and render engines engineered for dynamic user interfaces and scalable stack deployments.",
    icon: Layers,
    color: "#7C3AED",
    glow: "rgba(124, 58, 237, 0.4)",
    skills: [
      { name: "React.js", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Node.js", level: 90 },
      { name: "Express.js", level: 90 },
      { name: "MongoDB", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "HTML & CSS", level: 95 },
      { name: "Tailwind CSS", level: 95 },
    ],
  },
  {
    id: "backend",
    label: "Networks & APIs",
    desc: "Scalable socket networks, API controllers, and data routing protocols.",
    icon: Database,
    color: "#C4183C",
    glow: "rgba(196, 24, 60, 0.4)",
    skills: [
      { name: "REST APIs", level: 95 },
      { name: "WebRTC", level: 85 },
      { name: "Socket.io", level: 90 },
      { name: "DNS & HTTP", level: 80 },
      { name: "TCP/IP & Networks", level: 80 },
      { name: "Routing & Switching", level: 75 },
    ],
  },
  {
    id: "devops",
    label: "Tools & AI Systems",
    desc: "Deployment registries, test pipelines, secure authorization controls, and AI agents.",
    icon: Cpu,
    color: "#7C3AED",
    glow: "rgba(124, 58, 237, 0.4)",
    skills: [
      { name: "Git & GitHub", level: 90 },
      { name: "JWT Authorization", level: 88 },
      { name: "Unit Testing & Postman", level: 85 },
      { name: "Gemini API", level: 90 },
      { name: "Agentic Frameworks", level: 85 },
      { name: "Linux", level: 80 },
    ],
  },
];

export default function Skills() {
  const [activeCat, setActiveCat] = useState<string>("languages");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  
  // Realtime mixing board fader levels state
  const [faderValues, setFaderValues] = useState<Record<string, number>>({});
  
  // Stranger Things Christmas Lights Wall State
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const [activeLetters, setActiveLetters] = useState<string[]>([]);
  const [currentlySpelling, setCurrentlySpelling] = useState("");

  const activeData = CATEGORIES.find((c) => c.id === activeCat) || CATEGORIES[0];
  const ActiveIcon = activeData.icon;

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

  const ROW1 = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const ROW2 = ["I", "J", "K", "L", "M", "N", "O", "P", "Q"];
  const ROW3 = ["R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  const LETTER_COLORS = {
    A: "yellow", B: "blue", C: "red", D: "green", E: "yellow", F: "white", G: "blue", H: "red",
    I: "green", J: "yellow", K: "red", L: "blue", M: "green", N: "yellow", O: "red", P: "blue", Q: "white",
    R: "yellow", S: "blue", T: "red", U: "green", V: "yellow", W: "white", X: "blue", Y: "red", Z: "green"
  };

  const spellWord = useCallback((word: string) => {
    setCurrentlySpelling(word);
    setActiveLetters([]);
    
    const uppercaseWord = word.toUpperCase().replace(/[^A-Z]/g, "");
    if (!uppercaseWord) return;

    let index = 0;
    const playNextLetter = () => {
      // Ensure we haven't started spelling a different word
      setCurrentlySpelling((current) => {
        if (current !== word) return current;

        if (index >= uppercaseWord.length) {
          // Finished spelling, keep all letters lit
          setActiveLetters(Array.from(new Set(uppercaseWord)));
          return current;
        }

        const letter = uppercaseWord[index];
        setActiveLetters([letter]);

        // Play chime sound
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "sine";
          
          const charCode = letter.charCodeAt(0) - 65; // 0 to 25
          const freq = 220 + charCode * 15;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}

        index++;
        setTimeout(playNextLetter, 380);
        return current;
      });
    };

    playNextLetter();
  }, []);

  useEffect(() => {
    spellWord(activeData.label);
  }, [activeCat, activeData.label, spellWord]);

  useEffect(() => {
    const initial: Record<string, number> = {};
    activeData.skills.forEach((s) => {
      initial[s.name] = s.level;
    });
    setFaderValues(initial);
  }, [activeData]);

  const handleFaderChange = useCallback((name: string, val: number) => {
    setFaderValues((prev) => ({
      ...prev,
      [name]: val,
    }));
  }, []);

  const runDiagnostic = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompiling(true);
    setCompileProgress(0);
    setDiagnosticLogs(["INIT DECRYPT TRANSMISSION INQUIRY..."]);

    const steps = [
      { progress: 25, log: "LOAD FREQUENCIES: Tuning Cerebro receiver... OK" },
      { progress: 55, log: "GRID DECRYPT: Syncing Byers' wall nodes... OK" },
      { progress: 85, log: "FIELD SCAN: Running electromagnetic variance trace... Anomalous" },
      { progress: 100, log: "COMPLETED: Decrypt complete. Signal strength at 92%." },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setCompileProgress(step.progress);
        setDiagnosticLogs((prev) => [...prev, step.log]);
        if (step.progress === 100) {
          setTimeout(() => {
            setIsCompiling(false);
          }, 2000);
        }
      }, (idx + 1) * 500);
    });
  }, []);

  return (
    <section id="skills" className="py-24 px-6 md:px-12 relative z-10 max-w-6xl mx-auto overflow-hidden">
      {/* Equalizer Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none opacity-[0.03] flex items-end justify-around px-12 pb-6">
        {Array.from({ length: 16 }).map((_, i) => {
          const delays = ["0s", "0.4s", "0.8s", "1.2s", "0.2s", "0.6s"];
          const delay = delays[i % delays.length];
          const durations = ["1.8s", "2.4s", "1.5s", "3.0s", "2.1s"];
          const duration = durations[i % durations.length];
          return (
            <div 
              key={i} 
              className="w-4 bg-white rounded-t-md animate-[equalizer_infinite_alternate]"
              style={{ 
                animationDelay: delay, 
                animationDuration: duration,
                height: "50%"
              }} 
            />
          );
        })}
      </div>

      {/* Background spotlights */}
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-[#7C3AED]/5 blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-14">
        <span className="font-mono text-xs uppercase tracking-widest text-[#C4183C] block mb-3">
          &gt; stack.json
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight select-text text-transparent bg-clip-text bg-gradient-to-r from-[#F1EDE4] via-[#C4183C] to-[#7C3AED]" style={{ fontFamily: "'Unbounded', sans-serif" }}>
          Skills &amp; <span className="text-[#C4183C]">Arsenal</span>
        </h2>
        <p className="text-sm text-[#8B8698] mt-4 leading-relaxed max-w-md">
          Hover over the skill faders to watch the Christmas wall lights spell each technology. Click lights to trigger individual letters.
        </p>
      </div>

      {/* Interactive Arena: Grid of Christmas Wall + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Byers' Christmas Lights Wall (Col-span 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between min-h-[420px]">
          <div className="christmas-wall w-full rounded-[2rem] p-6 flex flex-col justify-around min-h-[360px] border border-white/10 shadow-2xl relative overflow-hidden select-none">
            {/* Vintage floral mesh overlay */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-repeat bg-[size:60px_60px]"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 5 C35 15 25 25 30 35 C25 25 15 25 30 5 Z M0 30 C10 35 10 25 20 30 C10 25 10 15 0 30 Z M40 30 C50 35 50 25 60 30 C50 25 50 15 40 30 Z' fill='%23ef4444' fill-opacity='0.2'/%3E%3C/svg%3E")` }}
            />
            
            {/* Spooky shadows and blood splatters if Upside Down */}
            {isUpsideDown && (
              <div className="absolute inset-0 bg-red-950/20 pointer-events-none mix-blend-color-burn" />
            )}
            
            <div className="text-center font-mono text-[9px] text-red-500/60 border-b border-white/5 pb-2 mb-4 uppercase tracking-widest flex justify-between">
              <span>JOYCE&apos;S LIGHTS COMMAND SYSTEM</span>
              <span>{currentlySpelling ? `SPELLING: ${currentlySpelling}` : "STANDBY"}</span>
            </div>

            {/* Row 1 */}
            <div className="relative flex justify-around items-center px-4 my-2">
              <div className="absolute top-4 left-4 right-4 h-[1px] bg-neutral-800" />
              {ROW1.map((letter) => {
                const lit = activeLetters.includes(letter);
                const color = LETTER_COLORS[letter as keyof typeof LETTER_COLORS] || "yellow";
                return (
                  <div key={letter} className="flex flex-col items-center z-10">
                    <div 
                      onClick={() => spellWord(letter)}
                      className={`christmas-light-bulb light-${color} ${lit ? "lit" : ""}`}
                    />
                    <span className={`byers-letter mt-1 ${lit ? "letter-lit" : ""}`}>
                      {letter}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Row 2 */}
            <div className="relative flex justify-around items-center px-2 my-2">
              <div className="absolute top-4 left-4 right-4 h-[1px] bg-neutral-800" />
              {ROW2.map((letter) => {
                const lit = activeLetters.includes(letter);
                const color = LETTER_COLORS[letter as keyof typeof LETTER_COLORS] || "yellow";
                return (
                  <div key={letter} className="flex flex-col items-center z-10">
                    <div 
                      onClick={() => spellWord(letter)}
                      className={`christmas-light-bulb light-${color} ${lit ? "lit" : ""}`}
                    />
                    <span className={`byers-letter mt-1 ${lit ? "letter-lit" : ""}`}>
                      {letter}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Row 3 */}
            <div className="relative flex justify-around items-center px-4 my-2">
              <div className="absolute top-4 left-4 right-4 h-[1px] bg-neutral-800" />
              {ROW3.map((letter) => {
                const lit = activeLetters.includes(letter);
                const color = LETTER_COLORS[letter as keyof typeof LETTER_COLORS] || "yellow";
                return (
                  <div key={letter} className="flex flex-col items-center z-10">
                    <div 
                      onClick={() => spellWord(letter)}
                      className={`christmas-light-bulb light-${color} ${lit ? "lit" : ""}`}
                    />
                    <span className={`byers-letter mt-1 ${lit ? "letter-lit" : ""}`}>
                      {letter}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Channel Presets underneath */}
          <div className="flex flex-wrap gap-2.5 justify-center mt-6 w-full border-t border-white/5 pt-4">
            {CATEGORIES.map((cat) => {
              const isActive = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCat(cat.id);
                    setDiagnosticLogs([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer border ${
                    isActive 
                      ? "bg-[#120D1E] border-[#C4183C] text-[#C4183C] shadow-[0_0_10px_rgba(196,24,60,0.2)]" 
                      : "bg-[#08070C]/50 border-[rgba(241,237,228,0.15)] text-[#8B8698] hover:text-[#F1EDE4]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Glass Drawer Details Panel (Col-span 5) */}
        <div className="lg:col-span-5 flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="glass-card p-8 md:p-10 w-full flex flex-col justify-between"
            >
              {/* Top info */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 bg-white/2"
                    style={{ color: activeData.color, boxShadow: `0 0 20px ${activeData.glow}` }}
                  >
                    <ActiveIcon size={20} />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                      Category Selected
                    </span>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase mt-0.5">
                      {activeData.label}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  {activeData.desc}
                </p>

                {/* Subheader */}
                <div className="mt-8 mb-4 flex items-center gap-2">
                  <ChevronRight size={14} style={{ color: activeData.color }} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                    Engineered Tools & Levels
                  </span>
                </div>

                {/* Skill progress faders list */}
                <div className="space-y-4">
                  {activeData.skills.map((skill, sIdx) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sIdx * 0.05 }}
                      className="space-y-1.5 cursor-pointer"
                      onMouseEnter={() => spellWord(skill.name)}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-white/80">{skill.name}</span>
                        <span className="text-[10px] text-white/40">{(faderValues[skill.name] ?? skill.level)}% dB</span>
                      </div>
                      <div className="relative w-full h-8 flex items-center bg-neutral-950/40 border border-white/5 rounded-lg px-3 overflow-hidden shadow-inner">
                        {/* Scale marks */}
                        <div className="absolute inset-x-4 top-1.5 bottom-1.5 flex justify-between pointer-events-none select-none text-[6px] text-white/10 font-mono">
                          <span>-∞</span>
                          <span>-20</span>
                          <span>-10</span>
                          <span>-5</span>
                          <span>0dB</span>
                        </div>
                        {/* Fader slider knob */}
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={faderValues[skill.name] ?? skill.level}
                          onChange={(e) => handleFaderChange(skill.name, parseInt(e.target.value))}
                          className="fader-slider w-full relative z-10 accent-[#C4183C]"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Diagnostic trigger panel */}
                <div className="mt-8 border-t border-white/5 pt-4">
                  {!isCompiling && diagnosticLogs.length === 0 ? (
                    <button
                      onClick={runDiagnostic}
                      data-text="Run System Core Diagnostic"
                      className="glitch-btn w-full py-2.5 rounded-sm border border-white/20 hover:border-[#C4183C]/60 hover:bg-[#C4183C]/5 font-mono text-[10px] text-[#F1EDE4] hover:text-white uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      Run System Core Diagnostic
                    </button>
                  ) : (
                    <div className="space-y-3 font-mono text-left">
                      <div className="flex items-center justify-between text-[9px] text-[#8B8698]">
                        <span>COMPILING CORES...</span>
                        <span>{compileProgress}%</span>
                      </div>
                      {/* Diagnostic Progress Bar */}
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-[#C4183C] to-[#7C3AED] rounded-full transition-all duration-300"
                          style={{ width: `${compileProgress}%` }}
                        />
                      </div>
                      {/* Diagnostic Log Lines */}
                      <div className="bg-[#08070C]/80 border border-white/5 rounded-lg p-2.5 text-[8px] text-[#4ade80] space-y-0.5 max-h-24 overflow-y-auto">
                        {diagnosticLogs.map((log, idx) => (
                          <div key={idx} className="truncate">&gt; {log}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative category visualizer footer */}
              <div className="border-t border-white/5 mt-8 pt-6 flex items-center justify-between text-xs text-white/30 font-mono">
                <span>Verification logs</span>
                <span style={{ color: activeData.color }}>Status: Active Core</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
