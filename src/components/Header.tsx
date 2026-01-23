"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  { name: "Personal Growth", slug: "personal-growth" },
  { name: "Productivity", slug: "productivity" },
  { name: "Emotional Intelligence", slug: "emotional-intelligence" },
  { name: "Book Summaries", slug: "book-summaries" },
  { name: "Success Stories", slug: "success-stories" },
  { name: "Career & Finance", slug: "career-finance" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  const toggleProfileDropdown = useCallback(() => {
    setIsProfileOpen(prev => !prev);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Bowl of Growth"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-bold text-xl text-[var(--foreground)]">
              Bowl of <span className="text-[var(--primary)]">Growth</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors font-medium"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 150)}
                className="flex items-center gap-1 text-[var(--muted)] hover:text-[var(--primary)] transition-colors font-medium"
              >
                Categories
                <svg
                  className={`w-4 h-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[var(--border)] py-2 fade-in">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--secondary)] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/games"
              className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors font-medium"
            >
              Brain Games
            </Link>

            {!mounted || loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative z-50">
                <button
                  type="button"
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors cursor-pointer"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
                  >
                    {(profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)] hidden lg:block max-w-[120px] truncate">
                    {profile?.full_name || user.email?.split("@")[0] || "User"}
                  </span>
                  <svg className={`w-4 h-4 text-[var(--muted)] transition-transform ${isProfileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0"
                      style={{ zIndex: 9998 }}
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 fade-in"
                      style={{ zIndex: 9999 }}
                    >
                      <div className="px-4 py-3 border-b border-[var(--border)]">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {profile?.full_name || user.email?.split("@")[0] || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center gap-1 mt-2 bg-purple-50 rounded-lg px-2 py-1">
                          <span className="text-lg">🏆</span>
                          <span className="text-sm font-bold text-purple-600">
                            {profile?.points ?? 0} points
                          </span>
                        </div>
                      </div>
                      <Link
                        href="/games"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        <span>🎮</span> Play Games
                      </Link>
                      <Link
                        href="/leaderboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        <span>🏆</span> Leaderboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span>👋</span> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-[var(--primary)] text-white px-5 py-2 rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[var(--muted)] hover:text-[var(--primary)]"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)] fade-in">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--secondary)] rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-[var(--foreground)] mb-2">Categories</p>
                <div className="flex flex-col gap-1 pl-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="py-1 text-[var(--muted)] hover:text-[var(--primary)] transition-colors text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/games"
                className="px-4 py-2 text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--secondary)] rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Brain Games
              </Link>

              {user ? (
                <div className="mx-4 mt-2 p-3 bg-purple-100 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
                    >
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {profile?.full_name || user.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-[var(--muted)]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="mx-4 mt-2 bg-[var(--primary)] text-white px-5 py-2 rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors text-center block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
