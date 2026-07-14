"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    const glow = glowRef.current;
    const dot  = dotRef.current;
    if (!glow || !dot) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;
    };

    const onScroll = () => {
      // Keep alignment relative to viewport
    };

    // Smooth glow follow
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      glowPos.current.x = lerp(glowPos.current.x, posRef.current.x, 0.08);
      glowPos.current.y = lerp(glowPos.current.y, posRef.current.y, 0.08);
      glow.style.left = `${glowPos.current.x}px`;
      glow.style.top  = `${glowPos.current.y}px`;
      rafRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll);

    // Expand cursor trail on links
    const onEnterLink = () => {
      glow.style.width  = "600px";
      glow.style.height = "600px";
      dot.style.transform = "translate(-50%, -50%) scale(2)";
    };
    const onLeaveLink = () => {
      glow.style.width  = "400px";
      glow.style.height = "400px";
      dot.style.transform = "translate(-50%, -50%) scale(1)";
    };

    const updateListeners = () => {
      const interactive = document.querySelectorAll("a, button, [data-hover-glow]");
      interactive.forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };

    updateListeners();

    const observer = new MutationObserver(updateListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-fluid hidden md:block" />
      <div ref={dotRef} className="cursor-dot-glow hidden md:block" />
    </>
  );
}
