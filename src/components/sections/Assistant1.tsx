"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Assistant1({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [runningNumber, setRunningNumber] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    const duration = 2000;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function outExpo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setRunningNumber(Math.floor(easeOut * 123456789));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Continuous random fluctuation after initial count
        setInterval(() => {
          setRunningNumber(prev => prev + Math.floor(Math.random() * 1000 - 200));
        }, 1500);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }} // Slide from left
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }} // Slide back out left
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-between py-24 px-8"
    >
      <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
        
        {/* Statistics Block */}
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl flex items-center gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Statistics</h2>
            <p className="text-lg font-medium text-gray-700 bg-white/40 px-3 py-1 rounded-md shadow-sm">
              With 100% accuracy <span className="text-green-600">✔</span>
            </p>
          </div>
          
          {/* Simple CSS Pie Chart / Donut */}
          <div className="relative w-32 h-32 rounded-full shadow-[0_0_20px_rgba(235,143,52,0.4)] flex items-center justify-center bg-[conic-gradient(var(--color-orange)_0%_40%,var(--color-coral)_40%_75%,var(--color-sandy)_75%_100%)]">
            <div className="w-24 h-24 bg-white/90 backdrop-blur-xl rounded-full shadow-inner flex items-center justify-center">
              <span className="font-bold text-xl">Top</span>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <button 
            onClick={() => onNavigate("assistant2")}
            className="group flex items-center gap-3 bg-foreground text-background px-10 py-5 rounded-full text-xl font-bold shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
          >
            <span>GET STARTED <span className="px-2 py-1 bg-white/20 rounded-md">NOW</span></span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-500 font-medium tracking-widest mt-2">
            CLICK TO PROCEED TO ASSISTANT
          </p>
        </div>
      </div>

      {/* Running Numbers Block */}
      <div className="w-full flex justify-center mb-10">
        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-10 py-6 rounded-2xl border border-white/20 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
          <span className="text-gray-600 font-bold uppercase tracking-widest text-sm">Real-time Data</span>
          <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
          <span className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange to-coral tabular-nums tracking-tight">
            {runningNumber.toLocaleString()}
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </motion.div>
  );
}
