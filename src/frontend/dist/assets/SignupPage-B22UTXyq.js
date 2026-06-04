import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-CstiQ4sz.js";
import { u as useAuth } from "./useAuth-nFRIFgXP.js";
import { c as createLucideIcon, u as useActor } from "./createLucideIcon-ByrRp2U0.js";
import { M as Mail } from "./mail-Dfa__ye-.js";
import { M as MapPin } from "./map-pin-U0yN2Gop.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", key: "1nerag" }],
  ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88", key: "o46ks0" }],
  ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02", key: "ptglia" }],
  ["path", { d: "M2 12a10 10 0 0 1 18-6", key: "ydlgp0" }],
  ["path", { d: "M2 16h.01", key: "1gqxmh" }],
  ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6", key: "drycrb" }],
  ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", key: "1tidbn" }],
  ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2", key: "13wd9y" }],
  ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2", key: "1fr1j5" }]
];
const Fingerprint = createLucideIcon("fingerprint", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
];
const UserRound = createLucideIcon("user-round", __iconNode);
function Steps({ current }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 justify-center", children: [1, 2].map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-smooth",
        style: {
          background: step <= current ? "oklch(0.68 0.24 55)" : "oklch(0.92 0.02 50)",
          color: step <= current ? "oklch(0.98 0 0)" : "oklch(0.45 0.01 50)"
        },
        children: step
      }
    ),
    step < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-12 h-0.5 rounded transition-smooth",
        style: {
          background: current >= 2 ? "oklch(0.68 0.24 55)" : "oklch(0.92 0.02 50)"
        }
      }
    )
  ] }, step)) });
}
function Field({
  label,
  icon: Icon,
  children,
  required,
  htmlFor
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "label",
      {
        htmlFor,
        className: "flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wide",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 12, style: { color: "oklch(0.68 0.24 55)" } }),
          label,
          required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.55 0.22 25)" }, children: "*" })
        ]
      }
    ),
    children
  ] });
}
const inputClass = "w-full h-11 rounded-xl border border-border bg-input px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-smooth focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
function SignupPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { actor } = useActor();
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [loginLoading, setLoginLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [pincode, setPincode] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (isAuthenticated && step === 1) {
      setStep(2);
    }
  }, [isAuthenticated, step]);
  if (isLoading) return null;
  const handleConnectIdentity = async () => {
    setLoginLoading(true);
    try {
      await login();
      setStep(2);
    } finally {
      setLoginLoading(false);
    }
  };
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
      const backend = actor;
      const input = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.replace(/\s+/g, "")
      };
      await backend.updateMyProfile(input);
      navigate({ to: "/home" });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col",
      style: { background: "oklch(0.97 0.025 60)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center justify-between px-5 py-3 bg-card border-b border-border shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/home" }),
              className: "select-none",
              "aria-label": "AssamRoots home",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted", children: "Create Account" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col items-center justify-center px-5 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-1 shadow-md",
                style: { background: "oklch(0.40 0.15 155 / 0.12)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", role: "img", "aria-label": "namaste", children: "🙏" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-foreground tracking-tight", children: step === 1 ? "Join AssamRoots" : "Complete Your Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: step === 1 ? "Start by connecting your Internet Identity" : "Tell us a bit about yourself to get started" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Steps, { current: step }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-lg overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-1.5 w-full",
                style: {
                  background: step === 1 ? "linear-gradient(90deg, oklch(0.68 0.24 55), oklch(0.75 0.18 65))" : "linear-gradient(90deg, oklch(0.75 0.18 65), oklch(0.40 0.15 155))"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "Connect your identity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No password needed — use your device biometrics or PIN." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-xl p-3 flex gap-3 items-start border",
                    style: {
                      background: "oklch(0.68 0.24 55 / 0.07)",
                      borderColor: "oklch(0.68 0.24 55 / 0.2)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Fingerprint,
                        {
                          size: 18,
                          className: "shrink-0 mt-0.5",
                          style: { color: "oklch(0.68 0.24 55)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: "Internet Identity keeps you safe without storing any passwords. Your biometric data never leaves your device." })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleConnectIdentity,
                    disabled: loginLoading,
                    "data-ocid": "signup-connect-identity",
                    className: "w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm",
                    style: {
                      background: loginLoading ? "oklch(0.68 0.24 55 / 0.7)" : "oklch(0.68 0.24 55)",
                      color: "oklch(0.98 0 0)"
                    },
                    children: loginLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "svg",
                        {
                          className: "animate-spin",
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          "aria-hidden": "true",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "path",
                              {
                                d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                                opacity: "0.25"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 12a9 9 0 01-9-9", strokeLinecap: "round" })
                          ]
                        }
                      ),
                      "Opening Internet Identity…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Fingerprint, { size: 18 }),
                      "Connect with Internet Identity"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
                  "Already have an account?",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleConnectIdentity,
                      className: "font-semibold underline underline-offset-2",
                      style: { color: "oklch(0.68 0.24 55)" },
                      "data-ocid": "signup-login-link",
                      children: "Sign in"
                    }
                  )
                ] })
              ] }),
              step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "Your details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This helps sellers deliver to you correctly." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Full Name",
                    icon: UserRound,
                    required: true,
                    htmlFor: "signup-name",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "signup-name",
                        type: "text",
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        placeholder: "e.g. Ritika Bora",
                        className: inputClass,
                        "data-ocid": "signup-name",
                        autoComplete: "name"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Email Address",
                    icon: Mail,
                    required: true,
                    htmlFor: "signup-email",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "signup-email",
                        type: "email",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        placeholder: "you@example.com",
                        className: inputClass,
                        "data-ocid": "signup-email",
                        autoComplete: "email"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Mobile Number",
                    icon: Phone,
                    required: true,
                    htmlFor: "signup-phone",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "signup-phone",
                        type: "tel",
                        value: phone,
                        onChange: (e) => setPhone(e.target.value),
                        placeholder: "98765 43210",
                        className: inputClass,
                        "data-ocid": "signup-phone",
                        autoComplete: "tel",
                        maxLength: 12
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "PIN Code",
                    icon: MapPin,
                    htmlFor: "signup-pincode",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "signup-pincode",
                        type: "text",
                        value: pincode,
                        onChange: (e) => setPincode(e.target.value.replace(/\D/g, "")),
                        placeholder: "e.g. 781001",
                        className: inputClass,
                        "data-ocid": "signup-pincode",
                        inputMode: "numeric",
                        maxLength: 6
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Full Address",
                    icon: MapPin,
                    htmlFor: "signup-address",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "textarea",
                      {
                        id: "signup-address",
                        value: address,
                        onChange: (e) => setAddress(e.target.value),
                        placeholder: "House / Flat no., Street, Area, City",
                        rows: 2,
                        className: `${inputClass} h-auto py-3 resize-none`,
                        "data-ocid": "signup-address",
                        autoComplete: "street-address"
                      }
                    )
                  }
                ),
                error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded-lg px-3 py-2 text-xs font-medium border",
                    style: {
                      background: "oklch(0.55 0.22 25 / 0.08)",
                      borderColor: "oklch(0.55 0.22 25 / 0.3)",
                      color: "oklch(0.45 0.18 25)"
                    },
                    role: "alert",
                    children: error
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleSubmitProfile,
                    disabled: submitting,
                    "data-ocid": "signup-submit",
                    className: "w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm mt-1",
                    style: {
                      background: submitting ? "oklch(0.40 0.15 155 / 0.7)" : "oklch(0.40 0.15 155)",
                      color: "oklch(0.98 0 0)"
                    },
                    children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "svg",
                        {
                          className: "animate-spin",
                          width: "16",
                          height: "16",
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "2",
                          "aria-hidden": "true",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "path",
                              {
                                d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                                opacity: "0.25"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M21 12a9 9 0 01-9-9", strokeLinecap: "round" })
                          ]
                        }
                      ),
                      "Saving profile…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { size: 16 }),
                      "Save & Start Shopping"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => navigate({ to: "/home" }),
                    className: "w-full text-xs text-center text-muted-foreground underline underline-offset-2 hover:opacity-70 transition-smooth py-1",
                    "data-ocid": "signup-skip",
                    children: "Skip for now"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground pb-2", children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            " AssamRoots. All rights reserved."
          ] })
        ] }) })
      ]
    }
  );
}
export {
  SignupPage as default
};
