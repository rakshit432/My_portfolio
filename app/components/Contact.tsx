"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Github, Linkedin, Radio, CheckCircle2, Copy, ExternalLink, Terminal } from "lucide-react";
import { SiLeetcode } from "react-icons/si";

interface ChannelConfig {
  id: "email" | "linkedin" | "github" | "leetcode";
  label: string;
  frequency: number;
  value: string;
  url?: string;
  icon: any;
}

const CHANNELS: ChannelConfig[] = [
  { id: "email", label: "Email Station", frequency: 98.5, value: "rakshitkumar.5905@gmail.com", icon: Mail },
  { id: "linkedin", label: "LinkedIn Link", frequency: 101.2, value: "rakshit-kumar-9979b1292", url: "https://www.linkedin.com/in/rakshit-kumar-9979b1292/", icon: Linkedin },
  { id: "github", label: "GitHub Repos", frequency: 104.8, value: "rakshit432", url: "https://github.com/rakshit432", icon: Github },
  { id: "leetcode", label: "LeetCode Submissions", frequency: 106.6, value: "Rakshit_kr", url: "https://leetcode.com/u/Rakshit_kr/", icon: SiLeetcode },
];

export default function Contact() {
  const [activeChannelIdx, setActiveChannelIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [txLogs, setTxLogs] = useState<string[]>([]);
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const year = new Date().getFullYear();

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

  const activeChannel = CHANNELS[activeChannelIdx];

  // Web Audio noise burst simulating analogue radio tuner static
  const playTunerStatic = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 0.15; // 150ms static noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1000;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch(e) {}
  }, []);

  const handleChannelSelect = useCallback((idx: number) => {
    playTunerStatic();
    setActiveChannelIdx(idx);
    setCopied(false);
  }, [playTunerStatic]);

  const handleCopyValue = useCallback(() => {
    navigator.clipboard.writeText(activeChannel.value);
    setCopied(true);
    // Play synthesizer confirmation tone
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch(e) {}
    setTimeout(() => setCopied(false), 2000);
  }, [activeChannel.value]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    const initialLogs = isUpsideDown 
      ? ["[TX] WARNING: BRIDGING DIMENSIONAL CONTAINMENTS...", "[TX] Cerebro arrays tuned to portal flux..."] 
      : ["[TX] Powering solid state relays...", "[TX] Tuning transmitter frequency: " + activeChannel.frequency + " MHz"];
    
    setTxLogs(initialLogs);
    const fd = new FormData(e.currentTarget);
    
    // Staggered simulated telemetries logs
    setTimeout(() => {
      setTxLogs((prev) => [
        ...prev, 
        isUpsideDown ? "[TX] SIGNAL ESCAPING containment gate..." : "[TX] Modulating message carrier packet..."
      ]);
    }, 450);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
          subject: `Broadcast via ${activeChannel.label}`,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "ok" : "err");
      if (data.success) {
        setTxLogs((prev) => [
          ...prev, 
          isUpsideDown ? "[TX] TRANSMISSION LEAKED INTO PORTAL SUCCESS!" : "[TX] Broadcast successful. Signal Out!"
        ]);
        (e.target as HTMLFormElement).reset();
      } else {
        setTxLogs((prev) => [...prev, isUpsideDown ? "[ERR] Signal collapsed. Vines blocked route." : "[ERR] Write failure. Relays reset."]);
      }
    } catch {
      setStatus("err");
      setTxLogs((prev) => [
        ...prev, 
        isUpsideDown ? "[ERR] Transmission lost in Upside Down static." : "[ERR] Transmission lost in atmospheric static."
      ]);
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <footer id="contact" className="py-24 px-6 md:px-12 relative z-10 max-w-6xl mx-auto overflow-hidden">
      {/* Pulsing Radio Transmitter Signal concentric waves background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none opacity-[0.08] flex items-center justify-center">
        <div className="absolute w-[350px] h-[350px] rounded-full border border-[#C4183C] animate-[pulseRing_8s_cubic-bezier(0.215,0.610,0.355,1)_infinite]" />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-[#7C3AED] animate-[pulseRing_8s_cubic-bezier(0.215,0.610,0.355,1)_infinite]" style={{ animationDelay: "2.5s" }} />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-[#C4183C] animate-[pulseRing_8s_cubic-bezier(0.215,0.610,0.355,1)_infinite]" style={{ animationDelay: "5s" }} />
      </div>

      {/* Title Header */}
      <div className="mb-14 select-none">
        <span className="font-mono text-xs uppercase tracking-widest text-[#C4183C] block mb-3">
          {isUpsideDown ? "CEREBRO PORTAL TRANSMITTER" : "Analog Broadcast Command"}
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight select-text text-transparent bg-clip-text bg-gradient-to-r from-[#F1EDE4] via-[#C4183C] to-[#7C3AED]" style={{ fontFamily: "'Unbounded', sans-serif" }}>
          {isUpsideDown ? <>Beam signal <span className="text-[#C4183C]">to the void</span></> : <>Let&apos;s build <span className="text-[#C4183C]">together</span></>}
        </h2>
        <p className="text-sm text-[#8B8698] mt-4 leading-relaxed max-w-md">
          {isUpsideDown 
            ? "Transmit a modulated frequency carrier block into the dimensional gate." 
            : "Tune in to Rakshit&apos;s channels or broadcast a carrier message packet straight to his terminal."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Left Side: Modular Tuner Console (Col-span 7) */}
        <div className="lg:col-span-7 border border-[rgba(241,237,228,0.15)] bg-[#120D1E] rounded-[2rem] p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[460px]">
          {/* Rack screws */}
          <span className="rack-mount-screw absolute top-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute top-3 right-3 opacity-30" />
          <span className="rack-mount-screw absolute bottom-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute bottom-3 right-3 opacity-30" />

          {/* LCD Screen Display */}
          <div className="bg-[#091512] border-2 border-neutral-850 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] text-[#4ade80] font-mono select-none min-h-[170px]">
            {/* Grid background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" 
                 style={{ 
                   backgroundImage: "linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)",
                   backgroundSize: "20px 20px"
                 }} 
            />
            
            <div className="relative z-10 flex items-center justify-between border-b border-[#4ade80]/20 pb-2 text-[8px] text-[#4ade80] tracking-widest">
              <span>{isUpsideDown ? "CEREBRO DIAL TRANSCEIVER" : "FREQUENCY DIAL RECEIVER"}</span>
              <span className="animate-pulse">{isUpsideDown ? "● GATE OPEN" : "● SIGNAL ON"}</span>
            </div>

            <div className="relative z-10 my-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-white/40 block">TUNE IN:</span>
                <span className="text-2xl font-black tracking-tight text-[#4ade80]">
                  {activeChannel.frequency.toFixed(1)} <span className="text-xs">MHz</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40 block">BAND / NODE</span>
                <span className="text-xs font-bold text-[#4ade80] uppercase tracking-wider">
                  {activeChannel.label}
                </span>
              </div>
            </div>

            {/* Display value link / copy wrapper */}
            <div className="relative z-10 flex items-center justify-between bg-black/40 border border-[#4ade80]/15 rounded-lg p-2.5 mt-2">
              <span className="text-[10px] truncate max-w-[240px] text-white/80">
                {activeChannel.value}
              </span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleCopyValue}
                  className="p-1.5 rounded hover:bg-[#4ade80]/15 text-[#4ade80] transition-all cursor-pointer"
                  title="Copy Channel Value"
                >
                  <Copy size={12} />
                </button>
                {activeChannel.url && (
                  <a
                    href={activeChannel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-[#4ade80]/15 text-[#4ade80] transition-all flex items-center justify-center"
                    title="Launch Channel Station"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
            
            <span className="absolute bottom-1 right-2 text-[6px] text-[#4ade80]/30 font-mono">RX: SENSITIVITY +18dB</span>
          </div>

          {/* Tuner scale indicator slider */}
          <div className="my-6 select-none">
            {/* Visual scale scale ticks */}
            <div className="flex justify-between text-[7px] font-mono text-white/30 px-2 mb-1.5">
              <span>88.0 MHz</span>
              <span>92.0</span>
              <span>96.0</span>
              <span>100.0</span>
              <span>104.0</span>
              <span>108.0 MHz</span>
            </div>
            {/* Tuner Track bar */}
            <div className="h-4 bg-neutral-950 border border-white/5 rounded-full relative overflow-hidden flex items-center px-1">
              <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-transparent via-[#C4183C]/8 to-transparent pointer-events-none" />
              {/* Linear scale sweep bar matching frequency */}
              <motion.div
                className="absolute top-0 bottom-0 w-0.5 bg-[#C4183C] shadow-[0_0_8px_#C4183C] z-10"
                animate={{
                  left: `${((activeChannel.frequency - 88) / (108 - 88)) * 96 + 2}%`,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>

          {/* Radio tune push button toggles */}
          <div className="grid grid-cols-4 gap-2 text-center select-none">
            {CHANNELS.map((chan, idx) => {
              const Icon = chan.icon;
              const isActive = idx === activeChannelIdx;
              return (
                <button
                  key={chan.id}
                  onClick={() => handleChannelSelect(idx)}
                  className={`py-3.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer border transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#C4183C] to-[#7C3AED] border-transparent text-[#F1EDE4] font-bold scale-[1.03] shadow-lg"
                      : "border-[rgba(241,237,228,0.15)] bg-white/2 hover:bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span className="font-mono text-[7px] uppercase tracking-wider leading-none">
                    {chan.frequency} MHz
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Side: Cassette Tape Recording Form Console (Col-span 5) */}
        <div className="lg:col-span-5 border border-[rgba(241,237,228,0.15)] bg-[#120D1E] rounded-[2rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Rack mount screws */}
          <span className="rack-mount-screw absolute top-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute top-3 right-3 opacity-30" />
          <span className="rack-mount-screw absolute bottom-3 left-3 opacity-30" />
          <span className="rack-mount-screw absolute bottom-3 right-3 opacity-30" />

          {/* Form Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <span className="font-mono text-[9px] text-[#C4183C] tracking-widest uppercase">
              {isUpsideDown ? "CEREBRO INGEST BOARD [CLASS A]" : "ANALOG TAPE INGEST DECK"}
            </span>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#C4183C] tracking-widest uppercase select-none">
              <span className={`w-2.5 h-2.5 rounded-full bg-[#C4183C] shadow-[0_0_8px_#C4183C] ${submitting ? "animate-ping" : "animate-pulse"}`} />
              {submitting ? "WRITING PACKET..." : isUpsideDown ? "PORTAL ACTIVE" : "REC STANDBY"}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="checkbox" name="botcheck" className="hidden" />

            <div>
              <label className="font-mono text-[8px] text-white/40 uppercase tracking-widest block mb-1">
                {isUpsideDown ? "Signal Origin: Sender ID" : "Tape Index: Sender Name"}
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder={isUpsideDown ? "Transmitting node..." : "Rakshit's Collaborator"}
                className="w-full bg-[#08070C] text-[#F1EDE4] border-l-4 border-[#C4183C] border-y border-r border-white/5 rounded-lg p-2.5 font-mono text-xs placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#C4183C] shadow-inner"
              />
            </div>

            <div>
              <label className="font-mono text-[8px] text-white/40 uppercase tracking-widest block mb-1">
                {isUpsideDown ? "Correlation Node: Return ID" : "Tape Index: Return Address"}
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="colleague@domain.com"
                className="w-full bg-[#08070C] text-[#F1EDE4] border-l-4 border-[#C4183C] border-y border-r border-white/5 rounded-lg p-2.5 font-mono text-xs placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#C4183C] shadow-inner"
              />
            </div>

            <div>
              <label className="font-mono text-[8px] text-white/40 uppercase tracking-widest block mb-1">
                {isUpsideDown ? "Dimension Payload: Message Frequencies" : "Magnetic Tracks: Message Payload"}
              </label>
              <textarea
                name="message"
                rows={3}
                required
                placeholder={isUpsideDown ? "Transmit logs or signals into the portal..." : "Type your message track notes here..."}
                className="w-full bg-[#08070C] text-[#F1EDE4] border-l-4 border-[#C4183C] border-y border-r border-white/5 rounded-lg p-2.5 font-mono text-xs placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#C4183C] resize-none shadow-inner"
              />
            </div>
            
            <div className="border border-white/5 bg-black/40 rounded-lg p-2.5 font-mono text-[8px] text-[#4ade80] min-h-[52px] space-y-0.5 select-none">
              <div className="flex items-center gap-1.5 text-white/40 border-b border-white/5 pb-1 mb-1">
                <Terminal size={9} className="animate-pulse" />
                <span>{isUpsideDown ? "GATE BEAM SENSOR RELAYS" : "Message Transmitter Relays"}</span>
              </div>
              {txLogs.length === 0 ? (
                <div className="text-white/20 animate-pulse">&gt; {isUpsideDown ? "Standby. Awaiting gateway overrides..." : "Standby. Awaiting lever trigger..."}</div>
              ) : (
                txLogs.map((log, idx) => (
                  <div key={idx} className="truncate">{log}</div>
                ))
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || status === "ok"}
              data-text={
                submitting 
                  ? (isUpsideDown ? "[TX] INJECTING BEAM..." : "[TX] BROADCASTING...") 
                  : status === "ok" 
                  ? (isUpsideDown ? "✓ GATEWAY INJECTION OK" : "✓ BROADCAST COMPLETED OK") 
                  : (isUpsideDown ? "[TX] INJECT INTO PORTAL" : "[TX] TRANSMIT MESSAGE")
              }
              className="glitch-btn w-full text-white font-mono text-xs uppercase tracking-widest font-black py-3 rounded-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 active:translate-y-0.5 hover:shadow-[0_8px_30px_rgba(124,58,237,0.35)]"
              style={{ background: 'linear-gradient(100deg, #C4183C, #7C3AED)' }}
            >
              {submitting ? (
                <span>{isUpsideDown ? "[TX] INJECTING BEAM..." : "[TX] BROADCASTING..."}</span>
              ) : status === "ok" ? (
                <span>{isUpsideDown ? "✓ GATEWAY INJECTION OK" : "✓ BROADCAST COMPLETED OK"}</span>
              ) : (
                <span>{isUpsideDown ? "[TX] INJECT INTO PORTAL" : "[TX] TRANSMIT MESSAGE"}</span>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Copyright Footer Strip */}
      <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/30 gap-4 select-none">
        <span>© {year} Rakshit. All rights reserved.</span>
        <span>Built with Next.js · Three.js · Tailwind CSS</span>
      </div>
    </footer>
  );
}
