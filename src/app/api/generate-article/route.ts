import { NextRequest, NextResponse } from "next/server";
import { articles } from "@/data/articles";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

interface ArticleRequest {
  topic: string;
  category: string;
}

// Get existing articles for internal linking
function getRelatedArticles(category: string, topic: string) {
  const topicWords = topic.toLowerCase().split(" ");

  return articles
    .map((article) => ({
      title: article.title,
      slug: article.slug,
      category: article.category,
      relevance:
        (article.category === category ? 2 : 0) +
        topicWords.filter((word) =>
          article.title.toLowerCase().includes(word)
        ).length,
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 8)
    .map((a) => ({ title: a.title, slug: a.slug, category: a.category }));
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

    // Get related articles for internal linking
    const relatedArticles = getRelatedArticles(category, topic);
    const articlesForLinking = relatedArticles
      .map((a) => `- "${a.title}" (link: /articles/${a.slug})`)
      .join("\n");

    const systemPrompt = `You are an expert content strategist and SEO specialist writing for Bowl of Growth (bowlofgrowth.in), a premium self-improvement website. Your articles rank on the first page of Google and get thousands of shares.

## YOUR WRITING STANDARDS:

### Length & Depth
- Write 1800-2500 words minimum
- Cover the topic comprehensively with unique insights
- Include data, statistics, or research findings where relevant
- Share real examples, case studies, or stories

### SEO Best Practices
- Use the main keyword in the first 100 words naturally
- Include 3-5 secondary keywords throughout
- Use proper heading hierarchy (H1 > H2 > H3)
- Write a compelling meta description in the excerpt
- Include numbers in subheadings when appropriate (e.g., "7 Ways to...")
- Keep paragraphs to 2-3 sentences for readability
- Use bullet points and numbered lists for scannability

### Structure (FOLLOW THIS):
1. **Hook** - Start with a compelling story, surprising statistic, or relatable scenario
2. **Problem agitation** - Describe the pain point readers face
3. **Promise** - What they'll learn/gain from this article
4. **Main content** - Comprehensive coverage with H2/H3 sections
5. **Practical takeaways** - Actionable steps readers can implement TODAY
6. **Conclusion** - Inspiring call-to-action

### Internal Linking (IMPORTANT)
Naturally link to these related articles from Bowl of Growth where relevant:
${articlesForLinking}

Use markdown links like: [anchor text](/articles/slug-here)
Include 2-4 internal links where they add value.

### Video Embeds
If a YouTube video would enhance the content (tutorials, Ted talks, expert interviews), include this placeholder with a relevant search suggestion:
\`\`\`
[VIDEO_EMBED: Search "relevant topic" on YouTube - e.g., "morning routine productivity tips"]
\`\`\`

### Tone & Style
- Conversational but authoritative
- Use "you" to speak directly to the reader
- Include personal pronouns occasionally ("I've found that...")
- Be encouraging without being preachy
- Avoid fluff and filler content
- Every sentence should add value

### Formatting
- Use **bold** for key takeaways
- Use *italics* for emphasis
- Include blockquotes for important insights
- Add relevant emojis sparingly in headings (optional)

## OUTPUT FORMAT
Return ONLY valid JSON with this structure:
{
  "title": "SEO-optimized, compelling title (50-60 characters ideal)",
  "excerpt": "Meta description that entices clicks and includes main keyword (150-160 characters)",
  "content": "Full article in markdown with all formatting, links, and video placeholders",
  "readTime": estimated_minutes_number,
  "seoKeywords": ["main keyword", "secondary keyword 1", "secondary keyword 2"]
}`;

    const userPrompt = `Write a comprehensive, SEO-optimized article about "${topic}" for the "${category}" category.

Requirements:
- 1800-2500 words
- Include 2-4 internal links to related Bowl of Growth articles
- Add 1-2 video embed placeholders if relevant
- Follow all SEO best practices
- Make it genuinely helpful and shareable
- Use the heading structure properly (## for H2, ### for H3)

The article should be so good that readers bookmark it and share it with friends.`;

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
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
        excerpt: `Discover powerful insights about ${topic} and transform your life with actionable strategies.`,
        content: content,
        readTime: Math.ceil(content.split(" ").length / 200),
        seoKeywords: [topic.toLowerCase()],
      };
    }

    // Process video placeholders - convert to actual embed format
    let processedContent = articleData.content;

    // Replace video placeholders with a styled video suggestion box
    processedContent = processedContent.replace(
      /```\n?\[VIDEO_EMBED: ([^\]]+)\]\n?```/g,
      (match: string, searchTerm: string) => {
        return `

<div class="video-suggestion">
  <p>📺 <strong>Recommended Video:</strong> ${searchTerm}</p>
  <p><em>Search this on YouTube for helpful visual content on this topic.</em></p>
</div>

`;
      }
    );

    // Generate a slug from the title
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 60);

    return NextResponse.json({
      success: true,
      article: {
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: processedContent,
        readTime: articleData.readTime || Math.ceil(processedContent.split(" ").length / 200),
        slug,
        category,
        categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        author: "Bowl of Growth",
        createdAt: new Date().toISOString().split("T")[0],
        image: `https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800`,
        seoKeywords: articleData.seoKeywords || [],
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
