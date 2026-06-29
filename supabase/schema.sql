-- Supabase Schema for Parker (PeterParker)

-- 1. Profiles Table (extends Supabase Auth users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  currency TEXT DEFAULT 'VND' CHECK (currency IN ('VND', 'USD', 'JPY', 'CNY')),
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories Table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  type TEXT DEFAULT 'expense' CHECK (type IN ('expense', 'income')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pre-populate default categories
INSERT INTO public.categories (name, icon) VALUES 
  ('Food', 'utensils'),
  ('Drink', 'coffee'),
  ('Transportation', 'car'),
  ('Shopping', 'shopping-bag'),
  ('Bills', 'file-text'),
  ('Healthcare', 'activity'),
  ('Entertainment', 'film'),
  ('Travel', 'plane'),
  ('Other', 'more-horizontal');

-- 3. Transactions Table
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  note TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Saving Goals Table (Budget limits per category per month)
CREATE TABLE public.saving_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  limit_amount NUMERIC NOT NULL,
  month_year TEXT NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, category_id, month_year)
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saving_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public categories are viewable by everyone." ON public.categories FOR SELECT USING (true);

CREATE POLICY "Users can view own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions." ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions." ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions." ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions." ON public.transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own saving goals." ON public.saving_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saving goals." ON public.saving_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saving goals." ON public.saving_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saving goals." ON public.saving_goals FOR DELETE USING (auth.uid() = user_id);
