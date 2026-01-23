import { NextRequest, NextResponse } from "next/server";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

interface ArticleRequest {
  topic: string;
  category: string;
}

export async function POST(request: NextRequest) {
  try {
    const { topic, category }: ArticleRequest = await request.json();

    if (!topic || !category) {
      return NextResponse.json(
        { error: "Topic and category are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Claude API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a professional self-help and personal development content writer for Bowl of Growth, a website focused on helping people improve their lives. Write engaging, actionable, and inspiring articles that are easy to read and understand.

Your writing style:
- Use clear, simple language
- Include practical tips and actionable advice
- Use bullet points and numbered lists for easy scanning
- Include relevant examples
- Keep paragraphs short (2-3 sentences)
- End with an inspiring call to action

Format your response as JSON with this structure:
{
  "title": "Catchy article title",
  "excerpt": "A compelling 1-2 sentence summary",
  "content": "Full article content in markdown format",
  "readTime": estimated minutes to read (number)
}`;

    const userPrompt = `Write a comprehensive, engaging article about "${topic}" for the "${category}" category. The article should be around 800-1200 words, practical, and inspiring. Include actionable tips that readers can implement immediately.`;

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Claude API error:", error);
      return NextResponse.json(
        { error: "Failed to generate article" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse the JSON response from Claude
    let articleData;
    try {
      // Find JSON in the response (Claude might add extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        articleData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // If parsing fails, create a basic structure
      articleData = {
        title: topic,
        excerpt: `Learn about ${topic} and how it can transform your life.`,
        content: content,
        readTime: Math.ceil(content.split(" ").length / 200),
      };
    }

    // Generate a slug from the title
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);

    return NextResponse.json({
      success: true,
      article: {
        ...articleData,
        slug,
        category,
        categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        author: "Bowl of Growth AI",
        createdAt: new Date().toISOString().split("T")[0],
        image: `https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800`, // Default image
      },
    });
  } catch (error) {
    console.error("Error generating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
