"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft } from "lucide-react";

export default function AboutUs({ onNavigate }: { onNavigate: (section: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  // As user scrolls down (0 -> 1), the spider moves down
  const spiderY = useTransform(scrollYProgress, [0, 1], [-100, 300]);
  // As user scrolls down, footer rises up
  const footerY = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 w-full h-full bg-gradient-to-b from-spidey-blue to-spidey-red text-white overflow-y-auto"
      ref={containerRef}
    >
      <div className="relative min-h-[150vh] w-full flex flex-col items-center">
        
        {/* Top Back Button */}
        <div className="absolute top-10 left-10 z-50">
          <button 
            onClick={() => onNavigate("assistant2")}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" /> Get Back
          </button>
        </div>

        {/* The Spider */}
        <motion.div 
          className="fixed top-0 flex flex-col items-center"
          style={{ y: spiderY }}
        >
          {/* Web Line */}
          <div className="w-1 h-32 bg-white/50" />
          {/* Mock Spider Image / Icon */}
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center relative shadow-2xl">
            {/* Spider Legs Mock */}
            <div className="absolute w-32 h-2 bg-black -z-10 rotate-45"></div>
            <div className="absolute w-32 h-2 bg-black -z-10 -rotate-45"></div>
            
            {/* The Sign */}
            <div className="absolute top-full mt-4 bg-white text-spidey-red font-bold text-xl px-6 py-3 rounded-lg shadow-xl whitespace-nowrap -rotate-3 border-4 border-black">
              Try Now!
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <div className="absolute top-1/3 text-white/50 animate-bounce">
          Scroll down...
        </div>

        {/* Spacer to allow scrolling */}
        <div className="flex-1" />

        {/* Footer */}
        <motion.div 
          className="w-full bg-black/80 backdrop-blur-md p-8 flex justify-between items-center text-sm md:text-base absolute bottom-0"
          style={{ y: footerY }}
        >
          <div className="font-bold tracking-widest text-white/80">
            Built By <br/>
            <span className="text-xl text-white">TranAnhTu ↑</span>
          </div>
          <div className="text-right font-medium text-white/80 flex flex-col gap-1">
            <span className="text-xl font-bold text-white mb-2">Keep In Touch</span>
            <span>for product updates</span>
            <span>trananhtu21012000@gmail.com</span>
            <span>Instagram: dnexq_</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
