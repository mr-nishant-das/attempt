import { u as useNavigate, b as useSearch, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-CstiQ4sz.js";
import { createActor } from "./backend-Dxpf4-N4.js";
import { L as Layout } from "./Layout-BaVl6Ee_.js";
import { B as Button } from "./button-T7X4xHPX.js";
import { u as useAuth } from "./useAuth-nFRIFgXP.js";
import { u as useActor, a as useQuery } from "./createLucideIcon-ByrRp2U0.js";
import { L as LogIn } from "./log-in-CgIptzWK.js";
import { C as CircleCheck } from "./circle-check-DYqL9Alt.js";
import { P as Package } from "./package-B99SaNTR.js";
import { S as ShoppingBag } from "./shopping-bag-D9TtHJ4I.js";
import "./useQueries-CA65lisC.js";
import "./index-DbvNitIR.js";
function ConfettiBurst() {
  const dots = [
    { color: "bg-primary", x: -60, y: -80, delay: 0 },
    { color: "bg-secondary", x: 60, y: -80, delay: 0.05 },
    { color: "bg-accent", x: -40, y: -100, delay: 0.1 },
    { color: "bg-primary", x: 40, y: -100, delay: 0.15 },
    { color: "bg-secondary", x: -80, y: -60, delay: 0.08 },
    { color: "bg-accent", x: 80, y: -60, delay: 0.12 },
    { color: "bg-primary", x: 0, y: -110, delay: 0.06 },
    { color: "bg-secondary", x: -20, y: -70, delay: 0.18 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "absolute inset-0 pointer-events-none overflow-hidden",
      "aria-hidden": "true",
      children: dots.map((dot) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `absolute left-1/2 top-1/3 w-2.5 h-2.5 rounded-full ${dot.color} opacity-0 motion-safe:animate-confetti`,
          style: {
            "--tx": `${dot.x}px`,
            "--ty": `${dot.y}px`,
            animationDelay: `${dot.delay}s`
          }
        },
        `${dot.color}-${dot.x}-${dot.y}`
      ))
    }
  );
}
function formatDeliveryDate(ts) {
  if (!ts) return "3–5 business days";
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function OrderCompletePage() {
  var _a;
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useSearch({ from: "/order-complete" });
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const redirected = reactExports.useRef(false);
  const [vendorNames, setVendorNames] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (!authLoading && !isAuthenticated && !redirected.current) {
      redirected.current = true;
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);
  const orderIdBigInt = orderId ? BigInt(orderId) : void 0;
  const {
    data: order,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["order-complete", orderId],
    queryFn: async () => {
      if (!actor || !orderIdBigInt) return null;
      return actor.getOrder(orderIdBigInt);
    },
    enabled: !!actor && !actorFetching && !!orderIdBigInt && isAuthenticated
  });
  reactExports.useEffect(() => {
    var _a2;
    if (!actor || actorFetching || !((_a2 = order == null ? void 0 : order.items) == null ? void 0 : _a2.length)) return;
    const productIds = order.items.map((item) => String(item.productId));
    Promise.all(
      productIds.map(
        (pid) => actor.getVendorForProduct(pid).then((v) => ({ pid, name: (v == null ? void 0 : v.businessName) ?? null })).catch(() => ({ pid, name: null }))
      )
    ).then((results) => {
      const map = {};
      for (const { pid, name } of results) {
        if (name) map[pid] = name;
      }
      setVendorNames(map);
    });
  }, [actor, actorFetching, order]);
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-16 text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-20 rounded-full mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-56 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-xl" })
    ] }) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 px-6",
        "data-ocid": "order-complete-unauthenticated",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 48, className: "text-muted-foreground/40 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "Sign in to view order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Access your order confirmation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => login(),
              className: "btn-primary border-0 px-8",
              "data-ocid": "order-complete-login",
              children: "Sign In"
            }
          )
        ]
      }
    ) });
  }
  if (isLoading && orderId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-16 text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-20 rounded-full mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-56 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-36 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-11 w-full rounded-lg" })
    ] }) });
  }
  if (!orderId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center px-6 py-10 relative",
        "data-ocid": "order-complete-no-id",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ConfettiBurst, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center justify-center mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-secondary/15 border-4 border-secondary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleCheck,
              {
                size: 44,
                className: "text-secondary",
                strokeWidth: 1.8
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute w-32 h-32 rounded-full border-2 border-secondary/10 animate-ping",
                "aria-hidden": "true"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-black text-foreground mb-2 tracking-tight", children: "Order Placed!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4 leading-relaxed", children: "Your order was placed successfully! 🎉" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 text-left mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground font-medium mb-1", children: "What's next?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
              "Check your order history in your",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", className: "text-primary font-medium", children: "Profile" }),
              " ",
              "for full details, status updates, and tracking information."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/5 border border-primary/15 rounded-xl p-3 mb-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "🌿 Your purchase directly supports local Assamese artisans and farmers — thank you!" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full btn-primary border-0 h-11 text-base",
                "data-ocid": "order-complete-view-orders",
                children: "View My Orders"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "w-full border-primary/30 text-primary h-11",
                "data-ocid": "order-complete-shop",
                children: "Continue Shopping"
              }
            ) })
          ] })
        ]
      }
    ) });
  }
  if (isError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center px-6 py-10",
        "data-ocid": "order-complete-error",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-secondary/15 border-4 border-secondary/30 flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CircleCheck,
            {
              size: 36,
              className: "text-secondary",
              strokeWidth: 1.8
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-foreground mb-2", children: "Order Placed!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [
            "Your order was placed. We couldn't load the details right now — check your order history in",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", className: "text-primary font-medium", children: "Profile" }),
            " ",
            "for full details."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full btn-primary border-0 h-11",
                "data-ocid": "order-complete-profile",
                children: "View My Orders"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "w-full border-primary/30 text-primary h-11",
                "data-ocid": "order-complete-shop",
                children: "Continue Shopping"
              }
            ) })
          ] })
        ]
      }
    ) });
  }
  const displayOrderId = orderId ?? "—";
  const itemCount = ((_a = order == null ? void 0 : order.items) == null ? void 0 : _a.length) ?? 0;
  const total = order ? `₹${(Number(order.totalAmount) / 100).toLocaleString("en-IN")}` : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "text-center px-6 py-10 relative",
      "data-ocid": "order-complete",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ConfettiBurst, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center justify-center mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-secondary/15 border-4 border-secondary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CircleCheck,
            {
              size: 44,
              className: "text-secondary",
              strokeWidth: 1.8
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute w-32 h-32 rounded-full border-2 border-secondary/10 animate-ping",
              "aria-hidden": "true"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-black text-foreground mb-2 tracking-tight", children: "Order Placed!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-1 leading-relaxed", children: "Thank you for supporting authentic Assamese artisans 🙏" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-6", children: [
          "Order ID:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground font-mono", children: [
            "#",
            displayOrderId
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 text-left mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pb-3 border-b border-border mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 20, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: "Estimated Delivery" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (order == null ? void 0 : order.estimatedDelivery) ? formatDeliveryDate(order.estimatedDelivery) : "3–5 business days" })
            ] })
          ] }),
          order && order.items.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            order.items.slice(0, 3).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 bg-muted rounded-lg flex-none overflow-hidden", children: item.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: item.imageUrl,
                      alt: item.title,
                      className: "w-full h-full object-cover"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ShoppingBag,
                    {
                      size: 14,
                      className: "text-muted-foreground"
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground font-medium truncate flex-1 min-w-0", children: item.title }),
                  vendorNames[String(item.productId)] && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: vendorNames[String(item.productId)] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground flex-none", children: [
                    "×",
                    Number(item.quantity)
                  ] })
                ]
              },
              String(item.productId)
            )),
            itemCount > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center pt-1", children: [
              "+",
              itemCount - 3,
              " more ",
              itemCount - 3 === 1 ? "item" : "items"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "Order confirmed" }),
          total && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Amount paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: total })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/5 border border-primary/15 rounded-xl p-3 mb-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "🌿 Your purchase directly supports local Assamese artisans and farmers — thank you!" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/order-tracking", search: { orderId: displayOrderId }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full btn-primary border-0 h-11 text-base",
              "data-ocid": "order-complete-track",
              children: "Track My Order"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "w-full border-primary/30 text-primary h-11",
              "data-ocid": "order-complete-shop",
              children: "Continue Shopping"
            }
          ) })
        ] })
      ]
    }
  ) });
}
export {
  OrderCompletePage as default
};
