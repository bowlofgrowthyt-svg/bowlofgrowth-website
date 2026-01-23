import { Article } from "@/types";

export const articles: Article[] = [];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.categorySlug === categorySlug);
}

export function getFeaturedArticle(): Article | undefined {
  return articles.find((a) => a.featured);
}

export function getRecentArticles(limit: number = 6): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getAllArticles(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
