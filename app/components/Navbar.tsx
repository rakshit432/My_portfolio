"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Monitor section scroll intersection
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: "-10% 0px -30% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    
    const lenis = (window as any).lenis;
    if (lenis) {
      if (id === "home") {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        const target = document.getElementById(id);
        if (target) {
          lenis.scrollTo(target, { duration: 1.2 });
        }
      }
    } else {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Desktop Floating Menu */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="nav-glass px-6 py-2.5 rounded-full hidden md:flex items-center gap-1.5"
        >
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => handleNavClick(s.id, e)}
                className="relative px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors duration-300"
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full pill-active -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {s.label}
              </a>
            );
          })}
        </motion.nav>
      </div>

      {/* Mobile Sticky Menu Bar */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full nav-glass flex items-center justify-center text-white/80 hover:text-white"
        >
          <motion.div animate={isOpen ? "open" : "closed"} className="w-5 h-4 flex flex-col justify-between">
            <motion.span
              variants={{ open: { rotate: 45, y: 7 }, closed: { rotate: 0, y: 0 } }}
              className="block h-0.5 bg-current rounded-full"
            />
            <motion.span
              variants={{ open: { opacity: 0, scale: 0 }, closed: { opacity: 1, scale: 1 } }}
              className="block h-0.5 bg-current rounded-full"
            />
            <motion.span
              variants={{ open: { rotate: -45, y: -7 }, closed: { rotate: 0, y: 0 } }}
              className="block h-0.5 bg-current rounded-full"
            />
          </motion.div>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {SECTIONS.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => handleNavClick(s.id, e)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`text-3xl font-extrabold uppercase tracking-tight ${
                    active === s.id ? "text-chromatic" : "text-white/40"
                  }`}
                >
                  {s.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
