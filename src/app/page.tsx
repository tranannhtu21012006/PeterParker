"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import ShaderBackground from "@/components/3d/ShaderBackground";
import Overview from "@/components/sections/Overview";
import WebRevealTransition from "@/components/sections/WebRevealTransition";
import Account from "@/components/sections/Account";
import Assistant from "@/components/sections/Assistant";
import AboutUs from "@/components/sections/AboutUs";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState("overview");

  // Restore session on mount + listen for auth changes
  useEffect(() => {
    // Get current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // Scroll back to overview
    document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" });
  };

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [user]); // re-observe when auth changes (assistant section mounts/unmounts)

  const navItems = ["Overview", "Account", ...(user ? ["Assistant"] : []), "About"];

  return (
    <main
      ref={containerRef}
      className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-background scroll-smooth"
    >
      {/* Fixed Background Layer with Parallax */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ShaderBackground scrollProgress={scrollYProgress} />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full">

        <section id="overview" className="w-full min-h-screen relative flex items-center justify-center">
          <Overview
            user={user}
            onNavigate={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            onLogout={handleLogout}
          />
        </section>

        {/* The Account Section with Web Reveal Overlay */}
        <section id="account" className="w-full min-h-screen relative overflow-hidden">
          <Account
            user={user}
            onNavigate={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          />
          <WebRevealTransition onComplete={() => {}} />
        </section>

        {/* Conditional Assistant Sections based on auth */}
        {user && (
          <section id="assistant" className="w-full min-h-screen relative">
            <Assistant
              user={user}
              onNavigate={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            />
          </section>
        )}

        <section id="about" className="w-full min-h-screen relative overflow-hidden">
          <AboutUs onNavigate={(id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} />
        </section>

      </div>

      {/* 3D Glowing Navigation Dots/Links */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50 mix-blend-difference pointer-events-none">
        {navItems.map((item) => {
          const id = item.toLowerCase();
          const isActive = activeSection === id;
          return (
            <div key={item} className="flex justify-end pointer-events-auto">
              <button
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                className={`text-right font-bold transition-all duration-500 ease-out ${
                  isActive
                    ? "text-xl text-orange scale-125 translate-x-[-10px] drop-shadow-[0_0_15px_rgba(235,143,52,0.8)]"
                    : "text-sm text-white/50 hover:text-white hover:scale-110"
                }`}
                style={{
                  textShadow: isActive ? "0 0 20px rgba(235,143,52,0.6), 0 0 10px rgba(255,255,255,0.3)" : "none",
                }}
              >
                {item}
              </button>
            </div>
          );
        })}
      </nav>
    </main>
  );
}
