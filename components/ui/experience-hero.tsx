"use client";

import { useRef, useCallback, memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Terminal, Star, ArrowUpRight, Award, Shield, Music, MapPin, GitCommit, Play, Pause, SkipForward, Power, Radio, Sliders } from "lucide-react";

// Interactive Bento Card — captures coordinates for reflections and handles bouncy 3D tilts
const BentoCard = memo(function BentoCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const reflection = reflectionRef.current;
    if (!card || !reflection) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width - 0.5) * 8; // Max 4 deg rotation
    const percentY = (y / rect.height - 0.5) * -8;

    card.style.transition = "none";
    card.style.transform = `perspective(800px) rotateY(${percentX}deg) rotateX(${percentY}deg) scale3d(1.005, 1.005, 1.005)`;
    reflection.style.setProperty("--x", `${x}px`);
    reflection.style.setProperty("--y", `${y}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.5s var(--ease-fluid), border-color 0.4s, box-shadow 0.4s";
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)";
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay }}
      className={`glass-card p-6 md:p-8 flex flex-col justify-between cursor-pointer ${className || ""}`}
      style={{ transition: "transform 0.4s var(--ease-fluid), border-color 0.4s, box-shadow 0.4s" }}
    >
      <div ref={reflectionRef} className="glass-reflection" />
      {children}
    </motion.div>
  );
});

// Ranchi Clock hook
function useLocalClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// Bouncing analog gauge needle hook linked to lofi volume amplitude & dimension shift
function useAnalogNeedle(isPlaying: boolean) {
  const [angle, setAngle] = useState(0);
  const [isShifted, setIsShifted] = useState(false);

  useEffect(() => {
    const h = (e: Event) => setIsShifted((e as CustomEvent).detail);
    window.addEventListener("dimensionShiftState", h);
    if (document.body.classList.contains("alternate-dimension")) {
      setIsShifted(true);
    }
    return () => window.removeEventListener("dimensionShiftState", h);
  }, []);

  useEffect(() => {
    let frameId: number;
    const updateNeedle = () => {
      const ms = new Date().getMilliseconds();
      let targetAngle = -35 + Math.sin(ms * 0.015) * 15; // default rest drift
      if (isShifted) {
        // Twitch violently like a compass near a gate
        targetAngle = Math.sin(ms * 0.08) * 45 + (Math.random() - 0.5) * 20;
      } else if (isPlaying) {
        // Higher amplitude vibration
        targetAngle = -10 + Math.sin(ms * 0.05) * 35 + (Math.random() - 0.5) * 8;
      }
      setAngle(THREE_CLAMP(targetAngle, -55, 55));
      frameId = requestAnimationFrame(updateNeedle);
    };

    const THREE_CLAMP = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

    frameId = requestAnimationFrame(updateNeedle);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, isShifted]);

  return angle;
}

export const Component = () => {
  const localTime = useLocalClock();
  const [hoveredCommit, setHoveredCommit] = useState<string | null>(null);

  // Audio track setup
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const TRACKS = [
    { title: "Should I Stay or Should I Go", artist: "The Clash (1982)", duration: "3:09", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Stranger Things Synth Theme", artist: "Dixon & Stein", duration: "2:45", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Kids (Hawkins Theme)", artist: "Dixon & Stein", duration: "2:38", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  ];

  // Listen for global triggers
  useEffect(() => {
    const handleTriggerPlay = () => setIsPlaying(true);
    const handleToggle = () => setIsPlaying(prev => !prev);
    const handleNext = () => {
      setActiveTrackIndex(prev => (prev + 1) % TRACKS.length);
      setIsPlaying(true);
    };
    window.addEventListener("triggerAudioPlay", handleTriggerPlay);
    window.addEventListener("toggleAudioPlay", handleToggle);
    window.addEventListener("nextAudioTrack", handleNext);
    return () => {
      window.removeEventListener("triggerAudioPlay", handleTriggerPlay);
      window.removeEventListener("toggleAudioPlay", handleToggle);
      window.removeEventListener("nextAudioTrack", handleNext);
    };
  }, [TRACKS.length]);

  const currentTrack = TRACKS[activeTrackIndex];
  const needleAngle = useAnalogNeedle(isPlaying);

  // Broadcast track details on change
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("audioTrackChange", {
      detail: {
        title: currentTrack.title,
        artist: currentTrack.artist,
        index: activeTrackIndex
      }
    }));
  }, [activeTrackIndex, currentTrack]);

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    window.dispatchEvent(new CustomEvent("audioTimeUpdate", {
      detail: {
        currentTime: audioRef.current.currentTime,
        duration: audioRef.current.duration || 1
      }
    }));
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
    window.dispatchEvent(new CustomEvent("audioPlayState", { detail: isPlaying }));
  }, [isPlaying, activeTrackIndex]);

  const handleNextTrack = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTrackIndex(prev => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, [TRACKS.length]);

  const handlePlayToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(prev => !prev);
  }, []);

  // Web Audio pentatonic chime generator
  const playSequencerNote = useCallback((colIndex: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Minor pentatonic scale frequencies (C4 to D5)
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
      const freq = scale[colIndex % scale.length];

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  }, []);

  // Web Audio synthesizer sweep for Dimension shift
  const playDimensionSweep = useCallback((isShifted: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sawtooth";
      const startFreq = isShifted ? 180 : 720;
      const endFreq = isShifted ? 720 : 180;
      
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.65);
      
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch(e) {}
  }, []);

  // Dimension Shift State (Stranger Things Easter Egg)
  const [dimensionShift, setDimensionShift] = useState(false);
  const handleDimensionToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !dimensionShift;
    setDimensionShift(nextState);
    playDimensionSweep(nextState);
    
    // Toggle class on body and dispatch global state event
    if (nextState) {
      document.body.classList.add("alternate-dimension");
    } else {
      document.body.classList.remove("alternate-dimension");
    }
    window.dispatchEvent(new CustomEvent("dimensionShiftState", { detail: nextState }));
  }, [dimensionShift, playDimensionSweep]);

  // Command Tuner faders
  const [radioFreq, setRadioFreq] = useState(98.5);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "$ cerebro radio online: channel set",
    "[OK] Hawkins transmitter synced.",
    "[INFO] Toggle override state active.",
  ]);

  const handleTerminalCommand = useCallback((cmd: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (cmd === "clear") {
      setTerminalLogs([]);
      setRadioFreq(88.0);
      return;
    }
    
    setTerminalLogs(["$ scanning receiver frequencies..."]);
    
    if (cmd === "about.sh") {
      setRadioFreq(98.5);
      setTimeout(() => {
        setTerminalLogs([
          "$ ./about.sh [98.5 FM]",
          "----------------------------------",
          "USER: Rakshit [CLEARANCE LEVEL 5]",
          "ROLE: Full Stack Developer / AI Engineer",
          "CAMPUS: CS Dept @ BIT Mesra, Hawkins",
          "STATUS: Active GATE researcher",
          "----------------------------------",
        ]);
      }, 200);
    } else if (cmd === "stats.log") {
      setRadioFreq(104.2);
      setTimeout(() => {
        setTerminalLogs([
          "$ cat stats.log [104.2 FM]",
          "EQUIPMENT: Cerebro Ham Radio Tower",
          "BARRIER FREQ: 60 FPS (WebGL Portal)",
          "GATE STABILITY: Anomalous fluctuations",
          "INCIDENTS: Future Meet, SQL AI, Mediversal",
        ]);
      }, 200);
    }
  }, []);

  // Generating a list of contribution dots for mock Github grid
  const COMMIT_MESSAGES = [
    "Optimized three.js shaders for fluid rendering",
    "Implemented secure JWT verification middleware",
    "Added responsive layouts for bento widgets",
    "Refactored custom state management hooks",
    "Integrated framer-motion card slide physics",
    "Fixed visual layout boundary leaks",
    "Wrote robust schema ledger validation",
    "Updated typography configuration tags",
    "Accelerated resource loading pipelines",
    "Cleaned up package configuration trees",
  ];

  const commitCells = Array.from({ length: 42 }).map((_, i) => {
    const opacities = ["opacity-10", "opacity-30", "opacity-60", "opacity-90"];
    const opacity = opacities[Math.floor((i * 31) % opacities.length)];
    const msg = COMMIT_MESSAGES[i % COMMIT_MESSAGES.length];
    
    return (
      <div
        key={i}
        className={`w-3.5 h-3.5 rounded-sm bg-[#7C3AED] ${opacity} hover:bg-white hover:shadow-[0_0_10px_rgba(124,58,237,0.8)] hover:scale-125 transition-all duration-200 cursor-crosshair`}
        onMouseEnter={() => {
          setHoveredCommit(msg);
          playSequencerNote(i);
        }}
        onMouseLeave={() => setHoveredCommit(null)}
      />
    );
  });

  return (
    <section id="about" className="py-24 px-6 md:px-12 relative z-10 max-w-6xl mx-auto overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-[#7C3AED]/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#C4183C]/5 blur-[120px] pointer-events-none -z-10" />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        
        {/* Box 1: Master Channel Strip (Col-span 8) */}
        <BentoCard className="md:col-span-8 md:p-10 min-h-[320px] relative overflow-hidden group">
          <div className="tech-dot-mesh" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-radial from-[#7C3AED]/5 to-transparent blur-3xl pointer-events-none" />
          {/* Corner Screws */}
          <span className="rack-mount-screw absolute top-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute top-3 right-3 opacity-30" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Sliders size={16} className="text-[#C4183C]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#8B8698]">
                {dimensionShift ? "WALKIE-TALKIE RECEIVER — SIGNAL GLITCH" : "CEREBRO WALKIE-TALKIE TRANSCEIVER"}
              </span>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-[1.1] text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                {dimensionShift ? (
                  <>Transmitting across the <span className="text-[#C4183C]">dimensional gate</span> of Hawkins.</>
                ) : (
                  <>Composing <span className="text-[#C4183C]">classified web architectures</span> like Ham Radio rigs.</>
                )}
              </h2>
              <p className="text-base text-white/60 leading-relaxed mt-6 max-w-xl">
                {dimensionShift ? (
                  "The portal is open. Deep inside Hawkins, Indiana, I build high-frequency React pipelines and robust server databases that survive the spores and chaos of the Upside Down."
                ) : (
                  "I am a Full Stack Developer & B.Tech CS Student at BIT Mesra. I treat software engineering as an immersive creative art, designing high-frequency React/WebGL pipelines and robust, low-latency API mixing desks."
                )}
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Box 2: Cassette Deck Tape Module (Col-span 4) */}
        <BentoCard className="md:col-span-4 min-h-[320px] group overflow-hidden relative" delay={0.1}>
          <div className="tech-dot-mesh" />
          <audio ref={audioRef} src={currentTrack.url} loop preload="auto" onTimeUpdate={handleTimeUpdate} />
          {/* Corner Screws */}
          <span className="rack-mount-screw absolute top-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute top-3 right-3 opacity-30" />
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Music size={16} className="text-[#C4183C]" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#8B8698]">
                  {dimensionShift ? "BYERS' WALKMAN DECK" : "1983 Hawkins Cassette Deck"}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono text-[#C4183C] bg-[#C4183C]/10 border border-[#C4183C]/20 animate-pulse">
                {isPlaying ? "Spinning" : "Paused"}
              </span>
            </div>

            {/* Realistic Custom SVG Cassette Tape Graphic */}
            <div className="w-full h-28 relative my-1 rounded-xl overflow-hidden border border-white/5 bg-black/60 p-2 flex items-center justify-center">
              <svg viewBox="0 0 160 100" className="w-full h-full select-none">
                {/* Outer Cassette Case */}
                <rect x="5" y="5" width="150" height="90" rx="6" fill="#0b0b0e" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                {/* Cassette faceplate label */}
                <rect x="18" y="15" width="124" height="48" rx="3" fill="rgba(196,24,60,0.03)" stroke="rgba(196,24,60,0.15)" strokeWidth="1" />
                {/* Text on label */}
                <text x="25" y="26" fill="rgba(255,255,255,0.6)" fontSize="6" fontFamily="monospace">
                  {dimensionShift ? "BYERS_TAPE_#4.dat" : "HAWKINS_CORE_COMPILER.dat"}
                </text>
                <text x="25" y="34" fill="rgba(196,24,60,0.5)" fontSize="5" fontFamily="monospace">
                  TRACK 0{activeTrackIndex + 1} // {dimensionShift ? "Should I Stay" : "Cerebro Link"}
                </text>
                {/* Clear plastic window */}
                <rect x="45" y="42" width="70" height="18" rx="2" fill="#040406" stroke="rgba(255,255,255,0.05)" />
                {/* Left Gear Reel */}
                <g transform="translate(60, 51)">
                  <circle r="7" fill="none" stroke="rgba(124,58,237,0.4)" strokeWidth="1.2" strokeDasharray="3,2" className={isPlaying ? "animate-spin" : ""} style={{ transformOrigin: "center", animationDuration: "6s" }} />
                  <circle r="3.5" fill="rgba(255,255,255,0.1)" />
                </g>
                {/* Right Gear Reel */}
                <g transform="translate(100, 51)">
                  <circle r="7" fill="none" stroke="rgba(124,58,237,0.4)" strokeWidth="1.2" strokeDasharray="3,2" className={isPlaying ? "animate-spin" : ""} style={{ transformOrigin: "center", animationDuration: "6s" }} />
                  <circle r="3.5" fill="rgba(255,255,255,0.1)" />
                </g>
              </svg>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{currentTrack.title}</h4>
              <p className="text-[10px] text-white/50">{currentTrack.artist}</p>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={handlePlayToggle}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                >
                  {isPlaying ? <Pause size={12} fill="black" /> : <Play size={12} fill="black" />}
                </button>
                <button
                  onClick={handleNextTrack}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <SkipForward size={12} />
                </button>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Box 3: API Traffic VU Decibel Meter (Col-span 4) */}
        <BentoCard className="md:col-span-4 min-h-[280px] relative overflow-hidden group" delay={0.15}>
          <div className="tech-dot-mesh" />
          {/* Corner Screws */}
          <span className="rack-mount-screw absolute top-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute top-3 right-3 opacity-30" />
          
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#C4183C]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#8B8698]">
                    {dimensionShift ? "ELECTROMAGNETIC GEIGER SENSOR" : "API Traffic VU Meter"}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-[#C4183C]">
                  {dimensionShift ? "ANOMALOUS" : "Telemetry"}
                </span>
              </div>
 
              {/* Bouncing needle SVG gauge */}
              <div className="relative w-full h-24 bg-neutral-950 border border-white/5 rounded-xl p-2 overflow-hidden shadow-inner flex flex-col justify-end">
                <svg viewBox="0 0 100 50" className="w-full h-full text-white/10 select-none">
                  <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" />
                  <path d="M 20 45 A 30 30 0 0 1 80 45" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <text x="12" y="42" className="text-[5px] fill-white/40 font-mono">-20</text>
                  <text x="32" y="24" className="text-[5px] fill-white/40 font-mono">-5</text>
                  <text x="50" y="16" className="text-[5px] fill-white/40 font-mono">0</text>
                  <text x="68" y="24" className="text-[5px] fill-[#C4183C]/50 font-mono">+3</text>
                  <text x="83" y="42" className="text-[5px] fill-[#C4183C]/50 font-mono">+6</text>
                </svg>
                {/* Needle path */}
                <div 
                  className={`absolute bottom-1 left-1/2 w-[1.5px] h-16 origin-bottom ${
                    dimensionShift ? "bg-[#C4183C] shadow-[0_0_8px_#C4183C]" : "bg-[#7C3AED] shadow-[0_0_8px_#7C3AED]"
                  }`}
                  style={{ 
                    transform: `translateX(-50%) rotate(${needleAngle}deg)`,
                    transition: "transform 0.08s ease-out"
                  }}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-3 text-[10px] font-mono text-white/30">
              <span>Time: {localTime} IST</span>
              <span>API LINK: ACTIVE</span>
            </div>
          </div>
        </BentoCard>

        {/* Box 4: Commit Sequencer Equalizer Matrix (Col-span 4) */}
        <BentoCard className="md:col-span-4 min-h-[280px] relative overflow-hidden group" delay={0.2}>
          <div className="tech-dot-mesh" />
          {/* Corner Screws */}
          <span className="rack-mount-screw absolute top-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute top-3 right-3 opacity-30" />
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GitCommit size={16} className="text-red-500" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white/50">
                    {dimensionShift ? "MIND FLAYER CORRELATOR MATRIX" : "Commit Sequencer Equalizer"}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-red-500">
                  {dimensionShift ? "INTERCEPT" : "Hover Grid"}
                </span>
              </div>

              {/* Grid visual */}
              <div className="grid grid-cols-7 gap-1.5 my-2">
                {commitCells}
              </div>
            </div>

            <div className="border-t border-white/5 pt-3">
              <div className="h-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={hoveredCommit || "idle"}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[9px] font-mono text-white/40 block truncate"
                  >
                    {hoveredCommit ? `> ${hoveredCommit}` : dimensionShift ? "Interception ready. Hover grid..." : "Hover columns to play pentatonic notes..."}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Box 5: Frequency Tuner & Dimension Toggle Module (Col-span 4) */}
        <BentoCard className="md:col-span-4 min-h-[280px] relative overflow-hidden group" delay={0.25}>
          <div className="tech-dot-mesh" />
          {/* Corner Screws */}
          <span className="rack-mount-screw absolute top-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute top-3 right-3 opacity-30" />
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center pr-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => handleTerminalCommand("about.sh", e)}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/5 hover:border-[#C4183C]/30 hover:bg-white/10 font-mono text-[8px] text-[#C4183C] cursor-pointer"
                  >
                    about.sh
                  </button>
                  <button
                    onClick={(e) => handleTerminalCommand("stats.log", e)}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/5 hover:border-[#7C3AED]/30 hover:bg-white/10 font-mono text-[8px] text-[#7C3AED] cursor-pointer"
                  >
                    stats.log
                  </button>
                  <button
                    onClick={(e) => handleTerminalCommand("clear", e)}
                    className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 hover:bg-white/10 font-mono text-[8px] text-white/30 cursor-pointer"
                  >
                    clear
                  </button>
                </div>
                <span className="font-mono text-[8px] text-[#7C3AED]">{radioFreq.toFixed(1)} MHz</span>
              </div>
 
              {/* FM Radio Dial Tuner bar slider */}
              <div className="relative w-full h-8 bg-neutral-950 border border-white/5 rounded-lg p-1.5 overflow-hidden flex flex-col justify-between select-none">
                <div className="flex justify-between text-[6px] font-mono text-white/20">
                  <span>88</span>
                  <span>93</span>
                  <span>98</span>
                  <span>103</span>
                  <span>108</span>
                </div>
                <div className="h-1 flex justify-between items-end border-b border-white/10">
                  {Array.from({ length: 17 }).map((_, idx) => (
                    <span key={idx} className={`w-[1px] bg-white/15 ${idx % 4 === 0 ? "h-1.5" : "h-0.5"}`} />
                  ))}
                </div>
                {/* Red pointer needle line */}
                <div 
                  className="absolute top-1 bottom-1 w-[1.5px] bg-[#C4183C] z-10 transition-all duration-300 ease-out"
                  style={{ left: `${((radioFreq - 88) / (108 - 88)) * 100}%` }}
                />
              </div>
            </div>
 
            <div className="font-mono text-xs text-white/80 space-y-1.5 mt-1 flex-1 flex flex-col justify-end min-h-[90px]">
              <div className="text-white/60 leading-relaxed pl-2 border-l border-white/5 space-y-0.5 select-all">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="text-[10px] truncate">{log}</div>
                ))}
              </div>
              
              {/* INTERACTIVE EASTER EGG ROCKER SWITCH: RED PORTAL DIMENSION OVERRIDE */}
              <div className="flex items-center justify-between pt-1 pr-1 select-none">
                <span className="text-[9px] font-bold text-[#C4183C] tracking-wider font-mono">ENTER THE UPSIDE DOWN:</span>
                <button
                  onClick={handleDimensionToggle}
                  className={`relative w-12 h-6 rounded-full p-1 transition-all duration-300 ease-in-out cursor-pointer flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border ${
                    dimensionShift 
                      ? "bg-[#120D1E] border-[#C4183C]/50 shadow-[0_0_12px_rgba(196,24,60,0.3)]" 
                      : "bg-black/80 border-white/10"
                  }`}
                >
                  <div 
                    className={`w-3.5 h-3.5 rounded-full transition-transform duration-300 ${
                      dimensionShift 
                        ? "translate-x-6 bg-[#C4183C] shadow-[0_0_8px_#C4183C]" 
                        : "translate-x-0 bg-neutral-600"
                    }`} 
                  />
                </button>
              </div>
            </div>
 
            <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[10px] font-mono text-white/30 mt-3">
              <span>Cerebro Frequency</span>
              <span className="text-[#C4183C]">{dimensionShift ? "GATE OPEN" : "HAWKINS SAFE"}</span>
            </div>
          </div>
        </BentoCard>

        {/* Box 6: Experience Highlights (Col-span 12) */}
        <BentoCard className="md:col-span-12 min-h-[200px] relative overflow-hidden group" delay={0.3}>
          <div className="tech-dot-mesh" />
          <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-[#7C3AED]/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-[#C4183C]" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#8B8698]">
                  {dimensionShift ? "HAWKINS LAB GATE METRICS" : "Experience Highlights"}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                {dimensionShift ? "Dimensional Telemetry Transmissions" : "Full Stack Software Engineering"}
              </h3>
              <p className="text-sm text-[#8B8698] mt-2 max-w-2xl leading-relaxed">
                {dimensionShift ? (
                  "Secured and monitored communications channels, configured database introspection modules, and tracked electromagnetic gate anomalies across Mesra pipelines."
                ) : (
                  "Designed custom administrative mixing panels, real-estate indexing platforms, and high-performance analytical systems."
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/rakshit432"
                target="_blank"
                rel="noopener noreferrer"
                data-text="GitHub profile"
                className="glitch-btn px-5 py-3 rounded-sm border border-white/20 hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/5 text-xs font-semibold uppercase tracking-wider text-white transition-all flex items-center gap-2"
              >
                GitHub profile
                <ArrowUpRight size={12} />
              </a>
              <a
                href="https://www.linkedin.com/in/rakshit-kumar-9979b1292/"
                target="_blank"
                rel="noopener noreferrer"
                data-text="LinkedIn profile"
                className="glitch-btn px-5 py-3 rounded-sm border border-white/20 hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/5 text-xs font-semibold uppercase tracking-wider text-white transition-all flex items-center gap-2"
              >
                LinkedIn profile
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </BentoCard>

      </div>
    </section>
  );
};
