"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { ArrowRight, PlusCircle, Search, History as HistoryIcon, PieChart, Target, CheckCircle2, CalendarDays } from "lucide-react";

const CATEGORIES = [
  "Food", "Drink", "Transportation", "Shopping", "Bills", "Healthcare", "Entertainment", "Travel", "Other"
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#EB8F34",
  Drink: "#E87070",
  Transportation: "#70B5E8",
  Shopping: "#B570E8",
  Bills: "#70E8B5",
  Healthcare: "#E8D470",
  Entertainment: "#E87070",
  Travel: "#70E8D4",
  Other: "#A0A0A0",
};

type Transaction = {
  id: number;
  cat: string;
  amount: number;
  date: string;
  time: string;
  desc: string;
};

const INITIAL_HISTORY: Transaction[] = [
  { id: 1, cat: "Food", amount: 45, date: "2025-10-29", time: "12:30", desc: "Lunch at Wendy's" },
  { id: 2, cat: "Transportation", amount: 15, date: "2025-10-29", time: "08:15", desc: "Uber to work" },
  { id: 3, cat: "Shopping", amount: 120, date: "2025-10-28", time: "16:45", desc: "New sneakers" },
  { id: 4, cat: "Bills", amount: 85, date: "2025-10-24", time: "09:00", desc: "Internet Bill" },
  { id: 5, cat: "Entertainment", amount: 30, date: "2025-10-22", time: "20:00", desc: "Movie tickets" },
];

type FilterMode = "day" | "month" | "year";

