"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Plus, Trash2, Edit2, Users, BookOpen, Loader2, X, Save, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClassesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [classes, setClasses] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingClass, setEditingClass] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", gradeId: "", description: "", capacity: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }
        if (status === "authenticated") {
            fetchClasses();
            fetchGrades();
        }
    }, [status, router]);

    const fetchGrades = async () => {
        try {
            const res = await fetch("/api/admin/grades");
            const data = await res.json();
            if (res.ok) {
                setGrades(data);
            }
        } catch (err) {
            console.error("Failed to fetch grades");
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await fetch("/api/admin/classes");
            const data = await res.json();
            if (res.ok) {
                setClasses(data);
            }
        } catch (err) {
            console.error("Failed to fetch classes");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingClass ? `/api/admin/classes/${editingClass.id}` : "/api/admin/classes";
            const method = editingClass ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchClasses();
                setShowAddForm(false);
                setEditingClass(null);
                setFormData({ name: "", gradeId: "", description: "", capacity: "" });
            }
        } catch (err) {
            console.error("Failed to save class");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/classes/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchClasses();
            }
        } catch (err) {
            console.error("Failed to delete class");
        }
    };

    const handleEdit = (cls: any) => {
        setEditingClass(cls);
        setFormData({
            name: cls.name,
            gradeId: cls.gradeId || "",
            description: cls.description || "",
            capacity: cls.capacity?.toString() || ""
        });
        setShowAddForm(true);
    };

    if (loading || status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col gap-6 bg-white">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-navy/5 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-emerald-500 rounded-full animate-spin" />
                    <GraduationCap className="absolute inset-x-0 inset-y-0 m-auto text-emerald-500/60 animate-pulse" size={28} />
                </div>
                <p className="text-navy/40 text-[10px] uppercase font-black tracking-[0.5em] animate-pulse">Synchronizing Class Hub...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-navy selection:bg-emerald-500/30 p-4 md:p-8">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-emerald-500/[0.02] blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-gold/[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/dashboard">
                            <button className="p-4 bg-white border border-navy/5 hover:border-emerald-500/20 rounded-2xl text-navy/40 hover:text-navy transition-all group shadow-sm">
                                <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-medium tracking-tight text-navy">
                                Class <span className="text-emerald-500 font-bold">Registry</span>
                            </h1>
                            <div className="flex items-center gap-3 text-[10px] text-navy/40 font-black uppercase tracking-[0.5em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                NODE ACCESS GRANTED
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/admin/grades">
                            <button className="px-6 py-4 bg-white border border-navy/5 hover:border-navy/10 rounded-2xl text-navy/60 hover:text-navy font-black text-[11px] uppercase tracking-widest transition-all shadow-sm">
                                Structure Hub
                            </button>
                        </Link>
                        <button
                            onClick={() => {
                                setEditingClass(null);
                                setFormData({ name: "", gradeId: "", description: "", capacity: "" });
                                setShowAddForm(true);
                            }}
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
                        >
                            <Plus size={18} className="group-hover:scale-110 transition-transform" />
                            <span>Initialize Class</span>
                        </button>
                    </div>
                </header>

                {/* Add/Edit Form Modal */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowAddForm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-2xl"
                            >
                                <GlassCard className="p-10 bg-white border-navy/10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.01] to-transparent pointer-events-none" />
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-navy/5 flex items-center justify-center shadow-sm">
                                                <GraduationCap className="text-emerald-500" size={28} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-light text-navy">
                                                    {editingClass ? "Modify Class" : "Initialize Class"}
                                                </h2>
                                                <p className="text-[10px] text-navy/40 uppercase tracking-[0.3em] font-black mt-1">
                                                    ACADEMIC NODE CONFIGURATION
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowAddForm(false)}
                                            className="p-3 bg-navy/5 hover:bg-red-500/5 border border-navy/5 hover:border-red-500/10 rounded-xl text-navy/40 hover:text-red-500 transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div className="space-y-4 group/field">
                                            <label className="text-[11px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1">
                                                Class Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="GRADE 9A"
                                                className="w-full bg-white border border-navy/5 rounded-2xl py-5 px-6 text-navy placeholder:text-navy/20 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-sm tracking-widest shadow-sm uppercase"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-4 group/field">
                                            <label className="text-[11px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1">
                                                Grade Level *
                                            </label>
                                            {grades.length === 0 ? (
                                                <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-4 shadow-sm">
                                                    <p className="text-xs text-amber-500/60 font-mono tracking-wider">
                                                        Warning: No grade levels detected in registry.
                                                    </p>
                                                    <Link href="/admin/grades">
                                                        <button type="button" className="text-[10px] text-amber-600 hover:text-amber-700 font-black uppercase tracking-widest flex items-center gap-2">
                                                            <Plus size={14} /> Initialize Grade Structure
                                                        </button>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {grades.map((g) => (
                                                        <button
                                                            key={g.id}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, gradeId: g.id })}
                                                            className={`py-4 px-2 rounded-xl border transition-all text-[11px] font-black uppercase truncate ${formData.gradeId === g.id
                                                                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                                                                : "bg-white border-navy/5 text-navy/40 hover:text-navy hover:border-navy/10 shadow-sm"
                                                                }`}
                                                        >
                                                            {g.level}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4 group/field">
                                            <label className="text-[11px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="SCIENCE TRACK WITH ADVANCED MATHEMATICS..."
                                                className="w-full h-32 bg-white border border-navy/5 rounded-2xl p-6 text-navy placeholder:text-navy/20 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-sm tracking-wide shadow-sm"
                                            />
                                        </div>

                                        <div className="space-y-4 group/field">
                                            <label className="text-[11px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1">
                                                Capacity (Optional)
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.capacity}
                                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                                placeholder="30"
                                                className="w-full bg-white border border-navy/5 rounded-2xl py-5 px-6 text-navy placeholder:text-navy/20 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-sm tracking-widest shadow-sm"
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddForm(false)}
                                                className="flex-1 px-6 py-4 bg-white border border-navy/10 rounded-xl text-navy/60 hover:text-navy text-[11px] font-black uppercase tracking-widest transition-all shadow-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting || grades.length === 0}
                                                className="flex-1 px-6 py-4 bg-emerald-500 text-white rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={18} />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save size={18} />
                                                        {editingClass ? "Update Node" : "Confirm Entry"}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </GlassCard>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Classes Grid */}
                {classes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="p-8 bg-navy/[0.01] rounded-3xl border border-navy/5 shadow-sm">
                            <BookOpen className="text-navy/10" size={64} />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-xl text-navy/40 font-light">No classes registered yet</p>
                            <p className="text-[10px] text-navy/20 uppercase tracking-[0.4em] font-black">Initialize your first academic node</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => (
                            <GlassCard key={cls.id} className="p-8 bg-white border-navy/5 hover:border-emerald-500/20 transition-all duration-500 group relative shadow-sm overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-navy/5 flex items-center justify-center group-hover:border-emerald-500/20 transition-all shadow-sm">
                                            <GraduationCap className="text-emerald-500/60 group-hover:text-emerald-500" size={22} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(cls)}
                                            className="p-2 bg-white hover:bg-emerald-500/5 border border-navy/5 hover:border-emerald-500/10 rounded-lg text-navy/30 hover:text-emerald-600 transition-all shadow-sm"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cls.id)}
                                            className="p-2 bg-white hover:bg-red-500/5 border border-navy/5 hover:border-red-500/10 rounded-lg text-navy/30 hover:text-red-500 transition-all shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-light text-navy tracking-tight uppercase group-hover:translate-x-1 transition-transform">{cls.name}</h3>
                                            <span className="px-3 py-1 bg-white border border-navy/5 rounded-lg text-[10px] font-black text-emerald-600 uppercase tracking-widest truncate max-w-[100px] shadow-sm">
                                                {cls.grade}
                                            </span>
                                        </div>
                                        {cls.description && (
                                            <p className="text-xs text-navy/40 leading-relaxed line-clamp-2">{cls.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6 pt-4 border-t border-navy/5">
                                        <div className="flex items-center gap-2">
                                            <Users className="text-emerald-500/40" size={16} />
                                            <span className="text-sm text-navy/60 font-semibold">
                                                {cls._count?.applications || 0}
                                                {cls.capacity && <span className="text-navy/20 font-light"> / {cls.capacity}</span>}
                                            </span>
                                        </div>
                                        {cls.capacity && (
                                            <div className="flex-1">
                                                <div className="h-1.5 bg-navy/5 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className="h-full bg-emerald-500/40 rounded-full transition-all group-hover:bg-emerald-500/60"
                                                        style={{ width: `${Math.min(((cls._count?.applications || 0) / cls.capacity) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}

                <footer className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.5em] text-navy/20 font-black pt-12 border-t border-navy/5">
                    <div className="flex items-center gap-4">
                        <span className="text-emerald-500/40">NODE ACTIVE</span>
                        <span className="w-1.5 h-[1px] bg-navy/10" />
                        <span>System Load: {classes.length} Registry Objects</span>
                    </div>
                    <span>© 2026 ACADEMIC NERVE CENTER</span>
                </footer>
            </div>
        </div>
    );
}
