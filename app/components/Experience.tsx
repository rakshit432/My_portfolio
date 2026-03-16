"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const EXPERIENCE = [
    {
        id: 1,
        role: "Web Lead",
        company: "NSS BIT Mesra",
        period: "2023 - Present",
        description: "Managed and led the development of the official NSS BIT Mesra government website. Mentored a team of developers to build impactful digital solutions for social causes.",
        tech: ["Leadership", "Govt Project", "Full Stack Dev"],
    },
    {
        id: 2,
        role: "Freelance Full Stack Developer",
        company: "Smart Choice Homes",
        period: "2024",
        description: "Designed and created the full frontend for a premium real estate platform. Developed a comprehensive Admin Dashboard to manage listings and streamline operations.",
        tech: ["Next.js", "Admin Dashboard", "Tailwind CSS"],
    },
];

const EDUCATION = [
    {
        id: 1,
        degree: "Bachelor of Technology in Computer Science",
        institution: "Birla Institute of Technology, Mesra",
        period: "2023 - 2027",
        description: "Focusing on Software Engineering, Data Structures, and Algorithms."
    }
]

export default function Experience() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax for header
    const yHeader = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacityHeader = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Timeline progress
    const scaleY = useSpring(useTransform(scrollYProgress, [0, 0.5], [0, 1]), {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} id="experience" className="py-32 px-6 relative z-10 overflow-hidden">

            {/* Parallax Background Element */}
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity: 0.1 }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[150px] -z-10 pointer-events-none"
            />

            <div className="max-w-4xl mx-auto space-y-16">

                {/* Header with Parallax */}
                <motion.div
                    style={{ y: yHeader, opacity: opacityHeader }}
                    className="space-y-6 text-center md:text-left pt-12"
                >
                    <h2 className="text-4xl md:text-8xl font-black tracking-tight text-white mb-6 uppercase">
                        Journey
                    </h2>
                    <p className="text-white/40 max-w-lg leading-relaxed text-lg font-light pl-1">
                        My academic and professional evolution.
                    </p>
                </motion.div>

                <div className="relative ml-1 md:ml-6 space-y-20 pl-8 md:pl-16 pb-12">

                    {/* Background Line (Faint) */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5" />

                    {/* Active Progress Line (Scroll Linked) */}
                    <motion.div
                        style={{ scaleY, originY: 0 }}
                        className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500"
                    />

                    {/* Experience Items */}
                    {EXPERIENCE.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="relative mb-12"
                        >
                            {/* Dot */}
                            <div className="absolute -left-[41px] md:-left-[73px] top-2 w-5 h-5 rounded-full bg-black border border-white/20 flex items-center justify-center z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-2 h-2 rounded-full bg-indigo-500"
                                />
                            </div>

                            <div className="space-y-4 group cursor-default">
                                <span className="text-sm font-mono tracking-widest text-indigo-400 uppercase">
                                    {item.period}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                    {item.role} <span className="text-white/40 group-hover:text-white/60 font-light">@</span> {item.company}
                                </h3>
                                <p className="text-white/60 leading-relaxed max-w-2xl text-lg group-hover:text-white/80 transition-colors">
                                    {item.description}
                                </p>
                                <div className="flex flex-wrap gap-3 pt-3">
                                    {item.tech.map(t => (
                                        <span key={t} className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-white/5 text-white/50 border border-white/5 group-hover:border-white/10 group-hover:bg-white/10 transition-colors">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Separator */}
                    <div className="py-8">
                        <span className="text-xs font-mono text-white/20 uppercase tracking-[0.3em] pl-2 border-l border-white/20 ml-[-33px] md:ml-[-65px] pl-8">Education</span>
                    </div>

                    {/* Education Items */}
                    {EDUCATION.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="relative mb-12"
                        >
                            {/* Dot */}
                            <div className="absolute -left-[41px] md:-left-[73px] top-2 w-5 h-5 rounded-full bg-black border border-white/20 flex items-center justify-center z-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-2 h-2 rounded-full bg-white/40"
                                />
                            </div>

                            <div className="space-y-3 group cursor-default">
                                <span className="text-sm font-mono tracking-widest text-indigo-400 uppercase">
                                    {item.period}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                    {item.institution}
                                </h3>
                                <p className="text-white/80 font-medium text-lg group-hover:text-white transition-colors">
                                    {item.degree}
                                </p>
                                <p className="text-white/60 leading-relaxed max-w-2xl">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                </div>

            </div>
        </section>
    );
}
