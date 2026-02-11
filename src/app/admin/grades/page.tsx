"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Plus, Trash2, Edit2, Loader2, X, Save, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GradesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [grades, setGrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingGrade, setEditingGrade] = useState<any>(null);
    const [formData, setFormData] = useState({ level: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }
        if (status === "authenticated") {
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
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = editingGrade ? `/api/admin/grades/${editingGrade.id}` : "/api/admin/grades";
            const method = editingGrade ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                fetchGrades();
                setShowAddForm(false);
                setEditingGrade(null);
                setFormData({ level: "" });
            } else {
                const error = await res.json();
                alert(error.details || error.error || "Failed to save grade");
            }
        } catch (err: any) {
            console.error("Failed to save grade", err);
            alert("Protocol Error: " + (err.message || "Unknown client error"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this grade level? This will only work if no classes are assigned to it.")) return;

        try {
            const res = await fetch(`/api/admin/grades/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchGrades();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to delete grade");
            }
        } catch (err) {
            console.error("Failed to delete grade");
        }
    };

    const handleEdit = (grade: any) => {
        setEditingGrade(grade);
        setFormData({
            level: grade.level
        });
        setShowAddForm(true);
    };

    if (loading || status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col gap-6 bg-white">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-navy/5 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-emerald-500 rounded-full animate-spin" />
                    <Layers className="absolute inset-x-0 inset-y-0 m-auto text-emerald-500/60 animate-pulse" size={28} />
                </div>
                <p className="text-navy/40 text-[10px] uppercase font-black tracking-[0.5em] animate-pulse">Accessing Grade Matrix...</p>
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
                                Grade <span className="text-emerald-500 font-bold">Structure</span>
                            </h1>
                            <div className="flex items-center gap-3 text-[10px] text-navy/40 font-black uppercase tracking-[0.5em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Custom Level Architecture
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setEditingGrade(null);
                            setFormData({ level: "" });
                            setShowAddForm(true);
                        }}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
                    >
                        <Plus size={18} className="group-hover:scale-110 transition-transform" />
                        <span>Register New Grade</span>
                    </button>
                </header>

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
                                className="w-full max-w-lg"
                            >
                                <GlassCard className="p-10 bg-white border-navy/10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.01] to-transparent pointer-events-none" />
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-navy/5 flex items-center justify-center shadow-sm">
                                                <Layers className="text-emerald-500" size={28} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-light text-navy">
                                                    {editingGrade ? "Modify Grade" : "Initialize Grade"}
                                                </h2>
                                                <p className="text-[10px] text-navy/40 uppercase tracking-[0.3em] font-black mt-1">
                                                    LEVEL CLASSIFICATION NODE
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
                                                Grade Level Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.level}
                                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                                placeholder="e.g., GRADE 1, YEAR 7, JS1..."
                                                className="w-full bg-white border border-navy/5 rounded-2xl py-5 px-6 text-navy placeholder:text-navy/20 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-sm tracking-widest shadow-sm uppercase"
                                                required
                                            />
                                            <p className="text-[10px] text-navy/20 font-black tracking-wider ml-1 uppercase">
                                                Standardizing Academic Hierarchy
                                            </p>
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
                                                disabled={submitting}
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
                                                        {editingGrade ? "Update Node" : "Confirm Entry"}
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

                {grades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="p-8 bg-navy/[0.01] rounded-3xl border border-navy/5 shadow-sm">
                            <Layers className="text-navy/10" size={64} />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-xl text-navy/40 font-light">No custom grades defined</p>
                            <p className="text-[10px] text-navy/20 uppercase tracking-[0.4em] font-black">Build your academic hierarchy from scratch</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {grades.map((grade) => (
                            <GlassCard key={grade.id} className="p-6 bg-white border-navy/5 hover:border-emerald-500/20 transition-all duration-500 group relative shadow-sm overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.01] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-navy/5 flex items-center justify-center group-hover:border-emerald-500/20 transition-all shadow-sm">
                                            <span className="text-[10px] font-black text-emerald-500/60 uppercase group-hover:text-emerald-500">LVL</span>
                                        </div>
                                        <h3 className="text-lg font-light text-navy tracking-tight uppercase group-hover:translate-x-1 transition-transform">{grade.level}</h3>
                                    </div>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(grade)}
                                            className="p-2 hover:bg-emerald-500/5 rounded-lg text-navy/20 hover:text-emerald-600 transition-all"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(grade.id)}
                                            className="p-2 hover:bg-red-500/5 rounded-lg text-navy/20 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}

                <footer className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.5em] text-navy/20 font-black pt-12 border-t border-navy/5">
                    <div className="flex items-center gap-4">
                        <span className="text-emerald-500/40">HIERARCHY ENGINE ACTIVE</span>
                        <span className="w-1.5 h-[1px] bg-navy/10" />
                        <span>System Load: {grades.length} Level Nodes</span>
                    </div>
                    <span>© 2026 ACADEMIC STRUCTURE PROTOCOL</span>
                </footer>
            </div>
        </div>
    );
}
