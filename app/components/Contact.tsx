"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Plus, Send, Github, Linkedin, Code, Terminal, Loader2 } from "lucide-react";
import { SiLeetcode } from "react-icons/si";

export default function Contact() {
    const currentYear = new Date().getFullYear();
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('rakshit.official@example.com'); // Placeholder, update with actual
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setFormStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setFormStatus('error');
            }
        } catch (error) {
            setFormStatus('error');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setFormStatus('idle'), 5000);
        }
    };

    const SOCIAL_LINKS = [
        { name: "GitHub", icon: Github, url: "https://github.com/rakshit432" },
        { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/rakshit-kumar-9979b1292/" },
        { name: "LeetCode", icon: SiLeetcode, url: "https://leetcode.com/u/Rakshit_kr/" },
        { name: "TUF", icon: Terminal, url: "https://takeuforward.org/profile/raks432" },
    ];

    return (
        <footer id="contact" className="relative pt-32 pb-12 px-6 overflow-hidden bg-black selection:bg-white selection:text-black">

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo-500/[0.03] blur-[120px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">

                {/* LEFT COLUMN: INFO & LINKS */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Available for work
                        </span>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9]">
                            LET'S WORK <br /> <span className="text-white/40">TOGETHER</span>
                        </h2>
                        <p className="text-lg text-white/50 font-light leading-relaxed max-w-sm">
                            Have a project in mind? Let's build something that solves real problems.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">Socials</h3>
                            <div className="flex flex-wrap gap-4">
                                {SOCIAL_LINKS.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                    >
                                        <link.icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                        <span className="text-sm text-white/60 group-hover:text-white transition-colors">{link.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">Contact</h3>
                            <button
                                onClick={handleCopyEmail}
                                className="group flex items-center gap-3 px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all w-full md:w-auto"
                            >
                                {copied ? <span className="text-emerald-400">Copied to clipboard!</span> : <span className="text-white/80 group-hover:text-white">rakshitkumar.5905@gmail.com</span>}
                                <Copy className="w-4 h-4 text-white/40 group-hover:text-white transition-colors ml-auto" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT COLUMN: FORM */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 sticky top-10"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-xs font-mono uppercase tracking-widest text-white/40">Name</label>
                            <input
                                type="text" id="name" name="name" required
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors bg-opacity-50"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-mono uppercase tracking-widest text-white/40">Email</label>
                            <input
                                type="email" id="email" name="email" required
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors bg-opacity-50"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-xs font-mono uppercase tracking-widest text-white/40">Message</label>
                            <textarea
                                id="message" name="message" required rows={4}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors bg-opacity-50 resize-none"
                                placeholder="Tell me about your project..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || formStatus === 'success'}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : formStatus === 'success' ? (
                                "Message Sent!"
                            ) : (
                                <>
                                    Send Message <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {formStatus === 'error' && (
                            <p className="text-red-400 text-sm text-center">Failed to send message. Please try again.</p>
                        )}
                    </form>
                </motion.div>

            </div>

            <div className="max-w-6xl mx-auto mt-32 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30 font-mono">
                <p>&copy; {currentYear} Rakshit. All Rights Reserved.</p>
                <p>Designed & Built with Next.js 15 & Tailwind</p>
            </div>
        </footer>
    );
}