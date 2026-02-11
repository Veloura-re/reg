import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
    return (
        <div className={cn("glass-panel rounded-3xl p-6 transition-all duration-300 hover:border-emerald-500/30", className)}>
            {children}
        </div>
    );
};
