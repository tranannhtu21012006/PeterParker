"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ShaderBackground from "@/components/3d/ShaderBackground";
import Overview from "@/components/sections/Overview";
import WebRevealTransition from "@/components/sections/WebRevealTransition";
import Account from "@/components/sections/Account";
import Assistant1 from "@/components/sections/Assistant1";
import Assistant2 from "@/components/sections/Assistant2";
import AboutUs from "@/components/sections/AboutUs";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const [isAuthenticated, setIsAuthenticated] = useState(false); // We'll mock this for now

  return (
    <main 
      ref={containerRef}
      className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-background snap-y snap-mandatory scroll-smooth"
    >
      {/* Fixed Background Layer with Parallax */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ShaderBackground scrollProgress={scrollYProgress} />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full">
        
        <section id="overview" className="w-full h-screen snap-start snap-always relative flex items-center justify-center">
          <Overview onNavigate={(id) => document.getElementById(id)?.scrollIntoView()} />
        </section>

        {/* The Account Section with Web Reveal Overlay */}
        <section id="account" className="w-full h-screen snap-start snap-always relative overflow-hidden">
          <Account 
            onNavigate={(id) => document.getElementById(id)?.scrollIntoView()} 
            setIsAuthenticated={setIsAuthenticated} 
          />
          <WebRevealTransition onComplete={() => {}} />
        </section>

        {/* Conditional Assistant Sections based on auth */}
        {isAuthenticated && (
          <>
            <section id="assistant1" className="w-full h-screen snap-start snap-always relative">
              <Assistant1 onNavigate={(id) => document.getElementById(id)?.scrollIntoView()} />
            </section>

            <section id="assistant2" className="w-full h-screen snap-start snap-always relative">
              <Assistant2 onNavigate={(id) => document.getElementById(id)?.scrollIntoView()} />
            </section>
          </>
        )}

        <section id="about" className="w-full h-screen snap-start snap-always relative">
          <AboutUs onNavigate={(id) => document.getElementById(id)?.scrollIntoView()} />
        </section>
        
      </div>
      
      {/* Fixed Navigation Dots/Links on the right */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 mix-blend-difference">
        {["Overview", "Account", ...(isAuthenticated ? ["Assistant1", "Assistant2"] : []), "About"].map((item) => (
          <button 
            key={item}
            onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView()}
            className="text-right text-sm font-bold text-white/50 hover:text-white transition-colors"
          >
            {item}
          </button>
        ))}
      </nav>
    </main>
  );
}
