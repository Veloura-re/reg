"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { Lock, AlertCircle, Loader2, Sparkles, ArrowLeft, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumInput } from "@/components/ui/PremiumInput";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!token) {
        return (
            <div className="text-center space-y-6">
                <AlertCircle size={48} className="text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold text-navy">Invalid Recovery Key</h2>
                <p className="text-navy/60">Molecular bond broken. No recovery token detected.</p>
                <Link href="/admin/forgot-password" className="text-gold font-bold uppercase tracking-widest text-xs">Request New Link</Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Entropy Mismatch: Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Structural Weakness: Password too short.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Reset failed. Please try again.");
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/admin/login");
                }, 3000);
            }
        } catch (err) {
            setError("System Error: Connection Refused");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
        >
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
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] shadow-sm"
                        >
                            <Sparkles size={18} className="shrink-0 text-emerald-500" />
                            <span>Access pass recalibrated. Redirecting to Terminal...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!success && (
                    <>
                        <div className="space-y-8">
                            <PremiumInput
                                required
                                label="New Access Pass (Password)"
                                type="password"
                                icon={<Lock size={20} />}
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                            />

                            <PremiumInput
                                required
                                label="Confirm Access Pass"
                                type="password"
                                icon={<Shield size={20} />}
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
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
                                        <Shield size={22} className="group-hover:scale-110 transition-transform" />
                                        <span>Update Credentials</span>
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                    </>
                )}
            </form>
        </motion.div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative w-full overflow-hidden bg-white">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md w-full relative z-10 font-rajdhani"
            >
                {/* Branding Header */}
                <div className="text-center space-y-6 mb-12">
                    <div className="inline-flex items-center justify-center p-8 rounded-[3rem] bg-white border border-navy/10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] group cursor-default backdrop-blur-3xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/[0.03] animate-pulse" />
                        <Lock size={48} className="text-emerald-600 group-hover:scale-110 transition-all duration-700 relative z-10" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-5xl font-orbitron font-bold text-navy tracking-tighter uppercase">Reset <span className="text-emerald-600/40">Access</span></h1>
                        <p className="text-navy/40 text-[10px] uppercase tracking-[0.4em] font-black">Credential Recalibration Protocol</p>
                    </div>
                </div>

                <GlassCard className="p-10 md:p-12 bg-white/70 border-navy/5 shadow-2xl shadow-navy/5 backdrop-blur-3xl rounded-[3rem] relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                    <Suspense fallback={
                        <div className="flex flex-col items-center gap-8 py-10">
                            <Loader2 className="animate-spin text-navy" size={40} />
                            <p className="text-navy/40 text-[10px] uppercase font-orbitron font-bold tracking-[0.6em]">Syncing Neural Key...</p>
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>

                    <div className="pt-10 border-t border-navy/5 flex flex-col items-center gap-8">
                        <Link href="/admin/login" className="text-[11px] text-navy/40 uppercase tracking-[0.4em] hover:text-gold transition-colors font-black group flex items-center gap-3">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Terminal
                        </Link>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
