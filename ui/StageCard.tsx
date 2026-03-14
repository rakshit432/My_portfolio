"use client";

import { ReactNode } from "react";
import clsx from "clsx";

export default function StageCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        `
        relative
        mx-auto
        w-full
        max-w-5xl
        rounded-3xl
        border border-white/10
        bg-white/[0.06]
        backdrop-blur-2xl
        supports-[backdrop-filter]:bg-white/[0.04]
        `,
        className
      )}
    >
      {/* soft inner highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5" />

      <div className="relative p-10 md:p-14">
        {children}
      </div>
    </div>
  );
}
