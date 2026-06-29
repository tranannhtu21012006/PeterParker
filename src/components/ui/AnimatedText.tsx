"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function ShimmerText({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange via-coral to-orange bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
        {children}
      </span>
    </span>
  );
}

export function GradientWipeText({ children, className = "", delay = 0 }: { children: string, className?: string, delay?: number }) {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <motion.span
        initial={{ x: "-100%" }}
        whileInView={{ x: "0%" }}
        transition={{ duration: 1, ease: "easeOut", delay }}
        viewport={{ once: true, margin: "-100px" }}
        className="absolute inset-0 z-10 bg-gradient-to-r from-background to-transparent"
        style={{ mixBlendMode: 'multiply' }}
      />
      {children}
    </span>
  );
}

export function MotionHighlight({ children, className = "", delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-50px" }}
      className={`bg-gradient-to-r from-orange/20 to-coral/20 bg-no-repeat bg-left-bottom ${className}`}
    >
      {children}
    </motion.span>
  );
}
