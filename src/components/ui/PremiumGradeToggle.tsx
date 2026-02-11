"use client";

import { cn } from "@/lib/utils";

interface Grade {
    id: string;
    level: string;
}

interface PremiumGradeToggleProps {
    grades: Grade[];
    selectedGrade: string;
    onSelect: (level: string) => void;
    label: string;
}

export const PremiumGradeToggle = ({ grades, selectedGrade, onSelect, label }: PremiumGradeToggleProps) => {
    return (
        <div className="space-y-2">
            <div className="h-4">
                <label className="text-[10px] text-navy/40 uppercase tracking-widest font-bold ml-4">
                    {label}
                </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {grades.map((grade) => {
                    const isActive = selectedGrade === grade.level;
                    return (
                        <button
                            key={grade.id}
                            type="button"
                            onClick={() => onSelect(grade.level)}
                            className={cn(
                                "relative py-5 px-2 rounded-2xl border transition-all duration-300 group overflow-hidden flex items-center justify-center",
                                isActive
                                    ? "bg-gold/10 border-gold/40 shadow-[0_0_20px_rgba(197,160,40,0.1)]"
                                    : "bg-white/50 border-navy/5 text-navy/20 hover:text-navy/40 hover:border-navy/10"
                            )}
                        >
                            {/* Hover/Active Glow */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent transition-opacity duration-500",
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )} />

                            <span className={cn(
                                "relative z-10 text-[13px] uppercase tracking-widest font-bold transition-colors duration-300",
                                isActive ? "text-gold" : "text-navy/20 group-hover:text-navy/40"
                            )}>
                                {grade.level}
                            </span>

                            {/* Corner Accents */}
                            {isActive && (
                                <>
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold/40 rounded-tr-lg" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold/40 rounded-bl-lg" />
                                </>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
