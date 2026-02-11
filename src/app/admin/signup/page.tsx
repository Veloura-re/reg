"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mail, Lock, User, Key, ArrowRight, Zap, Sparkles, Scan, Globe, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumInput } from "@/components/ui/PremiumInput";

export default function AdminSignup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        inviteCode: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Registration failed");
            }

            router.push("/admin/login?registered=true");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white">
            {/* Background handled by AnimatedBackground in layout */}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg relative z-10 font-rajdhani"
            >
                {/* Branding */}
                <div className="flex flex-col items-center mb-12 space-y-8">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-[3rem] bg-white border border-navy/10 flex items-center justify-center group-hover:border-emerald-500/40 transition-all duration-1000 shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden group backdrop-blur-3xl">
                            <ShieldCheck size={56} className="text-emerald-600 group-hover:scale-110 transition-all duration-700 relative z-10" />
                            <div className="absolute inset-0 bg-emerald-500/[0.03] animate-pulse" />
                        </div>
                        <div className="absolute -top-4 -right-4">
                            <Sparkles className="text-gold animate-pulse" size={32} />
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-orbitron font-bold text-navy tracking-tighter uppercase leading-none">Provision <br /><span className="text-emerald-600/40">Node</span></h1>
                        <p className="text-[10px] text-navy/40 uppercase tracking-[0.4em] font-black leading-relaxed">System Genesis Registry Protocol v5.0</p>
                    </div>
                </div>

                <GlassCard className="p-10 md:p-14 bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 backdrop-blur-3xl rounded-[3.5rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.02] to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-600 font-bold text-[10px] uppercase tracking-[0.2em] text-center shadow-sm"
                            >
                                Authorization Error: {error}
                            </motion.div>
                        )}

                        <div className="space-y-8">
                            <PremiumInput
                                required
                                label="Clearance Token"
                                type="text"
                                icon={<Key size={20} />}
                                value={formData.inviteCode}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, inviteCode: e.target.value.toUpperCase() })}
                                placeholder="INVITATION_KEY"
                                className="font-orbitron tracking-[0.2em] text-center"
                            />

                            <PremiumInput
                                required
                                label="Officer Legal Name"
                                type="text"
                                icon={<User size={20} />}
                                value={formData.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="FULL LEGAL NAME"
                            />

                            <PremiumInput
                                required
                                label="Registry Relay (Email)"
                                type="email"
                                icon={<Mail size={20} />}
                                value={formData.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="ADMIN@VISION.PROTOCOL"
                            />

                            <PremiumInput
                                required
                                label="Secure Passcode"
                                type="password"
                                icon={<Lock size={20} />}
                                value={formData.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••••••••••"
                            />
                        </div>

                        <div className="space-y-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-7 bg-navy hover:bg-navy/95 text-white rounded-[2.5rem] font-bold text-[12px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(0,26,61,0.2)] active:scale-[0.98] disabled:opacity-50 group/btn relative overflow-hidden font-orbitron"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-5">
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                            Synchronizing Node...
                                        </>
                                    ) : (
                                        <>
                                            Provision Access
                                            <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                            </button>

                            <div className="text-center">
                                <Link href="/admin/login" className="text-[11px] text-navy/40 uppercase tracking-[0.4em] hover:text-gold transition-colors font-black group flex items-center justify-center gap-3">
                                    Registered Node? <span className="text-gold group-hover:scale-105 transition-transform">Enter Terminal</span>
                                </Link>
                            </div>
                        </div>
                    </form>
                </GlassCard>

                {/* Secure Badge */}
                <div className="mt-16 flex justify-center">
                    <div className="flex items-center gap-10 px-12 py-5 bg-white/50 border border-navy/5 rounded-full backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-4">
                            <Scan size={18} className="text-emerald-600" />
                            <span className="text-[10px] text-navy/40 uppercase tracking-[0.4em] font-black font-orbitron">Grid Secure</span>
                        </div>
                        <div className="w-[1px] h-4 bg-navy/5" />
                        <div className="flex items-center gap-4">
                            <Globe size={18} className="text-gold" />
                            <span className="text-[10px] text-navy/40 uppercase tracking-[0.4em] font-black font-orbitron">Node Global</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
