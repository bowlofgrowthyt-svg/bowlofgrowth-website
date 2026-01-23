import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This feature is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { articles } = await request.json();

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { error: "No articles provided" },
        { status: 400 }
      );
    }

    // Read current articles file
    const articlesPath = path.join(
      process.cwd(),
      "src/data/articles.ts"
    );
    const currentContent = fs.readFileSync(articlesPath, "utf-8");

    // Find the existing articles array and get the last ID
    const idMatch = currentContent.match(/id:\s*"(\d+)"/g);
    let lastId = 0;
    if (idMatch) {
      const ids = idMatch.map((m) => parseInt(m.match(/\d+/)?.[0] || "0"));
      lastId = Math.max(...ids);
    }

    // Generate article entries with proper IDs
    const newArticleEntries = articles.map((a: any, index: number) => {
      const newId = lastId + index + 1;
      return `  {
    id: "${newId}",
    title: "${a.title.replace(/"/g, '\\"')}",
    slug: "${a.slug}",
    excerpt: "${a.excerpt.replace(/"/g, '\\"')}",
    content: \`${a.content.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`,
    category: "${a.category}",
    categorySlug: "${a.categorySlug}",
    image: "${a.image}",
    author: "${a.author}",
    readTime: ${a.readTime},
    createdAt: "${a.createdAt}",
    featured: ${a.featured},
  }`;
    });

    // Find the position to insert (before the closing bracket of the articles array)
    const articlesArrayEnd = currentContent.lastIndexOf("];");
    if (articlesArrayEnd === -1) {
      return NextResponse.json(
        { error: "Could not find articles array in file" },
        { status: 500 }
      );
    }

    // Check if array is empty or has content
    const beforeEnd = currentContent.substring(0, articlesArrayEnd).trim();
    const needsComma = !beforeEnd.endsWith("[") && !beforeEnd.endsWith(",");

    // Insert new articles
    const newContent =
      currentContent.substring(0, articlesArrayEnd) +
      (needsComma ? ",\n" : "\n") +
      newArticleEntries.join(",\n") +
      ",\n" +
      currentContent.substring(articlesArrayEnd);

    // Write back to file
    fs.writeFileSync(articlesPath, newContent, "utf-8");

    return NextResponse.json({
      success: true,
      message: `Successfully added ${articles.length} articles`,
      addedCount: articles.length,
    });
  } catch (error) {
    console.error("Error saving articles:", error);
    return NextResponse.json(
      { error: "Failed to save articles" },
      { status: 500 }
    );
  }
}
