import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-CstiQ4sz.js";
import { createActor } from "./backend-Dxpf4-N4.js";
import { u as useActor } from "./createLucideIcon-ByrRp2U0.js";
import { S as Store } from "./store-Dj_Vp66S.js";
import { M as Mail } from "./mail-Dfa__ye-.js";
import { A as ArrowRight } from "./arrow-right-C2C2K9N6.js";
function AssameseBorder() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 400 12", className: "w-full", "aria-hidden": "true", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M0 6 Q25 0 50 6 Q75 12 100 6 Q125 0 150 6 Q175 12 200 6 Q225 0 250 6 Q275 12 300 6 Q325 0 350 6 Q375 12 400 6",
      stroke: "oklch(var(--primary))",
      strokeWidth: "2",
      strokeOpacity: "0.5"
    }
  ) });
}
function VendorLoginPage() {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState("email");
  const [email, setEmail] = reactExports.useState("");
  const [otp, setOtp] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [resendCountdown, setResendCountdown] = reactExports.useState(0);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    localStorage.removeItem("vendorSession");
    localStorage.removeItem("vendorEmail");
    localStorage.removeItem("vendorSessionToken");
    if (localStorage.getItem("vendorSession")) {
      navigate({ to: "/vendor-dashboard" });
    }
  }, [navigate]);
  reactExports.useEffect(() => {
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
    }, 1e3);
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
        const statusStr = typeof status === "object" ? Object.keys(status)[0] : String(status);
        if (statusStr === "approved") {
          localStorage.setItem("vendorSession", token);
          localStorage.setItem("vendorEmail", email.trim());
          navigate({ to: "/vendor-dashboard" });
        } else if (statusStr === "pending") {
          setError(
            "Your application is under review. You will be notified at your email once approved."
          );
          setStep("email");
        } else if (statusStr === "rejected") {
          setError(
            "Your vendor application was rejected. Please contact assamshop@assamroots.shop for more information."
          );
          setStep("email");
        } else if (statusStr === "suspended") {
          setError(
            "Your vendor account has been suspended. Please contact assamshop@assamroots.shop."
          );
          setStep("email");
        }
      } else {
        const errMsg = result.err || "Verification failed";
        if (errMsg.toLowerCase().includes("vendor")) {
          setError(
            "No vendor account found with this email. Please register at /vendor-register first."
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center justify-between px-5 py-3 bg-card border-b border-border shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/home" }),
          "aria-label": "AssamRoots home",
          className: "select-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/logo.png",
              alt: "AssamRoots",
              className: "h-10 w-auto object-contain"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 12 }),
        "Vendor Portal"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col items-center justify-center px-5 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 shadow-md bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 28, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-foreground tracking-tight", children: "Vendor Sign In" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Access your vendor dashboard with a one-time code." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AssameseBorder, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-5", children: step === "email" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Enter your email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use the email registered with your vendor account." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                placeholder: "vendor@business.com",
                value: email,
                onChange: (e) => {
                  setEmail(e.target.value);
                  setError("");
                },
                onKeyDown: (e) => e.key === "Enter" && handleSendCode(),
                disabled: loading,
                "data-ocid": "vendor-login.email_input",
                className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
              }
            ),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "vendor-login.error_state",
                children: error
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleSendCode,
                disabled: loading,
                "data-ocid": "vendor-login.send_code_button",
                className: "w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90",
                children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    className: "animate-spin h-4 w-4",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    "aria-hidden": "true",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          className: "opacity-25",
                          cx: "12",
                          cy: "12",
                          r: "10",
                          stroke: "currentColor",
                          strokeWidth: "4"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          className: "opacity-75",
                          fill: "currentColor",
                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        }
                      )
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16 }),
                  " Send Code ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 })
                ] })
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Check your inbox" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "We sent a 6-digit code to",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                inputMode: "numeric",
                maxLength: 6,
                placeholder: "000000",
                value: otp,
                onChange: (e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                },
                onKeyDown: (e) => e.key === "Enter" && handleVerifyOtp(),
                disabled: loading,
                "data-ocid": "vendor-login.otp_input",
                className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-center text-2xl font-mono tracking-widest text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
              }
            ),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "vendor-login.error_state",
                children: error
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleVerifyOtp,
                disabled: loading,
                "data-ocid": "vendor-login.verify_button",
                className: "w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90",
                children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    className: "animate-spin h-4 w-4",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    "aria-hidden": "true",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          className: "opacity-25",
                          cx: "12",
                          cy: "12",
                          r: "10",
                          stroke: "currentColor",
                          strokeWidth: "4"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          className: "opacity-75",
                          fill: "currentColor",
                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        }
                      )
                    ]
                  }
                ) : "Verify & Enter Dashboard"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setStep("email");
                    setOtp("");
                    setError("");
                  },
                  "data-ocid": "vendor-login.back_button",
                  className: "text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground mr-4",
                  children: "← Change email"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: resendCountdown === 0 ? handleSendCode : void 0,
                  disabled: resendCountdown > 0 || loading,
                  "data-ocid": "vendor-login.resend_button",
                  className: "text-xs underline underline-offset-2 disabled:opacity-50 text-primary hover:text-primary/80",
                  children: resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend code"
                }
              )
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
        "Not a vendor yet?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "/vendor-register",
            className: "text-primary underline underline-offset-2 hover:opacity-80",
            children: "Apply here"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AssameseBorder, {})
    ] }) })
  ] });
}
export {
  VendorLoginPage as default
};
