"use client";

interface ShareButtonProps {
  title: string;
}

export default function ShareButton({ title }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-5 py-2 bg-[var(--primary)] text-white rounded-full text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
    >
      Share Article
    </button>
  );
}
