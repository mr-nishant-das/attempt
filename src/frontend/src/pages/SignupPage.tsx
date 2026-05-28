import type { Backend, UserProfileInput } from "@/backend";
import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Fingerprint, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Step indicator ────────────────────────────────────────────────────────
function Steps({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-smooth"
            style={{
              background:
                step <= current ? "oklch(0.68 0.24 55)" : "oklch(0.92 0.02 50)",
              color:
                step <= current ? "oklch(0.98 0 0)" : "oklch(0.45 0.01 50)",
            }}
          >
            {step}
          </div>
          {step < 2 && (
            <div
              className="w-12 h-0.5 rounded transition-smooth"
              style={{
                background:
                  current >= 2 ? "oklch(0.68 0.24 55)" : "oklch(0.92 0.02 50)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────
function Field({
  label,
  icon: Icon,
  children,
  required,
  htmlFor,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  required?: boolean;
  htmlFor: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide"
      >
        <Icon size={12} style={{ color: "oklch(0.68 0.24 55)" }} />
        {label}
        {required && <span style={{ color: "oklch(0.55 0.22 25)" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full h-11 rounded-xl border border-border bg-input px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function SignupPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error – useActor is called without createActor per platform convention
  const { actor } = useActor();
  const navigate = useNavigate();

  // ── Step: 1 = trigger II login, 2 = fill profile ──────────────────────
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");

  // Once authenticated, advance to step 2
  useEffect(() => {
    if (isAuthenticated && step === 1) {
      setStep(2);
    }
  }, [isAuthenticated, step]);

  if (isLoading) return null;

  // ── Step 1: trigger Internet Identity login ────────────────────────────
  const handleConnectIdentity = async () => {
    setLoginLoading(true);
    try {
      await login();
      setStep(2);
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Step 2: submit profile ─────────────────────────────────────────────
  const handleSubmitProfile = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/\s+/g, ""))) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (!actor) throw new Error("Not connected to backend.");
      const backend = actor as unknown as Backend;
      const input: UserProfileInput = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.replace(/\s+/g, ""),
      };
      await backend.updateMyProfile(input);
      navigate({ to: "/home" });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.025 60)" }}
    >
      {/* ── Top header ──────────────────────────────────────────────────── */}
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
          Create Account
        </span>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm space-y-5">
          {/* Hero */}
          <div className="text-center space-y-2">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-1 shadow-md"
              style={{ background: "oklch(0.40 0.15 155 / 0.12)" }}
            >
              <span className="text-2xl" role="img" aria-label="namaste">
                🙏
              </span>
            </div>
            <h1 className="font-display text-2xl font-black text-foreground tracking-tight">
              {step === 1 ? "Join AssamRoots" : "Complete Your Profile"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {step === 1
                ? "Start by connecting your Internet Identity"
                : "Tell us a bit about yourself to get started"}
            </p>
          </div>

          {/* Step indicator */}
          <Steps current={step} />

          {/* Card */}
          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            {/* Gradient top strip */}
            <div
              className="h-1.5 w-full"
              style={{
                background:
                  step === 1
                    ? "linear-gradient(90deg, oklch(0.68 0.24 55), oklch(0.75 0.18 65))"
                    : "linear-gradient(90deg, oklch(0.75 0.18 65), oklch(0.40 0.15 155))",
              }}
            />

            <div className="p-6">
              {/* ── STEP 1: Connect Identity ───────────────────────────── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="font-display text-base font-bold text-foreground">
                      Connect your identity
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      No password needed — use your device biometrics or PIN.
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-3 flex gap-3 items-start border"
                    style={{
                      background: "oklch(0.68 0.24 55 / 0.07)",
                      borderColor: "oklch(0.68 0.24 55 / 0.2)",
                    }}
                  >
                    <Fingerprint
                      size={18}
                      className="shrink-0 mt-0.5"
                      style={{ color: "oklch(0.68 0.24 55)" }}
                    />
                    <p className="text-xs text-foreground leading-relaxed">
                      Internet Identity keeps you safe without storing any
                      passwords. Your biometric data never leaves your device.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleConnectIdentity}
                    disabled={loginLoading}
                    data-ocid="signup-connect-identity"
                    className="w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm"
                    style={{
                      background: loginLoading
                        ? "oklch(0.68 0.24 55 / 0.7)"
                        : "oklch(0.68 0.24 55)",
                      color: "oklch(0.98 0 0)",
                    }}
                  >
                    {loginLoading ? (
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
                        Connect with Internet Identity
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={handleConnectIdentity}
                      className="font-semibold underline underline-offset-2"
                      style={{ color: "oklch(0.68 0.24 55)" }}
                      data-ocid="signup-login-link"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              )}

              {/* ── STEP 2: Fill profile ───────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="font-display text-base font-bold text-foreground">
                      Your details
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      This helps sellers deliver to you correctly.
                    </p>
                  </div>

                  <Field
                    label="Full Name"
                    icon={UserRound}
                    required
                    htmlFor="signup-name"
                  >
                    <input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ritika Bora"
                      className={inputClass}
                      data-ocid="signup-name"
                      autoComplete="name"
                    />
                  </Field>

                  <Field
                    label="Email Address"
                    icon={Mail}
                    required
                    htmlFor="signup-email"
                  >
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                      data-ocid="signup-email"
                      autoComplete="email"
                    />
                  </Field>

                  <Field
                    label="Mobile Number"
                    icon={Phone}
                    required
                    htmlFor="signup-phone"
                  >
                    <input
                      id="signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className={inputClass}
                      data-ocid="signup-phone"
                      autoComplete="tel"
                      maxLength={12}
                    />
                  </Field>

                  <Field
                    label="PIN Code"
                    icon={MapPin}
                    htmlFor="signup-pincode"
                  >
                    <input
                      id="signup-pincode"
                      type="text"
                      value={pincode}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="e.g. 781001"
                      className={inputClass}
                      data-ocid="signup-pincode"
                      inputMode="numeric"
                      maxLength={6}
                    />
                  </Field>

                  <Field
                    label="Full Address"
                    icon={MapPin}
                    htmlFor="signup-address"
                  >
                    <textarea
                      id="signup-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House / Flat no., Street, Area, City"
                      rows={2}
                      className={`${inputClass} h-auto py-3 resize-none`}
                      data-ocid="signup-address"
                      autoComplete="street-address"
                    />
                  </Field>

                  {error && (
                    <div
                      className="rounded-lg px-3 py-2 text-xs font-medium border"
                      style={{
                        background: "oklch(0.55 0.22 25 / 0.08)",
                        borderColor: "oklch(0.55 0.22 25 / 0.3)",
                        color: "oklch(0.45 0.18 25)",
                      }}
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmitProfile}
                    disabled={submitting}
                    data-ocid="signup-submit"
                    className="w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm mt-1"
                    style={{
                      background: submitting
                        ? "oklch(0.40 0.15 155 / 0.7)"
                        : "oklch(0.40 0.15 155)",
                      color: "oklch(0.98 0 0)",
                    }}
                  >
                    {submitting ? (
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
                        Saving profile…
                      </>
                    ) : (
                      <>
                        <UserRound size={16} />
                        Save &amp; Start Shopping
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate({ to: "/home" })}
                    className="w-full text-xs text-center text-muted-foreground underline underline-offset-2 hover:opacity-70 transition-smooth py-1"
                    data-ocid="signup-skip"
                  >
                    Skip for now
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground pb-2">
            © {new Date().getFullYear()} AssamRoots. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
