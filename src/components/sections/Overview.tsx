"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import PLogo3D from "@/components/3d/PLogo3D";
import { ArrowRight, LogOut } from "lucide-react";
import { ShimmerText, GradientWipeText, MotionHighlight } from "@/components/ui/AnimatedText";
import type { User } from "@supabase/supabase-js";

// ─── Floating Orbs Animation ─────────────────────────────────────────────────
// A canvas-based animation of soft glowing orbs that drift and pulse,
// representing money flowing through your financial life.
function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Orb configuration
    const ORBS = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 22 + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      color: [
        "rgba(235, 143, 52,",   // orange
        "rgba(229, 115, 90,",   // coral
        "rgba(255, 200, 120,",  // warm gold
        "rgba(240, 160, 80,",   // amber
      ][i % 4],
    }));

    // Money symbols to float
    const SYMBOLS = ["$", "₿", "¥", "€", "%", "∞"];
    const particles = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      alpha: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.3 + 0.1,
      size: Math.random() * 12 + 10,
    }));

    let frame: number;
    let t = 0;

    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw orbs
      ORBS.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        // Bounce
        if (orb.x < orb.r || orb.x > canvas.width - orb.r) orb.vx *= -1;
        if (orb.y < orb.r || orb.y > canvas.height - orb.r) orb.vy *= -1;

        const pulse = Math.sin(t * 1.5 + orb.phase) * 0.3 + 0.7;
        const grd = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * 2.5);
        grd.addColorStop(0, `${orb.color}${(0.55 * pulse).toFixed(2)})`);
        grd.addColorStop(0.5, `${orb.color}${(0.2 * pulse).toFixed(2)})`);
        grd.addColorStop(1, `${orb.color}0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      // Draw floating symbols
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        ctx.font = `bold ${p.size}px monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(180, 90, 20, ${p.alpha * (0.6 + Math.sin(t * 2 + p.x) * 0.4)})`;
        ctx.fillText(p.symbol, p.x, p.y);
      });

      // Draw subtle connecting lines between close orbs
      for (let i = 0; i < ORBS.length; i++) {
        for (let j = i + 1; j < ORBS.length; j++) {
          const dx = ORBS[i].x - ORBS[j].x;
          const dy = ORBS[i].y - ORBS[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(ORBS[i].x, ORBS[i].y);
            ctx.lineTo(ORBS[j].x, ORBS[j].y);
            ctx.strokeStyle = `rgba(235, 143, 52, ${0.15 * (1 - dist / 80)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-64 h-80 group mb-16 ml-4">
      {/* Cat on top */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 text-4xl hover:animate-bounce cursor-default transition-transform" title="Meow">
        🐈
      </div>
      
      {/* Floating Hearts */}
      <div className="absolute top-10 -left-6 z-20 text-2xl animate-pulse">💖</div>
      <div className="absolute bottom-1/4 -right-5 z-20 text-3xl animate-bounce" style={{ animationDuration: '3s' }}>💘</div>
      
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative border-2 border-white/40 bg-white/10 backdrop-blur-md">
        
        {/* Background Image (Rotated vertically properly) */}
        <img 
          src="/portrait.jpg" 
          alt="Portrait" 
          className="absolute inset-0 w-full h-full object-cover transform -rotate-90 scale-[1.35] translate-x-4 origin-center opacity-90" 
        />
        
        {/* Dark overlay to make the canvas orbs and text pop out */}
        <div className="absolute inset-0 bg-black/20 z-0"></div>

        {/* Canvas for Orbs */}
        <canvas ref={canvasRef} className="w-full h-full block relative z-10 mix-blend-screen" style={{ width: "100%", height: "100%" }} />
        
        <div className="absolute bottom-3 left-0 right-0 flex justify-center z-20">
          <span className="text-[10px] font-bold text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Live Flow</span>
        </div>
      </div>
    </div>
  );
}

// ─── Overview Component ───────────────────────────────────────────────────────
export default function Overview({
  user,
  onNavigate,
  onLogout,
}: {
  user: User | null;
  onNavigate: (section: string) => void;
  onLogout: () => void;
}) {
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

        {/* Top Right: P Logo */}
        <div className="hidden md:block">
          <PLogo3D />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end w-full">

        {/* Left: Creative Orbs Animation */}
        <FloatingOrbs />

        {/* Right: Action Area */}
        <div className="flex flex-col items-end gap-6">
          <p className="text-xl md:text-2xl font-semibold text-foreground bg-white/30 px-6 py-3 rounded-full backdrop-blur-md shadow-lg border border-white/40">
            Always know where your money is going.
          </p>

          {user ? (
            /* Logged-in state: show greeting + logout */
            <div className="flex flex-col items-end gap-3">
              <span className="text-base font-semibold text-gray-700 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/40">
                👋 Hi, {user.email?.split("@")[0]}
              </span>
              <button
                onClick={onLogout}
                className="group flex items-center gap-3 border-2 border-foreground/60 text-foreground px-8 py-4 rounded-full text-lg font-bold shadow-md hover:-translate-y-1 hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            /* Not logged in: show login button */
            <button
              onClick={() => onNavigate("account")}
              className="group flex items-center gap-3 bg-foreground text-background px-10 py-5 rounded-full text-xl font-bold shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
            >
              <span>Log In</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
