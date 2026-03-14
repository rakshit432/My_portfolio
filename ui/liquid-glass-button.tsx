"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ---------------- Variants ---------------- */

const liquidbuttonVariants = cva(
  "relative inline-flex items-center justify-center cursor-pointer select-none whitespace-nowrap font-medium transition-transform duration-300 ease-out active:scale-[0.97]",
  {
    variants: {
      size: {
        sm: "h-10 px-6 text-sm rounded-full",
        lg: "h-12 px-8 text-base rounded-full",
        xxl: "h-14 px-10 text-lg rounded-full",
      },
    },
    defaultVariants: {
      size: "xxl",
    },
  }
);

/* ---------------- Liquid Button ---------------- */

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidbuttonVariants> {
  asChild?: boolean;
}

export function LiquidButton({
  className,
  size,
  asChild = false,
  children,
  ...props
}: LiquidButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      {...props}
      className={cn(liquidbuttonVariants({ size }), className)}
    >
      {/* Glass surface (samples WebGL shader behind) */}
      <span
        aria-hidden
        className="
          absolute inset-0 rounded-full
          bg-white/10
          backdrop-blur-xl
          ring-1 ring-white/20
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.35),0_10px_30px_rgba(0,0,0,0.35)]
        "
      />

      {/* Soft highlight */}
      <span
        aria-hidden
        className="
          absolute inset-0 rounded-full
          bg-gradient-to-b from-white/25 via-white/5 to-transparent
          opacity-60
        "
      />

      {/* Button content */}
      <span className="relative z-10 text-white tracking-tight">
        {children}
      </span>
    </Comp>
  );
}
