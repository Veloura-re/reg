"use client";

import { motion } from "framer-motion";

export function QuillBackground() {
  return (
    <div
      className="fixed inset-0 z-[-1]"
    >
      <div className="orb orb-primary" />
      <div className="orb orb-secondary" />
      <div className="cyber-grid" />
      <div className="digital-grain opacity-5" />
    </div>
  );
}
