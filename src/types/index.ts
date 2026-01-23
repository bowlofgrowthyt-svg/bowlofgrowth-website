export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  image: string;
  author: string;
  readTime: number;
  createdAt: string;
  featured?: boolean;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  points: number;
  streak: number;
  joinedAt: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  pointsReward: number;
}

export interface BookSummary {
  id: string;
  title: string;
  slug: string;
  author: string;
  coverImage: string;
  summary: string;
  keyTakeaways: string[];
  category: string;
  rating: number;
  readTime: number;
}
