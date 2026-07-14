"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   AsciiArtVisualizer
   Recreates the "Flicker Tower" ASCII-art photo effect from 21st.dev.
   Loads the developer avatar and processes it in a Canvas2D loop:
   - Resampling grid cells
   - Character rendering based on luminance
   - Glitch and flicker animations over time
   - Custom crimson / violet tint option matching the design system
───────────────────────────────────────────────────────────── */

interface AsciiVisualizerProps {
  imageSrc?: string;
  tintColor?: string;
}

export function AsciiArtVisualizer({
  imageSrc = "/developer_3d_avatar.png",
  tintColor = "#C4183C", // Crimson default
}: AsciiVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Settings matching the requested parameters JSON (tweaked for performance/theme)
  const settings = {
    cellSize: 10,
    contrast: 1.15, // 115%
    brightness: 0,
    edgeEmphasis: 92,
    charSet: "@%#*+=-:. ",
    tintOpacity: 0.48, // 48%
    vignetteIntensity: 38,
    animSpeed: 0.05,
    animIntensity: 0.6,
  };

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setLoaded(true);
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!loaded || !imageRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create offscreen canvas for rendering source photo at target size
    const offscreen = document.createElement("canvas");
    offscreenCanvasRef.current = offscreen;
    const octx = offscreen.getContext("2d");
    if (!octx) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      const parent = containerRef.current;
      if (!parent) return;
      width = parent.clientWidth || 320;
      height = parent.clientHeight || 320;
      canvas.width = width;
      canvas.height = height;
      offscreen.width = width;
      offscreen.height = height;
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      time += settings.animSpeed;

      // 1. Draw source photo to offscreen canvas
      octx.clearRect(0, 0, width, height);
      
      // Aspect ratio fit
      const img = imageRef.current!;
      const imgRatio = img.width / img.height;
      const canvasRatio = width / height;
      let dWidth = width;
      let dHeight = height;
      let dx = 0;
      let dy = 0;

      if (imgRatio > canvasRatio) {
        dWidth = height * imgRatio;
        dx = (width - dWidth) / 2;
      } else {
        dHeight = width / imgRatio;
        dy = (height - dHeight) / 2;
      }

      octx.drawImage(img, dx, dy, dWidth, dHeight);

      // Get offscreen pixels
      const imgData = octx.getImageData(0, 0, width, height);
      const pixels = imgData.data;

      // Clear onscreen canvas
      ctx.fillStyle = "#08070C"; // void background
      ctx.fillRect(0, 0, width, height);

      const cellSize = settings.cellSize;
      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);

      ctx.font = `${cellSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 2 & 3. Grid sampling and Character rendering
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cellSize + cellSize / 2;
          const y = r * cellSize + cellSize / 2;

          // Sample central pixel of cell
          const pxIdx = (Math.floor(y) * width + Math.floor(x)) * 4;
          if (pxIdx >= pixels.length) continue;

          let rVal = pixels[pxIdx];
          let gVal = pixels[pxIdx + 1];
          let bVal = pixels[pxIdx + 2];

          // Apply contrast adjustment
          rVal = Math.min(255, Math.max(0, (rVal - 128) * settings.contrast + 128));
          gVal = Math.min(255, Math.max(0, (gVal - 128) * settings.contrast + 128));
          bVal = Math.min(255, Math.max(0, (bVal - 128) * settings.contrast + 128));

          // Calculate luminance
          const luminance = (0.299 * rVal + 0.587 * gVal + 0.114 * bVal) / 255;

          // Flicker animation logic (style: flicker)
          let flicker = 1.0;
          if (settings.animIntensity) {
            // Noise-like flicker based on time, row, and column index
            const noise = Math.sin(time + r * 0.15 + c * 0.08) * Math.cos(time * 0.7 - r * 0.05);
            if (noise > 0.4) {
              flicker = 1.0 - settings.animIntensity * Math.random();
            }
          }

          const finalLuminance = Math.min(1.0, Math.max(0, luminance * flicker));

          // Character index selection based on inverted luminance
          const charSet = settings.charSet;
          const charIdx = Math.floor((1.0 - finalLuminance) * (charSet.length - 1));
          const char = charSet[charIdx];

          // Get colors
          let finalR = Math.floor(rVal);
          let finalG = Math.floor(gVal);
          let finalB = Math.floor(bVal);

          // Apply Tint overlay (Blend Mode: Multiply or colorize)
          const hex = tintColor.replace("#", "");
          const tr = parseInt(hex.substring(0, 2), 16);
          const tg = parseInt(hex.substring(2, 4), 16);
          const tb = parseInt(hex.substring(4, 6), 16);

          finalR = Math.floor(finalR * (1 - settings.tintOpacity) + tr * finalLuminance * settings.tintOpacity);
          finalG = Math.floor(finalG * (1 - settings.tintOpacity) + tg * finalLuminance * settings.tintOpacity);
          finalB = Math.floor(finalB * (1 - settings.tintOpacity) + tb * finalLuminance * settings.tintOpacity);

          ctx.fillStyle = `rgb(${finalR}, ${finalG}, ${finalB})`;
          ctx.fillText(char, x, y);
        }
      }

      // 4. Post-effects: Vignette
      if (settings.vignetteIntensity) {
        const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.75);
        grad.addColorStop(0, "rgba(8,7,12,0)");
        grad.addColorStop(1, `rgba(8,7,12,${settings.vignetteIntensity * 0.01})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Subtle horizontal scanline glow overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
      const scanY = (time * 60) % height;
      ctx.fillRect(0, scanY, width, 2);

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameId);
    };
  }, [loaded, tintColor]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#08070C] rounded-2xl border border-white/5">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#8B8698] uppercase tracking-widest animate-pulse">
          Decrypting signal...
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
