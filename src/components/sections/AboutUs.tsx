"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft } from "lucide-react";

const CINEMA_IMAGES = [
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
];

export default function AboutUs({ onNavigate }: { onNavigate: (section: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef, offset: ["start end", "end end"] });
  
  // Swing the spider down to halfway the screen.
  // 0 -> starts off screen top (-200px)
  // 0.5 to 1 -> reaches and stays at 40vh
  const spiderY = useTransform(scrollYProgress, [0, 0.5, 1], ["-300px", "40vh", "40vh"]);
  
  // Footer slides in
  const footerY = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="absolute inset-0 w-full h-full bg-black text-white overflow-hidden flex flex-col"
      ref={containerRef}
    >
      {/* Curved Cinema Background Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden" style={{ perspective: '1000px' }}>
        <div 
          className="w-[150vw] h-[80vh] absolute top-[-10vh] left-[-25vw] bg-white/5 opacity-40 shadow-inner flex flex-col justify-center"
          style={{ 
            borderRadius: '0 0 50% 50%',
            transform: 'rotateX(10deg)',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
          }}
        >
          <div className="flex w-max animate-marquee-horizontal h-[40vh] items-center gap-10">
            {[...CINEMA_IMAGES, ...CINEMA_IMAGES, ...CINEMA_IMAGES].map((src, i) => (
              <img key={i} src={src} className="w-[400px] h-full object-cover rounded-xl shadow-[0_0_50px_rgba(235,143,52,0.3)] opacity-80" alt="Cinema Reel" />
            ))}
          </div>
        </div>
      </div>

      <div className="relative min-h-[150vh] w-full flex flex-col items-center z-10">
        
        {/* Top Back Button */}
        <div className="absolute top-10 left-10 z-50">
          <button 
            onClick={() => onNavigate("assistant")}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 hover:bg-white/30 transition-colors backdrop-blur-md border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Assistant
          </button>
        </div>

        {/* The Spider */}
        <motion.div 
          className="fixed top-0 flex flex-col items-center"
          style={{ y: spiderY }}
        >
          {/* Web Line */}
          <div className="w-0.5 h-64 bg-white/50 -mt-64" />
          
          {/* Mock Spider Image */}
          <div className="relative flex flex-col items-center group cursor-pointer" onClick={() => onNavigate("account")}>
             <img 
               src="https://cdn3d.iconscout.com/3d/premium/thumb/spider-4993427-4159518.png" 
               alt="Spider" 
               className="w-32 h-32 object-contain drop-shadow-[0_20px_20px_rgba(235,143,52,0.5)] group-hover:scale-110 transition-transform duration-500" 
             />
            
            {/* The Sign */}
            <div className="absolute top-full mt-2 bg-gradient-to-r from-orange to-coral text-white font-bold text-xl px-8 py-4 rounded-xl shadow-[0_10px_30px_rgba(235,143,52,0.6)] whitespace-nowrap -rotate-2 border-2 border-white/50 group-hover:rotate-0 transition-transform duration-300">
              Try Now!
            </div>
          </div>
        </motion.div>

        {/* Spacer to allow scrolling */}
        <div className="flex-1" />

        {/* Footer */}
        <motion.div 
          className="w-full bg-black/80 backdrop-blur-md p-8 flex justify-between items-center text-sm md:text-base absolute bottom-0 border-t border-white/20"
          style={{ y: footerY }}
        >
          <div className="font-bold tracking-widest text-white/80">
            Built By <br/>
            <span className="text-xl text-white">TranAnhTu ↑</span>
          </div>
          <div className="text-right font-medium text-white/80 flex flex-col gap-1">
            <span className="text-xl font-bold text-white mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange to-coral">Keep In Touch</span>
            <span>for product updates</span>
            <span>trananhtu21012000@gmail.com</span>
            <span>Instagram: dnexq_</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
