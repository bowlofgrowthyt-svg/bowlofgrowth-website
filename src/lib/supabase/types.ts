export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  points: number;
  streak: number;
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  category_slug: string;
  image: string | null;
  author: string;
  read_time: number;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbQuote {
  id: string;
  text: string;
  author: string;
  category: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  points_earned: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface GameScore {
  id: string;
  user_id: string;
  game_slug: string;
  score: number;
  time_taken: number | null;
  difficulty: string | null;
  created_at: string;
}

export type ActivityType =
  | "article_read"
  | "game_played"
  | "daily_login"
  | "streak_bonus"
  | "first_signup";

export const POINT_VALUES = {
  article_read: 10,
  daily_login: 5,
  game_played: 20, // base, can be higher based on score
  streak_bonus: 5, // per day
  first_signup: 50,
} as const;
