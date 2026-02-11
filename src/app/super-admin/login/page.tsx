"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { Lock, LogIn, AlertCircle, Loader2, Fingerprint, ShieldAlert, Cpu, Activity, Shield, Mail, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumInput } from "@/components/ui/PremiumInput";

export default function SuperAdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Core Access Denied: Identification Failure");
            } else {
                const sessionRes = await fetch("/api/auth/session");
                const session = await sessionRes.json();

                if (session?.user?.role === "super_admin") {
                    router.push("/super-admin/dashboard");
                } else {
                    router.push("/admin/dashboard");
                }
            }
        } catch (err) {
            setError("Neural Link Failed: Connection Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative w-full overflow-hidden bg-white font-rajdhani">
            {/* Background handled by layout */}

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl w-full relative z-10"
            >
                {/* Visual Identity */}
                <div className="text-center space-y-12 mb-16">
                    <div className="inline-flex items-center justify-center relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-40px] bg-emerald-500/[0.05] rounded-full blur-3xl opacity-40"
                        />
                        <div className="relative w-32 h-32 rounded-[3.5rem] bg-white border border-navy/10 flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.05)] backdrop-blur-3xl overflow-hidden group">
                            <ShieldAlert size={64} className="text-emerald-600 group-hover:scale-110 transition-all duration-700 relative z-10" />
                            <div className="absolute inset-0 bg-emerald-500/[0.03] animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-7xl font-orbitron font-bold text-navy tracking-tighter uppercase leading-none">Super <br /><span className="text-emerald-600/30">Admin</span></h1>
                        <div className="flex items-center justify-center gap-6">
                            <span className="w-12 h-[1px] bg-navy/10" />
                            <p className="text-gold text-[10px] uppercase tracking-[0.6em] font-black">Root Nexus Access Port</p>
                            <span className="w-12 h-[1px] bg-navy/10" />
                        </div>
                    </div>
                </div>

                <GlassCard className="p-10 md:p-14 bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 rounded-[4rem] relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex items-center gap-5 text-red-600 font-bold text-[10px] uppercase tracking-[0.2em] shadow-sm"
                                >
                                    <AlertCircle size={20} className="shrink-0 text-red-500" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-10">
                            <PremiumInput
                                required
                                label="Universal Identity"
                                type="email"
                                icon={<Mail size={24} />}
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                placeholder="ROOT@CORE.SYSTEM"
                                className="font-orbitron"
                            />

                            <PremiumInput
                                required
                                label="Encryption Token"
                                type="password"
                                icon={<Lock size={24} />}
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                placeholder="••••••••••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-8 bg-navy hover:bg-navy/95 text-white rounded-[3rem] font-bold text-[13px] uppercase tracking-[0.6em] transition-all shadow-[0_30px_60px_rgba(0,26,61,0.2)] active:scale-[0.98] disabled:opacity-50 group/btn relative overflow-hidden font-orbitron"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-6">
                                {loading ? <Loader2 className="animate-spin" size={26} /> : (
                                    <>
                                        <Fingerprint size={26} className="group-hover:scale-110 transition-transform duration-500" />
                                        <span>Authorize Root</span>
                                        <LogIn size={22} className="opacity-0 -mr-10 group-hover:opacity-100 group-hover:mr-0 transition-all duration-500" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                        </button>

                        <div className="pt-12 border-t border-navy/5 flex justify-between items-center text-[10px] text-navy/20 uppercase tracking-[0.6em] font-black">
                            <div className="flex items-center gap-4">
                                <Activity size={14} className="text-emerald-500" />
                                <span>CORE_SYNC STABLE</span>
                            </div>
                            <span>NODE_099 RED</span>
                        </div>
                    </form>
                </GlassCard>

                <p className="mt-20 text-center text-[11px] text-navy/30 uppercase tracking-[1em] font-black">
                    Global Administration Grid • Clae Systems
                </p>
            </motion.div>
        </div>
    );
}
