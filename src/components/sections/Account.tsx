"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Settings as SettingsIcon } from "lucide-react";

type AuthState = "landing" | "signin" | "signup" | "authenticated";

// Random avatars for new users
const RANDOM_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Parker",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Spidey",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Finance",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Stark",
];

export default function Account({ 
  onNavigate, 
  setIsAuthenticated 
}: { 
  onNavigate: (section: string) => void;
  setIsAuthenticated: (val: boolean) => void;
}) {
  const [authState, setAuthState] = useState<AuthState>("landing");
  const [username, setUsername] = useState("Peter");
  const [avatar, setAvatar] = useState(RANDOM_AVATARS[0]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authState === "signup") {
      setAvatar(RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)]);
    }
    setAuthState("authenticated");
    setIsAuthenticated(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8"
    >
      <AnimatePresence mode="wait">
        
        {/* Account 1: Landing / Auth Forms */}
        {authState !== "authenticated" && (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-md flex flex-col items-center gap-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-center drop-shadow-sm">
              Log in to start <br/>manage your money
            </h1>

            {authState === "landing" ? (
              <div className="flex gap-4">
                <button 
                  onClick={() => setAuthState("signup")}
                  className="flex items-center gap-2 border-2 border-foreground rounded-full px-6 py-2 hover:bg-foreground hover:text-background transition-colors font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
                >
                  Sign up <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setAuthState("signin")}
                  className="flex items-center gap-2 bg-foreground text-background rounded-full px-6 py-2 hover:opacity-90 transition-opacity font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuth} className="w-full flex flex-col gap-4 bg-white/20 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/50">
                <input 
                  type="text" 
                  placeholder="Username" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none transition-colors"
                />
                {authState === "signup" && (
                  <input 
                    type="email" 
                    placeholder="Email" 
                    required
                    className="px-4 py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none transition-colors"
                  />
                )}
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  className="px-4 py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none transition-colors"
                />
                
                <div className="flex justify-between items-center mt-2">
                  <button 
                    type="button"
                    onClick={() => setAuthState("landing")}
                    className="text-sm font-medium hover:underline"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="bg-foreground text-background px-6 py-2 rounded-xl font-bold shadow-md hover:scale-105 transition-transform"
                  >
                    {authState === "signin" ? "Enter" : "Create Account"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {/* Account 2: Profile Page */}
        {authState === "authenticated" && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl flex flex-col justify-between h-full py-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-start w-full">
              
              {/* Left Side: Welcome Text */}
              <motion.div 
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mt-20"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  Welcome, <br/><span className="text-coral">"{username}"</span>
                </h1>
                <p className="text-xl font-medium text-gray-700 bg-white/30 backdrop-blur-md inline-block px-4 py-2 rounded-xl shadow-sm">
                  Hope you will get smooth and clean experience !!
                </p>
                <div className="mt-12">
                   <button 
                      onClick={() => onNavigate("assistant")}
                      className="group flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full text-lg font-bold shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <span>Continue to Assistant</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>

              {/* Right Side: Avatar */}
              <motion.div 
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col items-center mt-12 mr-12"
              >
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white/50 p-2 backdrop-blur-sm group hover:scale-105 transition-transform">
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                </div>
                <p className="mt-4 font-semibold text-lg drop-shadow-sm">@{username}</p>
              </motion.div>
            </div>

            {/* Bottom Settings Button */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-end w-full"
            >
              <button 
                onClick={() => alert("Settings Demo Mode")}
                className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-white/50 hover:bg-white/60 transition-colors"
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="font-semibold">Settings</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
