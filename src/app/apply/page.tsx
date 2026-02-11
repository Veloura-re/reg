"use client";

import { GlassCard } from "@/components/GlassCard";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LockKeyhole, FileKey, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function ApplyPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 relative overflow-hidden bg-white font-rajdhani">
            {/* Background scanning line */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(16,185,129,0.03),transparent)] animate-[scan_6s_linear_infinite] pointer-events-none" />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg relative z-10"
            >
                <GlassCard className="text-center space-y-12 p-12 md:p-16 border-navy/5 bg-white/70 backdrop-blur-3xl rounded-[4rem] shadow-2xl shadow-navy/5 relative overflow-hidden group">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                    <div className="space-y-10 flex flex-col items-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                boxShadow: ["0 20px 40px rgba(16,185,129,0.05)", "0 20px 60px rgba(16,185,129,0.15)", "0 20px 40px rgba(16,185,129,0.05)"]
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="w-28 h-28 rounded-[2.5rem] bg-white border border-navy/10 flex items-center justify-center shadow-lg"
                        >
                            <ShieldAlert size={56} className="text-emerald-600" />
                        </motion.div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-orbitron font-bold text-navy tracking-tighter uppercase leading-none">
                                Access <br /><span className="text-emerald-600/30">Restricted</span>
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-[10px] text-navy/30 uppercase tracking-[0.5em] font-black">
                                <Terminal size={14} className="text-emerald-600" />
                                <span>Protocol 403: ENROLLMENT_HALTED</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 p-10 rounded-[2.5rem] bg-white/50 border border-navy/5 text-left relative overflow-hidden shadow-inner">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/[0.03] to-transparent pointer-events-none" />

                        <div className="flex items-start gap-6">
                            <LockKeyhole size={20} className="text-emerald-600 mt-1 shrink-0" />
                            <p className="text-[11px] text-navy/40 font-black leading-relaxed uppercase tracking-[0.1em]">
                                General admission channels are <span className="text-red-600">OFFLINE</span>.
                            </p>
                        </div>
                        <div className="flex items-start gap-6">
                            <FileKey size={20} className="text-gold mt-1 shrink-0" />
                            <p className="text-[11px] text-navy/40 font-black leading-relaxed uppercase tracking-[0.1em]">
                                Use the <span className="text-emerald-600">SECURE_TOKEN_LINK</span> provided by your registrar to bypass this gate.
                            </p>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Link href="/" className="block">
                            <button className="w-full py-7 bg-navy hover:bg-navy/95 text-white rounded-[2.5rem] font-bold text-[11px] uppercase tracking-[0.6em] transition-all shadow-[0_20px_40px_rgba(0,26,61,0.2)] active:scale-95 group/btn relative overflow-hidden font-orbitron">
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                    <ArrowLeft size={18} className="group-hover/btn:-translate-x-2 transition-transform duration-500" />
                                    Return to Main Node
                                </span>
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                            </button>
                        </Link>
                    </div>
                </GlassCard>
            </motion.div>

            <p className="absolute bottom-16 text-[10px] text-navy/10 uppercase tracking-[1em] font-black font-orbitron">
                Security clearance Level_04 Required
            </p>
        </div>
    );
}

