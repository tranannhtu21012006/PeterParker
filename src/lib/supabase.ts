import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Type Definitions ---

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  currency: string;
  theme: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string | null;
  type: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  note: string | null;
  transaction_date: string;
  created_at: string;
  // Joined field (from categories table)
  categories?: { name: string } | null;
};

export type SavingGoal = {
  id: string;
  user_id: string;
  category_id: string;
  limit_amount: number;
  month_year: string; // YYYY-MM
  created_at: string;
  // Joined field
  categories?: { name: string } | null;
};
