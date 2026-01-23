"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import Image from "next/image";
import Link from "next/link";

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={{
        // Custom heading styles
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-[var(--foreground)] mt-8 mb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 pb-2 border-b border-[var(--border)]">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold text-[var(--foreground)] mt-6 mb-2">
            {children}
          </h3>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className="text-[var(--muted)] leading-relaxed mb-4">{children}</p>
        ),
        // Links - all open in new tab for better UX
        a: ({ href, children }) => {
          const isExternal = href?.startsWith("http");
          if (isExternal) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline inline-flex items-center gap-1"
              >
                {children}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            );
          }
          // Internal links also open in new tab
          return (
            <a
              href={href || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:underline font-medium"
            >
              {children}
            </a>
          );
        },
        // Images with Next.js optimization
        img: ({ src, alt }) => {
          const imgSrc = typeof src === "string" ? src : "";
          return (
            <figure className="my-6">
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden">
                <Image
                  src={imgSrc}
                  alt={alt || "Article image"}
                  fill
                  className="object-cover"
                  unoptimized={imgSrc.startsWith("http")}
                />
              </div>
              {alt && (
                <figcaption className="text-center text-sm text-[var(--muted)] mt-2 italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          );
        },
        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-[var(--muted)]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-[var(--muted)]">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[var(--primary)] pl-4 my-6 italic text-[var(--muted)] bg-[var(--secondary)] py-3 pr-4 rounded-r-lg">
            {children}
          </blockquote>
        ),
        // Code blocks
        code: ({ className, children }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="bg-[var(--secondary)] text-[var(--primary)] px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          }
          return (
            <code className="block bg-gray-900 text-gray-100 p-4 rounded-xl my-4 overflow-x-auto text-sm font-mono">
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="my-4">{children}</pre>,
        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-[var(--border)] rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-[var(--secondary)] px-4 py-2 text-left font-semibold text-[var(--foreground)] border-b border-[var(--border)]">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 border-b border-[var(--border)] text-[var(--muted)]">
            {children}
          </td>
        ),
        // Horizontal rule
        hr: () => <hr className="my-8 border-[var(--border)]" />,
        // Strong/Bold
        strong: ({ children }) => (
          <strong className="font-semibold text-[var(--foreground)]">{children}</strong>
        ),
        // Emphasis/Italic
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
