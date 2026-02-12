"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { Mail, Lock, LogIn, AlertCircle, Loader2, Fingerprint, ShieldCheck, Zap, Sparkles, Activity, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumInput } from "@/components/ui/PremiumInput";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");

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
                setError("Authentication Failed: Invalid credentials");
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
            setError("System Error: Connection Refused");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md w-full relative z-10 font-rajdhani"
        >
            {/* Branding Header */}
            <div className="text-center space-y-6 mb-12">
                <div className="inline-flex items-center justify-center p-8 rounded-[3rem] bg-white border border-navy/10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] group cursor-default backdrop-blur-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/[0.03] animate-pulse" />
                    <ShieldCheck size={48} className="text-emerald-600 group-hover:scale-110 transition-all duration-700 relative z-10" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-5xl font-orbitron font-bold text-navy tracking-tighter uppercase">Admin <span className="text-emerald-600/40">Terminal</span></h1>
                    <p className="text-navy/40 text-[10px] uppercase tracking-[0.4em] font-black">Secure Multi-Node Access Protocol</p>
                </div>
            </div>

            <GlassCard className="p-10 md:p-12 bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 backdrop-blur-xl rounded-[3rem] relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 flex items-center gap-4 text-red-600 font-bold text-[10px] uppercase tracking-[0.2em] shadow-sm"
                            >
                                <AlertCircle size={18} className="shrink-0 text-red-500" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                        {registered && !error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] shadow-sm"
                            >
                                <Sparkles size={18} className="shrink-0 text-emerald-500" />
                                <span>Node provisioned. Authenticate key.</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-8">
                        <PremiumInput
                            required
                            label="Identity Relay (Email)"
                            type="email"
                            icon={<Mail size={20} />}
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="OFFICER@CORE.SYSTEM"
                        />

                        <PremiumInput
                            required
                            label="Access Pass (Password)"
                            type="password"
                            icon={<Lock size={20} />}
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-7 bg-navy hover:bg-navy/95 text-white rounded-[2.5rem] font-bold text-[12px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(0,26,61,0.2)] active:scale-[0.98] disabled:opacity-50 group/btn relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-5 font-orbitron">
                            {loading ? <Loader2 className="animate-spin" size={22} /> : (
                                <>
                                    <Fingerprint size={22} className="group-hover:scale-110 transition-transform" />
                                    <span>Initiate Protocol</span>
                                    <LogIn size={18} className="opacity-0 -mr-6 group-hover:opacity-100 group-hover:mr-0 transition-all" />
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                    </button>

                    <div className="pt-10 border-t border-navy/5 flex flex-col items-center gap-8">
                        <div className="flex justify-between w-full text-[10px] uppercase tracking-[0.4em] text-navy/20 font-black">
                            <span>v5.0.0 STABLE</span>
                            <span className="flex items-center gap-2">
                                <Activity size={12} className="text-emerald-500" />
                                NODE_SECURE
                            </span>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Link href="/admin/signup" className="text-[11px] text-navy/40 uppercase tracking-[0.4em] hover:text-gold transition-colors font-black group flex items-center gap-3">
                                Need Access? <span className="text-gold group-hover:scale-105 transition-transform">Provision Node</span>
                            </Link>
                            <Link href="/admin/forgot-password" className="text-[10px] text-navy/30 uppercase tracking-[0.4em] hover:text-gold transition-colors font-black w-fit">
                                Lost Access Pass?
                            </Link>
                        </div>
                    </div>
                </form>
            </GlassCard>
        </motion.div>
    );
}

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative w-full overflow-hidden bg-white">
            {/* Background handled by AnimatedBackground in layout */}
            <Suspense fallback={
                <div className="flex flex-col items-center gap-8 z-10">
                    <div className="w-16 h-16 border-4 border-navy/5 border-t-navy rounded-full animate-spin" />
                    <p className="text-navy/40 text-[10px] uppercase font-orbitron font-bold tracking-[0.6em] animate-pulse">Initializing Terminal...</p>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
