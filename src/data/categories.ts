import { Category } from "@/types";
import { articles } from "./articles";

// Calculate actual article count for each category
function getArticleCount(categorySlug: string): number {
  return articles.filter((a) => a.categorySlug === categorySlug).length;
}

export const categories: Category[] = [
  {
    name: "Personal Growth",
    slug: "personal-growth",
    description: "Develop your mindset, build confidence, and become the best version of yourself.",
    icon: "growth",
    color: "#7C3AED",
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Master time management, eliminate distractions, and accomplish more every day.",
    icon: "productivity",
    color: "#10B981",
  },
  {
    name: "Emotional Intelligence",
    slug: "emotional-intelligence",
    description: "Understand emotions, build better relationships, and navigate life with empathy.",
    icon: "emotional",
    color: "#F59E0B",
  },
  {
    name: "Book Summaries",
    slug: "book-summaries",
    description: "Key insights from the world's best self-improvement and business books.",
    icon: "book",
    color: "#3B82F6",
  },
  {
    name: "Success Stories",
    slug: "success-stories",
    description: "Inspiring real-life stories of people who transformed their lives.",
    icon: "success",
    color: "#EC4899",
  },
  {
    name: "Career & Finance",
    slug: "career-finance",
    description: "Grow professionally, manage money wisely, and build financial freedom.",
    icon: "career",
    color: "#8B5CF6",
  },
];

// Get categories with real-time article counts
export function getCategoriesWithCounts(): (Category & { articleCount: number })[] {
  return categories.map((cat) => ({
    ...cat,
    articleCount: getArticleCount(cat.slug),
  }));
}
