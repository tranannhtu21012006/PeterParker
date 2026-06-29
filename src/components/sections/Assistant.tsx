"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, PlusCircle, Search, History as HistoryIcon, PieChart, Target, CheckCircle2 } from "lucide-react";
import { MatrixChart } from "@/components/ui/MatrixChart";

const CATEGORIES = [
  "Food", "Drink", "Transportation", "Shopping", "Bills", "Healthcare", "Entertainment", "Travel", "Other"
];

const MOCK_HISTORY = [
  { id: 1, cat: "Food", amount: "$45.00", date: "Today, 12:30 PM", desc: "Lunch at Wendy's" },
  { id: 2, cat: "Transportation", amount: "$15.00", date: "Today, 08:15 AM", desc: "Uber to work" },
  { id: 3, cat: "Shopping", amount: "$120.00", date: "Yesterday, 16:45 PM", desc: "New sneakers" },
  { id: 4, cat: "Bills", amount: "$85.00", date: "Oct 24, 09:00 AM", desc: "Internet Bill" },
  { id: 5, cat: "Entertainment", amount: "$30.00", date: "Oct 22, 20:00 PM", desc: "Movie tickets" },
];

export default function Assistant({ onNavigate }: { onNavigate: (section: string) => void }) {
  // Importing state
  const [selectedCat, setSelectedCat] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Imported ${amount} for ${selectedCat} with note: ${note}`);
    setAmount("");
    setNote("");
  };

  return (
    <div className="w-full flex flex-col items-center py-32 px-8 gap-32">
      
      {/* 1. Header / Avatar Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        className="flex flex-col md:flex-row items-center gap-12 max-w-5xl w-full"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)] overflow-hidden bg-white/50 p-2 backdrop-blur-sm group hover:scale-105 transition-transform duration-500">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Parker" alt="Avatar" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="text-2xl font-bold bg-white/40 px-4 py-1 rounded-full backdrop-blur-md">@Peter's Assistant</h2>
        </div>
        <div className="flex-1 bg-white/20 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Hello! I am your AI Accountant.</h2>
          <p className="text-xl text-gray-800">Scroll down to explore your financial hub. I have organized everything for you, from importing new transactions to analyzing your matrix of spending data.</p>
        </div>
      </motion.div>

      {/* 2. Statistics & Saving Goals Row */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl"
      >
        {/* Statistics Block */}
        <div className="flex-1 bg-white/30 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-2xl flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <PieChart className="w-8 h-8 text-orange" />
              <h2 className="text-3xl font-bold">Statistics</h2>
            </div>
            <p className="text-lg font-medium text-gray-700">Monthly overview</p>
            <p className="mt-4 text-sm font-bold bg-white/40 px-3 py-1 rounded-md shadow-sm self-start">
              100% accuracy <span className="text-green-600">✔</span>
            </p>
          </div>
          
          <div className="relative w-40 h-40 rounded-full shadow-[0_0_20px_rgba(235,143,52,0.4)] flex items-center justify-center bg-[conic-gradient(var(--color-orange)_0%_40%,var(--color-coral)_40%_75%,var(--color-sandy)_75%_100%)]">
            <div className="w-28 h-28 bg-white/90 backdrop-blur-xl rounded-full shadow-inner flex items-center justify-center flex-col">
              <span className="font-bold text-2xl text-orange">40%</span>
              <span className="text-xs font-bold text-gray-500">Food</span>
            </div>
          </div>
        </div>

        {/* Saving Goals Block */}
        <div className="flex-1 bg-white/30 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-6">
           <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-coral" />
              <h2 className="text-3xl font-bold">Saving Goals</h2>
            </div>
            <div className="flex flex-col gap-5 mt-2">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Emergency Fund</span>
                  <span>80%</span>
                </div>
                <div className="w-full bg-white/40 h-4 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-orange to-coral h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>New Car</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-white/40 h-4 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-orange to-coral h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Vacation</span>
                  <span>15%</span>
                </div>
                <div className="w-full bg-white/40 h-4 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-orange to-coral h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
        </div>
      </motion.div>

      {/* 3. Importing Block */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        className="w-full max-w-6xl bg-white/40 backdrop-blur-2xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8"
      >
        <div className="flex items-center gap-4">
          <PlusCircle className="w-8 h-8 text-orange" />
          <h2 className="text-3xl font-bold">Import Transaction</h2>
        </div>
        
        <p className="text-lg font-medium text-gray-800">Keep your spending organized on the fly.</p>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col gap-2 h-[350px] overflow-y-auto pr-4 lg:w-1/3 hover:scrollbar-thin scrollbar-thumb-orange scrollbar-track-transparent">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-6 py-4 rounded-xl font-semibold text-left transition-colors ${selectedCat === cat ? "bg-foreground text-background shadow-md scale-[1.02]" : "bg-white/50 hover:bg-white/80"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {selectedCat ? (
              <form onSubmit={handleImport} className="flex flex-col gap-6 h-full">
                <div className="bg-white/60 p-8 rounded-2xl flex flex-col gap-8 flex-1 shadow-inner">
                  <div>
                    <label className="text-sm font-bold text-gray-600 uppercase">Amount</label>
                    <div className="flex items-center border-b-2 border-gray-300 focus-within:border-orange transition-colors">
                      <span className="text-4xl font-bold text-gray-500 mr-2">$</span>
                      <input 
                        type="number" 
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full text-4xl font-bold bg-transparent outline-none py-2 tabular-nums"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600 uppercase">Note (Optional)</label>
                    <input 
                      type="text" 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full text-lg bg-transparent border-b-2 border-gray-300 focus:border-orange outline-none py-2"
                      placeholder="What was this for?"
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-auto">* Date and time will be automatically recorded to the Supabase database.</p>
                </div>
                
                <button type="submit" className="bg-foreground text-background py-5 rounded-xl font-bold text-xl hover:opacity-90 shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95">
                  <CheckCircle2 className="w-6 h-6" /> Save Transaction
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 font-medium text-lg border-2 border-dashed border-gray-400/50 rounded-2xl bg-white/20 p-10 text-center gap-4">
                <ArrowRight className="w-10 h-10 text-gray-400 -rotate-180 md:rotate-0" />
                Select a category from the list to start importing a new transaction.
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 4. History Block */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        className="w-full max-w-6xl bg-white/30 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8"
      >
        <div className="flex items-center gap-4">
           <HistoryIcon className="w-8 h-8 text-orange" />
           <h2 className="text-3xl font-bold">Recent History</h2>
        </div>
        <div className="flex flex-col gap-4">
          {MOCK_HISTORY.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-white/40 hover:bg-white/70">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                   <span className="font-bold text-lg text-orange">{item.cat.charAt(0)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{item.cat}</span>
                  <span className="text-gray-600 text-sm">{item.desc}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-xl text-foreground">{item.amount}</span>
                <span className="text-gray-500 text-xs font-medium">{item.date}</span>
              </div>
            </div>
          ))}
          <button className="mt-4 text-center text-orange font-bold hover:underline">View full history in Supabase...</button>
        </div>
      </motion.div>

      {/* 5. Searching / Matrix Chart Block */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        className="w-full max-w-6xl bg-white/40 backdrop-blur-2xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8 h-[700px]"
      >
        <div className="flex items-center gap-4">
          <Search className="w-8 h-8 text-coral" />
          <h2 className="text-3xl font-bold">Searching & Analysis Data</h2>
        </div>
        
        <div className="flex-1 w-full rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 border-4 border-white/50 rounded-2xl pointer-events-none z-10"></div>
          <MatrixChart />
        </div>
      </motion.div>

    </div>
  );
}
