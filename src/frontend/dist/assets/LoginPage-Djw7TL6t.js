import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-DUDks8tZ.js";
import { u as useAuth } from "./useAuth-fgdZxk-8.js";
import { S as ShieldCheck } from "./shield-check-CmasqSFa.js";
import { F as Fingerprint } from "./fingerprint-CIpk-Lhx.js";
import { L as Leaf } from "./leaf-BVdYb5uf.js";
import "./createLucideIcon-Ccmnz96I.js";
function AssameseBorder() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 400 12",
      className: "w-full",
      "aria-hidden": "true",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M0 6 Q25 0 50 6 Q75 12 100 6 Q125 0 150 6 Q175 12 200 6 Q225 0 250 6 Q275 12 300 6 Q325 0 350 6 Q375 12 400 6",
            stroke: "oklch(var(--primary))",
            strokeWidth: "2",
            strokeOpacity: "0.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "200",
            cy: "6",
            r: "3",
            fill: "oklch(var(--primary))",
            fillOpacity: "0.6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "100",
            cy: "6",
            r: "2",
            fill: "oklch(var(--accent))",
            fillOpacity: "0.6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "300",
            cy: "6",
            r: "2",
            fill: "oklch(var(--accent))",
            fillOpacity: "0.6"
          }
        )
      ]
    }
  );
}
const features = [
  {
    icon: ShieldCheck,
    title: "Secure & Decentralised",
    desc: "No passwords stored. Your identity is yours alone."
  },
  {
    icon: Fingerprint,
    title: "One-tap Login",
    desc: "Authenticate with biometrics or device PIN."
  },
  {
    icon: Leaf,
    title: "Rooted in Assam",
    desc: "Authentic products, trusted sellers, your community."
  }
];
function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center justify-between px-5 py-3 bg-card border-b border-border shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/home" }),
          className: "font-display text-2xl font-black tracking-tight select-none",
          "aria-label": "AssamRoots home",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Assam" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary", children: "Roots" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted", children: "Secure Login" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col items-center justify-center px-5 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 shadow-md bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", role: "img", "aria-label": "leaf", children: "🌿" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-foreground tracking-tight", children: "Welcome to AssamRoots" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Discover authentic Assamese products — tea, handloom, spices, and more." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AssameseBorder, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Sign in to continue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "We use Internet Identity — no email or password required." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl p-3 flex gap-3 items-start border border-secondary/25 bg-secondary/8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ShieldCheck,
              {
                size: 20,
                className: "mt-0.5 shrink-0 text-secondary"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Internet Identity" }),
              " is a secure, password-free login by DFINITY. It uses your device's biometrics or PIN — your data stays private and decentralised."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleLogin,
              disabled: loading,
              "data-ocid": "login-submit",
              className: "w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90",
              children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
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
                "Continue with Internet Identity"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
            "New here?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleLogin,
                className: "font-semibold underline underline-offset-2 transition-smooth hover:opacity-70 text-primary",
                "data-ocid": "login-create-account",
                children: "Create your account"
              }
            ),
            " ",
            "— same button, we'll guide you."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: features.map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: desc })
        ] })
      ] }, title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AssameseBorder, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground pb-2", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "underline underline-offset-2 hover:opacity-70 transition-smooth",
            children: "Built with caffeine.ai"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  LoginPage as default
};
