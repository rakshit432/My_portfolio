"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                // Random increment for realistic feel
                const increment = Math.floor(Math.random() * 10) + 1;
                return Math.min(prev + increment, 100);
            });
        }, 120);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (count === 100) {
            // Small delay before finishing to let user see 100%
            const timeout = setTimeout(onComplete, 800);
            return () => clearTimeout(timeout);
        }
    }, [count, onComplete]);

    return (
        <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
            <div className="relative w-full max-w-md px-6">
                {/* Progress Text */}
                <div className="flex justify-between items-end mb-4">
                    <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                        Initialising
                    </span>
                    <span className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                        {count}%
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${count}%` }}
                        className="h-full bg-white"
                    />
                </div>

                {/* Decorative details */}
                <div className="absolute -bottom-12 left-6 text-white/20 font-mono text-[10px]">
                    SYSTEM_READY_CHECK... {count < 100 ? "PENDING" : "OK"}
                </div>
            </div>
        </motion.div>
    );
}
