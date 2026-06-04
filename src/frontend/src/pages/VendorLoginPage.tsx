import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Mail, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AssameseBorder() {
  return (
    <svg viewBox="0 0 400 12" className="w-full" aria-hidden="true" fill="none">
      <path
        d="M0 6 Q25 0 50 6 Q75 12 100 6 Q125 0 150 6 Q175 12 200 6 Q225 0 250 6 Q275 12 300 6 Q325 0 350 6 Q375 12 400 6"
        stroke="oklch(var(--primary))"
        strokeWidth="2"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

export default function VendorLoginPage() {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    localStorage.removeItem("vendorSession");
    localStorage.removeItem("vendorEmail");
    localStorage.removeItem("vendorSessionToken");
    if (localStorage.getItem("vendorSession")) {
      navigate({ to: "/vendor-dashboard" });
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
      const result = await actor.verifyVendorOtp(email.trim(), otp.trim());
      if ("ok" in result) {
        const { token, status } = result.ok;
        const statusStr =
          typeof status === "object" ? Object.keys(status)[0] : String(status);
        if (statusStr === "approved") {
          localStorage.setItem("vendorSession", token);
          localStorage.setItem("vendorEmail", email.trim());
          navigate({ to: "/vendor-dashboard" });
        } else if (statusStr === "pending") {
          setError(
            "Your application is under review. You will be notified at your email once approved.",
          );
          setStep("email");
        } else if (statusStr === "rejected") {
          setError(
            "Your vendor application was rejected. Please contact assamshop@assamroots.shop for more information.",
          );
          setStep("email");
        } else if (statusStr === "suspended") {
          setError(
            "Your vendor account has been suspended. Please contact assamshop@assamroots.shop.",
          );
          setStep("email");
        }
      } else {
        const errMsg = result.err || "Verification failed";
        if (errMsg.toLowerCase().includes("vendor")) {
          setError(
            "No vendor account found with this email. Please register at /vendor-register first.",
          );
        } else {
          setError(errMsg);
        }
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 bg-card border-b border-border shadow-sm">
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          aria-label="AssamRoots home"
          className="select-none"
        >
          <img
            src="/assets/logo.png"
            alt="AssamRoots"
            className="h-10 w-auto object-contain"
          />
        </button>
        <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted flex items-center gap-1">
          <Store size={12} />
          Vendor Portal
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 shadow-md bg-primary/10">
              <Store size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-black text-foreground tracking-tight">
              Vendor Sign In
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Access your vendor dashboard with a one-time code.
            </p>
          </div>

          <AssameseBorder />

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
                      Use the email registered with your vendor account.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="vendor@business.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                      disabled={loading}
                      data-ocid="vendor-login.email_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    {error && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="vendor-login.error_state"
                      >
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={loading}
                      data-ocid="vendor-login.send_code_button"
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
                          <Mail size={16} /> Send Code <ArrowRight size={14} />
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
                      data-ocid="vendor-login.otp_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-center text-2xl font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    {error && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="vendor-login.error_state"
                      >
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      data-ocid="vendor-login.verify_button"
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
                        "Verify & Enter Dashboard"
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
                        data-ocid="vendor-login.back_button"
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
                        data-ocid="vendor-login.resend_button"
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

          <p className="text-center text-xs text-muted-foreground">
            Not a vendor yet?{" "}
            <a
              href="/vendor-register"
              className="text-primary underline underline-offset-2 hover:opacity-80"
            >
              Apply here
            </a>
          </p>

          <AssameseBorder />
        </div>
      </main>
    </div>
  );
}
