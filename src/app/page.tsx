"use client";

import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { ShieldCheck, Lock, ArrowRight, School, Sparkles, Globe, Activity, Zap, Layers, Terminal, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function Home() {

  return (
    <div className="relative min-h-screen flex flex-col font-rajdhani selection:bg-emerald-500/30 overflow-x-hidden text-navy">

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-600 text-[10px] font-bold tracking-[0.3em] uppercase backdrop-blur-md"
          >
            <Terminal size={12} />
            <span>Visionary Protocol v5.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-9xl font-orbitron font-medium tracking-tighter leading-[0.9] uppercase"
          >
            Clae <br />
            <span className="text-gold font-semibold drop-shadow-sm">Vision</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-navy/60 font-medium tracking-widest max-w-2xl mx-auto leading-relaxed border-l-2 border-gold/30 pl-6 text-left"
          >
            PREMIUM_INSTITUTIONAL_FRAMEWORK //
            SECURE_ENROLLMENT_ARCHITECTURE //
            VISIONARY_OPERATING_SYSTEM.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12"
          >
            <Link href="/apply" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-5 bg-navy text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.5em] hover:bg-navy/90 transition-all shadow-[0_10px_30px_rgba(0,26,61,0.2)] flex items-center justify-center gap-4 group relative overflow-hidden">
                <Fingerprint size={20} className="group-hover:scale-110 transition-transform" />
                <span>Initialize Portal</span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gold translate-y-full group-hover:translate-y-0 transition-transform" />
              </button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-5 bg-white/40 text-navy/60 border border-navy/10 rounded-2xl font-bold text-[11px] uppercase tracking-[0.5em] hover:text-navy hover:border-gold/40 transition-all backdrop-blur-xl">
                System Overview
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features / Glass Grid */}
      <section className="relative z-10 px-6 pb-48">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="p-10 space-y-6 hover:border-emerald-500/40 transition-all duration-500 group border-navy/5">
            <div className="w-14 h-14 rounded-2xl bg-white border border-navy/5 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
              <Globe size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-navy/40 uppercase tracking-[0.4em]">Integrated Hub</h3>
              <p className="text-xl font-orbitron font-semibold text-navy tracking-tight">
                Global Node Sync
              </p>
            </div>
            <p className="text-navy/50 text-xs font-medium leading-relaxed tracking-wider">
              Manage multi-campus operations from a single centralized visionary hub. Real-time parity across all active nodes.
            </p>
          </GlassCard>

          <GlassCard className="p-10 space-y-6 hover:border-gold/40 transition-all duration-500 group md:col-span-2 relative overflow-hidden border-navy/5">
            <div className="absolute right-0 top-0 p-10 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
              <Activity size={180} className="text-gold" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white border border-navy/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white group-hover:scale-110 transition-all h-fit shadow-sm">
              <Zap size={28} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-navy/40 uppercase tracking-[0.4em]">Analytics Engine</h3>
                <p className="text-3xl font-orbitron font-semibold text-navy tracking-tighter">High-Velocity Insights</p>
              </div>
              <p className="text-navy/60 text-sm font-medium leading-relaxed tracking-widest max-w-lg">
                INSTANT_METRICS // STUDENT_PERFORMANCE // FINANCIAL_HEALTH // OPERATIONAL_EFFICIENCY.
                SECURED_BY_PREMIUM_RECORDS.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-10 space-y-6 hover:border-navy/40 transition-all duration-500 group md:col-span-2 border-navy/5">
            <div className="w-14 h-14 rounded-2xl bg-white border border-navy/5 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
              <Layers size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-navy/40 uppercase tracking-[0.4em]">Scalable Framework</h3>
              <p className="text-3xl font-orbitron font-semibold text-navy tracking-tighter">Modular Architecture</p>
            </div>
            <p className="text-navy/50 text-sm font-medium leading-relaxed tracking-widest">
              Scale your institution with plug-and-play modules. From admissions to alumni networks,
              Clae grows with you without system degradation.
            </p>
          </GlassCard>

          <GlassCard className="p-10 flex flex-col justify-center items-center text-center border-gold/20 hover:border-gold/40 transition-all group relative overflow-hidden bg-white/50">
            <div className="relative z-10 space-y-4">
              <ShieldCheck size={56} className="text-emerald-600 mx-auto group-hover:scale-110 transition-all duration-700" />
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.5em]">Security Protocol</h3>
                <p className="text-lg font-orbitron font-semibold text-navy">Encrypted Core</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gold/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-10 border-t border-navy/5 bg-white/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-[10px] text-navy/40 font-bold uppercase tracking-[0.6em]">
            © 2024 Clae Systems // Vision v5.0
          </div>
          <div className="flex gap-12 text-[10px] text-navy/40 font-bold uppercase tracking-[0.4em]">
            <Link href="#" className="hover:text-gold transition-colors">Privacy_Gate</Link>
            <Link href="#" className="hover:text-gold transition-colors">Terms_Registry</Link>
            <Link href="#" className="hover:text-gold transition-colors">Support_Relay</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

