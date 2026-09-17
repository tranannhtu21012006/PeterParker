"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import PLogo3D from "@/components/3d/PLogo3D";
import { ArrowRight, LogOut } from "lucide-react";
import { ShimmerText, GradientWipeText, MotionHighlight } from "@/components/ui/AnimatedText";
import type { User } from "@supabase/supabase-js";

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
      className="relative flex flex-col justify-between p-8 lg:p-24 w-full min-h-screen gap-12 z-10"
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
        <div />

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
