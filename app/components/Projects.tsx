"use client";

import { Component as ProjectSlider } from "@/components/ui/lumina-interactive-list";
import { motion } from "framer-motion";

export default function Projects() {
  return (
    <motion.section 
      id="projects" 
      className="relative w-full h-screen"
      initial={{ opacity: 0, filter: "blur(20px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <ProjectSlider />
    </motion.section>
  );
}