"use client";

import { TextareaHTMLAttributes, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PremiumTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    icon?: ReactNode;
}

export const PremiumTextarea = ({ label, icon, className, value, onFocus, onBlur, ...props }: PremiumTextareaProps) => {
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
                    "relative flex items-start transition-all duration-300 rounded-2xl border bg-white/50 backdrop-blur-xl overflow-hidden",
                    isFocused
                        ? "border-gold/50 shadow-[0_0_25px_rgba(197,160,40,0.1)] ring-1 ring-gold/10"
                        : "border-navy/5 hover:border-navy/10"
                )}
            >
                {icon && (
                    <div className={cn(
                        "flex items-center justify-center w-12 pt-5 transition-colors duration-300",
                        isFocused ? "text-gold" : "text-navy/20 group-hover:text-navy/40"
                    )}>
                        {icon}
                    </div>
                )}
                <div className="relative flex-1">
                    <textarea
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
                            "w-full bg-transparent py-6 text-[18px] text-navy placeholder-transparent focus:outline-none relative z-10 min-h-[160px] resize-none font-bold",
                            icon ? "pl-2 pr-4" : "px-4",
                            className
                        )}
                        placeholder={props.placeholder || label}
                    />

                    {/* Placeholder Label (when empty or not focused) */}
                    {!(isFocused || hasValue) && (
                        <label
                            className={cn(
                                "absolute transition-all duration-300 pointer-events-none uppercase tracking-widest font-bold top-6 text-[16px] text-navy/20",
                                icon ? "left-2" : "left-4"
                            )}
                        >
                            {label}
                        </label>
                    )}
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
