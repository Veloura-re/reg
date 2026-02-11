"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { School, CheckCircle, Copy, Shield, Users, Activity, Router, Globe, Lock, Cpu, Zap, Signal, ArrowLeft, Save, Loader2, Info, Mail, Phone, MapPin, Link2, FileText, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SettingsPage() {
    const [school, setSchool] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        description: "",
        logoUrl: ""
    });

    useEffect(() => {
        fetch("/api/admin/my-school")
            .then(res => res.json())
            .then(data => {
                setSchool(data);
                if (data && !data.error) {
                    setFormData({
                        name: data.name || "",
                        address: data.address || "",
                        phone: data.phone || "",
                        email: data.email || "",
                        website: data.website || "",
                        description: data.description || "",
                        logoUrl: data.logoUrl || ""
                    });
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const copyLink = async () => {
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaveSuccess(false);
        try {
            const res = await fetch("/api/admin/my-school", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const updated = await res.json();
                setSchool(updated);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen flex-col gap-6 bg-white">
            <div className="relative">
                <div className="w-16 h-16 border-2 border-navy/5 rounded-full" />
                <div className="absolute inset-0 border-2 border-t-emerald-500 rounded-full animate-spin" />
                <Cpu className="absolute inset-x-0 inset-y-0 m-auto text-emerald-500 animate-pulse" size={28} />
            </div>
            <p className="text-navy/40 text-[10px] uppercase font-black tracking-[0.5em] animate-pulse">Initializing System Config...</p>
        </div>
    );

    if (!school || school.error) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-white">
            <div className="p-6 bg-red-500/5 rounded-[2.5rem] border border-red-500/10 shadow-sm">
                <Signal className="text-red-500 animate-pulse" size={40} />
            </div>
            <div className="text-center space-y-4">
                <p className="text-navy font-semibold text-base tracking-tight uppercase">
                    {school?.message || "Critical Error: Core node inaccessible."}
                </p>
                <p className="text-red-500/60 text-[10px] uppercase font-black tracking-[0.4em]">Verify administrative credentials</p>
            </div>
        </div>
    );

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
                                System <span className="text-emerald-500 font-bold">Configuration</span>
                            </h1>
                            <div className="flex items-center gap-3 text-[10px] text-navy/40 font-black uppercase tracking-[0.5em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Optimized Operational Node
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-5 text-[10px] text-navy/20 uppercase tracking-[0.5em] font-black mr-4">
                            <span className="text-emerald-500 font-black">Status: SECURE</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-navy/5" />
                            <span>Node: {school.slug?.toUpperCase() || "UNK_NODE"}</span>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-4 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                                    <span>{saveSuccess ? "Synchronized" : "Commit Changes"}</span>
                                </>
                            )}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Gate Connection */}
                            <GlassCard className="p-10 space-y-10 bg-white border-navy/5 hover:border-emerald-500/20 transition-all duration-700 group relative shadow-sm">
                                <div className="flex items-center gap-6 border-b border-navy/5 pb-10 relative z-10">
                                    <div className="w-16 h-16 rounded-[2rem] bg-white border border-navy/5 flex items-center justify-center shadow-sm group-hover:border-emerald-500/20 transition-colors">
                                        <Shield className="text-emerald-500" size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-light text-navy tracking-tight">Access Link</h2>
                                        <p className="text-[10px] text-navy/30 uppercase tracking-[0.3em] font-black">Public Registry Handshake</p>
                                    </div>
                                </div>

                                <div className="space-y-10 relative z-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 text-emerald-500">
                                            <Signal size={16} className="animate-pulse" />
                                            <p className="text-[10px] uppercase tracking-[0.5em] font-black">Broadcast Relay Active</p>
                                        </div>
                                        <p className="text-[15px] text-navy/40 leading-relaxed font-semibold uppercase tracking-wider">
                                            Distribute this secure link to initiate applicant enrollment. Primary gateway for outside connections.
                                        </p>
                                    </div>

                                    <div className="p-2 pl-8 bg-white border border-navy/5 rounded-[2.5rem] flex items-center justify-between gap-6 shadow-sm hover:border-emerald-500/20 transition-all group/link">
                                        <div className="flex items-center gap-5 min-w-0">
                                            <Lock size={16} className="text-navy/10 shrink-0" />
                                            <code className="text-sm text-emerald-600 font-mono truncate py-6 tracking-tighter uppercase font-black">
                                                {typeof window !== 'undefined' ? `${window.location.host}/${school.slug}/register` : `.../${school.slug}/register`}
                                            </code>
                                        </div>
                                        <button
                                            onClick={copyLink}
                                            className="p-6 bg-emerald-500 hover:bg-emerald-400 text-white rounded-[1.8rem] transition-all shadow-lg shadow-emerald-500/20 active:scale-90 shrink-0"
                                        >
                                            {copied ? <CheckCircle size={28} /> : <Copy size={28} />}
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Node Identity Core */}
                            <GlassCard className="p-10 space-y-10 bg-white border-navy/5 hover:border-emerald-500/20 transition-all duration-700 group overflow-hidden relative shadow-sm lg:row-span-2">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/[0.01] blur-[120px] rounded-full pointer-events-none" />

                                <div className="flex items-center gap-6 border-b border-navy/5 pb-10 relative z-10">
                                    <div className="w-16 h-16 rounded-[2rem] bg-white border border-navy/5 flex items-center justify-center shadow-sm group-hover:border-emerald-500/20 transition-colors">
                                        <School className="text-emerald-500" size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-light text-navy tracking-tight">Identity Core</h2>
                                        <p className="text-[10px] text-navy/30 uppercase tracking-[0.3em] font-black">Primary Institutional Metadata</p>
                                    </div>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <SettingsInput
                                        label="Institutional Name"
                                        icon={School}
                                        value={formData.name}
                                        onChange={(v: string) => setFormData({ ...formData, name: v })}
                                        placeholder="RIVERSIDE HIGH SCHOOL"
                                    />

                                    <div className="space-y-4">
                                        <label className="text-[10px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1 flex items-center gap-2">
                                            <FileText size={14} className="text-emerald-500" />
                                            Node Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="DESCRIBE INSTITUTIONAL DIRECTIVES..."
                                            className="w-full h-40 bg-white border border-navy/5 rounded-[2.5rem] p-8 text-[11px] text-navy placeholder:text-navy/10 focus:outline-none focus:border-emerald-500/40 transition-all font-mono tracking-widest font-black uppercase leading-relaxed shadow-sm"
                                        />
                                    </div>

                                    <SettingsInput
                                        label="Corporate Registry Hash (Slug)"
                                        icon={Globe}
                                        value={school.slug}
                                        disabled
                                        placeholder="/node-slug"
                                    />

                                    <SettingsInput
                                        label="Asset Vector (Logo URL)"
                                        icon={ImageIcon}
                                        value={formData.logoUrl}
                                        onChange={(v: string) => setFormData({ ...formData, logoUrl: v })}
                                        placeholder="https://cloud.assets/logo.png"
                                    />
                                </div>
                            </GlassCard>

                            {/* Physical & Comms Node */}
                            <GlassCard className="p-10 space-y-10 bg-white border-navy/5 hover:border-emerald-500/20 transition-all duration-700 group relative shadow-sm">
                                <div className="flex items-center gap-6 border-b border-navy/5 pb-10 relative z-10">
                                    <div className="w-16 h-16 rounded-[2rem] bg-white border border-navy/5 flex items-center justify-center shadow-sm group-hover:border-emerald-500/20 transition-colors">
                                        <MapPin className="text-emerald-500" size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-light text-navy tracking-tight">Access Points</h2>
                                        <p className="text-[10px] text-navy/30 uppercase tracking-[0.3em] font-black">Physical & Digital Vectors</p>
                                    </div>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <SettingsInput
                                        label="Physical Coordinates"
                                        icon={MapPin}
                                        value={formData.address}
                                        onChange={(v: string) => setFormData({ ...formData, address: v })}
                                        placeholder="123 MAPLE AVE, RIVERSIDE"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <SettingsInput
                                            label="Comms Relay (Phone)"
                                            icon={Phone}
                                            value={formData.phone}
                                            onChange={(v: string) => setFormData({ ...formData, phone: v })}
                                            placeholder="+251 ..."
                                        />
                                        <SettingsInput
                                            label="Secure Encryption (Email)"
                                            icon={Mail}
                                            value={formData.email}
                                            onChange={(v: string) => setFormData({ ...formData, email: v })}
                                            placeholder="contact@riverside.edu"
                                        />
                                    </div>

                                    <SettingsInput
                                        label="Digital Mirror (Website)"
                                        icon={Link2}
                                        value={formData.website}
                                        onChange={(v: string) => setFormData({ ...formData, website: v })}
                                        placeholder="https://riverside.edu"
                                    />
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>

                {/* Telemetry Grid */}
                <div className="space-y-10">
                    <div className="flex items-center gap-4 px-2">
                        <Activity size={18} className="text-emerald-500" />
                        <h3 className="text-[10px] text-navy/40 uppercase tracking-[0.6em] font-black">Node Telemetry Overview</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "Applicants", value: school._count?.applications || 0, icon: Users, color: "text-blue-600" },
                            { label: "Admin Nodes", value: school._count?.admins || 0, icon: Shield, color: "text-emerald-600" },
                            { label: "Core Status", value: "Operational", icon: Activity, color: "text-emerald-500" },
                            { label: "Integrity", value: "99.99%", icon: Zap, color: "text-gold" }
                        ].map((stat, i) => (
                            <GlassCard key={i} className="p-8 bg-white border-navy/5 hover:border-emerald-500/20 group transition-all duration-500 shadow-sm">
                                <div className="flex justify-between items-start mb-10">
                                    <div className={`p-3.5 rounded-2xl bg-white border border-navy/5 ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <p className="text-[9px] font-black text-navy/10 uppercase tracking-[0.4em]">SEC_NODE_0{i + 1}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-4xl font-light text-navy tracking-tighter">{stat.value}</p>
                                    <p className="text-[10px] text-navy/30 uppercase tracking-[0.3em] font-black">{stat.label}</p>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                <footer className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.6em] text-navy/20 font-black pt-12 border-t border-navy/5">
                    <div className="flex items-center gap-4">
                        <span className="text-emerald-500">Authorized Deployment</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-navy/5" />
                        <span>Visionary OS Core v4.2</span>
                    </div>
                    <span>© 2026 Core Protocols</span>
                </footer>
            </div>
        </div>
    );
}

const SettingsInput = ({ label, value, onChange, icon: Icon, placeholder, disabled }: any) => (
    <div className="space-y-4 group/input">
        <label className="text-[10px] text-navy/30 uppercase tracking-[0.4em] font-black ml-1 flex items-center gap-2">
            <Icon size={14} className="text-emerald-500 group-focus-within/input:text-emerald-600 transition-colors" />
            {label}
        </label>
        <div className="relative">
            <input
                disabled={disabled}
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-white border border-navy/5 rounded-2xl py-6 px-8 text-navy placeholder:text-navy/10 focus:outline-none focus:border-emerald-500/40 transition-all font-mono text-[11px] tracking-widest font-black uppercase shadow-sm ${disabled ? 'opacity-40 cursor-not-allowed' : 'group-hover/input:border-navy/10'}`}
            />
            {disabled && <Lock size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-navy/10" />}
        </div>
    </div>
);
