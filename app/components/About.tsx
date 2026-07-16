"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { PortalAnimeCanvas } from "@/components/ui/portal-anime-canvas";

const STATS = [
  { val: "800+", label: "DSA Problems Solved", mono: "LEETCODE // CODEFORCES // GFG" },
  { val: "Next.js", label: "Framework Architecture", mono: "FULL-STACK // WEB SYSTEM" },
  { val: "5", label: "Live Systems Shipped", mono: "MERN // NEXT.JS // NODE" },
  { val: "SDKs & Libs", label: "Open-Source Tools", mono: "INTEGRATION // API // DEPS" },
];

const STACK = [
  "Java", "C++", "Python", "JavaScript", "TypeScript",
  "React.js", "Next.js", "Node.js", "Express.js",
  "MongoDB", "PostgreSQL", "REST APIs", "Socket.io", "WebRTC",
  "Git", "Linux", "Gemini API",
];

const SKILL_DESC: Record<string, string> = {
  "Java": "OOP architecture, multi-threaded pipelines & robust runtime code.",
  "C++": "Low-level system architecture, custom algorithms & DSA puzzles.",
  "Python": "AI prompts, automated scripting, data processing & analysis.",
  "JavaScript": "Asynchronous engine loops, interactive DOM logic & Web API hooks.",
  "TypeScript": "Strict type safety compile guards & enterprise structure validation.",
  "React.js": "Virtual DOM architecture & high-performance interactive interfaces.",
  "Next.js": "Server Components, dynamic routing & SEO optimized deployments.",
  "Node.js": "Event-driven runtime engines, heavy compute pipelines & servers.",
  "Express.js": "RESTful routing controllers, security middleware & API gateways.",
  "MongoDB": "NoSQL document collections, geo-queries & flexible schemas.",
  "PostgreSQL": "Relational transactions, relational indexing & schema locks.",
  "REST APIs": "Secure endpoints, JSON exchange formatting & status compliance.",
  "Socket.io": "Real-time socket mesh pipelines & duplex event streams.",
  "WebRTC": "Low-latency direct peer-to-peer data & real-time video feeds.",
  "Git": "Distributed tree versioning, merge control & collaboration trees.",
  "Linux": "Posix kernel commands, automation scripts & container operations.",
  "Gemini API": "Generative model inference prompts, vector embeds & AI pipelines.",
  "DSA Problems Solved": "LeetCode, GFG & Codeforces database verified.",
  "Framework Architecture": "Next.js 14 Server Actions & React 18 Engine.",
  "Live Systems Shipped": "Production-grade MERN & Next.js systems deployed.",
  "Open-Source Tools": "Developer utilities, templates & npm modules."
};

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Advanced Telemetry State
  const [scanMode, setScanMode] = useState<"fingerprint" | "webcam" | "portal">("fingerprint");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // WebCam Biometric Stream State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Terminal & Clearance States
  const [activeTab, setActiveTab] = useState<"dossier" | "stack" | "classified">("dossier");
  const [isClassifiedUnlocked, setIsClassifiedUnlocked] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "SYSTEM DECRYPTION COMPLETED.",
    "WELCOME VISITOR // SECURE CONNECTION SECURED.",
    "Type 'help' to view available commands.",
    ""
  ]);

  // Initialize camera automatically on user activation
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const enableCamera = async () => {
      if (scanMode !== "webcam") {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        return;
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 240 } },
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn("Camera permission deferred or unavailable:", err);
        setScanMode("fingerprint");
      }
    };
    enableCamera();
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [scanMode]);

  // Ensure stream gets assigned to video node if it renders later
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Scroll-driven subtle vertical parallax offset
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const cardY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const cardYSpring = useSpring(cardY, { stiffness: 60, damping: 18 });

  // Web Audio oscillator sound feedback
  const playBeep = (freq: number, type: OscillatorType = "sine", duration: number = 0.1) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime); // keep it subtle and low volume
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored if blocked
    }
  };

  const handlePortalScanComplete = () => {
    setScanProgress(100);
    setIsScanning(false);
    playBeep(880, "sine", 0.12);
    setTimeout(() => {
      playBeep(1320, "sine", 0.18);
    }, 100);

    setScanLogs((prev) => [
      ...prev,
      "PORTAL STREAM DECRYPTED // STABLE",
      "BIOMETRIC COGNITION: APPROVED",
      "DECRYPTION COMPLETE // CLASSIFIED ACCESS UNLOCKED."
    ]);

    setIsClassifiedUnlocked(true);
    setActiveTab("classified");
    
    if (window.innerWidth < 1024) {
      setIsModalOpen(true);
    } else {
      const panel = document.getElementById("terminal-profile-panel");
      if (panel) {
        panel.classList.add("glitch-highlight");
        setTimeout(() => panel.classList.remove("glitch-highlight"), 1000);
      }
    }
  };

  // Play scanning trigger simulation when clicked or tapped
  const handleCardClick = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs(["INIT SCAN SEQUENCE...", "READYING TELEMETRY..."]);
    playBeep(440, "sawtooth", 0.08);

    if (scanMode === "portal") {
      setScanLogs([
        "INIT PORTAL DECRYPTION PIPELINE...",
        "BYPASSING GATEWAY FIREWALLS...",
        "DECRYPTING ANOMALY STREAM..."
      ]);
      return; // Canvas handles the 10-second timer and onComplete
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 6;
      if (progress >= 100) {
        progress = 100;
        setScanProgress(100);
        clearInterval(interval);
        setIsScanning(false);
        playBeep(880, "sine", 0.12);
        setTimeout(() => {
          playBeep(1320, "sine", 0.18);
        }, 100);

        setScanLogs((prev) => [
          ...prev, 
          "BIOMETRIC COGNITION: APPROVED", 
          "UPGRADING CLEARANCE TO LEVEL 2...", 
          "DECRYPTION COMPLETE // CLASSIFIED ACCESS UNLOCKED."
        ]);

        setIsClassifiedUnlocked(true);
        setActiveTab("classified");
        
        // Open credentials modal on mobile viewports
        if (window.innerWidth < 1024) {
          setIsModalOpen(true);
        } else {
          // Highlight desktop side panel temporarily
          const panel = document.getElementById("terminal-profile-panel");
          if (panel) {
            panel.classList.add("glitch-highlight");
            setTimeout(() => panel.classList.remove("glitch-highlight"), 1000);
          }
        }
      } else {
        playBeep(500 + progress * 3, "sine", 0.04);
        setScanProgress(progress);
        
        if (progress > 20 && progress < 40) {
          setScanLogs((prev) => {
            if (prev.includes("COLLECTING SCAN COORDS...")) return prev;
            return [...prev, "COLLECTING SCAN COORDS..."];
          });
        } else if (progress > 55 && progress < 75) {
          setScanLogs((prev) => {
            if (prev.includes("RESOLVING DECRYPT MATRIX...")) return prev;
            return [...prev, "RESOLVING DECRYPT MATRIX..."];
          });
        }
      }
    }, 90);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let response: string[] = [];
    switch (cmd) {
      case "help":
        response = [
          `RK-SHELL:> help`,
          `Available actions:`,
          `  secrets  - Display classified information`,
          `  stats    - Retrieve algorithmic & project telemetry`,
          `  ping     - Transmit packet into the portal`,
          `  clear    - Clear console screen`
        ];
        break;
      case "secrets":
        response = [
          `RK-SHELL:> secrets`,
          `> LOCATION // Patna (Origin) -> BIT Mesra (Current).`,
          `> CORE FUEL // High-potency caffeine & algorithmic puzzles.`,
          `> SECRETS  // I maintain a 800+ solved DSA nodes inventory.`,
          `> ELEVEN   // "Friends don't lie." Lights are flickering in Patna...`
        ];
        break;
      case "stats":
        response = [
          `RK-SHELL:> stats`,
          `> UPSTREAM CODE CLARITY // 100% Type-Safe`,
          `> ALGORITHMS SOLVED    // 800+ (LeetCode/GFG/CodeForces)`,
          `> LIVE DEPLOYMENTS     // 5 systems active`,
          `> REPO INTEGRITY       // A+`
        ];
        break;
      case "ping":
        response = [
          `RK-SHELL:> ping`,
          `Sending biometric packet to Portal...`,
          `[OK] 64 bytes received from Upside Down.`,
          `Void response: "RUN."`,
          `Warning: Dimensional shift event triggered!`
        ];
        // Trigger visual anomalies
        window.dispatchEvent(new CustomEvent("avatarShockwave"));
        window.dispatchEvent(new CustomEvent("dimensionShiftState", { detail: true }));
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("dimensionShiftState", { detail: false }));
        }, 3000);
        break;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      default:
        response = [
          `RK-SHELL:> ${cmd}`,
          `Error: Command '${cmd}' not recognized. Type 'help' for support.`
        ];
    }

    setTerminalHistory((prev) => [...prev, ...response, ""]);
    setTerminalInput("");
    playBeep(600, "sine", 0.05);
  };

  // Sub-component for rendering info details (shared between mobile modal and desktop side-panel)
  const InfoDetails = () => (
    <div className="flex flex-col gap-5 text-left h-full">
      {/* Eyebrow */}
      <div className="font-mono text-xs text-[#C4183C] flex items-center gap-2.5 tracking-wider">
        <span className="w-4 h-px bg-[#C4183C]" />
        &gt; identity_log.sh
      </div>

      {/* Title */}
      <h3 className="text-3xl font-extrabold uppercase tracking-tight text-[#F1EDE4]" style={{ fontFamily: "'Unbounded', sans-serif" }}>
        Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4183C] to-[#7C3AED]">Profile</span>
      </h3>

      {/* Terminal Tabs */}
      <div className="flex border-b border-white/10 gap-1 sm:gap-2">
        <button
          onClick={() => setActiveTab("dossier")}
          className={`px-3 py-1.5 font-mono text-[9px] sm:text-xs uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer ${
            activeTab === "dossier"
              ? "bg-[#120D1E] text-[#C4183C] border-t border-x border-white/10"
              : "text-[#8B8698] hover:text-[#F1EDE4]"
          }`}
        >
          DOSSIER.txt
        </button>
        <button
          onClick={() => setActiveTab("stack")}
          className={`px-3 py-1.5 font-mono text-[9px] sm:text-xs uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer ${
            activeTab === "stack"
              ? "bg-[#120D1E] text-[#C4183C] border-t border-x border-white/10"
              : "text-[#8B8698] hover:text-[#F1EDE4]"
          }`}
        >
          STACK.json
        </button>
        <button
          onClick={() => {
            if (!isClassifiedUnlocked) {
              playBeep(250, "sawtooth", 0.2);
              setScanLogs((prev) => [...prev, "ERROR // CLASSIFIED ACCESS DENIED", "BIOMETRIC VERIFICATION REQUIRED"]);
              // Highlight/flash the scanner on the left to direct users
              setIsHovered(true);
              setTimeout(() => setIsHovered(false), 800);
              return;
            }
            setActiveTab("classified");
          }}
          className={`px-3 py-1.5 font-mono text-[9px] sm:text-xs uppercase tracking-wider rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "classified"
              ? "bg-[#120D1E] text-[#C4183C] border-t border-x border-white/10"
              : isClassifiedUnlocked
              ? "text-[#4ADE80] hover:text-[#4ADE80]/80 font-bold"
              : "text-[#8B8698]/60 hover:text-white/80"
          }`}
        >
          {isClassifiedUnlocked ? "🔓" : "🔒"} CLASSIFIED.log
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 min-h-[300px]">
        {activeTab === "dossier" && (
          <div className="space-y-5">
            {/* Biography */}
            <div className="space-y-3 text-xs sm:text-[13px] leading-relaxed text-[#8B8698] font-sans font-normal">
              <p>
                I&apos;m <span className="text-[#F1EDE4] font-semibold">Rakshit Kumar</span> — a Computer Science
                & Engineering student at <span className="text-[#F1EDE4]">BIT Mesra, Jharkhand</span>,
                originally from Patna, Bihar.
              </p>
              <p>
                My development stack centers on building scalable applications using <span className="text-[#F1EDE4]">Next.js</span> and React, backed by Node.js, Express, and MongoDB.
                I&apos;m also highly active in algorithmic puzzle solving, with <span className="text-[#F1EDE4]">800+ problems solved</span> across LeetCode, Codeforces, and GFG.
              </p>
              <p>
                I regularly integrate <span className="text-[#F1EDE4]">open-source SDKs, libraries, and developer tools</span> to implement real-time systems (Socket.io/WebRTC), AI features (Gemini API), and custom pipelines.
              </p>
            </div>

            {/* Grid counters */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  onMouseEnter={() => setHoveredSkill(stat.label)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className="p-3 rounded-lg border border-white/5 bg-[#120D1E]/40 backdrop-blur-sm transition-colors duration-300 hover:border-[#7C3AED]/40 cursor-help"
                >
                  <div
                    className="text-lg font-extrabold tracking-tight leading-none mb-1"
                    style={{
                      fontFamily: "'Unbounded', sans-serif",
                      background: "linear-gradient(115deg, #F1EDE4, #C4183C)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {stat.val}
                  </div>
                  <div className="text-[9.5px] text-[#F1EDE4]/75 font-medium leading-none mb-1">{stat.label}</div>
                  <div className="font-mono text-[6.5px] text-[#8B8698] uppercase tracking-wider">{stat.mono}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stack" && (
          <div className="space-y-4">
            <p className="text-xs text-[#8B8698] font-sans font-normal">
              Hover over any technical variable below to introspect details in the biometric scanner module:
            </p>
            {/* Stack chips */}
            <div className="flex flex-wrap gap-1.5">
              {STACK.map((chip) => (
                <span
                  key={chip}
                  onMouseEnter={() => setHoveredSkill(chip)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className="font-mono text-[9px] px-2.5 py-1 rounded border tracking-wide select-none transition-all duration-200 hover:border-[#C4183C] hover:text-[#F1EDE4] cursor-help bg-black/50"
                  style={{
                    borderColor: "rgba(241,237,228,0.12)",
                    color: "#8B8698",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="p-3 rounded-lg border border-white/5 bg-[#120D1E]/30 min-h-[50px] flex items-center justify-center text-center">
              {hoveredSkill ? (
                <div className="text-xs font-mono text-[#22d3ee]">
                  <span className="text-[#C4183C] font-semibold">{hoveredSkill}:</span> {SKILL_DESC[hoveredSkill] || "Verified component."}
                </div>
              ) : (
                <div className="text-xs font-mono text-[#8B8698]">
                  &gt; Awaiting skill selection...
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "classified" && (
          <div className="border border-white/10 rounded-xl bg-black/80 p-4 font-mono text-[10px] h-[300px] flex flex-col justify-between select-text relative">
            {!isClassifiedUnlocked ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <span className="text-2xl mb-2 animate-bounce">🔒</span>
                <span className="text-[#C4183C] font-bold uppercase tracking-wider mb-2">ACCESS RESTRICTED</span>
                <p className="text-[#8B8698] text-[9px] max-w-xs leading-relaxed">
                  Biometric authorization required. Place your finger on the scanner card (or use facecam) to upgrade clearance levels.
                </p>
              </div>
            ) : (
              <>
                {/* Terminal Logs */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-2 border-b border-white/5 pb-2 mb-2 scrollbar-thin select-text text-left max-h-[220px]">
                  {terminalHistory.map((line, idx) => (
                    <div key={idx} className={`${line.startsWith("RK-SHELL:>") ? "text-[#C4183C]" : line.includes("Error") ? "text-red-500" : "text-[#4ADE80]"}`}>
                      {line}
                    </div>
                  ))}
                </div>
                
                {/* Terminal Form */}
                <form onSubmit={handleTerminalSubmit} className="flex gap-2 items-center pointer-events-auto mt-auto">
                  <span className="text-[#C4183C] shrink-0">RK-SHELL:&gt;</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="type 'help' for commands..."
                    className="flex-1 bg-transparent border-none outline-none text-[#4ADE80] font-mono text-[10px] py-1"
                    autoFocus
                  />
                </form>
              </>
            )}
          </div>
        )}
      </div>

      {/* CTA Button Row */}
      <div className="flex gap-2 flex-wrap mt-auto">
        <a
          href="https://github.com/rakshit432"
          target="_blank"
          rel="noopener noreferrer"
          data-text="GitHub"
          className="glitch-btn font-mono text-[10px] px-4 py-2.5 rounded-sm text-white transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(124,58,237,0.35)] cursor-pointer"
          style={{ background: "linear-gradient(100deg, #C4183C, #7C3AED)" }}
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/rakshit-kumar-9979b1292"
          target="_blank"
          rel="noopener noreferrer"
          data-text="LinkedIn"
          className="glitch-btn font-mono text-[10px] px-4 py-2.5 rounded-sm border border-white/20 hover:border-white/50 transition-all hover:-translate-y-0.5 cursor-pointer text-[#F1EDE4]"
        >
          LinkedIn
        </a>
        <a
          href="https://leetcode.com/u/Rakshit_kr/"
          target="_blank"
          rel="noopener noreferrer"
          data-text="LeetCode"
          className="glitch-btn font-mono text-[10px] px-4 py-2.5 rounded-sm border border-white/20 hover:border-white/50 transition-all hover:-translate-y-0.5 cursor-pointer text-[#F1EDE4]"
        >
          LeetCode
        </a>
      </div>
    </div>
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 px-6 md:px-12 max-w-6xl mx-auto overflow-hidden z-10 text-center"
    >
      <style>{`
        @keyframes scan-line-run {
          0% { top: 0%; opacity: 0.3; }
          50% { top: 98%; opacity: 1; }
          100% { top: 0%; opacity: 0.3; }
        }
        @keyframes blueprint-glow {
          0%, 100% { opacity: 0.15; filter: drop-shadow(0 0 2px rgba(34,211,238,0.2)); }
          50% { opacity: 0.45; filter: drop-shadow(0 0 8px rgba(34,211,238,0.8)); }
        }
        @keyframes ecg-slide {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .glitch-highlight {
          animation: glitch-flash 0.6s ease-out;
        }
        @keyframes glitch-flash {
          0% { border-color: rgba(196,24,60,1); background: rgba(124,58,237,0.25); filter: hue-rotate(15deg); }
          50% { border-color: rgba(34,211,238,1); background: rgba(196,24,60,0.15); filter: hue-rotate(-15deg); }
          100% { border-color: transparent; background: transparent; }
        }
        @keyframes portal-drift {
          0% { transform: scale(1.05) translate(1px, -1px); filter: brightness(0.6) contrast(1.25); }
          50% { transform: scale(1.08) translate(-1px, 2px); filter: brightness(0.68) contrast(1.3); }
          100% { transform: scale(1.05) translate(2px, 0px); filter: brightness(0.58) contrast(1.2); }
        }
        .portal-drift-img {
          animation: portal-drift 12s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Radial accent glows */}
      <div
        className="absolute top-1/2 -left-20 w-[450px] h-[450px] rounded-full pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          transform: "translateY(-50%)",
        }}
      />
      <div
        className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle, rgba(196,24,60,0.06) 0%, transparent 70%)" }}
      />

      {/* Header text */}
      <div className="mb-14">
        <span className="font-mono text-xs uppercase tracking-widest text-[#C4183C] block mb-2">
          &gt; hawkins.system.control
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F1EDE4] via-[#C4183C] to-[#7C3AED]" style={{ fontFamily: "'Unbounded', sans-serif" }}>
          Identity Credentials
        </h2>
      </div>

      {/* Main Enclosure */}
      <motion.div
        style={{ y: cardYSpring }}
        className="relative max-w-4xl mx-auto rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md p-5 sm:p-7 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          
          {/* LEFT: Futuristic Access Card */}
          <div
            className={`w-full lg:w-[320px] shrink-0 rounded-xl border p-4 sm:p-5 relative group overflow-hidden flex flex-col justify-between select-none shadow-2xl cursor-pointer transition-all duration-500 bg-[#0A0A0C]/95 ${
              isHovered || isScanning
                ? isClassifiedUnlocked
                  ? "border-[#4ADE80]/60 shadow-[0_0_35px_rgba(74,222,128,0.25)]"
                  : "border-[#C4183C]/60 shadow-[0_0_35px_rgba(196,24,60,0.25)]" 
                : "border-white/5"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
          >
            {/* Blueprint Grid Mesh Background */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered || isScanning ? "opacity-[0.07]" : "opacity-[0.03]"}`}
              style={{
                backgroundImage: `linear-gradient(to right, #F1EDE4 1px, transparent 1px),
                                  linear-gradient(to bottom, #F1EDE4 1px, transparent 1px)`,
                backgroundSize: "20px 20px"
              }}
            />

            <div>
              {/* Header Title bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="text-left">
                  <span className="font-mono text-[9px] font-bold text-white uppercase tracking-wider block">
                    Access Scan Control
                  </span>
                  <span className="font-mono text-[7px] text-[#8B8698] uppercase">
                    SYS.LOG // {scanMode === "webcam" ? "WEBCAM_MODE" : scanMode === "portal" ? "PORTAL_MODE" : "FINGERPRINT_MODE"}
                  </span>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isScanning 
                    ? "bg-[#4ADE80] animate-ping" 
                    : isHovered 
                    ? "bg-[#22d3ee] animate-pulse" 
                    : isClassifiedUnlocked
                    ? "bg-[#4ADE80]" 
                    : "bg-[#C4183C]"
                }`} />
              </div>

              {/* Mode Selectors */}
              <div className="flex gap-1 mb-3 pointer-events-auto relative z-30">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScanMode("fingerprint");
                  }}
                  className={`flex-1 py-1 font-mono text-[7px] uppercase tracking-wider rounded border transition-all ${
                    scanMode === "fingerprint"
                      ? isClassifiedUnlocked
                        ? "border-[#4ADE80]/50 bg-[#4ADE80]/10 text-white font-bold"
                        : "border-[#C4183C]/50 bg-[#C4183C]/10 text-white font-bold"
                      : "border-white/5 bg-transparent text-[#8B8698] hover:border-white/20 hover:text-white"
                  }`}
                >
                  Fingerprint
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScanMode("webcam");
                  }}
                  className={`flex-1 py-1 font-mono text-[7px] uppercase tracking-wider rounded border transition-all ${
                    scanMode === "webcam"
                      ? "border-[#22d3ee]/50 bg-[#22d3ee]/10 text-white font-bold"
                      : "border-white/5 bg-transparent text-[#8B8698] hover:border-white/20 hover:text-white"
                  }`}
                >
                  Face Cam
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScanMode("portal");
                  }}
                  className={`flex-1 py-1 font-mono text-[7px] uppercase tracking-wider rounded border transition-all ${
                    scanMode === "portal"
                      ? "border-[#7C3AED]/50 bg-[#7C3AED]/10 text-white font-bold"
                      : "border-white/5 bg-transparent text-[#8B8698] hover:border-white/20 hover:text-white"
                  }`}
                >
                  Portal Feed
                </button>
              </div>

              {/* Recessed Avatar scanner viewport */}
              <div className={`relative w-full h-[210px] sm:h-[230px] rounded-lg overflow-hidden border bg-[#040406] flex items-center justify-center transition-colors duration-500 ${
                isHovered || isScanning 
                  ? isClassifiedUnlocked
                    ? "border-[#4ADE80]/40"
                    : "border-[#C4183C]/40"
                  : "border-white/10"
              }`}>
                
                 {/* 1. Live WebCam feed if active */}
                {scanMode === "webcam" ? (
                  stream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1] scale-x-[-1] absolute inset-0 z-0 pointer-events-none"
                    />
                  ) : (
                    /* Request/Fallback message */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/90 z-0 text-center font-mono">
                      <svg className="w-6 h-6 text-[#22d3ee] animate-pulse mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                      <span className="text-[7px] text-[#22d3ee] tracking-widest uppercase">
                        AWAITING MEDIA PERMISSION
                      </span>
                      <span className="text-[6px] text-[#8B8698] mt-1 uppercase max-w-[150px] leading-tight">
                        Allow browser camera access or switch to fingerprint scanner mode
                      </span>
                    </div>
                  )
                ) : scanMode === "portal" ? (
                  /* Anomaly Portal Live Visual showing Rakshit in Stranger Things */
                  <div className="absolute inset-0 z-0 bg-[#0A0A0C] overflow-hidden flex items-center justify-center">
                    {/* Render active 10-second canvas anime sequence if scanning */}
                    {isScanning ? (
                      <PortalAnimeCanvas
                        imageSrc="/rakshit_anime_portal.png"
                        isActive={isScanning}
                        onComplete={handlePortalScanComplete}
                      />
                    ) : (
                      <img
                        src="/rakshit_anime_portal.png"
                        alt="Portal Anomaly Feed"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector(".portal-fallback");
                            if (fallback) fallback.classList.remove("hidden");
                          }
                        }}
                        className="w-full h-full object-cover opacity-80 filter select-none pointer-events-none scale-105 portal-drift-img"
                      />
                    )}
                    {/* Retro fallback text shown if copy_image.js was not executed yet */}
                    <div className="portal-fallback hidden absolute inset-0 flex flex-col items-center justify-center p-6 text-center font-mono z-10">
                      <svg className="w-5 h-5 text-[#7C3AED] animate-pulse mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                      <span className="text-[7.5px] text-[#7C3AED] tracking-widest uppercase mb-1 font-bold">
                        SIGNAL CORRUPTED // NO IMAGE
                      </span>
                      <span className="text-[6.5px] text-[#8B8698] uppercase leading-relaxed max-w-[170px]">
                        Please execute &apos;node copy_image.js&apos; in your project terminal to copy the generated anime portrait.
                      </span>
                    </div>
                    {/* Retro telemetry lines overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/10 via-transparent to-[#C4183C]/10 opacity-50 mix-blend-overlay pointer-events-none" />
                  </div>
                ) : (
                  /* Fingerprint Scanner Visual */
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#0A0A0C]/50 z-0">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-[#22d3ee]/10 animate-ping opacity-60 pointer-events-none" />
                      <div className={`absolute w-16 h-16 rounded-full border animate-pulse pointer-events-none transition-colors duration-500 ${isClassifiedUnlocked ? "border-[#4ADE80]/20" : "border-[#C4183C]/20"}`} />
                      
                      <svg
                        className={`w-12 h-12 transition-colors duration-300 ${
                          isScanning 
                            ? "text-[#4ADE80] scale-105" 
                            : isClassifiedUnlocked
                            ? "text-[#4ADE80]/80 group-hover:text-[#4ADE80]"
                            : "text-[#22d3ee]/70 group-hover:text-[#C4183C]"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2a10 10 0 0 0-7.3 3.1M19.3 5.1A10 10 0 0 0 12 2M22 12a10 10 0 0 1-10 10M2 12c0 2.2.7 4.3 2 6M6 12a6 6 0 0 1 12 0 M18 12a6 6 0 0 1-6 6 M6 12a6 6 0 0 0 2.4 4.8" />
                        <path d="M10 12a2 2 0 0 1 4 0 M14 12a2 2 0 0 1-2 2" />
                        <path d="M12 4v4 M12 16v4 M8 12H4 M20 12h-4" />
                      </svg>
                    </div>
                    <span className="font-mono text-[7px] text-[#22d3ee]/80 tracking-widest uppercase mt-3 animate-pulse">
                      {isScanning ? "Deciphering Matrix..." : "Press to Verify Identity"}
                    </span>
                  </div>
                )}

                {/* Viewfinder Target corners */}
                <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-[#22d3ee] opacity-70 z-20 pointer-events-none" />
                <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-[#22d3ee] opacity-70 z-20 pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-[#22d3ee] opacity-70 z-20 pointer-events-none" />
                <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-[#22d3ee] opacity-70 z-20 pointer-events-none" />

                {/* Viewfinder diagnostic telemetry tags */}
                <div className="absolute top-2.5 left-8 font-mono text-[6.5px] text-[#22d3ee]/85 uppercase tracking-wider z-20 pointer-events-none flex gap-1">
                  <span>REC [TRK]</span>
                  <span className="w-1 h-1 rounded-full bg-[#4ADE80] self-center animate-pulse" />
                </div>
                <div className="absolute top-2.5 right-8 font-mono text-[6.5px] text-white/50 uppercase z-20 pointer-events-none">
                  ISO 800
                </div>
                <div className="absolute bottom-2.5 left-8 font-mono text-[6.5px] text-white/40 uppercase z-20 pointer-events-none">
                  F/2.8 · AF-S
                </div>
                <div className="absolute bottom-2.5 right-8 font-mono text-[6.5px] text-white/40 uppercase z-20 pointer-events-none">
                  EV +0.7
                </div>

                {/* Center Tracking Crosshair Target */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 border border-dashed rounded-full flex items-center justify-center pointer-events-none z-20 transition-all duration-700 ${
                  isHovered || isScanning 
                    ? isClassifiedUnlocked
                      ? "rotate-90 scale-110 border-[#4ADE80]/70"
                      : "rotate-90 scale-110 border-[#C4183C]/70" 
                    : "border-[#22d3ee]/35"
                }`}>
                  <div className={`w-3 h-px transition-colors duration-500 ${
                    isHovered || isScanning 
                      ? isClassifiedUnlocked
                        ? "bg-[#4ADE80]/80"
                        : "bg-[#C4183C]/80" 
                      : "bg-[#22d3ee]/80"
                  }`} />
                  <div className={`h-3 w-px absolute transition-colors duration-500 ${
                    isHovered || isScanning 
                      ? isClassifiedUnlocked
                        ? "bg-[#4ADE80]/80"
                        : "bg-[#C4183C]/80" 
                      : "bg-[#22d3ee]/80"
                  }`} />
                </div>

                {/* Cybernetic Neon Face Blueprint Overlay (Webcam active only) */}
                {scanMode === "webcam" && (
                  <div 
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-500 ${isHovered || isScanning ? "opacity-75 scale-102 filter drop-shadow-[0_0_6px_#22d3ee]" : "opacity-35"}`}
                    style={{ animation: "blueprint-glow 4s ease-in-out infinite" }}
                  >
                    <svg className="w-28 h-28 text-[#22d3ee]/85" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M 50,15 C 32,15 28,30 28,45 C 28,62 36,75 50,85 C 64,75 72,62 72,45 C 72,30 68,15 50,15 Z" strokeDasharray="3, 3" />
                      <circle cx="38" cy="42" r="5" />
                      <circle cx="62" cy="42" r="5" />
                      <path d="M 38,34 L 38,50" strokeWidth="1" />
                      <path d="M 30,42 L 46,42" strokeWidth="1" />
                      <path d="M 62,34 L 62,50" strokeWidth="1" />
                      <path d="M 54,42 L 70,42" strokeWidth="1" />
                      <path d="M 42,65 Q 50,68 58,65" strokeWidth="1.2" />
                      <path d="M 12,12 L 20,12 M 12,12 L 12,20" />
                      <path d="M 88,12 L 80,12 M 88,12 L 88,20" />
                      <path d="M 12,88 L 20,88 M 12,88 L 12,80" />
                      <path d="M 88,88 L 80,88 M 88,88 L 88,80" />
                    </svg>
                  </div>
                )}

                {/* Live Telemetry Decryption Console Overlay */}
                {isScanning && scanMode !== "portal" && (
                  <div className="absolute inset-0 bg-black/90 flex flex-col justify-center items-start p-4 font-mono z-30 select-none text-left">
                    <div className="w-full space-y-1 text-[7px] text-[#4ADE80] h-[72px] overflow-hidden">
                      {scanLogs.map((log, idx) => (
                        <div key={idx} className="truncate animate-[scan-progress-blink_1.5s_infinite]">&gt; {log}</div>
                      ))}
                    </div>
                    <div className="w-full mt-4 bg-white/5 border border-white/10 rounded overflow-hidden h-2.5 relative">
                      <div className="bg-gradient-to-r from-[#C4183C] to-[#4ADE80] h-full transition-all duration-75" style={{ width: `${scanProgress}%` }} />
                    </div>
                    <span className="font-mono text-[8px] text-[#F1EDE4] mt-2 tracking-widest uppercase">
                      Decrypting telemetry // {scanProgress}%
                    </span>
                  </div>
                )}

                {/* Live Hover Skill Summary overlay */}
                {hoveredSkill && !isScanning && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-black/90 border border-[#22d3ee]/55 rounded p-2.5 z-30 font-mono text-[7px] text-[#22d3ee] text-left leading-relaxed shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <span className="text-[#C4183C] font-bold block mb-0.5">&gt; QUERY: {hoveredSkill.toUpperCase()}</span>
                    <span>{SKILL_DESC[hoveredSkill] || "VERIFIED SYSTEM INTEGRITY // 100% STABLE"}</span>
                  </div>
                )}

                {/* Laser scan line overlay */}
                <div
                  className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#4ADE80] to-transparent shadow-[0_0_12px_#4ADE80] pointer-events-none z-20"
                  style={{
                    animation: "scan-line-run 3.5s linear infinite",
                  }}
                />

                {/* Active scan matrix overlay on hover/scan */}
                {(isHovered || isScanning) && (
                  <div className={`absolute inset-0 backdrop-blur-[0.5px] p-2 flex flex-col justify-between pointer-events-none z-0 ${isClassifiedUnlocked ? "bg-[#4ADE80]/5" : "bg-[#C4183C]/5"}`}>
                    <div className={`flex justify-between font-mono text-[6.5px] ${isClassifiedUnlocked ? "text-[#4ADE80]" : "text-[#C4183C]"}`}>
                      <span>{isScanning ? "SYS.DECRYPTING..." : isClassifiedUnlocked ? "ACCESS.AUTHORIZED" : "SYS.DECRYPT.ACTIVE"}</span>
                      <span>NODE // OK</span>
                    </div>
                    <div className={`flex justify-between font-mono text-[6.5px] ${isClassifiedUnlocked ? "text-[#4ADE80]/80" : "text-[#C4183C]/80"}`}>
                      <span>MATRIX_LOCK: {isClassifiedUnlocked ? "BYPASSED" : "ENABLED"}</span>
                      <span>PORT: 3000</span>
                    </div>
                  </div>
                )}

                {/* Scanning overlay noise */}
                <div className={`absolute inset-0 bg-black/10 group-hover:${isClassifiedUnlocked ? "bg-[#4ADE80]/5" : "bg-[#C4183C]/5"} pointer-events-none transition-colors duration-300 z-10`} />
              </div>
            </div>

            {/* Bottom info section with Heartbeat monitor */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  Rakshit Kumar
                </span>
                {/* Cyan verification badge */}
                <svg className="w-3.5 h-3.5 text-[#22d3ee] fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="font-mono text-[8px] text-[#8B8698] tracking-widest mt-1">
                rakshitkumar.5905@gmail.com
              </span>

              {/* Heartbeat sweep monitor graph */}
              <div className="w-full flex items-center justify-between border-t border-white/5 pt-2.5 mt-3 px-1 text-left">
                <div className="flex flex-col shrink-0">
                  <span className="font-mono text-[6px] text-[#8B8698] uppercase">biometric log</span>
                  <span className="font-mono text-[8.5px] font-extrabold text-[#4ADE80] tracking-tight">
                    {isScanning ? "118 BPM // SCAN" : "72 BPM // SAFE"}
                  </span>
                </div>
                <div className="w-20 h-5 overflow-hidden relative opacity-50 shrink-0">
                  <svg className={`w-full h-full transition-colors duration-500 ${isClassifiedUnlocked ? "text-[#4ADE80]" : "text-[#C4183C]"}`} viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M0,15 H25 L30,5 L35,25 L40,15 H60 L65,0 L70,30 L75,15 H100" />
                  </svg>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0A0C] to-[#0A0A0C] w-[200%] -translate-x-full"
                    style={{ animation: "ecg-slide 1.8s linear infinite" }}
                  />
                </div>
                <div className="flex flex-col text-right shrink-0">
                  <span className="font-mono text-[6px] text-[#8B8698] uppercase">SYS CONTROL</span>
                  <span className="font-mono text-[8.5px] font-bold text-[#22d3ee] tracking-widest">
                    ONLINE
                  </span>
                </div>
              </div>

              {/* Mobile Prompt helper */}
              <div className={`lg:hidden mt-3 text-[7.5px] font-mono uppercase tracking-widest animate-pulse ${isClassifiedUnlocked ? "text-[#4ADE80]" : "text-[#C4183C]"}`}>
                {isScanning ? "SCANNING TELEMETRY..." : isClassifiedUnlocked ? "ACCESS LEVEL 2 AUTHORIZED" : "Tap Card for Full Credentials"}
              </div>
            </div>
          </div>

          {/* RIGHT: High-tech Info Terminal (Always shown on desktop) */}
          <div id="terminal-profile-panel" className="hidden lg:block lg:flex-1 text-left p-1 rounded-xl border border-transparent transition-all duration-500">
            <InfoDetails />
          </div>

        </div>

      </motion.div>

      {/* Mobile Credentials Modal Overlay (Rendered outside transformed parent to ensure positioning and clicks work) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
              className="bg-[#0A0A0C] border border-[#C4183C]/35 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner target markings for design scope */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#C4183C]/40" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-[#C4183C]/40" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-[#C4183C]/40" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#C4183C]/40" />

              {/* Close Button top-right */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#8B8698] hover:text-[#F1EDE4] transition-colors p-1 cursor-pointer z-50"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Holographic grid mesh in modal background */}
              <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, #F1EDE4 1px, transparent 1px),
                                    linear-gradient(to bottom, #F1EDE4 1px, transparent 1px)`,
                  backgroundSize: "20px 20px"
                }}
              />

              <div className="relative z-10">
                <InfoDetails />
                
                {/* Dismiss Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full mt-6 py-2.5 font-mono text-[10px] font-semibold text-[#F1EDE4] border border-[#C4183C]/30 rounded hover:bg-[#C4183C]/10 transition-colors uppercase tracking-widest cursor-pointer"
                >
                  Close Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dustin Henderson Broadcast Callout below card */}
      <div className="w-full max-w-4xl mx-auto mt-8 flex justify-center">
        <div className="w-full max-w-[450px] p-4 rounded-xl border border-white/5 bg-black/60 relative overflow-hidden group shadow-[0_8px_25px_rgba(0,0,0,0.7)] text-left">
          <div className="blueprint-grid opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          
          <div className="flex gap-4 items-center relative z-10">
            <img
              src="/dustin_formal.png"
              alt="Dustin Henderson (Formal)"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-white/10 select-none pointer-events-none shrink-0"
            />
            <div className="min-w-0">
              <span className="font-mono text-[7px] text-[#FACC15] uppercase tracking-wider block mb-1">
                Broadcasting // Dustin Henderson
              </span>
              <p className="font-mono text-[8.5px] sm:text-[9.5px] text-[#F1EDE4] leading-relaxed italic">
                &quot;I cordially invite you to inspect the full extent of this technical portfolio. Please feel free to establish coordinates for collaboration or professional engagements.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
