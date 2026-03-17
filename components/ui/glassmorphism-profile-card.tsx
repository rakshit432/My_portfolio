"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Plus, Copy, Zap, X } from "lucide-react";

interface ComponentProps {
    name?: string;
    role?: string;
    email?: string;
    avatarSrc?: string;
    statusText?: string;
    statusColor?: string;
    glowText?: string;
    className?: string;
}

export default function GlassmorphismProfileCard({
    name = "Rakshit K.",
    role = "Full-stack Developer",
    email = "rakshitkumar.5905@gmail.com",
    avatarSrc = "https://github.com/shadcn.png",
    statusText = "Available for work",
    statusColor = "bg-blue-500",
    glowText = "Currently High on Creativity",
    className,
}: ComponentProps) {
    const [copied, setCopied] = useState(false);
    const [timeText, setTimeText] = useState<string>("");
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const updateTime = () => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes().toString().padStart(2, "0");
            const hour12 = ((h + 11) % 12) + 1;
            const ampm = h >= 12 ? "PM" : "AM";
            setTimeText(`${hour12}:${m}${ampm}`);
        };
        
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("relative w-full max-w-sm mx-auto", className)}
        >

            {/* Glowing Accent Background */}
            <div className="pointer-events-none absolute inset-x-3 -bottom-10 top-[85%] rounded-[28px] bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-purple-500/80 blur-xl shadow-[0_40px_80px_-16px_rgba(99,102,241,0.5)] z-0 transition-all duration-700 ease-in-out group-hover:blur-2xl" />
            
            <div className="absolute inset-x-0 -bottom-10 mx-auto w-full z-0 pointer-events-none">
                <div className="flex items-center justify-center gap-2 bg-transparent py-3 text-center text-sm font-semibold text-white/90 tracking-wide drop-shadow-md">
                    <Zap className="h-4 w-4 text-yellow-400" /> {glowText}
                </div>
            </div>

            <Card className={cn(
                "group relative z-10 mx-auto w-full max-w-[90vw] sm:max-w-3xl overflow-visible rounded-[24px]",
                "bg-white/5 backdrop-blur-2xl dark:bg-black/20",
                "border border-white/10 dark:border-white/5",
                "shadow-2xl shadow-black/40 text-white transition-all duration-500 hover:shadow-indigo-500/20 hover:border-white/20 hover:-translate-y-1"
            )}>
                <CardContent className="p-6 sm:p-8">
                    <div className="mb-8 flex items-center justify-between text-sm text-neutral-300">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                            <span className={cn("inline-block h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]", statusColor)} />
                            <span className="select-none font-medium text-xs tracking-wider uppercase opacity-90">{statusText}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-70 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="tabular-nums text-xs font-mono">{timeText || "--:--"}</span>
                        </div>
                    </div>


                    <div className="flex flex-col justify-center items-center gap-5 relative z-10">
                        <div className="relative h-32 w-32 sm:h-40 sm:w-40 shrink-0 overflow-hidden rounded-full ring-4 ring-white/10 shadow-2xl transition-transform duration-500 ease-out group-hover:scale-105 group-hover:ring-white/20">
                            <Image
                                src={avatarSrc}
                                alt={`${name} avatar`}
                                fill
                                sizes="(max-width: 640px) 128px, 160px"
                                className="object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                        <div className="min-w-0 text-center">
                            <h3 className="truncate text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                                {name}
                            </h3>
                            <p className="mt-1.5 text-sm font-medium text-indigo-200/80 uppercase tracking-widest">{role}</p>
                        </div>
                    </div>


                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsResumeOpen(true)}
                            className="h-12 justify-center gap-2 sm:gap-3 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/15 hover:text-white hover:scale-[1.02] transition-all duration-300 shadow-md backdrop-blur-md font-bold uppercase tracking-wider text-xs"
                        >
                            <Plus className="h-4 w-4" /> View Resume
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleCopy}
                            className="h-12 justify-center gap-2 sm:gap-3 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/15 hover:text-white hover:scale-[1.02] transition-all duration-300 shadow-md backdrop-blur-md"
                        >
                            <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy Email"}
                        </Button>
                    </div>
                </CardContent>
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-tr from-white/0 via-white/0 to-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            </Card>

            {/* Resume Overlay Modal */}
            {isMounted && document.body && createPortal(
                <AnimatePresence>
                    {isResumeOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-xl"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-5xl h-full max-h-[90vh] bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/50">
                                    <h3 className="text-white font-bold uppercase tracking-widest text-sm">Resume Document</h3>
                                    <button 
                                        onClick={() => setIsResumeOpen(false)}
                                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                {/* Iframe */}
                                <div className="flex-1 w-full bg-black">
                                    <iframe 
                                        src="https://drive.google.com/file/d/1IoUhKAVlPbzbz6a5f11LoJJS9zq32HAh/preview" 
                                        className="w-full h-full border-none"
                                        allow="autoplay"
                                    ></iframe>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </motion.div>
    );
}
