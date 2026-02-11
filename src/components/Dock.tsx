"use client";

import { motion } from "framer-motion";
import { Home, Search, LogIn, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Track", href: "/track" },
    { icon: LogIn, label: "Admin", href: "/admin/login" },
];

export function Dock() {
    const pathname = usePathname();

    if (pathname === "/admin/login") return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel flex items-center gap-2 p-2 px-4 rounded-full border border-emerald-500/20"
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "relative p-3 rounded-full transition-colors",
                                    isActive ? "text-emerald-base" : "text-foreground/40 hover:text-foreground"
                                )}
                            >
                                <item.icon size={24} strokeWidth={1.5} />
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute inset-0 bg-emerald-base/10 rounded-full -z-10 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
}
