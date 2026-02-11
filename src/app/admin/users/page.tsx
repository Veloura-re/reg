"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { GlassCard } from "@/components/GlassCard";
import {
    Users,
    UserPlus,
    Shield,
    Trash2,
    ArrowLeft,
    Check,
    X,
    Mail,
    Lock,
    ShieldCheck,
    Scan,
    Search,
    ChevronRight,
    Loader2,
    Activity,
    Zap,
    Key,
    User,
    LogOut,
    Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "registrar"
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [school, setSchool] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }

        if (status === "authenticated") {
            if ((session?.user as any).role !== "super_admin") {
                router.push("/admin/dashboard");
                return;
            }
            fetchAdmins();
            fetchSchool();
        }
    }, [status, router, session]);

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

    const fetchAdmins = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (res.ok) {
                setAdmins(data);
            }
        } catch (err) {
            console.error("Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setShowAddForm(false);
                setFormData({ name: "", email: "", password: "", role: "registrar" });
                fetchAdmins();
            } else {
                setError(data.error || "Failed to create user");
            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setSubmitting(false);
        }
    };

    const copyRegistrationLink = async () => {
        if (!school?.slug) return;
        const url = `${window.location.protocol}//${window.location.host}/${school.slug}/register`;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
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

    const handleDelete = async (id: string) => {
        if (!confirm("Confirm personnel decommissioning? This action is permanent.")) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchAdmins();
            }
        } catch (err) {
            console.error("Delete error");
        }
    };

    const filteredAdmins = useMemo(() => {
        return admins.filter(admin =>
            admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [admins, searchTerm]);

    if (status === "loading" || (status === "authenticated" && loading)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-navy/5 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="text-navy/40 text-[10px] uppercase font-black tracking-[0.5em] animate-pulse">Scanning Personnel Grid</p>
            </div>
        );
    }

    if (!session || (session.user as any).role !== "super_admin") return null;

    return (
        <div className="min-h-screen bg-white text-navy selection:bg-emerald-500/30 p-4 md:p-8">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-emerald-500/[0.02] blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-gold/[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                {/* Navigation & Header */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/dashboard">
                            <button className="p-4 bg-white border border-navy/5 hover:border-emerald-500/20 rounded-2xl text-navy/40 hover:text-navy transition-all group shadow-sm">
                                <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-medium tracking-tight text-navy">
                                Personnel <span className="text-emerald-500 font-bold">Clearance</span>
                            </h1>
                            <div className="flex items-center gap-3 text-[10px] text-navy/40 font-black uppercase tracking-[0.5em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                NODE ACCESS GRANTED
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
                            <input
                                placeholder="SEARCH IDENTITY..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full lg:w-72 bg-white border border-navy/5 rounded-2xl py-4 pl-12 pr-4 text-navy placeholder:text-navy/20 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-[11px] uppercase tracking-widest shadow-sm"
                            />
                        </div>
                        {school?.slug && (
                            <>
                                <Link href={`/${school.slug}/register`}>
                                    <button className="px-5 py-4 bg-white border border-navy/5 hover:border-navy/10 rounded-2xl text-navy/60 hover:text-navy text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
                                        Public Gateway
                                    </button>
                                </Link>
                                <button
                                    onClick={copyRegistrationLink}
                                    className="px-5 py-4 bg-white border border-navy/5 hover:border-navy/10 rounded-2xl text-navy/60 hover:text-navy text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={16} className="text-emerald-500" />
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
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
                        >
                            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                            <span>Authorize New Node</span>
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <GlassCard className="p-0 bg-white border-navy/5 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-navy/[0.02] border-b border-navy/5">
                                    <th className="px-8 py-6 text-[10px] font-black text-navy/40 uppercase tracking-[0.4em]">Officer Identity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-navy/40 uppercase tracking-[0.4em]">Clearance Tier</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-navy/40 uppercase tracking-[0.4em]">Registry Origin</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-navy/40 uppercase tracking-[0.4em] text-right">Directives</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy/5">
                                {filteredAdmins.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-40 text-center text-navy/20 font-black text-[10px] uppercase tracking-[0.5em]">
                                            NULL SET DETECTED IN PERSONNEL GRID
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAdmins.map((admin, i) => (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={admin.id}
                                            className="group hover:bg-emerald-500/[0.02] transition-all"
                                        >
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-white border border-navy/5 flex items-center justify-center text-emerald-500 group-hover:border-emerald-500/20 transition-all font-mono text-lg shadow-sm">
                                                        {admin.name.charAt(0)}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[15px] text-navy font-semibold tracking-tight uppercase">{admin.name}</p>
                                                        <p className="text-[10px] text-navy/40 font-black uppercase tracking-widest">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2.5 rounded-xl bg-white border ${admin.role === 'super_admin' ? 'text-emerald-500 border-emerald-500/20 shadow-sm' : 'text-navy/20 border-navy/5'
                                                        } group-hover:scale-110 transition-transform`}>
                                                        {admin.role === 'super_admin' ? <ShieldCheck size={20} /> : <Shield size={20} />}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${admin.role === 'super_admin' ? 'text-emerald-600' : 'text-navy/40'
                                                        }`}>
                                                        {admin.role.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="space-y-1">
                                                    <p className="text-[11px] text-navy/60 font-black tracking-widest uppercase">
                                                        {new Date(admin.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[9px] text-navy/20 uppercase tracking-[0.4em] font-black">STABLE_NODE_SYNC</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                {admin.email !== session?.user?.email ? (
                                                    <button
                                                        onClick={() => handleDelete(admin.id)}
                                                        className="p-2.5 bg-white hover:bg-red-500/5 border border-navy/5 hover:border-red-500/10 rounded-xl text-navy/20 hover:text-red-500 transition-all shadow-sm"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                ) : (
                                                    <span className="text-[9px] text-emerald-500/40 font-black uppercase tracking-[0.4em] pr-2">Master Active</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>

                {/* Footer Section */}
                <footer className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.5em] text-navy/20 font-black pt-8 border-t border-navy/5">
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-3">
                            <Activity size={14} className="text-emerald-500" />
                            Nodes Online: {admins.length}
                        </span>
                        <span className="w-[1px] h-3 bg-navy/10 md:block hidden" />
                        <span>Sector: Personnel_Gamma</span>
                    </div>
                    <span>Authorized Personnel Only</span>
                </footer>
            </div>

            {/* Add User Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddForm(false)}
                            className="absolute inset-0 bg-navy/20 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 40 }}
                            className="relative w-full max-w-xl z-10"
                        >
                            <GlassCard className="p-10 bg-white border-navy/10 shadow-3xl rounded-[3rem] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.01] to-transparent pointer-events-none" />

                                <form onSubmit={handleAddUser} className="space-y-10 relative z-10">
                                    <div className="text-center space-y-4">
                                        <div className="w-20 h-20 mx-auto rounded-[2rem] bg-white border border-navy/5 flex items-center justify-center group-hover:border-emerald-500/20 transition-all duration-700 shadow-sm">
                                            <UserPlus size={36} className="text-emerald-500 group-hover:scale-110 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-4xl font-light text-navy tracking-tighter">Provision Personnel</h2>
                                            <p className="text-[10px] text-navy/30 uppercase tracking-[0.5em] font-black">Initialize Identity Synchronization</p>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-600 text-[10px] uppercase font-black tracking-[0.3em] text-center"
                                        >
                                            Synchronization Failure: {error}
                                        </motion.div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1">Identity Tag</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="FULL_LEGAL_IDENTITY"
                                                className="w-full bg-white border border-navy/5 rounded-2xl py-5 px-6 text-navy placeholder:text-navy/20 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-[11px] uppercase tracking-widest shadow-sm"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1">Relay Connection (Email)</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="IDENTITY@CORE.SYSTEM"
                                                className="w-full bg-white border border-navy/5 rounded-2xl py-5 px-6 text-navy placeholder:text-navy/20 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-[11px] uppercase tracking-widest shadow-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1">Access Pass (Password)</label>
                                                <input
                                                    required
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="••••••••"
                                                    className="w-full bg-white border border-navy/5 rounded-2xl py-5 px-6 text-navy placeholder:text-navy/20 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-[11px] uppercase tracking-widest shadow-sm"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1">Clearance Tier</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.role}
                                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                        className="w-full bg-white border border-navy/5 rounded-2xl py-5 px-6 text-navy/70 focus:outline-none focus:border-emerald-500/40 transition-all appearance-none text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer shadow-sm pr-10"
                                                    >
                                                        <option value="registrar">Registrar Node</option>
                                                        <option value="viewer">Audit Viewer</option>
                                                        <option value="super_admin">Super Admin</option>
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/20 rotate-90 pointer-events-none" size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="flex-1 py-5 bg-white border border-navy/5 hover:border-navy/10 text-navy/30 hover:text-navy/70 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all active:scale-95 shadow-sm"
                                        >
                                            Abort Link
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group/submit"
                                        >
                                            {submitting ? <Loader2 className="animate-spin" size={18} /> : (
                                                <>
                                                    <Zap size={16} className="group-hover:scale-110 transition-transform" />
                                                    <span>Authorize Provisioning</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
