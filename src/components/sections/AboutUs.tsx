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
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Spider swings in from top, stops at ~40% viewport
  const spiderY = useTransform(scrollYProgress, [0, 0.6, 1], ["-260px", "36vh", "36vh"]);

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-black text-white flex flex-col">

      {/* ── Curved Cinema Background ── */}
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        style={{ perspective: "1000px" }}
      >
        <div
          className="w-[160vw] h-[75vh] absolute top-[-8vh] left-[-30vw] flex items-center opacity-35"
          style={{
            borderRadius: "0 0 50% 50%",
            transform: "rotateX(12deg)",
            maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
          }}
        >
          <div className="flex w-max animate-marquee-horizontal h-[45vh] items-center gap-10">
            {[...CINEMA_IMAGES, ...CINEMA_IMAGES, ...CINEMA_IMAGES].map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-[420px] h-full object-cover rounded-xl shadow-[0_0_50px_rgba(235,143,52,0.4)]"
                alt=""
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content (grows to fill space) ── */}
      <div className="relative z-10 w-full flex flex-col flex-1">

        {/* Back button */}
        <button
          onClick={() => onNavigate("assistant")}
          className="absolute top-10 left-10 z-50 flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 transition-all backdrop-blur-md border border-white/20"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Assistant
        </button>

        {/* PARKER center title */}
        <div className="flex-1 flex items-center justify-center pt-24 pb-16">
          <div className="text-center select-none">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="font-black tracking-widest text-transparent bg-clip-text"
              style={{
                fontSize: "clamp(4rem, 10vw, 9rem)",
                backgroundImage: "linear-gradient(135deg, #fff 0%, rgba(235,143,52,0.9) 50%, #fff 100%)",
                textShadow: "none",
                filter: "drop-shadow(0 0 60px rgba(235,143,52,0.4))",
              }}
            >
              PARKER
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white/50 text-xl font-medium tracking-[0.4em] mt-2 uppercase"
            >
              Your Smart Accountant
            </motion.p>
          </div>
        </div>

        {/* Spider — hangs from fixed top, descends on scroll, shifted left */}
        <motion.div
          className="fixed top-0 flex flex-col items-center pointer-events-none z-30"
          style={{ y: spiderY, left: "28%" }}
        >
          {/* Silky thread */}
          <div
            className="w-px"
            style={{
              height: "270px",
              marginTop: "-270px",
              background: "linear-gradient(to bottom, transparent, rgba(180,220,255,0.4), rgba(180,220,255,0.8))",
            }}
          />

          {/* Web image + Try Now */}
          <div
            className="relative flex flex-col items-center pointer-events-auto cursor-pointer group"
            onClick={() =>
              document.getElementById("account")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <img
              src="/spiderweb.png"
              alt="Spider web"
              className="w-52 h-52 object-contain group-hover:scale-110 transition-transform duration-700"
              style={{
                filter: "brightness(1.15) contrast(1.1) drop-shadow(0 0 25px rgba(100,200,255,0.6))",
              }}
            />

            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mt-2 bg-gradient-to-r from-orange to-coral text-white font-bold text-lg px-8 py-4 rounded-xl shadow-[0_10px_30px_rgba(235,143,52,0.7)] border border-white/30 group-hover:shadow-[0_15px_40px_rgba(235,143,52,0.9)] transition-shadow whitespace-nowrap"
            >
              Try Now! 🕷️
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Footer (always at bottom, not animated away) ── */}
      <div className="relative z-20 w-full bg-black/90 backdrop-blur-md p-8 flex justify-between items-center border-t border-white/10">
        <div className="font-bold tracking-widest text-white/70">
          Built By <br />
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange to-coral">
            TranAnhTu
          </span>
        </div>
        <div className="text-right font-medium text-white/70 flex flex-col gap-1">
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange to-coral mb-2">
            Keep In Touch
          </span>
          <span className="text-sm">for product updates</span>
          <span className="text-sm">trananhtu21012000@gmail.com</span>
          <span className="text-sm">Instagram: dnexq_</span>
        </div>
      </div>
    </div>
  );
}
