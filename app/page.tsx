"use client";

import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import Hero    from "./components/Hero";
import Navbar  from "./components/Navbar";
import Preloader from "@/components/ui/preloader";
import ScrollToTop from "./components/ui/scroll-to-top";
import dynamic from "next/dynamic";
import Lenis from "lenis";

// Custom cursor — client only
const Cursor = dynamic(() => import("@/components/ui/cursor"), { ssr: false });

// Lazy-load Three.js global background
const ThreeGlobalBg = dynamic(() => import("@/components/ui/three-global-bg"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-50 bg-[#030303]" />,
});

// Lazy-load below-fold sections
const About      = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Skills     = lazy(() => import("./components/Skills"));
const Projects   = lazy(() => import("./components/Projects"));
const Contact    = lazy(() => import("./components/Contact"));

function SectionSkeleton() {
  return (
    <div className="w-full py-24 px-6 md:px-10 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="h-2 w-24 rounded-sm mb-8 animate-pulse" style={{ background: "var(--bg-2)" }} />
      <div className="h-16 w-80 rounded-sm animate-pulse" style={{ background: "var(--bg-2)" }} />
    </div>
  );
}

// Lazy-load Cinematic Overlays
const MovieScreenFrame = dynamic(() => import("@/components/ui/movie-screen-frame").then((m) => ({ default: m.MovieScreenFrame })), { ssr: false });
const CinematicCharacter = dynamic(() => import("@/components/ui/cinematic-character").then((m) => ({ default: m.CinematicCharacter })), { ssr: false });

// Cinematic Scroll Wrapper: Applies camera focus zoom, vertical parallax, and fades on scroll
function CinematicScrollWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.1, 1, 1, 0.1]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.98, 1, 1, 0.98]);

  const springOpacity = useSpring(opacity, { stiffness: 90, damping: 25 });
  const springScale = useSpring(scale, { stiffness: 90, damping: 25 });

  return (
    <div ref={ref} className="w-full">
      <motion.div
        style={{
          opacity: springOpacity,
          scale: springScale,
        }}
        className="origin-center w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Initialize Lenis smooth scroll on client side
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    
    (window as any).lenis = lenis;

    let frameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  return (
    <>
      {/* Custom cursor — sits at root, above everything */}
      <Cursor />

      {/* Global immersive 3D background experience */}
      <ThreeGlobalBg />

      {/* Cinematic widescreen monitor framing + filters */}
      <MovieScreenFrame />

      {/* Interactive 2D Developer Avatar Guide */}
      <CinematicCharacter />

      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <Navbar />

      <main className="relative w-full overflow-hidden">
        <Hero />

        <CinematicScrollWrapper>
          <Suspense fallback={<SectionSkeleton />}><About /></Suspense>
        </CinematicScrollWrapper>

        <CinematicScrollWrapper>
          <Suspense fallback={<SectionSkeleton />}><Experience /></Suspense>
        </CinematicScrollWrapper>

        <CinematicScrollWrapper>
          <Suspense fallback={<SectionSkeleton />}><Skills /></Suspense>
        </CinematicScrollWrapper>

        <CinematicScrollWrapper>
          <Suspense fallback={<SectionSkeleton />}><Projects /></Suspense>
        </CinematicScrollWrapper>

        <CinematicScrollWrapper>
          <Suspense fallback={<SectionSkeleton />}><Contact /></Suspense>
        </CinematicScrollWrapper>
      </main>

      <ScrollToTop />
    </>
  );
}

