import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Leaf, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
    title: "Secure OTP Login",
    desc: "One-time code sent to your email — no password needed.",
  },
  {
    icon: Mail,
    title: "Instant Verification",
    desc: "Check your inbox and enter the 6-digit code to sign in.",
  },
  {
    icon: Leaf,
    title: "Rooted in Assam",
    desc: "Authentic products, trusted sellers, your community.",
  },
];

export default function LoginPage() {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect if already has session
  useEffect(() => {
    if (localStorage.getItem("userSessionToken")) {
      navigate({ to: "/home" });
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    setResendCountdown(30);
    timerRef.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!actor || isFetching) {
      setError("Connecting to server, please try again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await actor.requestOtp(email.trim());
      if ("err" in result) {
        setError(result.err);
      } else {
        setStep("otp");
        startResendTimer();
      }
    } catch {
      setError("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    if (!actor || isFetching) {
      setError("Connecting to server, please try again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await actor.verifyOtp(email.trim(), otp.trim());
      if ("err" in result) {
        setError(result.err);
      } else {
        localStorage.setItem("userSessionToken", result.ok);
        navigate({ to: "/home" });
      }
    } catch {
      setError("Verification failed. Please try again.");
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
              Sign in with a one-time code sent to your email.
            </p>
          </div>

          <AssameseBorder />

          {/* Login card */}
          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" />
            <div className="p-6 space-y-5">
              {step === "email" ? (
                <>
                  <div className="space-y-1">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      Enter your email
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      We'll send a 6-digit verification code.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                      disabled={loading}
                      data-ocid="login.email_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    {error && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="login.error_state"
                      >
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={loading}
                      data-ocid="login.submit_button"
                      className="w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                      ) : (
                        <>
                          <Mail size={16} />
                          Send Code
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      Check your inbox
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      We sent a 6-digit code to{" "}
                      <span className="font-semibold text-foreground">
                        {email}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                      disabled={loading}
                      data-ocid="login.otp_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-center text-2xl font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    {error && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="login.error_state"
                      >
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      data-ocid="login.verify_button"
                      className="w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                      ) : (
                        "Verify & Sign In"
                      )}
                    </button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("email");
                          setOtp("");
                          setError("");
                        }}
                        data-ocid="login.back_button"
                        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground mr-4"
                      >
                        ← Change email
                      </button>
                      <button
                        type="button"
                        onClick={
                          resendCountdown === 0 ? handleSendCode : undefined
                        }
                        disabled={resendCountdown > 0 || loading}
                        data-ocid="login.resend_button"
                        className="text-xs underline underline-offset-2 disabled:opacity-50 text-primary hover:text-primary/80"
                      >
                        {resendCountdown > 0
                          ? `Resend in ${resendCountdown}s`
                          : "Resend code"}
                      </button>
                    </div>
                  </div>
                </>
              )}
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

          <AssameseBorder />

          <p className="text-center text-xs text-muted-foreground pb-2">
            New vendor?{" "}
            <a
              href="/vendor-register"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              Apply as a vendor
            </a>
            {" · "}
            <a
              href="/vendor-login"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              Vendor login
            </a>
          </p>
          <p className="text-center text-xs text-muted-foreground pb-2">
            © {new Date().getFullYear()} AssamRoots. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
