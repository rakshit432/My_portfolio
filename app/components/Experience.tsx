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
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-600 drop-shadow-sm">
                        Journey
                    </h2>
                    <p className="text-indigo-200/70 max-w-lg leading-relaxed text-xl font-medium tracking-wide pl-1">
                        My academic and professional evolution.
                    </p>
                </motion.div>

                <div className="relative ml-1 md:ml-6 space-y-20 pl-8 md:pl-16 pb-12">

                    {/* Background Line (Faint) */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5" />

                    {/* Active Progress Line (Scroll Linked) */}
                    <motion.div
                        style={{ scaleY, originY: 0 }}
                        className="absolute left-[0px] md:left-[0px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"
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
                            <div className="absolute -left-[42px] md:-left-[74px] top-2 w-6 h-6 rounded-full bg-black border-[2px] border-white/10 group-hover:border-indigo-400/50 flex items-center justify-center z-10 transition-colors duration-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 group-hover:from-white group-hover:to-white transition-colors duration-300"
                                />
                            </div>

                            <div className="space-y-4 group cursor-default bg-white/[0.01] p-6 rounded-3xl border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all duration-500 hover:-translate-y-1">
                                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold tracking-[0.2em] text-indigo-300 uppercase shadow-inner">
                                    {item.period}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-white/90 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300">
                                    {item.role} <span className="text-white/20 group-hover:text-white/40 font-light mx-2">@</span> {item.company}
                                </h3>
                                <p className="text-indigo-100/60 leading-relaxed max-w-2xl text-[1.1rem] group-hover:text-white/80 transition-colors duration-300 gap-2">
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
                    <div className="py-12 flex items-center gap-4 ml-[-33px] md:ml-[-65px] pl-8">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] bg-white/5 px-4 py-1.5 rounded-full border border-white/10 shadow-sm backdrop-blur-sm">Education</span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
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
                            <div className="absolute -left-[42px] md:-left-[74px] top-2 w-6 h-6 rounded-full bg-black border-[2px] border-white/10 group-hover:border-purple-400/50 flex items-center justify-center z-10 transition-colors duration-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-2.5 h-2.5 rounded-full bg-neutral-400 group-hover:bg-white transition-colors duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                />
                            </div>

                            <div className="space-y-4 group cursor-default bg-white/[0.01] p-6 rounded-3xl border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all duration-500 hover:-translate-y-1">
                                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold tracking-[0.2em] text-purple-300 uppercase shadow-inner">
                                    {item.period}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-white/90 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                                    {item.institution}
                                </h3>
                                <p className="text-white/80 font-semibold text-[1.1rem] group-hover:text-white transition-colors duration-300">
                                    {item.degree}
                                </p>
                                <p className="text-indigo-100/60 leading-relaxed max-w-2xl group-hover:text-white/80 transition-colors duration-300 gap-2">
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
