"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { SVGProps } from "react";

/* ---------------- Types ---------------- */

type FrameworkAgnosticProps = {
  cardTitle?: string;
  cardDescription?: string;
};

type TechItem = {
  name: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

/* ---------------- Tech List ---------------- */

/* ---------------- Icons ---------------- */

const ReactIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 228" {...props}>
    <circle cx="128" cy="114" r="18" fill="#00D8FF" />
  </svg>
);

const NextjsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 180 180" {...props}>
    <circle cx="90" cy="90" r="80" stroke="white" strokeWidth="10" fill="black" />
  </svg>
);

const NodeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" {...props}>
    <polygon points="128,10 246,70 246,186 128,246 10,186 10,70" fill="#539E43" />
  </svg>
);

const ExpressIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" {...props}>
    <text x="20" y="140" fill="white" fontSize="64">
      ex
    </text>
  </svg>
);

const TypeScriptIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" {...props}>
    <rect width="256" height="256" fill="#3178C6" />
    <text x="64" y="160" fill="white" fontSize="96">
      TS
    </text>
  </svg>
);

const DockerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" {...props}>
    <rect x="40" y="100" width="176" height="80" fill="#2496ED" />
  </svg>
);

const TECH_STACK: TechItem[] = [
  { name: "React", Icon: ReactIcon },
  { name: "Next.js", Icon: NextjsIcon },
  { name: "Node.js", Icon: NodeIcon },
  { name: "Express", Icon: ExpressIcon },
  { name: "TypeScript", Icon: TypeScriptIcon },
  { name: "Docker", Icon: DockerIcon },
];

/* ---------------- Main Component ---------------- */

const FrameworkAgnostic = ({
  cardTitle = "Framework Agnostic",
  cardDescription = "Works seamlessly across React, Next.js, Node, Express, Docker, and modern tooling. No lock-in. Just clean architecture.",
}: FrameworkAgnosticProps) => {
  return (
    <div className="relative flex h-[20rem] flex-col justify-between rounded-md border border-neutral-800/50 bg-neutral-950">
      <FrameworkCard />

      <div className="px-4 pb-4">
        <div className="text-sm font-semibold text-white">{cardTitle}</div>
        <div className="mt-2 text-xs text-neutral-400">{cardDescription}</div>
      </div>
    </div>
  );
};

export default FrameworkAgnostic;

/* ---------------- Animated Card Grid ---------------- */

const FrameworkCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % TECH_STACK.length);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-[14.5rem] w-full items-center justify-center [perspective:1000px]">
      <div className="grid grid-cols-3 gap-4">
        {TECH_STACK.map((tech, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={tech.name}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md border border-neutral-800",
                "bg-gradient-to-b from-neutral-700 to-neutral-900",
                "transition-transform duration-700 ease-out will-change-transform",
                isActive && "translate-y-[-8px] rotate-x-[12deg]"
              )}
            >
              <tech.Icon className="size-7 text-white" />
            </div>
          );
        })}
      </div>

      {/* Fade bottom */}
      <div className="absolute bottom-0 left-0 h-4 w-full bg-gradient-to-t from-neutral-950 to-transparent" />
    </div>
  );
};
