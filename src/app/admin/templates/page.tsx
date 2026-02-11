"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import {
    ArrowLeft,
    Smartphone,
    Monitor,
    ChevronRight,
    Copy,
    Check,
    Users,
    Shield,
    MessageSquare,
    Zap,
    Cpu,
    Mail,
    Hash,
    Maximize2,
    Send,
    Edit3,
    Lock,
    Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TEMPLATES = [
    {
        id: "received",
        name: "Application Received",
        type: "Both",
        subject: "Safe Arrival: [Student Name]'s Enrollment Protocol",
        content: "Greetings [Parent Name],\n\nWe have successfully received the enrollment application for [Student Name] (Grade [Grade]).\n\nYour unique tracking code is: [Tracking Code].\n\nYou can monitor the status of this protocol at any time via our secure portal.\n\nInstitutional Regards,\nRiverside High School Admissions",
        sms: "Clae: Application received for [Student Name]. track at: [Portal URL]. Code: [Tracking Code]"
    },
    {
        id: "review",
        name: "Under Review",
        type: "Email",
        subject: "Protocol Update: [Student Name] - Under Evaluation",
        content: "Dear [Parent Name],\n\nThis is to inform you that [Student Name]'s enrollment application is now under official review by the Registrar's Office.\n\nNo further action is required at this time.\n\nInstitutional Regards,\nRiverside High School",
        sms: "Clae: [Student Name]'s application is now under review."
    },
    {
        id: "approved",
        name: "Admission Approved",
        type: "Both",
        subject: "Notice of Acceptance: [Student Name]",
        content: "Congratulations [Parent Name]!\n\nWe are pleased to inform you that [Student Name]'s application for Grade [Grade] has been APPROVED.\n\nPlease log in to the portal with your tracking code ([Tracking Code]) to complete the final registration steps.\n\nWelcome to Riverside High.\n\nInstitutional Regards,\nOffice of Enrollment",
        sms: "Congratulations! [Student Name] has been approved for admission. Finalize at: [Portal URL]"
    }
];

