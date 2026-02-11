"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Zap, LayoutDashboard, Database, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Features", href: "/features", icon: Zap },
    { name: "About", href: "/about", icon: Info },
    { name: "Track Corp", href: "/track", icon: Database },
    { name: "Portal", href: "/admin/login", icon: Lock },
];

export function FloatingNav() {
    const pathname = usePathname();
    const { data: session } = useSession();

    // Hide on all authenticated/dashboard pages and registration pages
    const isExcludedPage = pathname.startsWith("/dashboard") ||
        (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
        pathname.includes("/register");

    // Hide if user is logged in or on an excluded page
    if (session || isExcludedPage) return null;

    return (
        <div className="fixed right-6 bottom-6 z-50">
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative flex flex-col items-center gap-3 py-5 px-3 rounded-full bg-white/70 backdrop-blur-2xl border border-navy/10 shadow-[0_8px_32px_rgba(0,26,61,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset] will-change-transform"
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

                {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08, type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <Link href={item.href}>
                                <motion.div
                                    whileHover={{
                                        scale: 1.15,
                                        transition: { type: "spring", stiffness: 400, damping: 15 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn(
                                        "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group",
                                        isActive
                                            ? "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                            : "text-navy/60 hover:bg-navy/5 hover:text-navy"
                                    )}
                                >
                                    {/* Hover glow effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/0 to-emerald-600/0 group-hover:from-emerald-400/10 group-hover:to-emerald-600/5 transition-all duration-300"
                                        style={{ filter: "blur(8px)" }}
                                    />

                                    {/* Icon */}
                                    <motion.div
                                        whileHover={{ rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Icon
                                            size={22}
                                            strokeWidth={isActive ? 2.5 : 1.5}
                                            className="relative z-10"
                                        />
                                    </motion.div>

                                    {/* Enhanced Tooltip - Left Side */}
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-navy text-xs font-semibold rounded-lg shadow-lg border border-navy/10 whitespace-nowrap pointer-events-none"
                                    >
                                        {item.name}
                                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-t border-r border-navy/10" />
                                    </motion.span>

                                    {/* Active Indicator - Vertical */}
                                    {isActive && (
                                        <>
                                            <motion.div
                                                layoutId="active-dot"
                                                className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-gold rounded-full"
                                                animate={{
                                                    boxShadow: [
                                                        "0 0 8px rgba(197,160,40,0.6)",
                                                        "0 0 12px rgba(197,160,40,0.8)",
                                                        "0 0 8px rgba(197,160,40,0.6)",
                                                    ]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            {/* Inner glow for active state */}
                                            <div className="absolute inset-0 rounded-full bg-gold/5 animate-pulse" />
                                        </>
                                    )}

                                    {/* Click ripple effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-emerald-500/10"
                                        initial={{ scale: 0, opacity: 0.5 }}
                                        whileTap={{ scale: 1.5, opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </motion.div>
                            </Link>
                        </motion.div>
                    );
                })}

                {/* Floating particles effect (subtle) */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-1 h-1 bg-gold/20 rounded-full"
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute top-1/2 right-1/4 w-1 h-1 bg-emerald-400/20 rounded-full"
                        animate={{
                            y: [0, 10, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
