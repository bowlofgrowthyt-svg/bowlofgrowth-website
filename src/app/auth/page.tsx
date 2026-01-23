"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const { user, loading, configured, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } = useAuth();

  // Force logout function that clears everything - no async, just clear and reload
  const handleForceLogout = () => {
    setIsLoggingOut(true);

    // Clear all storage immediately
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Force hard reload after a brief delay
    setTimeout(() => {
      window.location.href = "/auth";
    }, 100);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Show setup message if Supabase not configured
  if (!loading && !configured) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--secondary)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">Authentication Setup Required</h1>
          <p className="text-[var(--muted)] mb-6">
            Supabase authentication is not configured yet. Follow these steps to enable user accounts:
          </p>
          <div className="bg-white rounded-xl p-6 text-left shadow-sm border border-[var(--border)]">
            <ol className="space-y-3 text-sm text-[var(--muted)]">
              <li className="flex gap-2">
                <span className="font-semibold text-[var(--primary)]">1.</span>
                Create a free account at <a href="https://supabase.com" target="_blank" className="text-[var(--primary)] hover:underline">supabase.com</a>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-[var(--primary)]">2.</span>
                Create a new project and wait for it to initialize
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-[var(--primary)]">3.</span>
                Go to Settings → API and copy your URL and anon key
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-[var(--primary)]">4.</span>
                Create <code className="bg-gray-100 px-1 rounded">.env.local</code> in your project root
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-[var(--primary)]">5.</span>
                Add your keys and restart the dev server
              </li>
            </ol>
          </div>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-2 bg-[var(--primary)] text-white rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setError(error.message);
        } else {
          router.push("/");
        }
      } else {
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUpWithEmail(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          setMessage("Check your email for a confirmation link!");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    }
  };

  // Always show logout option even while loading
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-6" />
          <p className="text-gray-600 mb-4">Loading...</p>
          <button
            onClick={handleForceLogout}
            disabled={isLoggingOut}
            className="text-sm text-red-500 hover:text-red-700 underline disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Stuck? Click here to logout & clear cache"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logout Button - Always visible */}
        <div className="text-center mb-4">
          <button
            onClick={handleForceLogout}
            disabled={isLoggingOut}
            className="text-sm text-red-500 hover:text-red-700 underline disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Having issues? Click here to logout & clear cache"}
          </button>
        </div>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Welcome Back!" : "Join Bowl of Growth"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? "Sign in to track your progress and earn points"
              : "Create an account to start your growth journey"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[var(--border)]">
          {/* Social Login */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--border)] rounded-xl font-medium text-[var(--foreground)] hover:bg-gray-50 transition-colors mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[var(--muted)]">or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  placeholder="John Doe"
                  required={!isLogin}
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                placeholder="you@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                minLength={6}
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[var(--muted)]">
                  <input type="checkbox" className="rounded border-[var(--border)]" />
                  Remember me
                </label>
                <a href="#" className="text-[var(--primary)] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>{isLogin ? "Sign In" : "Create Account"}</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setMessage("");
              }}
              className="text-[var(--primary)] font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--muted)] mb-4">Join today and get:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Track progress
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Earn points
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Daily streaks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
