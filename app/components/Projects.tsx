"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowRight, Cpu, Globe, Database } from "lucide-react";
import dynamic from "next/dynamic";

const ThreeProjectVisualizer = dynamic(
  () => import("@/components/ui/three-project-visualizer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[280px] bg-black/30 border border-white/5 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#3b82f6]/40 border-t-[#3b82f6] animate-spin" />
      </div>
    ),
  }
);

interface Project {
  id: string;
  num: string;
  title: string;
  shortTitle: string;
  tagline: string;
  desc: string;
  category: string;
  categoryIcon: React.ElementType;
  year: string;
  vizLabel: string;
  stack: string[];
  architecture: {
    label: string;
    role: string;
    tech: string;
  }[];
  metrics: { key: string; val: string }[];
  demoUrl?: string;
  githubUrl?: string;
}

const PROJECTS: Project[] = [
  {
    id: "futuremeet",
    num: "01",
    title: "Future Meet",
    shortTitle: "Future Meet",
    tagline: "Real-Time Video Conferencing Platform",
    desc: "End-to-end video conferencing system built on WebRTC peer-to-peer mesh architecture. Participants connect directly through ICE negotiation while Socket.io handles signaling. The Gemini API provides post-call AI summaries of transcripts.",
    category: "WebRTC · Real-Time Systems",
    categoryIcon: Globe,
    year: "2025",
    vizLabel: "Network Topology — P2P Mesh",
    stack: ["React.js", "Node.js", "Socket.io", "WebRTC", "MongoDB", "JWT", "Gemini API"],
    architecture: [
      { label: "Client Layer", role: "Video grid, controls, active speaker detection", tech: "React.js · Tailwind CSS" },
      { label: "Signaling Server", role: "WebRTC offer/answer relay, ICE candidate exchange", tech: "Node.js · Socket.io" },
      { label: "Media Transport", role: "P2P media streams, TURN/STUN fallback, adaptive bitrate", tech: "WebRTC · getUserMedia" },
      { label: "Data Layer", role: "Session records, meeting transcripts, user auth", tech: "MongoDB · JWT" },
    ],
    metrics: [
      { key: "Latency Reduction", val: "25%" },
      { key: "P2P Connections", val: "Mesh" },
      { key: "Auth", val: "JWT" },
      { key: "AI Summaries", val: "Gemini" },
    ],
    demoUrl: "https://future-meet.vercel.app",
  },
  {
    id: "nexusdb",
    num: "02",
    title: "SQL AI Agent",
    shortTitle: "SQL AI Agent",
    tagline: "AI-Powered SQL Generation Agent",
    desc: "Natural language to SQL translation pipeline powered by the Gemini API. Users describe queries in plain English, and the inference engine returns optimized, injection-safe SQL. Supports PostgreSQL schema introspection for context-aware generation.",
    category: "AI Inference · Database Systems",
    categoryIcon: Cpu,
    year: "2025",
    vizLabel: "Inference Pipeline — NL → SQL",
    stack: ["Next.js", "Gemini API", "PostgreSQL", "Drizzle ORM", "TypeScript"],
    architecture: [
      { label: "Input Interface", role: "Natural language query editor, schema browser", tech: "Next.js · TypeScript" },
      { label: "Inference Engine", role: "Gemini API call with schema context, prompt engineering", tech: "Gemini 1.5 Flash" },
      { label: "Query Validator", role: "SQL injection sanitization, syntax verification, retry logic", tech: "Drizzle ORM" },
      { label: "Database Layer", role: "Schema introspection, query execution, result streaming", tech: "PostgreSQL · pg" },
    ],
    metrics: [
      { key: "Model", val: "Gemini 1.5" },
      { key: "Injection Safe", val: "Yes" },
      { key: "Schema Aware", val: "Yes" },
      { key: "Latency", val: "~800ms" },
    ],
    demoUrl: "https://sql-ai-agent-ten.vercel.app/",
  },
  {
    id: "blogonspot",
    num: "03",
    title: "BlogOnSpot",
    shortTitle: "BlogOnSpot",
    tagline: "AI-Powered MERN Blogging Platform",
    desc: "Full-stack blogging platform for 200+ users with JWT authentication, admin moderation, secure CRUD operations, and AI-powered blog summarization + plagiarism detection that cut review time by 40%. Hover-based content previews boosted engagement by 25%.",
    category: "Full Stack · MERN · AI",
    categoryIcon: Globe,
    year: "2025",
    vizLabel: "Platform Architecture — MERN + AI",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Gemini API", "Vercel"],
    architecture: [
      { label: "Client Layer", role: "Blog feed, hover previews, dashboard analytics", tech: "React.js · CSS" },
      { label: "Auth & CRUD Layer", role: "JWT auth, admin moderation, secure post management", tech: "Express.js · Node.js" },
      { label: "AI Pipeline", role: "Blog summarization & plagiarism detection engine", tech: "Gemini API" },
      { label: "Data Layer", role: "User records, blog posts, admin controls", tech: "MongoDB · Mongoose" },
    ],
    metrics: [
      { key: "Active Users", val: "200+" },
      { key: "Review Time", val: "-40%" },
      { key: "Engagement", val: "+25%" },
      { key: "Auth", val: "JWT" },
    ],
    demoUrl: "https://blogonspot.vercel.app",
  },
  {
    id: "resumebuilder",
    num: "04",
    title: "Resume Builder",
    shortTitle: "ResumeBuilder",
    tagline: "MERN Resume Creation & Export Tool",
    desc: "Resume creation tool enabling users to design and export polished resumes with a responsive, Tailwind-based UI. Built with JWT-based authentication, multi-resume management, and AI suggestions across 10+ skill categories. Achieved 30% faster data handling through optimized MongoDB schema and API structure.",
    category: "Full Stack · MERN",
    categoryIcon: Database,
    year: "2025",
    vizLabel: "User Flow — Build → Export → Store",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
    architecture: [
      { label: "UI Layer", role: "Drag-drop resume builder, real-time preview, PDF export", tech: "React.js · Tailwind" },
      { label: "Auth Layer", role: "JWT login, multi-resume management, user sessions", tech: "Express.js · JWT" },
      { label: "AI Suggestions", role: "Skill-based content recommendations for 10+ categories", tech: "AI Integration" },
      { label: "Data Layer", role: "Optimized schema for resume objects, user profiles", tech: "MongoDB · Mongoose" },
    ],
    metrics: [
      { key: "Data Speed", val: "+30%" },
      { key: "AI Categories", val: "10+" },
      { key: "Auth", val: "JWT" },
      { key: "UI", val: "Tailwind" },
    ],
    demoUrl: "https://resumebuilder-frontend-6gjz.onrender.com/",
  },
  {
    id: "mediversal",
    num: "05",
    title: "Mediversal",
    shortTitle: "Mediversal",
    tagline: "Healthcare Appointment & Administration System",
    desc: "Multi-role healthcare platform connecting Patients, Doctors, and Admins under a unified booking system. Implements role-gated JWT authentication, real-time slot availability, and scheduling efficiency improvements of 35% over manual systems.",
    category: "Enterprise SaaS · Healthcare",
    categoryIcon: Database,
    year: "2026",
    vizLabel: "Workflow Graph — Role-Based Access",
    stack: ["React.js", "Express.js", "MongoDB", "JWT", "Mongoose", "Node.js"],
    architecture: [
      { label: "Role Dashboards", role: "Patient booking, Doctor calendar, Admin control panel", tech: "React.js · Tailwind" },
      { label: "API Gateway", role: "Role-gated REST API routes, JWT middleware validation", tech: "Express.js · Node.js" },
      { label: "Scheduling Engine", role: "Slot availability, conflict detection, appointment assignment", tech: "Custom logic · Node.js" },
      { label: "Data Layer", role: "Patient records, appointment history, doctor profiles", tech: "MongoDB · Mongoose" },
    ],
    metrics: [
      { key: "Efficiency Gain", val: "35%" },
      { key: "Roles", val: "3 (P/D/A)" },
      { key: "Auth", val: "JWT" },
      { key: "Deployment", val: "Vercel" },
    ],
    demoUrl: "https://mediversal-tf2h.vercel.app",
  },
];