export default function Assistant({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [history, setHistory] = useState<Transaction[]>(INITIAL_HISTORY);
  const [selectedCat, setSelectedCat] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [filterMode, setFilterMode] = useState<FilterMode>("month");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const newTx: Transaction = {
      id: Date.now(),
      cat: selectedCat,
      amount: parseFloat(amount),
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      desc: note || `${selectedCat} expense`,
    };
    setHistory(prev => [newTx, ...prev]);
    setAmount("");
    setNote("");
    setSelectedCat("");
  };

  const filteredHistory = useMemo(() => {
    return history.filter(tx => {
      if (filterMode === "day") return tx.date === filterDate;
      if (filterMode === "month") return tx.date.slice(0, 7) === filterDate.slice(0, 7);
      if (filterMode === "year") return tx.date.slice(0, 4) === filterDate.slice(0, 4);
      return true;
    });
  }, [history, filterMode, filterDate]);

  const filteredTotal = useMemo(() => filteredHistory.reduce((s, t) => s + t.amount, 0), [filteredHistory]);

  const statsData = useMemo(() => {
    const totals: Record<string, number> = {};
    history.forEach(tx => { totals[tx.cat] = (totals[tx.cat] || 0) + tx.amount; });
    const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
    return Object.entries(totals)
      .map(([cat, val]) => ({ cat, val, pct: grandTotal ? Math.round((val / grandTotal) * 100) : 0 }))
      .sort((a, b) => b.val - a.val);
  }, [history]);

  const conicGradient = useMemo(() => {
    let acc = 0;
    return statsData.map(({ cat, pct }) => {
      const start = acc;
      acc += pct;
      return `${CATEGORY_COLORS[cat] || "#aaa"} ${start}% ${acc}%`;
    }).join(", ");
  }, [statsData]);

  const anim = (dir: "left" | "right" | "up" = "up") => ({
    initial: { opacity: 0, x: dir === "left" ? -60 : dir === "right" ? 60 : 0, y: dir === "up" ? 60 : 0 },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, margin: "-10%" } as const,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  });

  return (
    <div className="w-full flex flex-col items-center py-32 px-8 gap-32">

      {/* 1. Header */}
      <motion.div {...anim("up")} className="flex flex-col md:flex-row items-center gap-12 max-w-5xl w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)] overflow-hidden bg-white/50 p-2 backdrop-blur-sm hover:scale-105 transition-transform duration-500">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Parker" alt="Avatar" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="text-2xl font-bold bg-white/40 px-4 py-1 rounded-full backdrop-blur-md">@Peter&apos;s Assistant</h2>
        </div>
        <div className="flex-1 bg-white/20 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Hello! I am your AI Accountant.</h2>
          <p className="text-xl text-gray-800">Scroll down — import transactions, search by date, and visualize your spending patterns below.</p>
        </div>
      </motion.div>

      {/* 2. Statistics & Saving Goals */}
      <motion.div {...anim("left")} className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl">

        {/* Dynamic Donut */}
        <div className="flex-1 bg-white/30 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <PieChart className="w-8 h-8 text-orange" />
            <h2 className="text-3xl font-bold">Statistics</h2>
          </div>
          <div className="flex items-center gap-10">
            <div
              className="relative w-44 h-44 rounded-full flex-shrink-0 shadow-[0_0_20px_rgba(235,143,52,0.4)] flex items-center justify-center"
              style={{ background: `conic-gradient(${conicGradient || "#eee 0% 100%"})` }}
            >
              <div className="w-32 h-32 bg-white/90 backdrop-blur-xl rounded-full shadow-inner flex items-center justify-center flex-col">
                <span className="font-bold text-2xl text-orange">{statsData[0]?.pct ?? 0}%</span>
                <span className="text-xs font-bold text-gray-500">{statsData[0]?.cat ?? "—"}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-48">
              {statsData.map(({ cat, val, pct }) => (
                <div key={cat} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[cat] || "#aaa" }} />
                  <span className="font-semibold text-sm flex-1">{cat}</span>
                  <span className="text-xs font-bold text-gray-600">${val.toFixed(0)} · {pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Saving Goals */}
        <div className="flex-1 bg-white/30 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-coral" />
            <h2 className="text-3xl font-bold">Saving Goals</h2>
          </div>
          <div className="flex flex-col gap-5 mt-2">
            {[{ label: "Emergency Fund", pct: 80 }, { label: "New Car", pct: 45 }, { label: "Vacation", pct: 15 }].map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>{label}</span><span>{pct}%</span>
                </div>
                <div className="w-full bg-white/40 h-4 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="bg-gradient-to-r from-orange to-coral h-full rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. Import Transaction */}
      <motion.div {...anim("up")} className="w-full max-w-6xl bg-white/40 backdrop-blur-2xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <PlusCircle className="w-8 h-8 text-orange" />
          <h2 className="text-3xl font-bold">Import Transaction</h2>
        </div>
        <p className="text-lg font-medium text-gray-800">Keep your spending organized on the fly.</p>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex flex-col gap-2 h-[350px] overflow-y-auto pr-4 lg:w-1/3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-6 py-4 rounded-xl font-semibold text-left transition-all ${selectedCat === cat ? "bg-foreground text-background shadow-md scale-[1.02]" : "bg-white/50 hover:bg-white/80"}`}
              >
                <span className="inline-block w-3 h-3 rounded-full mr-3 align-middle" style={{ background: CATEGORY_COLORS[cat] }} />
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
                      <span className="text-4xl font-bold text-gray-400 mr-2">$</span>
                      <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)}
                        className="w-full text-4xl font-bold bg-transparent outline-none py-2 tabular-nums" placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600 uppercase">Note (Optional)</label>
                    <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
                      className="w-full text-lg bg-transparent border-b-2 border-gray-300 focus:border-orange outline-none py-2"
                      placeholder="What was this for?" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-auto">* Date &amp; time auto-recorded.</p>
                </div>
                <button type="submit" className="bg-foreground text-background py-5 rounded-xl font-bold text-xl hover:opacity-90 shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform">
                  <CheckCircle2 className="w-6 h-6" /> Save Transaction
                </button>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 font-medium text-lg border-2 border-dashed border-gray-400/50 rounded-2xl bg-white/20 p-10 text-center gap-4">
                <ArrowRight className="w-10 h-10 text-gray-400 -rotate-180 md:rotate-0" />
                Select a category to start importing.
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 4. Transaction History */}
      <motion.div {...anim("right")} className="w-full max-w-6xl bg-white/30 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <HistoryIcon className="w-8 h-8 text-orange" />
          <h2 className="text-3xl font-bold">Transaction History</h2>
        </div>
        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
          {history.length === 0 && <p className="text-gray-500 text-center py-10">No transactions yet. Add one above!</p>}
          {history.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-white/40 hover:bg-white/70">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"
                  style={{ background: CATEGORY_COLORS[item.cat] + "25", border: `2px solid ${CATEGORY_COLORS[item.cat]}` }}>
                  <span className="font-bold text-lg" style={{ color: CATEGORY_COLORS[item.cat] }}>{item.cat.charAt(0)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{item.cat}</span>
                  <span className="text-gray-600 text-sm">{item.desc}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-xl text-foreground">${item.amount.toFixed(2)}</span>
                <span className="text-gray-500 text-xs font-medium">{item.date} · {item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. Search by Date/Month/Year */}
      <motion.div {...anim("up")} className="w-full max-w-6xl bg-white/40 backdrop-blur-2xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Search className="w-8 h-8 text-coral" />
          <h2 className="text-3xl font-bold">Search by Date</h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="flex bg-white/50 rounded-xl overflow-hidden shadow-inner border border-white/40">
            {(["day", "month", "year"] as FilterMode[]).map((mode) => (
              <button key={mode} onClick={() => setFilterMode(mode)}
                className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all ${filterMode === mode ? "bg-foreground text-background shadow-md" : "hover:bg-white/50"}`}>
                {mode === "day" ? "Day" : mode === "month" ? "Month" : "Year"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-white/60 rounded-xl px-6 py-3 border border-white/50 shadow-sm">
            <CalendarDays className="w-5 h-5 text-gray-500" />
            {filterMode === "day" && (
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent font-semibold text-lg outline-none" />
            )}
            {filterMode === "month" && (
              <input type="month" value={filterDate.slice(0, 7)} onChange={(e) => setFilterDate(e.target.value + "-01")}
                className="bg-transparent font-semibold text-lg outline-none" />
            )}
            {filterMode === "year" && (
              <input type="number" value={filterDate.slice(0, 4)} min="2020" max="2099"
                onChange={(e) => setFilterDate(e.target.value + "-01-01")}
                className="bg-transparent font-semibold text-lg outline-none w-24 tabular-nums" />
            )}
          </div>
        </div>

        {/* Summary cards */}
        <div className="flex gap-8">
          <div className="bg-white/50 rounded-2xl p-6 flex flex-col gap-1 shadow-inner">
            <span className="text-sm font-bold text-gray-500 uppercase">Total Spent</span>
            <span className="text-4xl font-bold text-foreground tabular-nums">${filteredTotal.toFixed(2)}</span>
          </div>
          <div className="bg-white/50 rounded-2xl p-6 flex flex-col gap-1 shadow-inner">
            <span className="text-sm font-bold text-gray-500 uppercase">Transactions</span>
            <span className="text-4xl font-bold text-foreground tabular-nums">{filteredHistory.length}</span>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
          {filteredHistory.length === 0 ? (
            <div className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-400/40 rounded-2xl">
              No transactions found for this period.
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white/50 p-5 rounded-2xl border border-white/40 hover:bg-white/70 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: CATEGORY_COLORS[item.cat] + "25", border: `2px solid ${CATEGORY_COLORS[item.cat]}` }}>
                    <span className="font-bold" style={{ color: CATEGORY_COLORS[item.cat] }}>{item.cat.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="font-bold">{item.cat}</span>
                    <span className="text-gray-500 text-sm ml-3">{item.desc}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${item.amount.toFixed(2)}</div>
                  <div className="text-gray-400 text-xs">{item.date} · {item.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

    </div>
  );
}
