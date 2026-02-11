"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import { School, UserPlus, Copy, Check, ShieldCheck, Activity, Globe, Zap, LogOut, Search, Settings, Server, Shield, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export default function SuperAdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [schools, setSchools] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSchoolName, setNewSchoolName] = useState("");
    const [newSchoolSlug, setNewSchoolSlug] = useState("");
    const [creating, setCreating] = useState(false);
    const [generatingInvite, setGeneratingInvite] = useState(false);
    const [copiedInvite, setCopiedInvite] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") router.push("/super-admin/login");
        if (status === "authenticated") {
            if (session?.user?.role !== "super_admin") {
                router.push("/admin/dashboard");
                return;
            }
            fetchdata();
        }
    }, [status, router, session]);

    const fetchdata = async () => {
        try {
            const [schoolsRes, invitesRes] = await Promise.all([
                fetch("/api/admin/schools"),
                fetch("/api/admin/invites")
            ]);
            if (schoolsRes.ok) setSchools(await schoolsRes.json());
            if (invitesRes.ok) setInvites(await invitesRes.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSchool = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/admin/schools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newSchoolName, slug: newSchoolSlug }),
            });
            if (res.ok) {
                setNewSchoolName("");
                setNewSchoolSlug("");
                fetchdata();
            }
        } finally {
            setCreating(false);
        }
    };

    const handleGenerateInvite = async (schoolId: string) => {
        setGeneratingInvite(true);
        try {
            const res = await fetch("/api/admin/invites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ schoolId }),
            });
            if (res.ok) {
                fetchdata();
            }
        } finally {
            setGeneratingInvite(false);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedInvite(code);
        setTimeout(() => setCopiedInvite(null), 2000);
    };

    const filteredSchools = useMemo(() => {
        return schools.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [schools, searchTerm]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] gap-8">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="text-emerald-500/60 font-mono text-xs uppercase tracking-[0.6em] animate-pulse">Synchronizing Core Nexus</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 p-4 md:p-8">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/[0.04] blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-blue-500/[0.03] blur-[150px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
            </div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                {/* Header Section */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-black border border-emerald-500/40 flex items-center justify-center shadow-3xl overflow-hidden relative group">
                            <ShieldCheck size={40} className="text-emerald-500 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-700 relative z-10" />
                            <div className="absolute inset-0 bg-emerald-500/[0.08] animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-light tracking-tight text-white uppercase">
                                Root <span className="text-emerald-500/80 font-bold">Nexus</span>
                            </h1>
                            <div className="flex items-center gap-4 text-xs text-emerald-500/60 font-mono uppercase tracking-[0.5em] font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Global Grid Administration v4.0.2
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end px-8 border-r border-white/10 py-1">
                            <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase font-bold">Status: ROOT_STABLE</span>
                            <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase mt-1.5">Cluster: ALPHA_NODE_01</span>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/super-admin/login" })}
                            className="p-4.5 bg-black border border-white/10 hover:border-red-500/40 rounded-2xl text-white/30 hover:text-red-400 transition-all group shadow-xl"
                        >
                            <LogOut size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </header>

                {/* Quick Telemetry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: "Active School Nodes", value: schools.length, icon: Globe, color: "text-emerald-500" },
                        { label: "Authorization Tokens", value: invites.length, icon: Key, color: "text-blue-500" },
                        { label: "Grid Load Factor", value: "0.02%", icon: Activity, color: "text-amber-500" },
                        { label: "Sync Latency", value: "11ms", icon: Zap, color: "text-purple-500" }
                    ].map((stat, i) => (
                        <GlassCard key={i} className="p-8 bg-black/40 border-white/10 hover:border-emerald-500/30 group transition-all duration-700 relative overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />
                            <div className="flex justify-between items-start mb-8">
                                <p className="text-[11px] uppercase tracking-[0.4em] text-white/40 font-bold">{stat.label}</p>
                                <div className={`p-3 rounded-xl bg-black border border-white/10 ${stat.color} group-hover:scale-110 transition-transform shadow-lg opacity-60 group-hover:opacity-100`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <p className="text-5xl font-light tracking-tighter text-white">{stat.value}</p>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Main Node Management */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
                            <h2 className="text-2xl font-light text-white tracking-tight flex items-center gap-4">
                                <Server size={24} className="text-emerald-500/60" />
                                Cluster Nodes Registry
                            </h2>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    placeholder="SEARCH_NODE_HASH..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-xs font-mono text-white/60 focus:outline-none focus:border-emerald-500/50 transition-all uppercase tracking-[0.2em] font-bold shadow-inner"
                                />
                            </div>
                        </div>

                        <GlassCard className="p-0 bg-black/40 border-white/10 overflow-hidden shadow-3xl">
                            {/* Genesis Form */}
                            <div className="p-10 border-b border-white/10 bg-white/[0.02] shadow-inner">
                                <form onSubmit={handleCreateSchool} className="grid grid-cols-1 md:grid-cols-7 gap-8 items-end">
                                    <div className="md:col-span-3 space-y-4">
                                        <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold ml-1">Entity Identity</label>
                                        <input
                                            required
                                            placeholder="INSTITUTION_NAME"
                                            value={newSchoolName}
                                            onChange={e => setNewSchoolName(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-2xl py-5 px-7 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 transition-all font-mono uppercase tracking-widest shadow-inner font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold ml-1">Registry Prefix</label>
                                        <input
                                            required
                                            placeholder="/NODE_SLUG"
                                            value={newSchoolSlug}
                                            onChange={e => setNewSchoolSlug(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-2xl py-5 px-7 text-sm text-emerald-500 placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 transition-all font-mono uppercase tracking-[0.2em] shadow-inner font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button
                                            disabled={creating}
                                            className="w-full py-5 bg-emerald-500/90 hover:bg-emerald-400 text-black rounded-2xl font-bold text-[11px] uppercase tracking-[0.5em] transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group/btn"
                                        >
                                            <Zap size={18} className="group-hover:scale-110 transition-transform" />
                                            {creating ? "SYNCING..." : "Genesis Node"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Node Repository */}
                            <div className="px-10 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                                    <AnimatePresence mode="popLayout">
                                        {filteredSchools.map((school, i) => (
                                            <motion.div
                                                key={school.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="p-7 bg-black border border-white/10 rounded-[2.5rem] flex justify-between items-center group/node hover:border-emerald-500/40 transition-all shadow-2xl relative overflow-hidden will-change-transform"
                                            >
                                                <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover/node:opacity-100 transition-opacity" />
                                                <div className="relative z-10 min-w-0 pr-6">
                                                    <p className="text-base font-medium text-white tracking-wide truncate group-hover/node:text-emerald-50 transition-colors uppercase">
                                                        {school.name}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="text-[11px] font-mono text-emerald-500 tracking-widest font-bold uppercase">/{school.slug}</span>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold">NODE_STABLE</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleGenerateInvite(school.id)}
                                                    disabled={generatingInvite}
                                                    className="relative z-10 p-4.5 bg-black border border-white/10 rounded-2xl text-white/20 hover:text-emerald-400 hover:border-emerald-500/50 transition-all active:scale-95 group/invite-btn shadow-xl shrink-0"
                                                    title="Generate Access Token"
                                                >
                                                    <UserPlus size={24} className="group-hover/invite-btn:scale-110 transition-transform" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {filteredSchools.length === 0 && (
                                        <div className="col-span-full py-32 text-center space-y-6 rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01]">
                                            <div className="inline-flex p-8 rounded-[2rem] bg-black border border-white/10 text-white/5">
                                                <Search size={48} />
                                            </div>
                                            <p className="text-xs text-white/20 font-mono uppercase tracking-[0.6em] italic font-bold">NULL_SET DETECTED IN CLUSTER REPOSITORY</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Registry Token Stream */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="flex items-center gap-4 px-2">
                            <Activity size={24} className="text-blue-500/60" />
                            <h2 className="text-2xl font-light text-white tracking-tight">Active Tokens</h2>
                        </div>

                        <GlassCard className="p-10 bg-black/40 border-white/10 space-y-8 shadow-3xl">
                            <div className="space-y-6 max-h-[650px] overflow-y-auto pr-4 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {invites.length === 0 ? (
                                        <div className="py-32 text-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.01]">
                                            <p className="text-[11px] text-white/10 font-mono uppercase tracking-[0.4em] italic font-bold">Tokens depleted</p>
                                        </div>
                                    ) : invites.slice().reverse().map((invite, i) => (
                                        <motion.div
                                            key={invite.id}
                                            initial={{ x: 25, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-7 bg-black border border-white/10 rounded-[2.5rem] group/token relative overflow-hidden hover:border-blue-500/40 transition-all shadow-2xl will-change-transform"
                                        >
                                            <div className="absolute inset-0 bg-blue-500/[0.01] opacity-0 group-hover/token:opacity-100 transition-opacity" />
                                            <div className="flex justify-between items-center relative z-10">
                                                <div className="min-w-0 flex-1 pr-6">
                                                    <div className="flex items-center gap-3 mb-2.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                        <p className="text-[11px] text-white/40 uppercase tracking-[0.3em] font-bold truncate">
                                                            {invite.school?.name}
                                                        </p>
                                                    </div>
                                                    <p className="text-blue-500 font-mono tracking-[0.3em] text-2xl select-all font-bold uppercase">{invite.code}</p>
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(invite.code)}
                                                    className="p-5 bg-black border border-white/10 rounded-2xl text-white/20 hover:text-blue-400 hover:border-blue-500/50 transition-all flex items-center justify-center shadow-2xl active:scale-90"
                                                >
                                                    {copiedInvite === invite.code ? <Check size={24} className="text-emerald-500" /> : <Copy size={24} />}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="p-8 bg-blue-500/[0.03] border border-blue-500/20 rounded-[2rem] space-y-4 shadow-inner">
                                <div className="flex items-center gap-4">
                                    <Shield size={18} className="text-blue-500/60 animate-pulse" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-blue-500/80">Node Elevation</span>
                                </div>
                                <p className="text-[11px] text-white/40 leading-relaxed font-mono tracking-wider">Registry tokens grant root-level officer permissions. One-time usage protocol in effect.</p>
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Footer Telemetry */}
                <footer className="flex flex-col md:flex-row justify-between items-center gap-10 py-12 border-t border-white/10">
                    <div className="flex items-center gap-10 text-[11px] font-mono uppercase tracking-[0.5em] text-white/20 font-bold">
                        <span className="flex items-center gap-3">
                            <Activity size={14} className="text-emerald-500/60" />
                            Core Status: OPTIMIZED
                        </span>
                        <span className="w-[1.5px] h-4 bg-white/5 md:block hidden" />
                        <span>Sector: GRID_ADM_V4</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.8em] text-center font-bold">
                        Secure Root Access Point • Clae Core Deployment
                    </span>
                </footer>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.2);
                }
            `}</style>
        </div>
    );
}
