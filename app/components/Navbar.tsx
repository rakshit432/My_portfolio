"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = ["Home", "About", "Experience", "Skills", "Projects", "Contact"];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`
            relative
            flex items-center
            ${isOpen ? "justify-center" : "justify-between md:justify-center"}
            w-[95%] md:w-auto
            px-8 py-3
            rounded-full
            bg-black/60
            backdrop-blur-xl
            border border-white/[0.08]
            ring-1 ring-white/[0.05]
            shadow-[0_8px_30px_rgba(0,0,0,0.6)]
            transition-all duration-300
          `}
        >
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-12">
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  if (item === "Home") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="
                  text-xs uppercase tracking-widest font-semibold
                  text-white/60
                  transition-all duration-300
                  hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-white hover:to-white/60
                  hover:scale-105 cursor-pointer relative group
                "
              >
                {item}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden w-full items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-white uppercase">
              Menu
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white focus:outline-none"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
              )}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-28 px-6 md:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    setIsOpen(false);
                    if (item === "Home") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="
                    text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40
                    hover:from-indigo-400 hover:to-purple-400 hover:scale-105 transition-all duration-300
                  "
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
