"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { MouseEvent, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  { name: "Food", pos: "top-20 left-1/4" },
  { name: "Drink", pos: "top-1/4 right-1/4" },
  { name: "Transportation", pos: "top-1/2 left-1/5" },
  { name: "Shopping", pos: "top-1/3 left-1/2" },
  { name: "Bills", pos: "bottom-1/3 right-1/3" },
  { name: "Healthcare", pos: "bottom-1/4 left-1/3" },
  { name: "Entertainment", pos: "top-2/3 right-1/5" },
  { name: "Travel", pos: "top-3/4 left-1/2" },
  { name: "Other", pos: "bottom-10 right-1/4" }
];

export default function WebRevealTransition({ onComplete }: { onComplete: () => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ clientX, clientY, currentTarget }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Flashlight mask
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, black 40%, transparent 100%)`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 w-full h-full bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center cursor-crosshair overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Spider Web Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-[80vw] h-[80vh] stroke-white stroke-[0.2] fill-transparent">
          {/* Simple Web drawing */}
          {[10, 20, 30, 40, 50].map((r) => (
            <polygon key={r} points="50,50" />
            // actually just drawing concentric octagons and radial lines
          ))}
          <path d="M 50 0 L 50 100 M 0 50 L 100 50 M 15 15 L 85 85 M 15 85 L 85 15" />
          <circle cx="50" cy="50" r="10" />
          <circle cx="50" cy="50" r="25" />
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>

      {/* Hidden Items waiting to be revealed */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage,
          WebkitMaskImage: maskImage
        }}
      >
        {CATEGORIES.map((cat, idx) => (
          <div key={idx} className={`absolute ${cat.pos} text-white font-bold text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]`}>
            {cat.name}
          </div>
        ))}
      </motion.div>

      <div className="absolute bottom-10 z-10 flex flex-col items-center gap-4">
        <p className="text-gray-400 text-sm">Hover around the web to reveal categories</p>
        <button 
          onClick={onComplete}
          className="flex items-center gap-2 bg-spidey-blue text-white px-6 py-3 rounded-full hover:bg-spidey-red transition-colors"
        >
          <span>Continue to Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
