"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Search, Loader2, Calendar, User, Clock, AlertCircle, ScanLine, Binary, Terminal, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TrackResult {
    studentName: string;
    status: string;
    submittedAt: string;
    position: number;
    total: number;
}

export default function TrackPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TrackResult | null>(null);
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        setError("");
        setResult(null);

        // Simulate scanning delay for effect
        setTimeout(async () => {
            try {
                const res = await fetch(`/api/status?query=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (res.ok) {
                    setResult({
                        studentName: data.studentName,
                        status: data.status,
                        submittedAt: new Date(data.createdAt).toLocaleDateString(),
                        position: data.position,
                        total: data.total,
                    });
                } else {
                    setError(data.error || "Application not found");
                }
            } catch (err) {
                setError("Network connection failure. System unreachable.");
            } finally {
                setLoading(false);
            }
        }, 1500);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "text-emerald-600 drop-shadow-sm";
            case "rejected": return "text-red-600 drop-shadow-sm";
            case "under_review": return "text-gold drop-shadow-sm";
            default: return "text-navy/40";
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-6 py-20 relative w-full max-w-2xl mx-auto text-navy font-rajdhani">
            {/* Background handled by layout */}

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 mb-16"
            >
                <div className="inline-flex items-center justify-center gap-4 px-6 py-2 rounded-full bg-emerald-500/[0.05] border border-emerald-500/10 text-emerald-600 text-[10px] font-black tracking-[0.4em] uppercase backdrop-blur-md transition-all">
                    <ScanLine size={14} className="animate-pulse" />
                    <span>Archive Query Protocol</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-orbitron font-bold tracking-tighter uppercase leading-none text-navy">
                    Track <br />
                    <span className="text-emerald-600/30">Application</span>
                </h1>
                <p className="text-navy/40 font-bold tracking-[0.2em] text-[11px] uppercase leading-relaxed max-w-sm mx-auto">
                    Initiate central registry lookup // Enter your unique tracking signature.
                </p>
            </motion.div>

            <GlassCard className="w-full relative overflow-hidden bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 backdrop-blur-3xl p-1 rounded-[3rem] group">
                {/* Decorative scanning line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/10 animate-[scan_4s_linear_infinite] opacity-50" />

                <div className="p-8 md:p-14 space-y-10">
                    <form onSubmit={handleSearch} className="relative z-10">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Search className="text-navy/10 group-focus-within:text-emerald-600 transition-colors" size={24} />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="CLAE-2026-XXXXX"
                                className="block w-full pl-16 pr-20 py-6 bg-white border border-navy/5 rounded-[2rem] text-navy placeholder-navy/10 focus:outline-none focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/[0.02] transition-all font-orbitron tracking-[0.2em] text-sm uppercase shadow-inner"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                <button
                                    type="submit"
                                    disabled={loading || !query}
                                    className="p-4 bg-navy text-white rounded-2xl disabled:bg-navy/5 disabled:text-navy/10 transition-all shadow-[0_10px_20px_rgba(0,26,61,0.15)] hover:scale-105 active:scale-95 flex items-center justify-center"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Terminal size={24} />}
                                </button>
                            </div>
                        </div>
                    </form>

                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-16 space-y-8"
                            >
                                <div className="relative w-24 h-24">
                                    <div className="absolute inset-0 border-4 border-navy/5 rounded-full" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 border-t-4 border-emerald-500 rounded-full"
                                    />
                                    <div className="absolute inset-4 border border-gold/20 rounded-full animate-ping" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <p className="text-[11px] text-emerald-600 font-black animate-pulse font-orbitron uppercase tracking-[0.5em]">
                                        Accessing_Records...
                                    </p>
                                    <p className="text-[9px] text-navy/20 font-black tracking-widest uppercase">Node connection established</p>
                                </div>
                            </motion.div>
                        )}

                        {error && !loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 flex items-center gap-6 text-red-600 shadow-sm"
                            >
                                <AlertCircle size={28} className="shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Query Exception</p>
                                    <p className="text-lg font-bold tracking-tight uppercase leading-none">{error}</p>
                                </div>
                            </motion.div>
                        )}

                        {result && !loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="relative p-10 rounded-[2.5rem] bg-white border border-navy/5 overflow-hidden shadow-sm">
                                    {/* Procedural Grid Background */}
                                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #001A3D 1px, transparent 0)', backgroundSize: '32px 32px' }}
                                    />

                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 pb-10 mb-10 border-b border-navy/5">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-[2rem] bg-navy/5 border border-navy/5 flex items-center justify-center text-navy/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                                <User size={40} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] text-navy/30 uppercase tracking-[0.5em] font-black">Identity Holder</p>
                                                <p className="text-3xl text-navy font-orbitron font-bold tracking-tighter uppercase leading-none">{result.studentName}</p>
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right space-y-2">
                                            <p className="text-[10px] text-navy/30 uppercase tracking-[0.5em] font-black">Registry State</p>
                                            <p className={`text-3xl font-orbitron font-bold uppercase tracking-tighter leading-none ${getStatusColor(result.status)}`}>
                                                {result.status.replace("_", " ")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="bg-white p-6 rounded-[2rem] border border-navy/5 space-y-4 group/item hover:border-navy/10 transition-all shadow-sm">
                                            <div className="flex items-center gap-3 text-navy/20 group-hover/item:text-gold transition-colors">
                                                <Calendar size={18} />
                                                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Genesis Event</span>
                                            </div>
                                            <p className="text-navy font-bold text-lg leading-none font-orbitron tracking-widest">{result.submittedAt}</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-[2rem] border border-navy/5 space-y-4 group/item hover:border-emerald-500/20 transition-all shadow-sm">
                                            <div className="flex items-center gap-3 text-navy/20 group-hover/item:text-emerald-600 transition-colors">
                                                <Binary size={18} />
                                                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Ledger Node</span>
                                            </div>
                                            <p className="text-navy font-bold text-lg leading-none font-orbitron tracking-widest">
                                                <span className="text-emerald-600">{result.position}</span> <span className="text-navy/5 mx-2">/</span> {result.total}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassCard>

            <div className="mt-16 flex items-center gap-6 text-[10px] text-navy/20 uppercase tracking-[0.8em] font-black">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                <span>Node Connection Secured</span>
                <span className="text-navy/5 mx-2">{"//"}</span>
                <span>Registry Protocol v5.0</span>
            </div>
        </div>
    );
}

