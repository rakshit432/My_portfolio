"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import About from "./components/About"
import Contact from "./components/Contact"
import Experience from "./components/Experience"
import Hero from "./components/Hero"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Navbar from "./components/Navbar"
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import ScrollToTop from "./components/ui/scroll-to-top";
import Preloader from "@/components/ui/preloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Fixed Navbar */}
      <div className="fixed top-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
        <div className="w-full flex justify-center pointer-events-auto">
          <Navbar />
        </div>
      </div>

      {/* Scrollable Content */}
      <main className="relative z-10 w-full overflow-hidden">
        <Hero />

        <div className="relative w-full">
          {/* Fix performance: use fixed instead of absolute so the canvas matches screen resolution, averting massive layout repaints and huge canvas sizes that delay scrolling. */}
          <div className="fixed inset-0 -z-10 h-screen w-full pointer-events-none">
            <FlickeringGrid
              className="w-full h-full"
              squareSize={4}
              gridGap={6}
              color="#818cf8"
              maxOpacity={0.2}
              flickerChance={0.1}
            />
          </div>
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </div>
      </main>

      <ScrollToTop />
    </>
  )
}
