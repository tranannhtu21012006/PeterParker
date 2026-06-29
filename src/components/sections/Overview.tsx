"use client";

import { motion, AnimatePresence } from "framer-motion";
import PLogo3D from "@/components/3d/PLogo3D";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// Mock images for the scrolling carousel
const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1580519542036-ed47c71fd482?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
];

export default function Overview({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % MOCK_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute inset-0 flex flex-col justify-between p-12 lg:p-24 w-full h-full"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start w-full">
        <div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground drop-shadow-sm">
            Your Smart<br />
            <span className="text-coral">Accountant</span>
          </h1>
          <p className="mt-4 text-xl font-medium text-gray-800">
            Help you with your financial problem
          </p>
        </div>
        
        {/* Top Right Animation 1 (P Logo) */}
        <div className="hidden md:block">
          <PLogo3D />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end w-full">
        {/* Pics Scroll */}
        <div className="w-64 h-40 bg-white/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImg}
              src={MOCK_IMAGES[currentImg]}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Finance"
            />
          </AnimatePresence>
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] rounded-2xl pointer-events-none" />
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-end gap-6">
          <p className="text-2xl font-semibold text-foreground bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
            Always know where your money is going.
          </p>
          <button 
            onClick={() => onNavigate("account")}
            className="group flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full text-lg font-bold shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
          >
            <span>Log In</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
