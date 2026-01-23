-- =============================================
-- BOWL OF GROWTH - DATABASE SCHEMA
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- ARTICLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  image TEXT,
  author TEXT DEFAULT 'Bowl of Growth',
  read_time INTEGER DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Anyone can read published articles
CREATE POLICY "Published articles are viewable by everyone"
  ON public.articles FOR SELECT
  USING (is_published = true);

-- =============================================
-- QUOTES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Anyone can read active quotes
CREATE POLICY "Active quotes are viewable by everyone"
  ON public.quotes FOR SELECT
  USING (is_active = true);

-- =============================================
-- USER ACTIVITIES (for tracking points)
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'article_read', 'game_played', 'daily_login', 'streak_bonus'
  points_earned INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Users can view their own activities
CREATE POLICY "Users can view their own activities"
  ON public.user_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- GAME SCORES
-- =============================================
CREATE TABLE IF NOT EXISTS public.game_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_slug TEXT NOT NULL,
  score INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Users can view their own scores
CREATE POLICY "Users can view their own scores"
  ON public.game_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores"
  ON public.game_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Leaderboard: anyone can see top scores
CREATE POLICY "Anyone can view leaderboard"
  ON public.game_scores FOR SELECT
  USING (true);

-- =============================================
-- NEWSLETTER SUBSCRIBERS
-- =============================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update streak
CREATE OR REPLACE FUNCTION public.update_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  last_date DATE;
  current_streak INTEGER;
BEGIN
  SELECT last_active_date, streak INTO last_date, current_streak
  FROM public.profiles WHERE id = user_uuid;

  IF last_date IS NULL OR last_date < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Streak broken or first time
    UPDATE public.profiles
    SET streak = 1, last_active_date = CURRENT_DATE, updated_at = NOW()
    WHERE id = user_uuid;
    RETURN 1;
  ELSIF last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Streak continues
    UPDATE public.profiles
    SET streak = streak + 1, last_active_date = CURRENT_DATE, updated_at = NOW()
    WHERE id = user_uuid;
    RETURN current_streak + 1;
  ELSE
    -- Same day, no change
    RETURN current_streak;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add points
CREATE OR REPLACE FUNCTION public.add_points(
  user_uuid UUID,
  activity TEXT,
  points INTEGER,
  meta JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_total INTEGER;
BEGIN
  -- Update profile points
  UPDATE public.profiles
  SET points = points + add_points.points, updated_at = NOW()
  WHERE id = user_uuid
  RETURNING points INTO new_total;

  -- Log the activity
  INSERT INTO public.user_activities (user_id, activity_type, points_earned, metadata)
  VALUES (user_uuid, activity, add_points.points, meta);

  RETURN new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SEED DATA: Sample Quotes
-- =============================================
INSERT INTO public.quotes (text, author, category) VALUES
('The only way to do great work is to love what you do.', 'Steve Jobs', 'motivation'),
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill', 'success'),
('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt', 'dreams'),
('It does not matter how slowly you go as long as you do not stop.', 'Confucius', 'persistence'),
('The mind is everything. What you think you become.', 'Buddha', 'mindset'),
('Believe you can and you''re halfway there.', 'Theodore Roosevelt', 'belief'),
('Your time is limited, don''t waste it living someone else''s life.', 'Steve Jobs', 'life'),
('The best time to plant a tree was 20 years ago. The second best time is now.', 'Chinese Proverb', 'action'),
('Don''t watch the clock; do what it does. Keep going.', 'Sam Levenson', 'persistence'),
('Everything you''ve ever wanted is on the other side of fear.', 'George Addair', 'courage')
ON CONFLICT DO NOTHING;

-- =============================================
-- POINT VALUES REFERENCE (for your app logic)
-- =============================================
-- article_read: +10 points
-- daily_login: +5 points
-- game_completed: +20-100 points (based on score)
-- streak_bonus: +5 points per day of streak
-- first_signup: +50 points
