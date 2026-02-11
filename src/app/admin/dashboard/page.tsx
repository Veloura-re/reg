"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import {
    Users,
    Clock,
    CheckCircle,
    XCircle,
    MoreVertical,
    Search,
    Filter,
    LogOut,
    Bell,
    Settings,
    ShieldCheck,
    MessageSquare,
    ChevronRight,
    Menu,
    FileText,
    Activity,
    Database,
    Zap,
    Download,
    Eye,
    Plus,
    X,
    Copy,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [school, setSchool] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }

        if (status === "authenticated") {
            fetchApplications();
            fetchSchool();
        }
    }, [status, router]);

    const fetchSchool = async () => {
        try {
            const res = await fetch("/api/admin/my-school");
            const data = await res.json();
            if (res.ok && !data.error) {
                setSchool(data);
            }
        } catch (err) {
            console.error("Failed to fetch school");
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await fetch("/api/admin/applications");
            const data = await res.json();
            if (res.ok) {
                setApplications(data);
            }
        } catch (err) {
            console.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (appId: string, status?: string, notes?: string) => {
        setActionLoading(true);
        try {
            const body: any = {};
            if (status) body.status = status;
            body.notes = notes;

            const res = await fetch(`/api/admin/applications/${appId}/action`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                const updatedData = await res.json();
                // Refresh list
                const freshRes = await fetch("/api/admin/applications");
                const freshData = await freshRes.json();
                setApplications(freshData);

                if (selectedApp?.id === appId) {
                    const freshApp = freshData.find((a: any) => a.id === appId);
                    setSelectedApp(freshApp);
                }
            }
        } catch (err) {
            console.error("Action error");
        } finally {
            setActionLoading(false);
        }
    };

    const copyRegistrationLink = async () => {
        if (!school?.slug) return;
        const url = `${window.location.protocol}//${window.location.host}/${school.slug}/register`;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                // Fallback for non-secure contexts or older browsers
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const filteredApplications = useMemo(() => {
        return applications.filter((app) => {
            const matchesSearch =
                app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.parentPhone.includes(searchQuery);

            const matchesFilter = filter === "all" || app.status === filter;

            return matchesSearch && matchesFilter;
        });
    }, [applications, searchQuery, filter]);

    if (status === "loading" || (status === "authenticated" && loading)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-navy/5 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="text-navy/40 text-xs uppercase tracking-[0.4em] font-mono animate-pulse">Syncing Central Core</p>
            </div>
        );
    }

    if (!session) return null;

    const stats = [
        { label: "Active Protocols", value: applications.length.toString(), icon: Database, color: "text-emerald-600" },
        { label: "In Analysis", value: applications.filter(a => a.status === 'waiting').length.toString(), icon: Clock, color: "text-gold" },
        { label: "Authorized", value: applications.filter(a => a.status === 'approved').length.toString(), icon: CheckCircle, color: "text-emerald-500" },
        { label: "Flagged Nodes", value: applications.filter(a => a.status === 'on_hold').length.toString(), icon: Activity, color: "text-red-500" },
    ];

    return (
        <div className="min-h-screen bg-white text-navy p-4 md:p-8 selection:bg-emerald-500/30">
            {/* Ambient background glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.02] blur-[80px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/[0.02] blur-[80px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                {/* Header Section */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-navy/10 flex items-center justify-center shadow-sm group transition-all duration-500">
                            <Zap size={28} className="text-emerald-600 group-hover:scale-110" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-medium tracking-tight text-navy">
                                {(session.user as any).role === "super_admin" ? "Root" : "Officer"} <span className="text-emerald-600 font-bold">Command</span>
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-navy/20 font-mono uppercase tracking-[0.4em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Protocol Grid v4.2 • Stable
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {(session.user as any).role === "super_admin" && (
                            <Link href="/super-admin/dashboard">
                                <button className="px-5 py-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-[11px] font-black uppercase tracking-widest transition-all">
                                    Root Terminal
                                </button>
                            </Link>
                        )}
                        {school?.slug && (
                            <>
                                <Link href={`/${school.slug}/register`}>
                                    <button className="px-5 py-2.5 bg-white border border-navy/5 hover:border-emerald-500/40 rounded-xl text-navy/40 hover:text-navy text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
                                        Public Gateway
                                    </button>
                                </Link>
                                <button
                                    onClick={copyRegistrationLink}
                                    className="px-5 py-2.5 bg-white border border-navy/5 hover:border-emerald-500/40 rounded-xl text-navy/40 hover:text-navy text-[11px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={16} className="text-emerald-600" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            Copy Link
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                        <Link href="/admin/grades">
                            <button className="px-5 py-2.5 bg-white border border-navy/5 hover:border-emerald-500/40 rounded-xl text-navy/40 hover:text-navy text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
                                Grade Structure
                            </button>
                        </Link>
                        <Link href="/admin/users">
                            <button className="px-5 py-2.5 bg-white border border-navy/5 hover:border-emerald-500/40 rounded-xl text-navy/40 hover:text-navy text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
                                Personnel
                            </button>
                        </Link>
                        <button
                            onClick={() => setShowSignoutConfirm(true)}
                            className="p-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl text-red-500/40 hover:text-red-500 transition-all"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                        >
                            <GlassCard className="p-7 bg-white/70 border-navy/5 hover:border-emerald-500/20 group relative overflow-hidden shadow-sm">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center justify-between mb-5 relative z-10">
                                    <div className={`p-2.5 rounded-xl bg-white border border-navy/5 ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <Activity size={12} className="text-navy/5" />
                                </div>
                                <div className="space-y-1.5 relative z-10">
                                    <p className="text-4xl font-light text-navy tracking-tighter">{stat.value}</p>
                                    <p className="text-[11px] text-navy/40 uppercase tracking-[0.3em] font-black">{stat.label}</p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Data Terminal */}
                <div className="space-y-6">
                    {/* Controls Bar */}
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-white border border-navy/5 p-6 rounded-3xl backdrop-blur-xl shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.01] to-transparent pointer-events-none" />
                        <div className="relative w-full lg:max-w-md z-10">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 z-10">
                            {["all", "waiting", "under_review", "approved", "rejected", "on_hold"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === s
                                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                                        : "bg-white border-navy/5 text-navy/40 hover:text-navy hover:border-navy/10"
                                        }`}
                                >
                                    {s.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Applications Table */}
                    <GlassCard className="p-0 bg-white border-navy/5 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-navy/[0.02] border-b border-navy/5">
                                        <th className="px-8 py-6 text-[11px] font-black text-navy/40 uppercase tracking-[0.3em]">Identity Hub</th>
                                        <th className="px-8 py-6 text-[11px] font-black text-navy/40 uppercase tracking-[0.3em]">Institutional Node</th>
                                        <th className="px-8 py-6 text-[11px] font-black text-navy/40 uppercase tracking-[0.3em]">Cycle Origin</th>
                                        <th className="px-8 py-6 text-[11px] font-black text-navy/40 uppercase tracking-[0.3em] text-right">Status Terminal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy/5">
                                    {filteredApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-40 text-center text-navy/20 font-mono text-[11px] uppercase tracking-[0.5em]">
                                                Null set detected in current sector
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredApplications.map((app) => (
                                            <tr
                                                key={app.id}
                                                onClick={() => {
                                                    setSelectedApp(app);
                                                }}
                                                className="group hover:bg-navy/[0.01] transition-all cursor-pointer"
                                            >
                                                <td className="px-8 py-7">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-navy/5 flex items-center justify-center text-emerald-600/60 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all font-mono text-lg shadow-sm">
                                                            {app.studentName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[15px] text-navy font-semibold tracking-wide group-hover:translate-x-1 transition-transform">{app.studentName}</p>
                                                            <div className="flex items-center gap-2.5 mt-1.5">
                                                                <p className="text-[11px] text-navy/30 font-mono uppercase tracking-widest">{app.trackingCode}</p>
                                                                {app.priorityFlags?.length > 0 && (
                                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <p className="text-sm text-navy/70 font-semibold">{app.parentName}</p>
                                                    <p className="text-[11px] text-navy/30 font-mono mt-1.5 lowercase">{app.parentEmail}</p>
                                                </td>
                                                <td className="px-8 py-7">
                                                    <p className="text-[11px] text-navy/50 font-mono tracking-widest uppercase">
                                                        {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-7 text-right">
                                                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border bg-white shadow-sm ${app.status === 'approved' ? 'border-emerald-500/20 text-emerald-600' :
                                                        app.status === 'under_review' ? 'border-gold/20 text-gold' :
                                                            app.status === 'rejected' ? 'border-red-500/10 text-red-500/70' :
                                                                'border-navy/5 text-navy/40'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'approved' ? 'bg-emerald-500 animate-pulse' :
                                                            app.status === 'under_review' ? 'bg-gold' :
                                                                app.status === 'rejected' ? 'bg-red-500' :
                                                                    'bg-navy/10'
                                                            }`} />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">{app.status.replace('_', ' ')}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </div>

            <SidePanel
                selectedApp={selectedApp}
                onClose={() => setSelectedApp(null)}
                onAction={handleAction}
                actionLoading={actionLoading}
            />

            {/* Sign-Out Confirmation Modal */}
            <AnimatePresence>
                {showSignoutConfirm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSignoutConfirm(false)}
                            className="absolute inset-0 bg-navy/30 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white rounded-3xl p-10 shadow-2xl border border-navy/5 w-full max-w-md mx-4 space-y-8"
                        >
                            <div className="space-y-4 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center mx-auto">
                                    <LogOut size={28} className="text-red-500/60" />
                                </div>
                                <h3 className="text-2xl font-light text-navy tracking-tight">Sign Out</h3>
                                <p className="text-sm text-navy/40 font-light leading-relaxed">
                                    Are you sure you want to end your session? You will need to log in again to access the dashboard.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowSignoutConfirm(false)}
                                    className="flex-1 py-4 bg-white border border-navy/10 hover:border-navy/20 text-navy/60 hover:text-navy text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => signOut()}
                                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-95"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 26, 61, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.2);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}

const SidePanel = ({ selectedApp, onClose, onAction, actionLoading }: any) => {
    const [notes, setNotes] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (selectedApp) {
            setNotes(selectedApp.internalNotes || "");
            setActiveTab("overview");
        }
    }, [selectedApp]);

    if (!selectedApp) return null;

    return (
        <AnimatePresence>
            {selectedApp && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-navy/20 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 35, stiffness: 300 }}
                        className="relative w-full md:max-w-2xl bg-white border-l border-navy/10 h-full shadow-2xl flex flex-col will-change-transform"
                    >
                        <div className="flex flex-col h-full overflow-hidden">
                            {/* Side Panel Header */}
                            <div className="p-10 border-b border-navy/5 space-y-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.01] to-transparent pointer-events-none" />
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="px-4 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                        Priority Protocol Active
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-3 rounded-2xl bg-navy/5 text-navy/40 hover:text-navy transition-all hover:bg-navy/10"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <h2 className="text-5xl font-extralight tracking-tighter text-navy">{selectedApp.studentName}</h2>
                                    <div className="flex items-center gap-5 text-[11px] font-mono text-navy/40 uppercase tracking-[0.4em]">
                                        <span className="flex items-center gap-2">
                                            <Database size={14} className="text-emerald-500/60" />
                                            {selectedApp.trackingCode}
                                        </span>
                                        <span className="w-[1px] h-4 bg-navy/10" />
                                        <span className="flex items-center gap-2">
                                            <Zap size={14} className="text-gold/60" />
                                            Grade {selectedApp.studentGrade}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Tabs Navigation */}
                            <div className="px-10 border-b border-navy/5 flex gap-12 bg-white">
                                {[
                                    { id: "overview", label: "Core Data" },
                                    { id: "assets", label: "Digital Assets", badge: selectedApp.documents?.length },
                                    { id: "logs", label: "Protocol Logs" }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-6 text-[11px] font-black uppercase tracking-[0.3em] border-b-[2px] transition-all relative ${activeTab === tab.id ? "text-emerald-600 border-emerald-500" : "text-navy/40 border-transparent hover:text-navy/70"
                                            }`}
                                    >
                                        {tab.label}
                                        {tab.badge > 0 && (
                                            <span className="absolute -right-5 top-1/2 -translate-y-1/2 min-w-[20px] h-[20px] rounded-full bg-navy/5 border border-navy/5 flex items-center justify-center text-[10px] text-navy/60 font-mono">
                                                {tab.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Side Panel Content */}
                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
                                <AnimatePresence mode="wait">
                                    {activeTab === "overview" && (
                                        <motion.div
                                            key="overview"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-12"
                                        >
                                            {/* Status Display */}
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-7 rounded-3xl bg-white border border-navy/5 space-y-3 shadow-sm">
                                                    <p className="text-[10px] text-navy/40 uppercase tracking-[0.3em] font-black">Node Status</p>
                                                    <p className={`text-xl font-mono uppercase tracking-[0.2em] font-black ${selectedApp.status === 'approved' ? 'text-emerald-500' :
                                                        selectedApp.status === 'under_review' ? 'text-gold' :
                                                            'text-red-500/70'
                                                        }`}>
                                                        {selectedApp.status.replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <div className="p-7 rounded-3xl bg-white border border-navy/5 space-y-3 shadow-sm">
                                                    <p className="text-[10px] text-navy/40 uppercase tracking-[0.3em] font-black">Level Registry</p>
                                                    <p className="text-2xl text-navy font-light">Grade {selectedApp.studentGrade}</p>
                                                </div>
                                            </div>

                                            {/* Information Clusters */}
                                            <div className="space-y-8">
                                                <h3 className="text-[11px] text-emerald-600/60 font-black uppercase tracking-[0.5em] flex items-center gap-4">
                                                    <span className="w-12 h-[1px] bg-emerald-500/30" />
                                                    Identity Profile
                                                </h3>
                                                <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                                                    <DataField label="Personnel Name" value={selectedApp.studentName} />
                                                    <DataField label="Age Registry" value={selectedApp.dateOfBirth ? new Date(selectedApp.dateOfBirth).toLocaleDateString() : 'UNKNOWN'} />
                                                    <DataField label="Primary Guardian" value={selectedApp.parentName} />
                                                    <DataField label="Comms Relay" value={selectedApp.parentPhone} />
                                                    <div className="col-span-2">
                                                        <DataField label="Secure Encryption Path" value={selectedApp.parentEmail} mono />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <DataField label="Physical Coordinate Proxy" value={selectedApp.address || "NO ADDRESS ON RECORD"} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Logic */}
                                            <div className="space-y-8 pt-12 border-t border-navy/5">
                                                <h3 className="text-[11px] text-emerald-600/60 font-black uppercase tracking-[0.5em] flex items-center gap-4">
                                                    <span className="w-12 h-[1px] bg-emerald-500/30" />
                                                    Decision Terminal
                                                </h3>
                                                <div className="grid grid-cols-2 gap-5">
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => onAction(selectedApp.id, 'approved', notes)}
                                                        className="py-5 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        Authorize Protocol
                                                    </button>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => onAction(selectedApp.id, 'under_review', notes)}
                                                        className="py-5 bg-white border border-navy/10 hover:border-gold/30 text-navy/70 hover:text-gold text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-sm"
                                                    >
                                                        Analysis Loop
                                                    </button>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => onAction(selectedApp.id, 'on_hold', notes)}
                                                        className="py-5 bg-white border border-navy/10 hover:border-navy/30 text-navy/40 hover:text-navy text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-sm"
                                                    >
                                                        Suspend Node
                                                    </button>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => onAction(selectedApp.id, 'rejected', notes)}
                                                        className="py-5 bg-red-500/5 border border-red-500/10 hover:border-red-500/30 text-red-500/60 hover:text-red-500 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95 shadow-sm"
                                                    >
                                                        Terminal Purge
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === "assets" && (
                                        <motion.div
                                            key="assets"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-8"
                                        >
                                            {!selectedApp.documents?.length && (
                                                <div className="py-24 text-center space-y-6 border border-dashed border-navy/10 rounded-[2.5rem]">
                                                    <FileText size={48} className="text-navy/5 mx-auto" />
                                                    <p className="text-[11px] text-navy/20 uppercase tracking-[0.5em] font-mono italic">Sector empty of digital assets</p>
                                                </div>
                                            )}
                                            {selectedApp.documents?.map((doc: any) => (
                                                <div key={doc.id} className="group p-7 rounded-[2rem] bg-white border border-navy/5 hover:border-emerald-500/20 transition-all flex items-center justify-between shadow-sm">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-navy/5 border border-navy/5 flex items-center justify-center text-navy/40 group-hover:text-emerald-500 transition-colors shadow-sm">
                                                            <FileText size={24} />
                                                        </div>
                                                        <div>
                                                            <p className="text-base text-navy font-semibold group-hover:text-navy transition-colors">{doc.name}</p>
                                                            <p className="text-[11px] text-navy/30 font-mono mt-1 uppercase tracking-[0.2em]">ENCRYPTED DATA_PACK • PDF</p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        className="p-4 bg-white border border-navy/5 rounded-2xl text-navy/40 hover:text-emerald-600 hover:border-emerald-500/20 transition-all shadow-sm active:scale-90"
                                                    >
                                                        <Download size={20} />
                                                    </a>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {activeTab === "logs" && (
                                        <motion.div
                                            key="logs"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-10"
                                        >
                                            <div className="space-y-5">
                                                <p className="text-[10px] text-navy/50 uppercase tracking-[0.3em] font-black ml-1">Registry Annotation</p>
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="APPEND OBSERVATIONS TO SYSTEM LOG..."
                                                    className="w-full h-40 bg-white border border-navy/5 rounded-[2rem] p-7 text-sm text-navy placeholder:text-navy/10 focus:outline-none focus:border-emerald-500/40 transition-all font-mono tracking-widest leading-relaxed shadow-sm"
                                                />
                                                <button
                                                    disabled={actionLoading}
                                                    onClick={() => onAction(selectedApp.id, undefined, notes)}
                                                    className="w-full py-4 bg-white border border-navy/5 hover:border-navy/10 text-navy/60 hover:text-navy text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all shadow-sm"
                                                >
                                                    Synchronize Observations
                                                </button>
                                            </div>

                                            <div className="space-y-10 pt-10 border-t border-navy/5">
                                                <h3 className="text-[11px] text-navy/40 font-black uppercase tracking-[0.6em] text-center">Protocol Sequence Relay</h3>
                                                <div className="space-y-10">
                                                    {selectedApp.logs?.slice().reverse().map((log: any, i: number) => (
                                                        <div key={i} className="flex gap-8 group">
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-2 h-2 rounded-full bg-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]" />
                                                                <div className="w-[1px] flex-1 bg-navy/5 my-3" />
                                                            </div>
                                                            <div className="pb-10 space-y-3">
                                                                <p className="text-base text-navy/60 leading-relaxed font-light group-hover:text-navy/80 transition-colors uppercase tracking-wide">{log.details}</p>
                                                                <div className="flex items-center gap-3 text-[10px] font-mono text-navy/30 uppercase tracking-[0.3em]">
                                                                    <span className="text-emerald-600 font-black">{log.admin.name}</span>
                                                                    <span className="w-1.5 h-[1px] bg-navy/10" />
                                                                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const SearchInput = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue);
        }, 300);
        return () => clearTimeout(timer);
    }, [localValue, onChange]);

    return (
        <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder="SEARCH IDENTITY HASH..."
            className="w-full bg-white border border-navy/5 rounded-2xl py-4 pl-12 pr-4 text-navy placeholder-navy/20 focus:outline-none focus:border-emerald-500/40 transition-all text-[11px] font-mono tracking-widest uppercase shadow-sm"
        />
    );
};

const DataField = ({ label, value, mono }: { label: string, value: string, mono?: boolean }) => (
    <div className="space-y-2">
        <p className="text-[10px] text-navy/30 uppercase tracking-[0.3em] font-black">{label}</p>
        <p className={`text-base text-navy/90 font-light tracking-wide ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
    </div>
);
