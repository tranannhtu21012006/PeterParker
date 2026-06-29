"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ShaderBackground from "@/components/3d/ShaderBackground";
import Overview from "@/components/sections/Overview";
import WebRevealTransition from "@/components/sections/WebRevealTransition";
import Account from "@/components/sections/Account";
import Assistant1 from "@/components/sections/Assistant1";
import Assistant2 from "@/components/sections/Assistant2";
import AboutUs from "@/components/sections/AboutUs";

export default function Home() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <ShaderBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {activeSection === "overview" && (
            <Overview key="overview" onNavigate={() => setActiveSection("webreveal")} />
          )}
          {activeSection === "webreveal" && (
            <WebRevealTransition key="webreveal" onComplete={() => setActiveSection("account")} />
          )}
          {activeSection === "account" && (
            <Account key="account" onNavigate={setActiveSection} />
          )}
          {activeSection === "assistant1" && (
            <Assistant1 key="assistant1" onNavigate={setActiveSection} />
          )}
          {activeSection === "assistant2" && (
            <Assistant2 key="assistant2" onNavigate={setActiveSection} />
          )}
          {activeSection === "about" && (
            <AboutUs key="about" onNavigate={setActiveSection} />
          )}
        </AnimatePresence>
      </div>
      
      {/* Fixed Navigation Dots/Links on the right (Overview, Account, Assistant, About Us) */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {["Overview", "Account", "Assistant", "About Us"].map((item) => (
          <button 
            key={item}
            onClick={() => setActiveSection(item.toLowerCase())}
            className={`text-right text-sm font-medium transition-colors ${
              activeSection === item.toLowerCase() ? "text-orange" : "text-gray-400 hover:text-orange"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </main>
  );
}
