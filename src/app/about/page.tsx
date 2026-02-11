"use client";

import { GlassCard } from "@/components/GlassCard";
import { Users, Lightbulb, Target, ArrowRight, Shield, Cpu, Network } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-48 px-6 text-navy font-rajdhani">
            <div className="max-w-5xl mx-auto space-y-24">

                {/* Header */}
                <div className="space-y-10 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-emerald-500/[0.05] border border-emerald-500/10 text-emerald-600 text-[10px] font-black tracking-[0.4em] uppercase backdrop-blur-md"
                    >
                        <Shield size={14} className="animate-pulse" />
                        <span>System Architecture Overview</span>
                    </motion.div>
                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-orbitron font-bold tracking-tighter leading-tight text-navy"
                        >
                            Operational <br />
                            <span className="text-emerald-600/30">Philosophy</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-navy/40 font-bold tracking-[0.2em] uppercase leading-relaxed max-w-2xl font-orbitron"
                        >
                            Clae // Neural operating layer designed for institutional friction elimination.
                        </motion.p>
                    </div>
                </div>

                {/* Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <GlassCard className="p-12 space-y-8 bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 rounded-[3rem] group hover:scale-[1.02] transition-all">
                        <div className="w-16 h-16 rounded-[2rem] bg-white border border-navy/10 flex items-center justify-center text-emerald-600 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-all duration-500">
                            <Lightbulb size={32} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-navy/30 uppercase tracking-[0.5em]">The Core</h3>
                            <p className="text-2xl font-orbitron font-bold text-navy tracking-tight uppercase leading-none">Invisible <br />Efficiency</p>
                        </div>
                        <p className="text-navy/40 text-xs font-bold leading-relaxed tracking-wider uppercase">
                            Technology should be silent. Eliminating friction so educators can focus purely on pedagogy.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-12 space-y-8 bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 rounded-[3rem] group hover:scale-[1.02] transition-all">
                        <div className="w-16 h-16 rounded-[2rem] bg-white border border-navy/10 flex items-center justify-center text-gold shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-all duration-500">
                            <Target size={32} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-navy/30 uppercase tracking-[0.5em]">Accuracy</h3>
                            <p className="text-2xl font-orbitron font-bold text-navy tracking-tight uppercase leading-none">Data <br />Integrity</p>
                        </div>
                        <p className="text-navy/40 text-xs font-bold leading-relaxed tracking-wider uppercase">
                            Every record is stored with cryptographic precision. Absolute data fidelity across the grid.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-12 space-y-8 bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 rounded-[3rem] group hover:scale-[1.02] transition-all">
                        <div className="w-16 h-16 rounded-[2rem] bg-white border border-navy/10 flex items-center justify-center text-emerald-600 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-all duration-500">
                            <Network size={32} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-navy/30 uppercase tracking-[0.5em]">Connectivity</h3>
                            <p className="text-2xl font-orbitron font-bold text-navy tracking-tight uppercase leading-none">Unified <br />Node</p>
                        </div>
                        <p className="text-navy/40 text-xs font-bold leading-relaxed tracking-wider uppercase">
                            Connecting students and administrators in a single, high-fidelity digital ecosystem.
                        </p>
                    </GlassCard>
                </div>

                {/* Tactical Detail / CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="pt-24"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-orbitron font-bold text-navy tracking-tight uppercase leading-tight">Synchronize <br />the <span className="text-emerald-600">Future</span></h2>
                                <p className="text-navy/40 font-bold tracking-[0.2em] text-[11px] leading-relaxed uppercase max-w-md">
                                    Our admissions protocols are currently processing high-capacity node enrollments. Join the next-generation institutional layer.
                                </p>
                            </div>
                            <div className="flex gap-6">
                                <Link href="/apply">
                                    <button className="px-10 py-5 bg-navy text-white rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.5em] hover:bg-navy/95 transition-all shadow-[0_20px_40px_rgba(0,26,61,0.2)] active:scale-95">
                                        Start Application
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <GlassCard className="p-10 bg-white/70 border-navy/5 shadow-2xl rounded-[3.5rem] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" />
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-full bg-white border border-navy/5 flex items-center justify-center shadow-lg">
                                    <Cpu size={36} className="text-emerald-600 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] text-navy/30 font-black uppercase tracking-[0.5em]">Node Status</p>
                                    <p className="text-xl font-orbitron font-bold text-navy uppercase tracking-widest">Master Active</p>
                                </div>
                            </div>
                            <div className="mt-10 pt-10 border-t border-navy/5 space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center text-[10px] font-black text-navy/20 uppercase tracking-[0.5em]">
                                        <span className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            Sector_Link_0{i}
                                        </span>
                                        <span className="text-emerald-600">ONLINE</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