// ─── LIVE METRICS DISPLAY ─────────────────────────────────────────────────────
function LiveMetricsPanel({ project }: { project: Project }) {
  const [tick, setTick] = useState(0);
  const [liveLines, setLiveLines] = useState<string[]>([]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const base: Record<string, string[]> = {
      futuremeet: [
        `> [SIGNAL] ICE candidate pair validated (${(Math.random() * 3 + 1).toFixed(0)} candidates)`,
        `> [MEDIA] Video stream established — 720p@30fps`,
        `> [SOCKET] Room event: participant_joined (id: 0x${Math.floor(Math.random() * 0xffff).toString(16)})`,
        `> [AUTH] JWT verified — session active (ttl: 3600s)`,
        `> [AI] Gemini transcript summary queued`,
      ],
      nexusdb: [
        `> [INPUT] NL query received: "find users created last 7 days"`,
        `> [INFER] Gemini 1.5 Flash → SQL compiled (${(Math.random() * 400 + 600).toFixed(0)}ms)`,
        `> [VALID] Injection scan: CLEAN — no risk tokens`,
        `> [EXEC] PostgreSQL → 12 rows returned`,
        `> [SCHEMA] Table context: users, sessions, events`,
      ],
      mediversal: [
        `> [GATE] Role: PATIENT — route access verified`,
        `> [SLOT] Checking availability: Dr. Sharma, 2026-07-14`,
        `> [BOOK] Appointment confirmed (id: APT-${Math.floor(Math.random() * 9999)})`,
        `> [NOTIFY] Doctor schedule updated`,
        `> [ADMIN] Dashboard sync — 3 active bookings`,
      ],
      blogonspot: [
        `> [AUTH] JWT verified — user session active (ttl: 3600s)`,
        `> [AI] Gemini summarization queued for post id: BLG-${Math.floor(Math.random() * 9999)}`,
        `> [PLAGIARISM] Scan complete — similarity index: ${(Math.random() * 8).toFixed(1)}%`,
        `> [CRUD] Blog post published — 200 OK`,
        `> [ANALYTICS] Dashboard sync — ${Math.floor(Math.random() * 80 + 180)} active users`,
      ],
      resumebuilder: [
        `> [AUTH] JWT login — user session created`,
        `> [RESUME] Draft loaded — id: RES-${Math.floor(Math.random() * 9999)}`,
        `> [AI] Skill suggestion engine: Java · React · MongoDB`,
        `> [EXPORT] PDF render queued — ETA: ${(Math.random() * 500 + 200).toFixed(0)}ms`,
        `> [DB] MongoDB schema optimized — 30% faster query`,
      ],
    };
    setLiveLines(base[project.id] ?? []);
  }, [project.id, tick]);

  return (
    <div className="border border-white/6 bg-black/50 rounded-xl p-3 font-mono text-[9px] space-y-1 overflow-hidden">
      <div className="flex items-center gap-1.5 text-white/30 border-b border-white/5 pb-1.5 mb-1.5 uppercase tracking-widest text-[8px]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse inline-block" />
        Runtime Engine — Live Output
      </div>
      {liveLines.map((line, i) => (
        <div key={i} className="text-[#c084fc]/70 truncate leading-relaxed">
          {line}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Projects() {
  const [activeIdx, setActiveIdx] = useState(0);
  const project = PROJECTS[activeIdx];
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

  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-12 relative z-10 max-w-7xl mx-auto"
    >
      {/* Subtle purple glow behind section */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
        style={{ background: "radial-gradient(circle, rgba(196,24,60,0.04) 0%, transparent 70%)" }}
      />

      {/* ── Section Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C4183C] block mb-3">
            &gt; projects.log
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight select-text text-transparent bg-clip-text bg-gradient-to-r from-[#F1EDE4] via-[#C4183C] to-[#7C3AED]" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            Shipped <span className="text-[#C4183C]">Work</span>
          </h2>
          <p className="text-sm text-[#8B8698] mt-4 max-w-md leading-relaxed">
            Five production deployments — MERN apps, real-time systems, and AI-powered tools, each mapped with its architecture stack and live telemetry.
          </p>
        </div>

        {/* Project selector pills */}
        <div className="flex gap-2 flex-wrap">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveIdx(i)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer border"
              style={i === activeIdx ? {
                background: "rgba(196,24,60,0.15)",
                borderColor: "rgba(196,24,60,0.5)",
                color: "#C4183C",
                boxShadow: "0 0 16px rgba(196,24,60,0.18)",
              } : {
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <span className="font-bold">{p.num}</span>
              <span className="hidden sm:inline">{p.shortTitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >

          {/* ── LEFT: Project Details (col 5) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">

            {/* Project identity */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-widest border"
                  style={{ color: "#C4183C", borderColor: "rgba(196,24,60,0.35)", background: "rgba(196,24,60,0.08)" }}
                >
                  {project.category}
                </span>
                <span className="font-mono text-[9px] text-white/25 ml-auto">{project.year}</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-1 font-mono uppercase">
                {project.title}
              </h3>
              <p className="text-xs text-[#C4183C]/70 font-mono mb-4">{project.tagline}</p>
              <p className="text-sm text-[#8B8698] leading-relaxed">{project.desc}</p>
            </div>

            {/* Architecture stack */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest block mb-3">
                Architecture Stack
              </span>
              {project.architecture.map((layer, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5 transition-all duration-200"
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-[8px] font-bold"
                    style={{ background: "rgba(124,58,237,0.15)", color: "#7C3AED" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold text-white/80">{layer.label}</span>
                      <span className="font-mono text-[8px] text-white/25 ml-auto flex-shrink-0">{layer.tech}</span>
                    </div>
                    <p className="text-[9px] text-white/40 leading-relaxed">{layer.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech stack pills */}
            <div>
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest block mb-2">
                Tech Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[8px] font-mono border"
                    style={{ color: "rgba(241,237,228,0.5)", borderColor: "rgba(241,237,228,0.15)", background: "rgba(241,237,228,0.02)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Links */}
            <div className="flex gap-3 pt-1 pointer-events-auto">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-text="Live Demo"
                  className="glitch-btn flex items-center gap-1.5 px-4 py-2.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider transition-all hover:translate-y-[-1px] text-white hover:shadow-[0_8px_20px_rgba(124,58,237,0.35)] cursor-pointer"
                  style={{ background: 'linear-gradient(100deg, #C4183C, #7C3AED)' }}
                >
                  <ExternalLink size={11} />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-text="Source"
                  className="glitch-btn flex items-center gap-1.5 px-4 py-2.5 rounded-sm border border-white/20 hover:border-white/50 transition-all hover:translate-y-[-1px] text-[#F1EDE4] hover:text-white cursor-pointer"
                >
                  <Github size={11} />
                  Source
                </a>
              )}
            </div>
          </div>

          {/* ── RIGHT: Visualization + Metrics (col 7) ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Viz header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#C4183C]/70">
                {project.vizLabel}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4183C] animate-pulse shadow-[0_0_6px_#C4183C]" />
                <span className="font-mono text-[8px] text-white/25 uppercase">Telemetry</span>
              </div>
            </div>

            {/* 3D Architecture Visualization */}
            <div
              className="w-full flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-white/6 bg-black/40 relative"
              style={{ 
                boxShadow: isUpsideDown 
                  ? "inset 0 2px 20px rgba(0,0,0,0.9), 0 0 35px rgba(196,24,60,0.2)" 
                  : "inset 0 2px 20px rgba(0,0,0,0.7), 0 0 20px rgba(196,24,60,0.05)" 
              }}
            >
              <ThreeProjectVisualizer projectId={project.id} />
            </div>

            {/* Key metrics row */}
            <div className="grid grid-cols-4 gap-2">
              {project.metrics.map((m) => (
                <div
                  key={m.key}
                  className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-center"
                >
                  <div className="text-sm font-bold text-white leading-none mb-1">{m.val}</div>
                  <div className="font-mono text-[7px] text-white/30 uppercase tracking-wider">{m.key}</div>
                </div>
              ))}
            </div>

            {/* Live runtime log output */}
            <LiveMetricsPanel project={project} />
          </div>

        </motion.div>
      </AnimatePresence>
    </section>
  );
}