"use client";

import { motion } from "framer-motion";
import PLogo3D from "@/components/3d/PLogo3D";
import { ArrowRight } from "lucide-react";
import { ShimmerText, GradientWipeText, MotionHighlight } from "@/components/ui/AnimatedText";

// Mock images for the scrolling carousel (Warm/Coral/Orange theme)
const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80", // Orange coins/piggy bank
  "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=400&q=80", // Warm aesthetic finance
  "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=400&q=80", // Financial charts warm
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80", // Orange app UI
];

export default function Overview({ onNavigate }: { onNavigate: (section: string) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col justify-between p-12 lg:p-24 w-full h-full"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start w-full">
        <div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground drop-shadow-sm flex flex-col items-start leading-[1.1]">
            <GradientWipeText>Your Smart</GradientWipeText>
            <ShimmerText className="text-coral">Accountant</ShimmerText>
          </h1>
          <p className="mt-6 text-2xl font-medium text-gray-800">
            Help you with your <MotionHighlight delay={1.5}>financial problems</MotionHighlight>
          </p>
        </div>
        
        {/* Top Right Animation 1 (P Logo) */}
        <div className="hidden md:block">
          <PLogo3D />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end w-full">
        
        {/* Vertical Pics Scroll - Floating up style */}
        <div className="w-64 h-56 bg-white/10 backdrop-blur-md rounded-md overflow-hidden shadow-2xl relative border border-white/20">
          <div className="absolute inset-0 flex flex-col w-full animate-marquee-vertical">
             {/* Duplicate images to create infinite scroll illusion */}
             {[...MOCK_IMAGES, ...MOCK_IMAGES].map((src, i) => (
                <div key={i} className="w-full h-40 shrink-0 p-2">
                   <img src={src} className="w-full h-full object-cover rounded-md shadow-md" alt="finance preview" />
                </div>
             ))}
          </div>
          {/* Fading gradients at top and bottom to mask the cutoff */}
          <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-end gap-6">
          <p className="text-xl md:text-2xl font-semibold text-foreground bg-white/30 px-6 py-3 rounded-full backdrop-blur-md shadow-lg border border-white/40">
            Always know where your money is going.
          </p>
          <button 
            onClick={() => onNavigate("account")}
            className="group flex items-center gap-3 bg-foreground text-background px-10 py-5 rounded-full text-xl font-bold shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
          >
            <span>Log In</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
