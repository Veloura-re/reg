"use client";

import { GlassCard } from "@/components/GlassCard";
import { DollarSign, UserPlus, Activity, BookOpen, Truck, Briefcase, Zap, Shield, Database, Layout, Cpu, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "Financial Protocol",
        desc: "Automated fee collection, expense tracking, and real-time financial health monitoring.",
        icon: DollarSign,
        color: "text-emerald-600",
        tag: "FIN_CORE"
    },
    {
        title: "Admission Relay",
        desc: "Paperless application process with automated status tracking and priority protocols.",
        icon: UserPlus,
        color: "text-navy",
        tag: "ADM_SYNC"
    },
    {
        title: "Neural Analytics",
        desc: "Dashboard metrics that update in real-time. Know your institution's pulse instantly.",
        icon: Activity,
        color: "text-emerald-600",
        tag: "DATA_PULSE"
    },
    {
        title: "Academic Registry",
        desc: "Secure storage for transcripts, grades, and student history with easy retrieval.",
        icon: BookOpen,
        color: "text-gold",
        tag: "RECORDS_V2"
    },
    {
        title: "Logistics Engine",
        desc: "Track assets, books, and resources across multiple campuses with precision.",
        icon: Truck,
        color: "text-navy",
        tag: "ASSET_LOCATOR"
    },
    {
        title: "HR Terminal",
        desc: "Manage staff attendance, payroll, and performance reviews in one unified module.",
        icon: Briefcase,
        color: "text-gold",
        tag: "PERSONNEL"
    }
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen pt-32 pb-48 px-6 text-navy font-rajdhani">
            <div className="max-w-6xl mx-auto space-y-24">

                <div className="space-y-10 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-emerald-500/[0.05] border border-emerald-500/10 text-emerald-600 text-[10px] font-black tracking-[0.4em] uppercase backdrop-blur-md"
                    >
                        <Zap size={14} className="animate-pulse" />
                        <span>Core Module Capabilities</span>
                    </motion.div>
                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-orbitron font-bold tracking-tighter leading-tight text-navy"
                        >
                            Precision <br />
                            <span className="text-emerald-600/30">Instruments</span>
                        </motion.h1>
                        <p className="text-xl text-navy/40 font-bold tracking-[0.2em] uppercase leading-relaxed max-w-2xl font-orbitron">
                            A suite of high-velocity tools designed for modern institutional governance.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <GlassCard className="p-12 space-y-10 bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 rounded-[3.5rem] group flex flex-col h-full hover:scale-[1.02] transition-all">
                                <div className="flex justify-between items-start">
                                    <div className={`w-16 h-16 rounded-[2rem] bg-white border border-navy/10 flex items-center justify-center ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                        <feature.icon size={32} />
                                    </div>
                                    <span className="text-[10px] font-black text-navy/20 uppercase tracking-[0.4em]">{feature.tag}</span>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <h3 className="text-2xl font-orbitron font-bold text-navy tracking-tight uppercase leading-none">{feature.title}</h3>
                                    <p className="text-navy/40 text-xs font-bold leading-relaxed tracking-wider uppercase">
                                        {feature.desc}
                                    </p>
                                </div>
                                <div className="pt-8 border-t border-navy/5 flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <div className="w-12 h-2 rounded-full bg-navy/5" />
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}