export default function AdminTemplatesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [viewMode, setViewMode] = useState<"email" | "sms">("email");
    const [copied, setCopied] = useState(false);
    const [school, setSchool] = useState<any>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }
        if (status === "authenticated") {
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

    const handleCopy = () => {
        const text = viewMode === "email" ? selectedTemplate.content : selectedTemplate.sms;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-navy/5 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <p className="text-navy/40 text-[10px] uppercase font-black tracking-[0.5em] animate-pulse">Initializing Comm Forge...</p>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-white text-navy selection:bg-emerald-500/30 p-4 md:p-8">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-emerald-500/[0.02] blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-gold/[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
                {/* Header */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/dashboard">
                            <button className="p-4 bg-white border border-navy/5 hover:border-emerald-500/20 rounded-2xl text-navy/40 hover:text-navy transition-all group shadow-sm">
                                <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-medium tracking-tight text-navy">
                                Communication <span className="text-emerald-500 font-bold">Forge</span>
                            </h1>
                            <div className="flex items-center gap-3 text-[10px] text-navy/40 font-black uppercase tracking-[0.5em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Transmission Protocol Active
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] text-navy/20 uppercase tracking-[0.5em] font-black">
                        {school?.slug && (
                            <Link href={`/${school.slug}/register`}>
                                <button className="px-5 py-4 bg-white border border-navy/5 hover:border-navy/10 rounded-2xl text-navy/60 hover:text-navy text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
                                    Public Gateway
                                </button>
                            </Link>
                        )}
                        <span className="text-emerald-500 font-black">RELAY: ENCRYPTED</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                        <span>MODULE: CORE_COMM_O2</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Protocol Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-4 px-2">
                            <Cpu size={16} className="text-emerald-500" />
                            <h3 className="text-[10px] text-navy/40 uppercase tracking-[0.4em] font-black">Protocol Templates</h3>
                        </div>

                        <div className="space-y-5">
                            {TEMPLATES.map((tmpl, i) => (
                                <motion.button
                                    initial={{ opacity: 0, x: -25 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={tmpl.id}
                                    onClick={() => setSelectedTemplate(tmpl)}
                                    className={`w-full text-left p-7 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden shadow-sm ${selectedTemplate.id === tmpl.id
                                        ? "bg-white border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                                        : "bg-white border-navy/5 hover:border-navy/10"
                                        }`}
                                >
                                    {selectedTemplate.id === tmpl.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                                    )}
                                    <div className="space-y-2.5 relative z-10">
                                        <p className={`text-base font-semibold tracking-tight uppercase transition-colors ${selectedTemplate.id === tmpl.id ? "text-navy" : "text-navy/40 group-hover:text-navy/80"}`}>
                                            {tmpl.name}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <Hash size={12} className={selectedTemplate.id === tmpl.id ? "text-emerald-500" : "text-navy/10"} />
                                            <p className={`text-[10px] uppercase tracking-[0.2em] font-black transition-colors ${selectedTemplate.id === tmpl.id ? "text-emerald-500/60" : "text-navy/20"}`}>
                                                FORMAT: {tmpl.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-500 ${selectedTemplate.id === tmpl.id ? "text-emerald-500 opacity-100 scale-125" : "text-navy/5 opacity-0 group-hover:opacity-100"}`}>
                                        <ChevronRight size={22} />
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* System Note */}
                        <div className="p-8 bg-white border border-navy/5 rounded-[3rem] space-y-5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <Send size={18} className="text-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">Node Integrity</span>
                            </div>
                            <p className="text-[11px] text-navy/40 leading-relaxed font-black tracking-wider uppercase">
                                All outgoing packets are signed with institutional private keys. Deployment triggers SHA-256 verification sequence.
                            </p>
                        </div>
                    </div>

                    {/* Right: Terminal Preview */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Interface Controls */}
                        <div className="flex items-center justify-between bg-white p-3.5 rounded-[3rem] border border-navy/5 backdrop-blur-3xl shadow-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.01] to-transparent pointer-events-none" />
                            <div className="flex gap-3 relative z-10">
                                <button
                                    onClick={() => setViewMode("email")}
                                    className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all ${viewMode === "email" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105" : "text-navy/40 hover:text-navy/70 hover:bg-navy/5"
                                        }`}
                                >
                                    <Monitor size={18} />
                                    Main Terminal
                                </button>
                                <button
                                    onClick={() => setViewMode("sms")}
                                    className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all ${viewMode === "sms" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105" : "text-navy/40 hover:text-navy/70 hover:bg-navy/5"
                                        }`}
                                >
                                    <Smartphone size={18} />
                                    Mobile Node
                                </button>
                            </div>

                            <div className="flex items-center gap-3 pr-3 relative z-10">
                                <button
                                    onClick={handleCopy}
                                    className="p-5 bg-white border border-navy/5 text-navy/20 hover:text-emerald-500 hover:border-emerald-500/20 rounded-2xl transition-all active:scale-90 shadow-sm"
                                >
                                    {copied ? <Check size={22} className="text-emerald-500" /> : <Copy size={22} />}
                                </button>
                            </div>
                        </div>

                        {/* Visualization Area */}
                        <div className="relative min-h-[750px] flex items-center justify-center p-8 lg:p-20 bg-white rounded-[4rem] border border-navy/5 overflow-hidden group/visual shadow-sm">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/[0.01] blur-[150px] rounded-full pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/[0.01] blur-[150px] rounded-full pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {viewMode === "email" ? (
                                    <motion.div
                                        key="email"
                                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -15, scale: 0.98 }}
                                        className="w-full max-w-3xl"
                                    >
                                        <GlassCard className="p-0 bg-white border-navy/5 shadow-2xl rounded-[3rem] overflow-hidden relative">
                                            {/* Window Header */}
                                            <div className="flex items-center justify-between px-8 py-6 bg-navy/[0.02] border-b border-navy/5">
                                                <div className="flex gap-3">
                                                    <div className="w-3.5 h-3.5 rounded-full bg-red-400/20 border border-red-400/30" />
                                                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400/20 border border-amber-400/30" />
                                                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/20 border border-emerald-400/30" />
                                                </div>
                                                <div className="flex items-center gap-3 opacity-40">
                                                    <Lock size={12} className="text-emerald-500" />
                                                    <span className="text-[10px] uppercase tracking-[0.5em] font-black text-navy/60">SSL_SECURE_RELAY</span>
                                                </div>
                                                <div className="w-12" />
                                            </div>

                                            {/* Mail Metadata */}
                                            <div className="p-10 space-y-8 border-b border-navy/5 bg-white shadow-sm">
                                                <div className="flex items-center gap-8">
                                                    <span className="text-[10px] font-black text-navy/20 uppercase tracking-[0.4em] w-16">Subject</span>
                                                    <p className="text-navy font-semibold tracking-tight text-base uppercase">{selectedTemplate.subject}</p>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <span className="text-[10px] font-black text-navy/20 uppercase tracking-[0.4em] w-16">Source</span>
                                                    <p className="text-emerald-500 text-[10px] font-black tracking-[0.2em] uppercase">SYSTEM@CORE.SECURE</p>
                                                </div>
                                            </div>

                                            {/* Message Content */}
                                            <div className="p-10 space-y-12 bg-white">
                                                <div className="flex gap-10">
                                                    <div className="w-16 h-16 rounded-[2rem] bg-white border border-navy/5 flex items-center justify-center shadow-sm group-hover/visual:border-emerald-500/20 transition-all shrink-0">
                                                        <Mail size={32} className="text-navy/10 group-hover/visual:text-emerald-500 transition-colors" />
                                                    </div>
                                                    <div className="space-y-10 flex-1">
                                                        <div className="whitespace-pre-wrap text-navy/60 text-sm leading-relaxed font-semibold uppercase tracking-wider bg-navy/[0.01] p-10 rounded-[2.5rem] border border-navy/5 shadow-sm">
                                                            {selectedTemplate.content}
                                                        </div>
                                                        <div className="pt-6 flex justify-between items-center opacity-30 group-hover/visual:opacity-80 transition-all">
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.5em]">Digital Signature Verified</p>
                                                                <p className="text-[11px] text-navy font-black tracking-tighter uppercase">PROTOCOL_SIG_V4.X</p>
                                                            </div>
                                                            <Activity size={24} className="text-emerald-500/40 animate-pulse" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="sms"
                                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                                        className="relative w-[340px] h-[700px] bg-white rounded-[60px] border-[14px] border-[#f8f9fa] shadow-2xl flex flex-col overflow-hidden ring-1 ring-navy/5"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fafafa] to-white" />

                                        {/* Dynamic Island */}
                                        <div className="relative h-12 flex items-center justify-center z-30">
                                            <div className="w-28 h-8 bg-[#0a0a0a] rounded-full shadow-lg" />
                                        </div>

                                        {/* Status */}
                                        <div className="h-12 flex items-center justify-between px-10 text-[11px] text-navy/40 font-black relative z-20">
                                            <span>11:11</span>
                                            <div className="flex gap-2.5 items-center">
                                                <div className="flex gap-1 items-end">
                                                    <div className="w-0.5 h-2 bg-navy/20 rounded-full" />
                                                    <div className="w-0.5 h-3 bg-navy/20 rounded-full" />
                                                    <div className="w-0.5 h-4 bg-navy/10 rounded-full" />
                                                </div>
                                                <Zap size={10} className="text-emerald-500" />
                                                <div className="w-6 h-3 border border-navy/20 rounded-[4px] p-[1.5px] flex items-center">
                                                    <div className="h-full w-[90%] bg-emerald-500/60 rounded-[1.5px]" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chat Interface */}
                                        <div className="flex-1 mt-8 px-5 space-y-10 relative z-10">
                                            <div className="flex flex-col items-center gap-5 py-10">
                                                <div className="w-20 h-20 rounded-full bg-white border border-navy/5 flex items-center justify-center text-emerald-500/60 shadow-sm">
                                                    <Shield size={36} className="opacity-60" />
                                                </div>
                                                <div className="text-center space-y-1.5">
                                                    <p className="text-sm text-navy font-bold tracking-tight uppercase">Institutional Relay</p>
                                                    <p className="text-[10px] text-navy/30 uppercase tracking-[0.4em] font-black">SECURE ENCRYPTED NODE</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 items-end pr-2">
                                                <div className="bg-white border border-navy/5 text-navy/60 p-6 rounded-[2.5rem] rounded-tr-[0.5rem] text-xs leading-relaxed font-semibold uppercase tracking-wide shadow-sm max-w-[95%] relative overflow-hidden group/msg">
                                                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                                                    {selectedTemplate.sms}
                                                </div>
                                                <div className="flex items-center gap-2 mr-4">
                                                    <Check size={10} className="text-emerald-500" />
                                                    <span className="text-[9px] text-emerald-500/40 font-black uppercase tracking-[0.3em]">Node Delivered</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phone Bottom */}
                                        <div className="pb-12 px-5 relative z-20">
                                            <div className="h-14 bg-white border border-navy/5 rounded-full flex items-center justify-between px-6 shadow-sm">
                                                <div className="w-full h-4 bg-navy/[0.03] rounded-full" />
                                                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white ml-5 shrink-0 shadow-lg shadow-emerald-500/20">
                                                    <Check size={20} className="font-bold" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Home Indicator */}
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-navy/10 rounded-full z-50 shadow-sm" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

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
            `}</style>
        </div>
    );
}
