"use client";

import { useEffect, useRef, useState } from "react";

interface PortalAnimeCanvasProps {
  imageSrc: string;
  isActive: boolean;
  onComplete: () => void;
}

export function PortalAnimeCanvas({ imageSrc, isActive, onComplete }: PortalAnimeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;

    let animationFrameId: number;
    const duration = 10000; // 10 seconds animation duration
    const startTime = Date.now();

    // Spore particle simulation setup
    const particles: Array<{ x: number; y: number; r: number; vy: number; vx: number; alpha: number }> = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * 320,
        y: Math.random() * 240,
        r: Math.random() * 1.5 + 0.5,
        vy: -(Math.random() * 0.4 + 0.1),
        vx: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    img.onload = () => {
      setErrorLoading(false);
      
      const render = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Canvas sizes
        const cw = canvas.width;
        const ch = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, cw, ch);

        // 1. Slow Pan and Zoom (Scale from 1.0 to 1.18 over 10s)
        const scale = 1 + progress * 0.18;
        const zoomWidth = cw * scale;
        const zoomHeight = ch * scale;
        
        // Jitter / Glitch shake offset calculation
        let dx = 0;
        let dy = 0;
        let isGlitchFrame = false;
        
        // Trigger glitch jitters randomly or at specific intervals
        if (Math.random() < 0.04 || (elapsed % 1400 < 80)) {
          isGlitchFrame = true;
          dx = (Math.random() - 0.5) * 6;
          dy = (Math.random() - 0.5) * 4;
        }

        const x = (cw - zoomWidth) / 2 + dx;
        const y = (ch - zoomHeight) / 2 + dy;

        // 2. Draw Image (with optional color split simulation on glitch frames)
        if (isGlitchFrame) {
          // Draw Red Channel offset
          ctx.globalAlpha = 0.5;
          ctx.drawImage(img, x - 4, y - 2, zoomWidth, zoomHeight);
          // Draw Blue Channel offset
          ctx.globalAlpha = 0.5;
          ctx.drawImage(img, x + 3, y + 1, zoomWidth, zoomHeight);
          ctx.globalAlpha = 1.0;
        } else {
          ctx.drawImage(img, x, y, zoomWidth, zoomHeight);
        }

        // 3. Lightning / Voltage surges (Flash screen crimson/violet)
        if (Math.random() < 0.015) {
          ctx.fillStyle = Math.random() > 0.5 ? "rgba(196, 24, 60, 0.15)" : "rgba(124, 58, 237, 0.15)";
          ctx.fillRect(0, 0, cw, ch);
        }

        // 4. Update and Draw floating portal spores (particles)
        ctx.fillStyle = "#C4183C"; // spores are crimson red
        particles.forEach((p) => {
          p.y += p.vy;
          p.x += p.vx;
          
          // wrap around bounds
          if (p.y < 0) p.y = ch;
          if (p.x < 0) p.x = cw;
          if (p.x > cw) p.x = 0;

          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // 5. Draw scanline raster overlay
        ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
        ctx.lineWidth = 1;
        for (let i = 0; i < ch; i += 3) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(cw, i);
          ctx.stroke();
        }

        // 6. Telemetry overlay UI
        // Blinking REC dot
        if (Math.floor(elapsed / 500) % 2 === 0) {
          ctx.fillStyle = "#C4183C";
          ctx.beginPath();
          ctx.arc(15, 15, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.fillStyle = "#F1EDE4";
        ctx.font = "8px monospace";
        ctx.fillText("REC [PORTAL]", 24, 18);

        // 10s Countdown Timer code (e.g. 10.00s down to 00.00s)
        const rem = Math.max((duration - elapsed) / 1000, 0);
        const sec = Math.floor(rem);
        const ms = Math.floor((rem % 1) * 100);
        const countdownStr = `T-${sec.toString().padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
        
        ctx.fillStyle = "#7C3AED";
        ctx.fillText(countdownStr, cw - 50, 18);

        // Progress bar at the bottom
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(10, ch - 15, cw - 20, 4);
        ctx.fillStyle = `linear-gradient(to right, #C4183C, #4ADE80)`;
        
        // Gradient progress fill
        const grad = ctx.createLinearGradient(10, 0, cw - 10, 0);
        grad.addColorStop(0, "#C4183C");
        grad.addColorStop(0.5, "#7C3AED");
        grad.addColorStop(1, "#4ADE80");
        ctx.fillStyle = grad;
        ctx.fillRect(10, ch - 15, (cw - 20) * progress, 4);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(render);
        } else {
          onComplete();
        }
      };

      render();
    };

    img.onerror = () => {
      setErrorLoading(true);
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageSrc, isActive, onComplete]);

  if (errorLoading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center font-mono bg-black/90">
        <span className="text-[7.5px] text-[#7C3AED] animate-pulse uppercase tracking-wider mb-1 font-bold">
          SIGNAL CORRUPTED // NO IMAGE
        </span>
        <span className="text-[6.5px] text-[#8B8698] uppercase leading-relaxed max-w-[170px]">
          Please execute &apos;node copy_image.js&apos; in your project terminal to copy the generated anime portrait.
        </span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={240}
      className="w-full h-full object-cover absolute inset-0 z-10 pointer-events-none"
    />
  );
}
