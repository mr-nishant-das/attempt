import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-BbgXscAi.js";
import { L as Layout, C as CircleUser, O as OrderStatus, d as createActor } from "./Layout-D5VIdwoN.js";
import { B as Badge } from "./badge-C-QwoaHS.js";
import { B as Button } from "./button-BlVWhxCp.js";
import { u as useAuth } from "./useAuth-CWtxSbDA.js";
import { u as useActor, a as useQuery } from "./useActor-AG09Vf65.js";
import { L as LogIn } from "./log-in-C0e58_7h.js";
import { c as createLucideIcon } from "./createLucideIcon-B6ccG8eC.js";
import { L as LogOut } from "./log-out-BJpcIOSP.js";
import { S as ShoppingBag } from "./shopping-bag-Tf_inE9v.js";
import { C as ChevronRight } from "./chevron-right-Duqqd7JQ.js";
import { P as Package } from "./package-CpMG6Sad.js";
import "./index-_KOCx7qY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const STATUS_CONFIG = {
  [OrderStatus.Processing]: {
    label: "Processing",
    className: "bg-primary/15 text-primary border-0"
  },
  [OrderStatus.Confirmed]: {
    label: "Confirmed",
    className: "bg-accent/20 text-accent-foreground border-0"
  },
  [OrderStatus.Shipped]: {
    label: "Shipped",
    className: "bg-primary/15 text-primary border-0"
  },
  [OrderStatus.OutForDelivery]: {
    label: "Out for Delivery",
    className: "bg-accent/30 text-foreground border-0"
  },
  [OrderStatus.Delivered]: {
    label: "Delivered",
    className: "bg-secondary/20 text-secondary border-0"
  },
  [OrderStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive border-0"
  }
};
function formatOrderDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function OrderCard({ order }) {
  var _a, _b;
  const statusConfig = STATUS_CONFIG[order.status] ?? {
    label: String(order.status),
    className: "bg-muted text-muted-foreground border-0"
  };
  const orderId = String(order.id);
  const firstImage = (_a = order.items[0]) == null ? void 0 : _a.imageUrl;
  const extraItems = order.items.length - 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/order-tracking",
      search: { orderId },
      className: "block",
      "data-ocid": "profile.order.item",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-smooth", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-foreground font-mono", children: [
              "#",
              orderId
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatOrderDate(order.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `text-[11px] flex-none ${statusConfig.className}`, children: statusConfig.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          firstImage ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg overflow-hidden bg-muted flex-none border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: firstImage,
              alt: order.items[0].title,
              className: "w-full h-full object-cover"
            }
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground font-medium truncate", children: ((_b = order.items[0]) == null ? void 0 : _b.title) ?? "Order items" }),
            extraItems > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
              "+",
              extraItems,
              " more ",
              extraItems === 1 ? "item" : "items"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground", children: [
            "₹",
            (Number(order.totalAmount) / 100).toLocaleString("en-IN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary font-semibold flex items-center gap-0.5", children: [
            "View Details ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 })
          ] })
        ] })
      ] })
    }
  );
}
function ProfilePage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    principalText,
    login,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [activeTab, setActiveTab] = reactExports.useState("account");
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !actorFetching && isAuthenticated && activeTab === "orders"
  });
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" })
    ] }) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 px-6",
        "data-ocid": "profile.unauthenticated",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 40, className: "text-muted-foreground/60" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "Sign in to your profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "View your orders, manage addresses, and more" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => login(),
              className: "btn-primary border-0 px-8",
              "data-ocid": "profile.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 16, className: "mr-2" }),
                "Sign In"
              ]
            }
          )
        ]
      }
    ) });
  }
  const displayId = principalText ? `${principalText.slice(0, 8)}…${principalText.slice(-6)}` : "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", "data-ocid": "profile.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 mb-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 28, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: "My Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono truncate", children: displayId })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => {
            logout();
            navigate({ to: "/home" });
          },
          className: "flex-none text-muted-foreground hover:text-destructive",
          "data-ocid": "profile.logout_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 bg-muted/40 rounded-lg p-1 mb-4",
        "data-ocid": "profile.tabs",
        children: ["account", "orders"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab),
            className: `flex-1 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
            "data-ocid": `profile.${tab}.tab`,
            children: tab === "account" ? "My Account" : "My Orders"
          },
          tab
        ))
      }
    ),
    activeTab === "account" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "profile.account.panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl divide-y divide-border overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "User ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-foreground truncate", children: principalText ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Authentication" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Internet Identity" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/orders",
          className: "flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors",
          "data-ocid": "profile.orders_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 18, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "My Orders" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-muted-foreground" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          className: "w-full text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20",
          onClick: () => {
            logout();
            navigate({ to: "/home" });
          },
          "data-ocid": "profile.signout_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 16, className: "mr-2" }),
            "Sign Out"
          ]
        }
      )
    ] }),
    activeTab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "profile.orders.panel", children: [
      (ordersLoading || actorFetching) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 flex-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
            ] })
          ]
        },
        n
      )) }),
      !ordersLoading && !actorFetching && (orders == null ? void 0 : orders.length) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-14",
          "data-ocid": "profile.orders.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 28, className: "text-muted-foreground/60" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground mb-1", children: "No orders yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Start exploring authentic Assamese products" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "btn-primary border-0 px-8",
                "data-ocid": "profile.orders.shop_button",
                children: "Shop Now"
              }
            ) })
          ]
        }
      ),
      !ordersLoading && !actorFetching && orders && orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order }, String(order.id))) })
    ] })
  ] }) });
}
export {
  ProfilePage as default
};
