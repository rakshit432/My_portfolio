"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const Component = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLButtonElement>(null);
    const bioRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // GSAP Animation Context
        const ctx = gsap.context(() => {
            // Hero Reveal
            gsap.fromTo(revealRef.current,
                { filter: "blur(30px)", opacity: 0, scale: 1.02 },
                { filter: "blur(0px)", opacity: 1, scale: 1, duration: 2.2, ease: "expo.out" }
            );

            gsap.from(".command-cell", {
                x: 60, opacity: 0, stagger: 0.1, duration: 1.5, ease: "power4.out", delay: 1, clearProps: "all"
            });

            // Bio Text Reveal on Scroll
            gsap.from(".bio-text", {
                scrollTrigger: {
                    trigger: bioRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out"
            });

        }, containerRef);

        // Mouse Interaction
        const handleMouseMove = (e: MouseEvent) => {
            if (!ctaRef.current) return;
            const rect = ctaRef.current.getBoundingClientRect();
            const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
            if (dist < 150) {
                gsap.to(ctaRef.current, { x: (e.clientX - (rect.left + rect.width / 2)) * 0.4, y: (e.clientY - (rect.top + rect.height / 2)) * 0.4, duration: 0.6 });
            } else {
                gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
            }
        };
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            ctx.revert();
        };
    }, []);

    return (
        <section ref={containerRef} className="relative w-full bg-transparent flex flex-col selection:bg-white selection:text-black pt-20 pb-20">

            {/* HERO SECTION */}
            <div ref={revealRef} className="relative z-10 w-full flex flex-col md:flex-row p-8 md:p-14 lg:p-20 min-h-[80vh] items-center md:items-stretch gap-10">
                <div className="flex-1 min-w-0 flex flex-col justify-between pb-12 md:pb-8 w-full">
                    <div className="flex items-center gap-3">
                        <div className="relative w-2.5 h-2.5 bg-white rounded-full">
                            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-white tracking-[0.2em] uppercase">ABOUT</span>
                    </div>

                    <div className="max-w-4xl lg:-translate-y-8 pr-0 md:pr-12 will-change-transform">
                        <h1 className="text-[clamp(2.5rem,10vw,11.5rem)] font-black leading-[0.9] tracking-tighter uppercase italic-none">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-400 drop-shadow-lg">CREATIVE</span> <br /> 
                            <span className="text-transparent text-outline hover:text-white/10 transition-colors duration-1000">ENGINEER</span>
                        </h1>
                        <p className="mt-6 md:mt-8 font-mono text-[10px] md:text-[11px] text-white/60 uppercase tracking-[0.2em] max-w-sm leading-relaxed">
                            Crafting immersive digital experiences through spatial logic and advanced WebGL.
                        </p>
                    </div>

                    <button ref={ctaRef} className="w-fit flex items-center gap-6 group mt-8 lg:-translate-y-20 cursor-pointer pointer-events-auto" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                        <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center group-hover:bg-white transition-all duration-500 overflow-hidden">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:stroke-black stroke-white transition-colors duration-500">
                                <path d="M7 17L17 7M17 7H8M17 7V16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-white uppercase tracking-[0.2em]">Contact Me</span>
                    </button>
                </div>

                {/* Right Side Deck with Stats */}
                <div className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col gap-4 justify-center z-20">
                    {[
                        { id: "01", title: "EXPERTISE", val: "Full Stack", type: "text" },
                        { id: "02", title: "STATUS", val: "Available", type: "progress" },
                        { id: "03", title: "LOCATION", val: "India", type: "data" }
                    ].map((item) => (
                        <div key={item.id} className="command-cell glass-panel p-6 sm:p-7 block opacity-1 border border-white/10 bg-white/5 backdrop-blur-md">
                            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block mb-3">{item.id} {"//"} {item.title}</span>
                            {item.type === "progress" ? (
                                <div className="flex justify-between items-end mt-2">
                                    <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tighter">{item.val}</h4>
                                    <div className="h-[2px] w-20 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-[100%] animate-loading" />
                                    </div>
                                </div>
                            ) : item.type === "data" ? (
                                <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tighter mt-2">{item.val}</h4>
                            ) : (
                                <h3 className="text-sm font-medium text-white/70 mt-3 leading-snug">
                                    Specializing in React, Next.js, and <span className="italic text-white">Interactive UI</span>.
                                </h3>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* BIO BODY SECTION */}
            <div ref={bioRef} className="relative z-10 w-full px-6 md:px-14 lg:px-20 mt-0 md:mt-20 text-left">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 border-t border-white/10 pt-10 md:pt-16">
                    <div className="md:col-span-4 bio-text">
                        <span className="font-mono text-[11px] text-white/40 uppercase tracking-[0.2em] block mb-6">Introduction</span>
                        <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90">
                            I am a passionate <span className="text-white font-medium">Full Stack Developer</span> with a knack for building scalable digital solutions.
                        </p>
                    </div>
                    <div className="md:col-span-4 bio-text">
                        <span className="font-mono text-[11px] text-white/40 uppercase tracking-[0.2em] block mb-6">Leadership</span>
                        <p className="text-sm md:text-base leading-relaxed text-white/70 mb-5">
                            With leadership experience at <span className="text-white">NSS BIT Mesra</span>, I led a team to develop the official government website, managing both the technical architecture and team coordination.
                        </p>
                        <p className="text-sm md:text-base leading-relaxed text-white/70 mb-5">
                            This role honed my ability to deliver critical projects under deadlines while mentoring junior developers.
                        </p>
                        <p className="text-sm md:text-base leading-relaxed text-white/70">
                            I further demonstrated leadership skills by volunteering for BIT Mesra&apos;s flagship tech fests, <span className="text-white">Bitotsav</span> and <span className="text-white">Pantheon</span>, where I successfully managed teams and coordinated with over 10 sponsors.
                        </p>
                    </div>
                    <div className="md:col-span-4 bio-text">
                        <span className="font-mono text-[11px] text-white/40 uppercase tracking-[0.2em] block mb-6">Impact</span>
                        <p className="text-sm md:text-base leading-relaxed text-white/70 mb-6">
                            As a freelancer for <span className="text-white">Smart Choice Homes</span>, I engineered a premium real estate platform featuring a custom admin dashboard, simplifying property management for the client.
                        </p>
                        <div className="flex gap-4 mt-8">
                            {['Next.js', 'React', 'Node.js', 'WebGL'].map(tech => (
                                <span key={tech} className="px-3 py-1 border border-white/20 rounded-full text-[10px] uppercase tracking-wider text-white/60 hover:bg-white hover:text-black transition-colors cursor-default">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5">
                            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-4">Find me on</span>
                            <div className="flex gap-4">
                                {[
                                    { name: 'GitHub', url: 'https://github.com/rakshit432' },
                                    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rakshit-kumar-9979b1292/' },
                                    { name: 'LeetCode', url: 'https://leetcode.com/u/Rakshit_kr/' },
                                    { name: 'TUF', url: 'https://takeuforward.org/profile/raks432' }
                                ].map(link => (
                                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider group">
                                        {link.name} <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-24 md:mt-32 border-b border-white/10 pb-10 flex justify-between items-end bio-text">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white/20">RAKSHIT / DEV</h2>
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest hidden md:block">Based in India</span>
                </div>
            </div>

        </section>
    );
};
