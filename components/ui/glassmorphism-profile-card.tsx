"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Mail, MapPin, ExternalLink, Terminal } from "lucide-react";

interface ProfileCardProps {
  name: string;
  role: string;
  email: string;
}

export default function GlassmorphismProfileCard({ name, role, email }: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0);
  const [showStats, setShowStats] = useState(false);

  // Audio track & time coordinates synced via custom event bus
  const [trackInfo, setTrackInfo] = useState({ title: "Lofi Ambient 1", artist: "Helix Instruments", index: 0 });
  const [timeInfo, setTimeInfo] = useState({ currentTime: 0, duration: 1 });

  // Sync state with global audio player events
  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPlaying(customEvent.detail);
    };
    const handleTrackChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setTrackInfo(customEvent.detail);
      }
    };
    const handleTimeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setTimeInfo(customEvent.detail);
      }
    };

    window.addEventListener("audioPlayState", handleStateChange);
    window.addEventListener("audioTrackChange", handleTrackChange);
    window.addEventListener("audioTimeUpdate", handleTimeChange);

    return () => {
      window.removeEventListener("audioPlayState", handleStateChange);
      window.removeEventListener("audioTrackChange", handleTrackChange);
      window.removeEventListener("audioTimeUpdate", handleTimeChange);
    };
  }, []);

  // requestAnimationFrame loop to tick wave coordinates
  useEffect(() => {
    let reqId: number;
    const tick = () => {
      setTimeOffset((prev) => prev + (isPlaying ? 0.22 : 0.035));
      reqId = requestAnimationFrame(tick);
    };
    reqId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(reqId);
  }, [isPlaying]);

  const toggleStats = useCallback(() => {
    // Play digital console selector chime (Web Audio)
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
    
    setShowStats((prev) => !prev);
  }, []);

  // Mouse tilt tracking handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const reflection = reflectionRef.current;
    if (!card || !reflection) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width - 0.5) * 12; 
    const percentY = (y / rect.height - 0.5) * -12;

    card.style.transition = "none";
    card.style.transform = `perspective(1000px) rotateY(${percentX}deg) rotateX(${percentY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    reflection.style.setProperty("--x", `${x}px`);
    reflection.style.setProperty("--y", `${y}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.5s var(--ease-fluid)";
    card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
  }, []);

  // Compute live Green Oscilloscope SVG path coordinates
  const points: string[] = [];
  const width = 160;
  for (let x = 0; x <= width; x += 4) {
    const amplitude = isPlaying ? 14 : 2;
    const frequency = isPlaying ? 0.09 : 0.03;
    const yVal = 40 + Math.sin(x * frequency + timeOffset) * amplitude;
    points.push(`${x === 0 ? "M" : "L"} ${x} ${yVal}`);
  }
  const pathData = points.join(" ");

  // Progress percentage
  const progressPercent = (timeInfo.currentTime / timeInfo.duration) * 100;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="border-beam-wrapper w-[92vw] max-w-[480px] aspect-[1.55/1] cursor-pointer"
      style={{ transition: "transform 0.4s var(--ease-fluid)" }}
    >
      <div className="border-beam-inner glass-card p-6 w-full h-full flex flex-col justify-between select-none relative bg-[#0c0c14] border-2 border-white/10 rounded-[2rem] shadow-2xl">
        {/* Corner Screws */}
        <span className="rack-mount-screw absolute top-3 left-3 opacity-30" />
        <span className="rack-mount-screw absolute top-3 right-3 opacity-30" />
        <span className="rack-mount-screw absolute bottom-3 left-3 opacity-30" />
        <span className="rack-mount-screw absolute bottom-3 right-3 opacity-30" />

        <div ref={reflectionRef} className="glass-reflection" />

        {/* Modular panel header */}
        <div className="relative z-10 flex items-center justify-between text-[8px] font-mono text-white/30 tracking-widest uppercase">
          <span>EURORACK OSCILLATOR MODEL-R</span>
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-[#22d3ee] animate-pulse" : "bg-neutral-600"}`} />
            <span className="text-[#22d3ee]">SYS CORE ACTIVE</span>
          </div>
        </div>

        {/* Chassis Center Panel */}
        <div className="relative z-10 flex items-stretch gap-4 my-2 flex-1">
          
          {/* Left Block: Glowing Oscilloscope Screen */}
          <div className="w-[52%] bg-[#081311] border-2 border-neutral-850 rounded-xl relative overflow-hidden flex flex-col justify-between p-2.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] text-[#4ade80] font-mono select-none">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" 
                 style={{ 
                   backgroundImage: "linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)",
                   backgroundSize: "16px 16px"
                 }} 
            />
            
            {showStats ? (
              <div className="relative z-10 flex flex-col justify-between h-full text-[7.5px] leading-tight space-y-0.5 mt-0.5 text-left">
                <div className="text-[8px] border-b border-[#4ade80]/20 pb-0.5 mb-1 flex justify-between font-bold text-[#ccfbf1]">
                  <span>DIAGNOSTIC DATA</span>
                  <span className="animate-pulse">●</span>
                </div>
                <div className="flex justify-between"><span>EDUCATION:</span> <span className="font-bold text-[#ccfbf1]">B.TECH CSE</span></div>
                <div className="flex justify-between"><span>LEETCODE RAT:</span> <span className="font-bold text-[#ccfbf1]">1700+</span></div>
                <div className="flex justify-between"><span>SOLVED PROBS:</span> <span className="font-bold text-[#ccfbf1]">800+</span></div>
                <div className="flex justify-between"><span>COMMITS:</span> <span className="font-bold text-[#ccfbf1]">1.2K+</span></div>
                <div className="flex justify-between"><span>ROLE FOCUS:</span> <span className="font-bold text-[#ccfbf1]">SOFTWARE ENG</span></div>
              </div>
            ) : (
              <>
                <svg viewBox="0 0 160 80" className="w-full h-full text-[#4ade80] relative z-10">
                  <path 
                    d={pathData} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    className="drop-shadow-[0_0_4px_rgba(74,222,128,0.7)]"
                  />
                </svg>
                
                {/* Track progress HUD overlay */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[5.5px] text-[#4ade80]/60 z-10 bg-[#081311]/85 px-1 py-0.5 rounded border border-[#4ade80]/15">
                  <span className="truncate max-w-[50px] uppercase font-bold text-[#ccfbf1] tracking-wider">{trackInfo.title}</span>
                  <span className="font-mono">
                    {Math.floor(timeInfo.currentTime / 60)}:{(Math.floor(timeInfo.currentTime % 60)).toString().padStart(2, '0')}
                  </span>
                </div>
                
                {/* Scrubber indicator line */}
                <div 
                  className="absolute bottom-0 left-0 h-0.5 bg-[#4ade80] transition-all duration-300 shadow-[0_0_4px_#4ade80]" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </>
            )}
          </div>

          {/* Right Block: Synth Knobs & Sockets */}
          <div className="flex-1 flex flex-col justify-between py-1 px-1 border-l border-white/5">
            {/* Toggle telemetry mode */}
            <div className="my-0.5 select-none relative z-20">
              <button 
                onClick={toggleStats}
                className="w-full px-1.5 py-1 border border-[#22d3ee]/20 text-[#22d3ee] rounded bg-white/5 font-mono text-[7px] cursor-pointer hover:bg-[#22d3ee]/10 active:scale-95 transition-all text-center leading-none font-bold"
              >
                {showStats ? "OSCILLOSCOPE" : "TELEMETRY"}
              </button>
            </div>

            {/* Rotary dial knobs */}
            <div className="grid grid-cols-3 gap-1">
              <div className="flex flex-col items-center group">
                <div className="w-6 h-6 rounded-full border border-neutral-750 bg-neutral-900 relative flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <div className="w-0.5 h-2 bg-[#22d3ee] absolute top-0.5 rounded-full" />
                </div>
                <span className="font-mono text-[5px] text-[#22d3ee]/80 mt-1">VOL</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-6 h-6 rounded-full border border-neutral-750 bg-neutral-900 relative flex items-center justify-center group-hover:-rotate-45 transition-transform duration-300">
                  <div className="w-0.5 h-2 bg-[#c084fc] absolute top-0.5 rounded-full" />
                </div>
                <span className="font-mono text-[5px] text-[#c084fc]/80 mt-1">BAL</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-6 h-6 rounded-full border border-neutral-750 bg-neutral-900 relative flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                  <div className="w-0.5 h-2 bg-[#f472b6] absolute top-0.5 rounded-full" />
                </div>
                <span className="font-mono text-[5px] text-[#f472b6]/80 mt-1">GAIN</span>
              </div>
            </div>

            {/* Sockets re-imagined as physical play controls */}
            <div className="flex justify-around items-center mt-1 border-t border-white/5 pt-2 select-none relative z-20">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("toggleAudioPlay"))}
                  className="w-5.5 h-5.5 rounded-full bg-black border-2 border-[#22d3ee] flex items-center justify-center hover:bg-[#22d3ee]/10 active:scale-90 transition-all cursor-pointer"
                  title="Play / Pause"
                >
                  {isPlaying ? (
                    <div className="w-1.5 h-1.5 bg-[#22d3ee] rounded-sm" />
                  ) : (
                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-[#22d3ee] ml-0.5" />
                  )}
                </button>
                <span className="font-mono text-[5px] text-white/30 mt-0.5">PLAY</span>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("nextAudioTrack"))}
                  className="w-5.5 h-5.5 rounded-full bg-black border-2 border-[#c084fc] flex items-center justify-center hover:bg-[#c084fc]/10 active:scale-90 transition-all cursor-pointer"
                  title="Next Track"
                >
                  <div className="w-1.5 h-1.5 bg-[#c084fc] rounded-full" />
                </button>
                <span className="font-mono text-[5px] text-white/30 mt-0.5">NEXT</span>
              </div>
            </div>
          </div>

        </div>

        {/* Metadata display */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-3">
          <div>
            <h2 className="text-sm font-black tracking-tight text-white font-mono uppercase leading-none">
              {name}
            </h2>
            <span className="font-mono text-[8px] text-white/40 block mt-0.5">
              {role}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={9} className="text-[#f472b6]" />
            <span className="font-mono text-[8px] text-white/40 uppercase">BIT MESRA, IN</span>
          </div>
        </div>

        {/* Footer links */}
        <div className="relative z-10 flex items-center justify-between text-[9px] text-white/40 pt-2 border-t border-dashed border-white/5 select-none">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1 hover:text-[#22d3ee] transition-colors relative z-20 font-mono text-[8px]"
          >
            <Mail size={9} />
            <span>{email}</span>
          </a>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-1 hover:text-[#c084fc] transition-colors cursor-pointer relative z-20 font-mono text-[8px]"
          >
            <span>Console Patch</span>
            <ExternalLink size={9} />
          </button>
        </div>

      </div>
    </div>
  );
}
