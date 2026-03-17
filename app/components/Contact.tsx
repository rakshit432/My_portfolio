"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Send, Github, Linkedin, Terminal, Loader2 } from "lucide-react";
import { SiLeetcode } from "react-icons/si";

export default function Contact() {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("rakshitkumar.5905@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name: data.name,
          email: data.email,
          message: data.message,
          subject: "New Portfolio Contact",
        }),
      });

      const result = await res.json();

      if (result.success) {
        setFormStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  const SOCIAL_LINKS = [
    { name: "GitHub", icon: Github, url: "https://github.com/rakshit432" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/rakshit-kumar-9979b1292/",
    },
    {
      name: "LeetCode",
      icon: SiLeetcode,
      url: "https://leetcode.com/u/Rakshit_kr/",
    },
    {
      name: "TUF",
      icon: Terminal,
      url: "https://takeuforward.org/profile/raks432",
    },
  ];

  return (
    <footer
      id="contact"
      className="relative pt-32 pb-12 px-6 overflow-hidden bg-black selection:bg-white selection:text-black"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for work
            </span>

            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
              LET&apos;S WORK <br />
              <span className="text-white/40">TOGETHER</span>
            </h2>

            <p className="text-lg text-white/50 max-w-sm">
              Have a project in mind? Let&apos;s build something that solves real
              problems.
            </p>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
              Socials
            </h3>

            <div className="flex flex-wrap gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-300 hover:-translate-y-1"
                >
                  <link.icon className="w-4 h-4 text-white/50 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors tracking-wide">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Email copy */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/30 mb-4">
              Contact
            </h3>

            <button
              onClick={handleCopyEmail}
              className="group flex w-full sm:w-auto items-center gap-3 px-6 py-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              {copied ? (
                <span className="text-emerald-400 font-medium tracking-wide">Copied automatically!</span>
              ) : (
                <span className="text-white/80 font-mono tracking-tight group-hover:text-white transition-colors">
                  rakshitkumar.5905@gmail.com
                </span>
              )}
              <Copy className="w-4 h-4 text-white/30 ml-auto group-hover:text-indigo-400 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* RIGHT SIDE FORM */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Honeypot for spam protection */}
            <input type="checkbox" name="botcheck" className="hidden" />

            <div>
              <label className="text-xs text-white/40">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full mt-2 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 placeholder:text-white/20"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-xs text-white/40">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full mt-2 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 placeholder:text-white/20"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="text-xs text-white/40">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full mt-2 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 placeholder:text-white/20"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || formStatus === "success"}
              className="w-full bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-white font-extrabold uppercase tracking-[0.2em] text-sm py-4 rounded-xl flex items-center justify-center gap-3 transform transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border border-white/10 shadow-lg"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : formStatus === "success" ? (
                "Message Sent!"
              ) : (
                <>
                  Send Message <Send className="w-4 h-4" />
                </>
              )}
            </button>

            {formStatus === "error" && (
              <p className="text-red-400 text-sm text-center">
                Failed to send message. Try again.
              </p>
            )}
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-32 border-t border-white/5 pt-8 text-xs text-white/30 font-mono flex justify-between">
        <p>© {currentYear} Rakshit. All rights reserved.</p>
        <p>Built with Next.js & Tailwind</p>
      </div>
    </footer>
  );
}
