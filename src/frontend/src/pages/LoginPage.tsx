import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { Fingerprint, Leaf, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Decorative Assamese motif SVG ─────────────────────────────────────────
function AssameseBorder() {
  return (
    <svg
      viewBox="0 0 400 12"
      className="w-full"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 6 Q25 0 50 6 Q75 12 100 6 Q125 0 150 6 Q175 12 200 6 Q225 0 250 6 Q275 12 300 6 Q325 0 350 6 Q375 12 400 6"
        stroke="oklch(var(--primary))"
        strokeWidth="2"
        strokeOpacity="0.5"
      />
      <circle
        cx="200"
        cy="6"
        r="3"
        fill="oklch(var(--primary))"
        fillOpacity="0.6"
      />
      <circle
        cx="100"
        cy="6"
        r="2"
        fill="oklch(var(--accent))"
        fillOpacity="0.6"
      />
      <circle
        cx="300"
        cy="6"
        r="2"
        fill="oklch(var(--accent))"
        fillOpacity="0.6"
      />
    </svg>
  );
}

const features = [
  {
    icon: ShieldCheck,
    title: "Secure & Decentralised",
    desc: "No passwords stored. Your identity is yours alone.",
  },
  {
    icon: Fingerprint,
    title: "One-tap Login",
    desc: "Authenticate with biometrics or device PIN.",
  },
  {
    icon: Leaf,
    title: "Rooted in Assam",
    desc: "Authentic products, trusted sellers, your community.",
  },
];

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/home" });
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) return null;
  if (isAuthenticated) return null;

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
      navigate({ to: "/home" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* ── Top header bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 bg-card border-b border-border shadow-sm">
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="select-none"
          aria-label="AssamRoots home"
        >
          <img
            src="/assets/logo.png"
            alt="AssamRoots"
            className="h-10 w-auto object-contain"
          />
        </button>
        <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted">
          Secure Login
        </span>
      </header>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm space-y-6">
          {/* Hero text */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 shadow-md bg-primary/10">
              <span className="text-3xl" role="img" aria-label="leaf">
                🌿
              </span>
            </div>
            <h1 className="font-display text-2xl font-black text-foreground tracking-tight">
              Welcome to AssamRoots
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover authentic Assamese products — tea, handloom, spices, and
              more.
            </p>
          </div>

          {/* Decorative divider */}
          <AssameseBorder />

          {/* Login card */}
          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            {/* Saffron accent top strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" />

            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Sign in to continue
                </h2>
                <p className="text-xs text-muted-foreground">
                  We use Internet Identity — no email or password required.
                </p>
              </div>

              {/* II explanation box */}
              <div className="rounded-xl p-3 flex gap-3 items-start border border-secondary/25 bg-secondary/8">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-secondary"
                />
                <p className="text-xs text-foreground leading-relaxed">
                  <span className="font-semibold">Internet Identity</span> is a
                  secure, password-free login by DFINITY. It uses your device's
                  biometrics or PIN — your data stays private and decentralised.
                </p>
              </div>

              {/* Login button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                data-ocid="login-submit"
                className="w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        opacity="0.25"
                      />
                      <path d="M21 12a9 9 0 01-9-9" strokeLinecap="round" />
                    </svg>
                    Opening Internet Identity…
                  </>
                ) : (
                  <>
                    <Fingerprint size={18} />
                    Continue with Internet Identity
                  </>
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                New here?{" "}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="font-semibold underline underline-offset-2 transition-smooth hover:opacity-70 text-primary"
                  data-ocid="login-create-account"
                >
                  Create your account
                </button>{" "}
                — same button, we'll guide you.
              </p>
            </div>
          </div>

          {/* Features strip */}
          <div className="space-y-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10">
                  <Icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative divider bottom */}
          <AssameseBorder />

          <p className="text-center text-xs text-muted-foreground pb-2">
            © {new Date().getFullYear()} AssamRoots. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
