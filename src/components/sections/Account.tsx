"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type AuthState = "landing" | "signin" | "signup" | "authenticated";

const RANDOM_AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Parker",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Spidey",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Finance",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Stark",
];

export default function Account({
  user,
  onNavigate,
}: {
  user: User | null;
  onNavigate: (section: string) => void;
}) {
  const [authState, setAuthState] = useState<AuthState>("landing");
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(RANDOM_AVATARS[0]);
  const [profileUsername, setProfileUsername] = useState("");

  // Sync when user logs in from session restore
  useEffect(() => {
    if (user) {
      setAuthState("authenticated");
      fetchProfile();
    } else {
      setAuthState("landing");
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    if (data) {
      setProfileUsername(data.username || user.email?.split("@")[0] || "User");
      setAvatar(data.avatar_url || RANDOM_AVATARS[0]);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: signinEmail,
      password: signinPassword,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // onAuthStateChange in page.tsx will handle the state update
      onNavigate("assistant");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }
    // Create profile row
    if (data.user) {
      const randomAvatar = RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)];
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: signupUsername,
        avatar_url: randomAvatar,
      });
    }
    setLoading(false);
    // Go to signin after signup
    setSigninEmail(signupEmail);
    setSignupEmail("");
    setSignupPassword("");
    setSignupUsername("");
    setAuthState("signin");
    setError("Account created! Please sign in.");
  };

  const displayName = profileUsername || user?.email?.split("@")[0] || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8"
    >
      <AnimatePresence mode="wait">

        {/* Auth Forms (not logged in) */}
        {authState !== "authenticated" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-md flex flex-col items-center gap-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-center drop-shadow-sm">
              Log in to start <br />manage your money
            </h1>

            {authState === "landing" ? (
              <div className="flex gap-4">
                <button
                  onClick={() => { setError(""); setAuthState("signup"); }}
                  className="flex items-center gap-2 border-2 border-foreground rounded-full px-6 py-2 hover:bg-foreground hover:text-background transition-colors font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
                >
                  Sign up <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setError(""); setAuthState("signin"); }}
                  className="flex items-center gap-2 bg-foreground text-background rounded-full px-6 py-2 hover:opacity-90 transition-opacity font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
                >
                  Sign In
                </button>
              </div>
            ) : authState === "signin" ? (
              <form onSubmit={handleSignIn} className="w-full flex flex-col gap-4 bg-white/20 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/50">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none transition-colors"
                />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none transition-colors"
                />
                {error && (
                  <p className={`text-sm font-medium text-center ${error.includes("created") ? "text-green-700" : "text-red-600"}`}>
                    {error}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <button type="button" onClick={() => setAuthState("landing")} className="text-sm font-medium hover:underline">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-foreground text-background px-6 py-2 rounded-xl font-bold shadow-md hover:scale-105 transition-transform disabled:opacity-60"
                  >
                    {loading ? "..." : "Enter"}
                  </button>
                </div>
              </form>
            ) : (
              /* Signup form — completely separate state from signin */
              <form onSubmit={handleSignUp} className="w-full flex flex-col gap-4 bg-white/20 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/50">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none transition-colors"
                />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  required
                  minLength={6}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none transition-colors"
                />
                {error && <p className="text-sm font-medium text-red-600 text-center">{error}</p>}
                <div className="flex justify-between items-center mt-2">
                  <button type="button" onClick={() => setAuthState("landing")} className="text-sm font-medium hover:underline">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-foreground text-background px-6 py-2 rounded-xl font-bold shadow-md hover:scale-105 transition-transform disabled:opacity-60"
                  >
                    {loading ? "..." : "Create Account"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {/* Profile Page (logged in) */}
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
                  Welcome, <br /><span className="text-coral">&quot;{displayName}&quot;</span>
                </h1>
                <p className="text-xl font-medium text-gray-700 bg-white/30 backdrop-blur-md inline-block px-4 py-2 rounded-xl shadow-sm">
                  Hope you will get smooth and clean experience!!
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
                <p className="mt-4 font-semibold text-lg drop-shadow-sm">@{displayName}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
