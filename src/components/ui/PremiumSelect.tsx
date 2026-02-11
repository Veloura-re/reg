"use client";

import { SelectHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface PremiumSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
}

export const PremiumSelect = ({ label, className, children, value, onFocus, onBlur, ...props }: PremiumSelectProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;

    return (
        <div className="group relative space-y-2">
            <div className="h-5">
                <label className="text-[13px] text-navy/40 uppercase tracking-widest font-bold ml-4">
                    {label}
                </label>
            </div>
            <div
                className={cn(
                    "relative flex items-center transition-all duration-300 rounded-2xl border bg-white/50 backdrop-blur-xl overflow-hidden",
                    isFocused
                        ? "border-gold/50 shadow-[0_0_25px_rgba(197,160,40,0.1)] ring-1 ring-gold/10"
                        : "border-navy/5 hover:border-navy/10"
                )}
            >
                <div className="relative flex-1">
                    <select
                        {...props}
                        value={value}
                        onFocus={(e) => {
                            setIsFocused(true);
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            onBlur?.(e);
                        }}
                        className={cn(
                            "w-full bg-transparent px-4 py-6 text-[18px] text-navy focus:outline-none relative z-10 appearance-none cursor-pointer font-bold",
                            className
                        )}
                    >
                        {children}
                    </select>

                    {/* Placeholder Label (when empty or not focused) */}
                    {!(isFocused || hasValue) && (
                        <label
                            className={cn(
                                "absolute left-4 transition-all duration-300 pointer-events-none uppercase tracking-widest font-bold top-1/2 -translate-y-1/2 text-[16px] text-navy/20"
                            )}
                        >
                            {label}
                        </label>
                    )}

                    {/* Custom Arrow */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <ChevronDown className={cn(
                            "w-4 h-4 transition-all duration-300",
                            isFocused ? "text-gold rotate-180" : "text-navy/20"
                        )} />
                    </div>
                </div>
            </div>

            {/* Visual bottom bar accent */}
            <div className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gold shadow-[0_0_10px_rgba(197,160,40,0.5)] transition-all duration-500 ease-out",
                isFocused ? "w-1/3 opacity-100" : "w-0 opacity-0"
            )} />
        </div>
    );
};
