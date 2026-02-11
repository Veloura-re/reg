"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Grade {
    id: string;
    level: string;
}

interface PremiumGradePickerProps {
    grades: Grade[];
    selectedGrade: string;
    onSelect: (level: string) => void;
    label: string;
}

export const PremiumGradePicker = ({ grades, selectedGrade, onSelect, label }: PremiumGradePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-3 relative" ref={containerRef}>
            <div className="h-5">
                <label className="text-[13px] text-navy/40 uppercase tracking-widest font-bold ml-4">
                    {label}
                </label>
            </div>

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-[76px] px-6 rounded-2xl bg-white/50 border transition-all duration-300 relative overflow-hidden flex items-center justify-between group",
                    isOpen ? "border-gold/50 ring-1 ring-gold/10 shadow-[0_0_25px_rgba(197,160,40,0.1)]" : "border-navy/5 hover:border-navy/10",
                    selectedGrade && !isOpen && "border-gold/20 shadow-[0_0_20px_rgba(197,160,40,0.05)]"
                )}
            >
                {/* Visual Backdrop Effects */}
                <div className="absolute inset-0 backdrop-blur-3xl" />
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    (selectedGrade || isOpen) && "opacity-100"
                )} />

                <div className="flex items-center gap-4 relative z-10">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                        selectedGrade
                            ? "bg-gold/20 text-gold scale-110 shadow-[0_0_15px_rgba(197,160,40,0.2)]"
                            : "bg-navy/5 text-navy/20 group-hover:text-navy/40 group-hover:scale-110"
                    )}>
                        <GraduationCap size={18} />
                    </div>
                    <div className="text-left">
                        <p className={cn(
                            "text-[17px] font-bold tracking-wider transition-colors duration-300",
                            selectedGrade ? "text-gold" : "text-navy/40 group-hover:text-navy/60"
                        )}>
                            {selectedGrade || "Select Student Grade"}
                        </p>
                        <p className="text-[11px] text-navy/20 uppercase tracking-[0.2em] font-bold">Protocol Node</p>
                    </div>
                </div>

                <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 relative z-10",
                    isOpen ? "text-gold" : "text-navy/10 group-hover:text-navy/30"
                )}>
                    <ChevronDown size={18} className={cn("transition-transform duration-500", isOpen && "rotate-180")} />
                </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute top-[calc(100%+8px)] left-0 right-0 z-[100] p-3 rounded-[2rem] bg-white/90 backdrop-blur-2xl border border-navy/10 shadow-[0_20px_50px_rgba(0,26,61,0.15),0_0_0_1px_rgba(255,255,255,0.8)_inset] overflow-hidden"
                    >
                        {/* Background Aesthetics */}
                        <div className="absolute inset-0 bg-white/60 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.05] to-transparent pointer-events-none" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-[60px] pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {grades.map((grade) => {
                                const isActive = selectedGrade === grade.level;
                                return (
                                    <button
                                        key={grade.id}
                                        type="button"
                                        onClick={() => {
                                            onSelect(grade.level);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "relative py-5 px-5 rounded-[1.25rem] border transition-all duration-300 group overflow-hidden flex items-center justify-between",
                                            isActive
                                                ? "bg-gold/10 border-gold/30 shadow-[0_0_20px_rgba(197,160,40,0.1)] ring-1 ring-gold/20"
                                                : "bg-white/60 border-navy/5 text-navy/30 hover:bg-navy/[0.02] hover:border-navy/10"
                                        )}
                                    >
                                        {/* Selection Pulse Glow */}
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent transition-opacity duration-500",
                                            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        )} />

                                        <div className="flex flex-col items-start relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                                            <span className={cn(
                                                "text-[18px] font-bold tracking-tight",
                                                isActive ? "text-gold" : "text-navy/40 group-hover:text-navy/80"
                                            )}>
                                                {grade.level}
                                            </span>
                                            {isActive && (
                                                <span className="text-[11px] text-gold/60 uppercase tracking-[0.2em] font-black">Selected</span>
                                            )}
                                        </div>

                                        {isActive && (
                                            <motion.div
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold relative z-10 border border-gold/30 shadow-[0_0_10px_rgba(197,160,40,0.3)]"
                                            >
                                                <Check size={14} />
                                            </motion.div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.4);
                }
            `}</style>
        </div>
    );
};
