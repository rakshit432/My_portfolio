"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Power, Terminal } from "lucide-react";

export default function StudioBootOverlay() {
  const [isBooted, setIsBooted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const isBootingRef = useRef(false);

  // Sync state with global audio player events
  useEffect(() => {
    const handleAudioState = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPlaying(customEvent.detail);
      if (customEvent.detail) {
        setIsBooted(true);
      }
    };
    window.addEventListener("audioPlayState", handleAudioState);
    return () => window.removeEventListener("audioPlayState", handleAudioState);
  }, []);

  const playBootSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playNote = (freq: number, time: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.06, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.start(time);
        osc.stop(time + duration);
      };

      // Play C-E-G-B-C-B-G-E theme arpeggio (C3 to C4 range for retro bass/synth tone)
      const notes = [130.81, 164.81, 196.00, 246.94, 261.63, 246.94, 196.00, 164.81];
      const tempo = 0.12; 
      notes.forEach((freq, idx) => {
        playNote(freq, ctx.currentTime + idx * tempo, 0.35);
      });
    } catch (e) {
      console.log("Audio Context blocked or unsupported:", e);
    }
  }, []);

  const handlePowerOn = useCallback(() => {
    if (isBootingRef.current) return;
    isBootingRef.current = true;
    
    playBootSound();
    setBootLogs(["CONNECTING POWER RELAYS...", "WARNING: GATE SHIELD INTRUSION..."]);

    setTimeout(() => {
      setBootLogs((prev) => [...prev, "MONITORING FLUX DENSITY...", "BREACH IN SECTOR 4 DETECTED!"]);
    }, 450);

    setTimeout(() => {
      setBootLogs((prev) => [...prev, "COLLAPSING DIMENSIONAL BARRIERS...", "WELCOME TO HAWKINS, IN 1983"]);
    }, 900);

    setTimeout(() => {
      // Trigger music start and state changes across the viewport
      window.dispatchEvent(new CustomEvent("audioPlayState", { detail: true }));
      window.dispatchEvent(new CustomEvent("triggerAudioPlay", { detail: true }));
      setIsBooted(true);
      isBootingRef.current = false;
    }, 1500);
  }, [playBootSound]);

  const floatConfig = [
    { left: 10, delay: 0, size: 14 },
    { left: 25, delay: 3, size: 22 },
    { left: 40, delay: 7, size: 16 },
    { left: 55, delay: 1, size: 18 },
    { left: 70, delay: 11, size: 24 },
    { left: 85, delay: 5, size: 15 },
    { left: 93, delay: 9, size: 20 },
  ];

  return (
    <>
      {/* Flashing spectrum boundary border glow */}
      <div className={`equalizer-spectrum-overlay ${isPlaying ? "active" : ""}`} />

      {/* Slowly floating musical background icons */}
      <div className="fixed inset-0 pointer-events-none z-[-15] overflow-hidden">
        {floatConfig.map((el, idx) => (
          <div
            key={idx}
            className={`floating-music-element ${isPlaying ? "playing" : "paused"}`}
            style={{
              left: `${el.left}%`,
              animationDelay: `${el.delay}s`,
              width: `${el.size}px`,
              height: `${el.size}px`,
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-white/5">
              {idx % 2 === 0 ? (
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              ) : (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
              )}
            </svg>
          </div>
        ))}
      </div>

      {/* Boot Modal Overlay */}
      {!isBooted && (
        <div className="fixed inset-0 bg-[#060608]/97 z-[9999] flex flex-col items-center justify-center p-6 backdrop-blur-md">
          {/* Audio Console Panel frame */}
          <div className="w-full max-w-sm glass-card border border-red-500/20 rounded-[2rem] p-8 flex flex-col justify-between items-center text-center shadow-[0_0_50px_rgba(239,68,68,0.15)] relative bg-[#090505]">
            <span className="rack-mount-screw absolute top-3 left-3 opacity-40" />
            <span className="rack-mount-screw absolute top-3 right-3 opacity-40" />
            <span className="rack-mount-screw absolute bottom-3 left-3 opacity-40" />
            <span className="rack-mount-screw absolute bottom-3 right-3 opacity-40" />

            <div>
              <div className="flex items-center gap-1.5 justify-center mb-6 text-red-500/50">
                <Terminal size={14} className="animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest">HAWKINS NATIONAL LAB</span>
              </div>
              <h1 className="text-2xl font-black text-red-500 font-mono uppercase tracking-tight mb-2">
                GATE SYSTEM: LOCK
              </h1>
              <p className="text-xs text-white/50 leading-relaxed font-sans max-w-[250px] mx-auto">
                Press the override toggle to power on the Cerebro radio arrays and bridge dimensional containment nodes.
              </p>
            </div>

            {/* Clickable Power Knob */}
            <div className="my-8">
              <button
                onClick={handlePowerOn}
                className="w-16 h-16 rounded-full bg-red-700 border-4 border-red-950 flex items-center justify-center text-white hover:scale-105 hover:bg-red-600 hover:shadow-[0_0_25px_#ef4444] transition-all cursor-pointer select-none"
              >
                <Power size={20} className="text-white" />
              </button>
            </div>

            {/* Simulated compiler status log */}
            <div className="w-full min-h-[50px] font-mono text-[9px] text-[#4ade80]/70 text-left border border-white/5 bg-black/40 rounded-lg p-3 space-y-0.5">
              {bootLogs.length === 0 ? (
                <div className="text-red-500/40 animate-pulse">&gt; Standby. Awaiting override input...</div>
              ) : (
                bootLogs.map((log, idx) => (
                  <div key={idx} className={log.includes("WARNING") || log.includes("BREACH") ? "text-red-500" : ""}>&gt; {log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
