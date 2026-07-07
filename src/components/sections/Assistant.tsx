"use client";

import { motion } from "framer-motion";
import { useState, useMemo, useEffect, useCallback } from "react";
import { ArrowRight, PlusCircle, Search, History as HistoryIcon, PieChart, Target, CheckCircle2, CalendarDays, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Transaction, SavingGoal, Category } from "@/lib/supabase";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#EB8F34", Drink: "#E87070", Transportation: "#70B5E8",
  Shopping: "#B570E8", Bills: "#70E8B5", Healthcare: "#E8D470",
  Entertainment: "#E87060", Travel: "#70E8D4", Other: "#A0A0A0",
};

type FilterMode = "day" | "month" | "year";

// ── Saving Goals UI ──────────────────────────────────────────────────────────
function SavingGoalsPanel({ userId, categories, transactions }: {
  userId: string;
  categories: Category[];
  transactions: (Transaction & { categories?: { name: string } | null })[];
}) {
  const [goals, setGoals] = useState<(SavingGoal & { categories?: { name: string } | null })[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selCatId, setSelCatId] = useState("");
  const [limitVal, setLimitVal] = useState(500);
  const [loading, setLoading] = useState(false);
  const currentMonth = new Date().toISOString().slice(0, 7);

  const loadGoals = useCallback(async () => {
    const { data } = await supabase
      .from("saving_goals")
      .select("*, categories(name)")
      .eq("user_id", userId)
      .eq("month_year", currentMonth)
      .order("created_at", { ascending: true });
    if (data) setGoals(data as (SavingGoal & { categories?: { name: string } | null })[]);
  }, [userId, currentMonth]);

  useEffect(() => { loadGoals(); }, [loadGoals]);

  const handleSave = async () => {
    if (!selCatId) return;
    setLoading(true);
    await supabase.from("saving_goals").upsert({
      user_id: userId,
      category_id: selCatId,
      limit_amount: limitVal,
      month_year: currentMonth,
    }, { onConflict: "user_id,category_id,month_year" });
    setLoading(false);
    setShowForm(false);
    setSelCatId("");
    setLimitVal(500);
    loadGoals();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("saving_goals").delete().eq("id", id);
    loadGoals();
  };

  // Calculate spending per category this month
  const spendMap = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach(tx => {
      if (tx.transaction_date?.slice(0, 7) === currentMonth && tx.categories?.name) {
        map[tx.categories.name] = (map[tx.categories.name] || 0) + tx.amount;
      }
    });
    return map;
  }, [transactions, currentMonth]);

  return (
    <div className="flex-1 bg-white/30 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-coral" />
          <h2 className="text-3xl font-bold">Saving Goals</h2>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1 bg-foreground text-background px-4 py-2 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 rounded-2xl p-6 flex flex-col gap-4 border border-white/60 shadow-inner">
          <label className="text-sm font-bold text-gray-600 uppercase">Category</label>
          <select value={selCatId} onChange={e => setSelCatId(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 outline-none font-semibold">
            <option value="">Select category...</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label className="text-sm font-bold text-gray-600 uppercase">
            Monthly Budget Limit: <span className="text-orange">${limitVal.toLocaleString()}</span>
          </label>
          <input type="range" min={10} max={5000} step={10} value={limitVal}
            onChange={e => setLimitVal(Number(e.target.value))}
            className="w-full accent-orange h-2 rounded-full" />
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>$10</span><span>$5,000</span>
          </div>

          <button onClick={handleSave} disabled={!selCatId || loading}
            className="bg-foreground text-background py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {loading ? "Saving..." : "Save Goal"}
          </button>
        </motion.div>
      )}

      <div className="flex flex-col gap-4 overflow-y-auto max-h-72">
        {goals.length === 0 && !showForm && (
          <p className="text-gray-500 text-center py-6 border-2 border-dashed border-gray-400/40 rounded-2xl">
            No goals yet. Click &quot;New Goal&quot; to set your first budget!
          </p>
        )}
        {goals.map(goal => {
          const catName = goal.categories?.name || "";
          const spent = spendMap[catName] || 0;
          const pct = Math.min(100, goal.limit_amount > 0 ? Math.round((spent / goal.limit_amount) * 100) : 0);
          const isOver = pct >= 100;
          return (
            <div key={goal.id}>
              <div className="flex justify-between items-center text-sm font-bold mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: CATEGORY_COLORS[catName] || "#aaa" }} />
                  {catName}
                </span>
                <div className="flex items-center gap-3">
                  <span className={isOver ? "text-red-500" : "text-gray-600"}>
                    ${spent.toFixed(0)} / ${goal.limit_amount.toLocaleString()} · {pct}%
                  </span>
                  <button onClick={() => handleDelete(goal.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="w-full bg-white/40 h-4 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className={`h-full rounded-full ${isOver ? "bg-gradient-to-r from-red-400 to-red-600" : "bg-gradient-to-r from-orange to-coral"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Assistant Component ─────────────────────────────────────────────────
export default function Assistant({ user, onNavigate }: {
  user: User;
  onNavigate: (section: string) => void;
}) {
  const [transactions, setTransactions] = useState<(Transaction & { categories?: { name: string } | null })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<{ username: string; avatar_url: string | null } | null>(null);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("month");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");

  // Load everything on mount
  useEffect(() => {
    const loadData = async () => {
      // Ensure profile exists (fixes FK constraint on transactions insert)
      await supabase.from("profiles").upsert({
        id: user.id,
        username: user.email?.split("@")[0] || "user",
        currency: "USD",
        theme: "light",
      }, { onConflict: "id", ignoreDuplicates: true });

      const [{ data: cats, error: catErr }, { data: txs, error: txErr }, { data: prof }] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("transactions").select("*, categories(name)")
          .eq("user_id", user.id).order("transaction_date", { ascending: false }),
        supabase.from("profiles").select("username, avatar_url").eq("id", user.id).single(),
      ]);

      if (catErr) console.error("[Categories error]", catErr);
      if (txErr) console.error("[Transactions error]", txErr);

      if (cats) setCategories(cats as Category[]);
      if (txs) setTransactions(txs as (Transaction & { categories?: { name: string } | null })[]);
      if (prof) setProfile(prof);
    };
    loadData();
  }, [user.id]);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId || !amount) return;
    setImportLoading(true);
    setImportError("");
    const { data, error } = await supabase.from("transactions").insert({
      user_id: user.id,
      category_id: selectedCatId,
      amount: parseFloat(amount),
      note: note || null,
      transaction_date: new Date().toISOString(),
    }).select("*, categories(name)").single();
    setImportLoading(false);
    if (error) {
      console.error("[Insert transaction error]", error);
      setImportError(`Error: ${error.message} (code: ${error.code})`);
    } else if (data) {
      setTransactions(prev => [data as (Transaction & { categories?: { name: string } | null }), ...prev]);
      setAmount("");
      setNote("");
      setSelectedCatId("");
    }
  };

  const filteredTxs = useMemo(() => {
    return transactions.filter(tx => {
      const d = tx.transaction_date?.slice(0, 10) || "";
      if (filterMode === "day") return d === filterDate;
      if (filterMode === "month") return d.slice(0, 7) === filterDate.slice(0, 7);
      if (filterMode === "year") return d.slice(0, 4) === filterDate.slice(0, 4);
      return true;
    });
  }, [transactions, filterMode, filterDate]);

  const filteredTotal = useMemo(() => filteredTxs.reduce((s, t) => s + t.amount, 0), [filteredTxs]);

  const statsData = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach(tx => {
      const cat = tx.categories?.name || "Other";
      totals[cat] = (totals[cat] || 0) + tx.amount;
    });
    const grand = Object.values(totals).reduce((a, b) => a + b, 0);
    return Object.entries(totals)
      .map(([cat, val]) => ({ cat, val, pct: grand ? Math.round((val / grand) * 100) : 0 }))
      .sort((a, b) => b.val - a.val);
  }, [transactions]);

  const conicGradient = useMemo(() => {
    let acc = 0;
    return statsData.map(({ cat, pct }) => {
      const start = acc; acc += pct;
      return `${CATEGORY_COLORS[cat] || "#aaa"} ${start}% ${acc}%`;
    }).join(", ");
  }, [statsData]);

  const anim = (dir: "left" | "right" | "up" = "up") => ({
    initial: { opacity: 0, x: dir === "left" ? -60 : dir === "right" ? 60 : 0, y: dir === "up" ? 60 : 0 },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, margin: "-10%" } as const,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  });

  const displayName = profile?.username || user.email?.split("@")[0] || "User";
  const avatarSrc = profile?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=Parker";

  return (
    <div className="w-full flex flex-col items-center py-32 px-8 gap-32">

      {/* 1. Header */}
      <motion.div {...anim("up")} className="flex flex-col md:flex-row items-center gap-12 max-w-5xl w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 rounded-full border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.5)] overflow-hidden bg-white/50 p-2 backdrop-blur-sm hover:scale-105 transition-transform duration-500">
            <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover rounded-full" />
          </div>
          <h2 className="text-2xl font-bold bg-white/40 px-4 py-1 rounded-full backdrop-blur-md">@{displayName}&apos;s Assistant</h2>
        </div>
        <div className="flex-1 bg-white/20 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Hello, {displayName}! I am your AI Accountant.</h2>
          <p className="text-xl text-gray-800">Scroll down — import transactions, set saving goals, and visualize your spending below.</p>
        </div>
      </motion.div>

      {/* 2. Statistics & Saving Goals */}
      <motion.div {...anim("left")} className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl">
        {/* Donut Chart */}
        <div className="flex-1 bg-white/30 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <PieChart className="w-8 h-8 text-orange" />
            <h2 className="text-3xl font-bold">Statistics</h2>
          </div>
          {statsData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet. Add one below!</p>
          ) : (
            <div className="flex items-center gap-10">
              <div className="relative w-44 h-44 rounded-full flex-shrink-0 shadow-[0_0_20px_rgba(235,143,52,0.4)] flex items-center justify-center"
                style={{ background: `conic-gradient(${conicGradient || "#eee 0% 100%"})` }}>
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
          )}
        </div>

        {/* Saving Goals */}
        <SavingGoalsPanel userId={user.id} categories={categories} transactions={transactions} />
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
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCatId(cat.id)}
                className={`px-6 py-4 rounded-xl font-semibold text-left transition-all ${selectedCatId === cat.id ? "bg-foreground text-background shadow-md scale-[1.02]" : "bg-white/50 hover:bg-white/80"}`}>
                <span className="inline-block w-3 h-3 rounded-full mr-3 align-middle" style={{ background: CATEGORY_COLORS[cat.name] || "#aaa" }} />
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex-1">
            {selectedCatId ? (
              <form onSubmit={handleImport} className="flex flex-col gap-6 h-full">
                <div className="bg-white/60 p-8 rounded-2xl flex flex-col gap-8 flex-1 shadow-inner">
                  <div>
                    <label className="text-sm font-bold text-gray-600 uppercase">Amount</label>
                    <div className="flex items-center border-b-2 border-gray-300 focus-within:border-orange transition-colors">
                      <span className="text-4xl font-bold text-gray-400 mr-2">$</span>
                      <input type="number" required value={amount} onChange={e => setAmount(e.target.value)}
                        className="w-full text-4xl font-bold bg-transparent outline-none py-2 tabular-nums" placeholder="0.00" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-600 uppercase">Note (Optional)</label>
                    <input type="text" value={note} onChange={e => setNote(e.target.value)}
                      className="w-full text-lg bg-transparent border-b-2 border-gray-300 focus:border-orange outline-none py-2"
                      placeholder="What was this for?" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-auto">* Date &amp; time auto-recorded.</p>
                </div>
                {importError && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-600 px-4 py-3 rounded-xl text-sm font-semibold text-center">
                    {importError}
                  </div>
                )}
                <button type="submit" disabled={importLoading}
                  className="bg-foreground text-background py-5 rounded-xl font-bold text-xl hover:opacity-90 shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-60">
                  <CheckCircle2 className="w-6 h-6" />
                  {importLoading ? "Saving..." : "Save Transaction"}
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
          {transactions.length === 0 && <p className="text-gray-500 text-center py-10">No transactions yet. Add one above!</p>}
          {transactions.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-white/40 hover:bg-white/70">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"
                  style={{ background: (CATEGORY_COLORS[item.categories?.name || ""] || "#aaa") + "25", border: `2px solid ${CATEGORY_COLORS[item.categories?.name || ""] || "#aaa"}` }}>
                  <span className="font-bold text-lg" style={{ color: CATEGORY_COLORS[item.categories?.name || ""] || "#aaa" }}>
                    {(item.categories?.name || "O").charAt(0)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{item.categories?.name || "Other"}</span>
                  <span className="text-gray-600 text-sm">{item.note || "—"}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-xl text-foreground">${item.amount.toFixed(2)}</span>
                <span className="text-gray-500 text-xs font-medium">{item.transaction_date?.slice(0, 10)}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. Search by Date */}
      <motion.div {...anim("up")} className="w-full max-w-6xl bg-white/40 backdrop-blur-2xl p-10 rounded-3xl border border-white/50 shadow-2xl flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Search className="w-8 h-8 text-coral" />
          <h2 className="text-3xl font-bold">Search by Date</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="flex bg-white/50 rounded-xl overflow-hidden shadow-inner border border-white/40">
            {(["day", "month", "year"] as FilterMode[]).map(mode => (
              <button key={mode} onClick={() => setFilterMode(mode)}
                className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all ${filterMode === mode ? "bg-foreground text-background shadow-md" : "hover:bg-white/50"}`}>
                {mode === "day" ? "Day" : mode === "month" ? "Month" : "Year"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 bg-white/60 rounded-xl px-6 py-3 border border-white/50 shadow-sm">
            <CalendarDays className="w-5 h-5 text-gray-500" />
            {filterMode === "day" && <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="bg-transparent font-semibold text-lg outline-none" />}
            {filterMode === "month" && <input type="month" value={filterDate.slice(0, 7)} onChange={e => setFilterDate(e.target.value + "-01")} className="bg-transparent font-semibold text-lg outline-none" />}
            {filterMode === "year" && <input type="number" value={filterDate.slice(0, 4)} min="2020" max="2099" onChange={e => setFilterDate(e.target.value + "-01-01")} className="bg-transparent font-semibold text-lg outline-none w-24 tabular-nums" />}
          </div>
        </div>
        <div className="flex gap-8">
          <div className="bg-white/50 rounded-2xl p-6 flex flex-col gap-1 shadow-inner">
            <span className="text-sm font-bold text-gray-500 uppercase">Total Spent</span>
            <span className="text-4xl font-bold text-foreground tabular-nums">${filteredTotal.toFixed(2)}</span>
          </div>
          <div className="bg-white/50 rounded-2xl p-6 flex flex-col gap-1 shadow-inner">
            <span className="text-sm font-bold text-gray-500 uppercase">Transactions</span>
            <span className="text-4xl font-bold text-foreground tabular-nums">{filteredTxs.length}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
          {filteredTxs.length === 0 ? (
            <div className="text-gray-500 text-center py-12 border-2 border-dashed border-gray-400/40 rounded-2xl">No transactions found for this period.</div>
          ) : (
            filteredTxs.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white/50 p-5 rounded-2xl border border-white/40 hover:bg-white/70 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: (CATEGORY_COLORS[item.categories?.name || ""] || "#aaa") + "25", border: `2px solid ${CATEGORY_COLORS[item.categories?.name || ""] || "#aaa"}` }}>
                    <span className="font-bold" style={{ color: CATEGORY_COLORS[item.categories?.name || ""] || "#aaa" }}>
                      {(item.categories?.name || "O").charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">{item.categories?.name || "Other"}</span>
                    <span className="text-gray-500 text-sm ml-3">{item.note || "—"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${item.amount.toFixed(2)}</div>
                  <div className="text-gray-400 text-xs">{item.transaction_date?.slice(0, 10)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

    </div>
  );
}
