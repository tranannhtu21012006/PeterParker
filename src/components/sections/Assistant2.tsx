"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, PlusCircle, Search, History as HistoryIcon, PieChart, Target, CheckCircle2 } from "lucide-react";
import { MatrixChart } from "@/components/ui/MatrixChart";

type SubView = "menu" | "importing" | "history" | "searching" | "statistics" | "saving_goals";

const MENU_ITEMS = [
  { id: "importing", label: "Importing", icon: PlusCircle },
  { id: "history", label: "History Counter", icon: HistoryIcon },
  { id: "searching", label: "Searching", icon: Search },
  { id: "statistics", label: "Statistics", icon: PieChart },
  { id: "saving_goals", label: "Saving Goals", icon: Target },
];

const CATEGORIES = [
  "Food", "Drink", "Transportation", "Shopping", "Bills", "Healthcare", "Entertainment", "Travel", "Other"
];

export default function Assistant2({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [view, setView] = useState<SubView>("menu");
  
  // Importing state
  const [selectedCat, setSelectedCat] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Imported ${amount} for ${selectedCat} with note: ${note}`);
    setAmount("");
    setNote("");
    setView("menu");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      className="absolute inset-0 w-full h-full flex items-center justify-center p-8"
    >
      <AnimatePresence mode="wait">
        
        {/* MAIN MENU */}
        {view === "menu" && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center gap-12 lg:gap-32 w-full max-w-5xl"
          >
            {/* Center Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)] overflow-hidden bg-white/50 p-2 backdrop-blur-sm group hover:scale-105 transition-transform duration-500">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Parker" alt="Avatar" className="w-full h-full object-cover rounded-full" />
              </div>
              <h2 className="text-2xl font-bold bg-white/40 px-4 py-1 rounded-full backdrop-blur-md">@Peter</h2>
            </div>

            {/* Right Menu - Compact Hover List */}
            <div className="flex flex-col gap-3">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id as SubView)}
                    className="group flex items-center bg-white/20 hover:bg-white/60 backdrop-blur-md rounded-full shadow-md transition-all duration-300 overflow-hidden w-16 hover:w-64 border border-white/40 h-16"
                  >
                    <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <span className="text-lg font-bold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-6">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* IMPORTING VIEW */}
        {view === "importing" && (
          <motion.div 
            key="importing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl bg-white/40 backdrop-blur-2xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => setView("menu")} className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors shadow-sm">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold">Importing</h2>
            </div>
            
            <p className="text-lg font-medium text-gray-800">Choose a category to keep your spending organized</p>

            <div className="flex gap-10 h-[350px]">
              {/* Categories Scroll */}
              <div className="flex flex-col gap-2 overflow-y-auto pr-4 w-1/3 hover:scrollbar-thin scrollbar-thumb-orange scrollbar-track-transparent">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`px-6 py-3 rounded-xl font-semibold text-left transition-colors ${selectedCat === cat ? "bg-foreground text-background shadow-md" : "bg-white/50 hover:bg-white/80"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <div className="flex-1">
                {selectedCat ? (
                  <form onSubmit={handleImport} className="flex flex-col gap-6 h-full">
                    <div className="bg-white/60 p-6 rounded-2xl flex flex-col gap-6 flex-1 shadow-inner">
                      <div>
                        <label className="text-sm font-bold text-gray-600 uppercase">Amount</label>
                        <input 
                          type="number" 
                          required
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full text-4xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-orange outline-none py-2 tabular-nums"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-600 uppercase">Note</label>
                        <input 
                          type="text" 
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="w-full text-lg bg-transparent border-b-2 border-gray-300 focus:border-orange outline-none py-2"
                          placeholder="What was this for?"
                        />
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-auto">* Date and time will be automatically recorded.</p>
                    </div>
                    
                    <button type="submit" className="bg-foreground text-background py-4 rounded-xl font-bold text-lg hover:opacity-90 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                      <CheckCircle2 className="w-6 h-6" /> Save Transaction
                    </button>
                  </form>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 font-medium text-lg border-2 border-dashed border-gray-400/50 rounded-2xl bg-white/20">
                    Select a category first
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SEARCHING VIEW (With Matrix Chart) */}
        {view === "searching" && (
           <motion.div 
           key="searching"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -20 }}
           className="w-full max-w-5xl bg-white/40 backdrop-blur-2xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8 h-[600px]"
         >
           <div className="flex items-center gap-4">
             <button onClick={() => setView("menu")} className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors shadow-sm">
               <ArrowLeft className="w-6 h-6" />
             </button>
             <h2 className="text-3xl font-bold">Searching & Analysis</h2>
           </div>
           
           <div className="flex-1 w-full">
              <MatrixChart />
           </div>
         </motion.div>
        )}

        {/* OTHER VIEWS (History, Statistics, Saving Goals) */}
        {["history", "statistics", "saving_goals"].includes(view) && (
          <motion.div 
            key="other"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl bg-white/30 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8 min-h-[500px]"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => setView("menu")} className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors shadow-sm">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold capitalize">{view.replace("_", " ")}</h2>
            </div>
            
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
              <p className="text-xl text-gray-700 font-medium">This module will be connected to Supabase</p>
              <div className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full animate-spin shadow-md"></div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
