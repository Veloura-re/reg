"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumDatePickerProps {
    label: string;
    value: string; // YYYY-MM-DD
    onChange: (date: string) => void;
    required?: boolean;
}

export const PremiumDatePicker = ({ label, value, onChange, required }: PremiumDatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse current value
    const date = value ? new Date(value) : new Date();
    const [viewDate, setViewDate] = useState(date);
    const [view, setView] = useState<"days" | "months" | "years">("days");

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Calendar logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    const prevMonthDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth() - 1);
    const days = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, current: false, month: viewDate.getMonth() - 1 });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, current: true, month: viewDate.getMonth() });
    }
    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, current: false, month: viewDate.getMonth() + 1 });
    }

    const handleDateSelect = (day: number, month: number) => {
        const newDate = new Date(viewDate.getFullYear(), month, day);
        // Format as YYYY-MM-DD
        const formatted = newDate.toISOString().split('T')[0];
        onChange(formatted);
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const changeYear = (year: number) => {
        const newDate = new Date(year, viewDate.getMonth(), 1);
        setViewDate(newDate);
        setView("days");
    };

    const changeMonthSelect = (month: number) => {
        const newDate = new Date(viewDate.getFullYear(), month, 1);
        setViewDate(newDate);
        setView("days");
    };

    // Outside click close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasValue = value && value.length > 0;

    return (
        <div className="group relative space-y-2" ref={containerRef}>
            <div className="h-4">
                {(isOpen || hasValue) && (
                    <label className="text-[10px] text-navy/40 uppercase tracking-widest font-bold ml-4 animate-in fade-in slide-in-from-bottom-1 duration-300">
                        {label}
                    </label>
                )}
            </div>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative flex items-center h-[66px] transition-all duration-300 rounded-2xl border bg-white/50 backdrop-blur-xl cursor-pointer overflow-hidden",
                    isOpen
                        ? "border-gold/50 shadow-[0_0_25px_rgba(197,160,40,0.1)] ring-1 ring-gold/10"
                        : "border-navy/5 hover:border-navy/10"
                )}
            >
                {/* Background lighting flare */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent transition-opacity duration-500",
                    isOpen ? "opacity-100" : "opacity-0"
                )} />

                <div className={cn(
                    "pl-4 pr-1 relative z-10 transition-colors duration-300",
                    isOpen ? "text-gold" : "text-navy/20"
                )}>
                    <CalendarIcon size={18} />
                </div>

                <div className="relative flex-1 px-3">
                    <div className={cn(
                        "text-[14px] transition-colors duration-300 font-medium",
                        hasValue ? "text-navy" : "text-navy/20 uppercase tracking-widest font-bold text-[12px]"
                    )}>
                        {hasValue ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : label}
                    </div>
                </div>

                {hasValue && !isOpen && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onChange(""); }}
                        className="mr-4 p-1 hover:bg-navy/5 rounded-lg text-navy/20 hover:text-navy/40 transition-colors relative z-10"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 mt-2 w-full min-w-[320px] bg-white/95 backdrop-blur-2xl border border-navy/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,26,61,0.15),0_0_0_1px_rgba(255,255,255,0.8)_inset] overflow-hidden"
                    >
                        {/* Internal Glow */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => setView(view === "months" ? "days" : "months")}
                                    className="px-3 py-1.5 hover:bg-navy/5 rounded-xl text-[12px] uppercase tracking-widest font-black text-gold border border-transparent hover:border-gold/20 transition-all"
                                >
                                    {months[viewDate.getMonth()]}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setView(view === "years" ? "days" : "years")}
                                    className="px-3 py-1.5 hover:bg-navy/5 rounded-xl text-[12px] uppercase tracking-widest font-black text-navy/40 transition-colors"
                                >
                                    {viewDate.getFullYear()}
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => changeMonth(-1)}
                                    className="p-2 hover:bg-navy/5 rounded-xl text-navy/20 hover:text-navy transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => changeMonth(1)}
                                    className="p-2 hover:bg-navy/5 rounded-xl text-navy/20 hover:text-navy transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Content */}
                        <div className="relative min-h-[240px]">
                            {view === "days" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-7 text-center">
                                        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                                            <span key={d} className="text-[10px] font-black text-navy/20 tracking-tighter">{d}</span>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {days.map((item, idx) => {
                                            const isSelected = value && new Date(value).toDateString() === new Date(viewDate.getFullYear(), item.month, item.day).toDateString();
                                            const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), item.month, item.day).toDateString();

                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => handleDateSelect(item.day, item.month)}
                                                    className={cn(
                                                        "aspect-square flex items-center justify-center text-[12px] rounded-xl transition-all duration-300 relative group",
                                                        !item.current ? "text-navy/10" : "text-navy/60 hover:text-navy hover:bg-navy/5",
                                                        isSelected && "bg-gold/10 text-gold border border-gold/30 shadow-[0_0_15px_rgba(197,160,40,0.1)]",
                                                        !isSelected && isToday && "text-gold"
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-gold/5 blur-md rounded-full" />
                                                    )}
                                                    <span className="relative z-10 font-bold">{item.day}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {view === "months" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-3 gap-2"
                                >
                                    {months.map((m, idx) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => changeMonthSelect(idx)}
                                            className={cn(
                                                "py-4 rounded-xl text-[11px] uppercase tracking-widest font-black transition-all",
                                                viewDate.getMonth() === idx
                                                    ? "bg-gold/10 text-gold border border-gold/30 shadow-[0_0_20px_rgba(197,160,40,0.1)]"
                                                    : "text-navy/20 hover:text-navy/40 hover:bg-navy/5"
                                            )}
                                        >
                                            {m.substring(0, 3)}
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            {view === "years" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto pr-2 hide-scrollbar"
                                >
                                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() => changeYear(year)}
                                            className={cn(
                                                "py-4 rounded-xl text-[12px] font-black transition-all",
                                                viewDate.getFullYear() === year
                                                    ? "bg-gold/10 text-gold border border-gold/30 shadow-[0_0_20px_rgba(197,160,40,0.1)]"
                                                    : "text-navy/20 hover:text-navy/40 hover:bg-navy/5"
                                            )}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Visual bottom bar accent */}
            <div className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gold shadow-[0_0_10px_rgba(197,160,40,0.5)] transition-all duration-500 ease-out",
                isOpen ? "w-1/3 opacity-100" : "w-0 opacity-0"
            )} />
        </div>
    );
};
