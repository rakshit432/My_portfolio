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
      <main className="relative z-10">
        <Hero />

        <div className="relative">
          <div className="absolute inset-0 -z-10 h-full w-full">
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
