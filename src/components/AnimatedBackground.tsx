"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export const AnimatedBackground = () => {
    // Use motion values instead of state to prevent re-renders
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Map mouse position to movement range
    const moveX = useTransform(springX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-50, 50]);
    const moveY = useTransform(springY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-50, 50]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Update motion values directly without triggering re-render
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-white">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    style={{
                        x: moveX,
                        y: moveY,
                    }}
                    className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-emerald-500/[0.08] blur-[80px] rounded-full"
                />
                <motion.div
                    style={{
                        x: useTransform(moveX, (val: number) => -val),
                        y: useTransform(moveY, (val: number) => -val),
                    }}
                    className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-[#001A3D]/[0.05] blur-[80px] rounded-full"
                />
                <motion.div
                    className="absolute top-[20%] left-[20%] w-[50%] h-[50%] bg-[#C5A028]/[0.04] blur-[60px] rounded-full"
                />
            </div>

            {/* Visionary Grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px),
                           linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
                    backgroundSize: '12rem 12rem',
                    maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)'
                }}
            />

            {/* Grain/Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply" />

            {/* Dust Particles (Subtle) */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />
        </div>
    );
};

