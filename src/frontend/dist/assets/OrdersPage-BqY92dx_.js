import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-CR5jwz_B.js";
import { O as OrderStatus, c as createActor } from "./useQueries-CzNiaAGb.js";
import { L as Layout } from "./Layout-DhGPVLyq.js";
import { B as Badge } from "./badge-BNJmWZh5.js";
import { B as Button } from "./button-I5RPTQO5.js";
import { u as useAuth } from "./useAuth-CQXdGqgC.js";
import { u as useActor, a as useQuery } from "./useActor-DMra6ezJ.js";
import { L as LogIn } from "./log-in-CtmyJVey.js";
import { S as ShoppingBag } from "./shopping-bag-CkxU1Cf2.js";
import { P as Package } from "./package-DCbmyrTh.js";
import { C as ChevronRight } from "./chevron-right-DsRoCsQ-.js";
import "./createLucideIcon-BOzMcLN1.js";
import "./index-D3eYOVqY.js";
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
    label: order.status,
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
      "data-ocid": `order-row-${orderId}`,
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
function OrderCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
    ] })
  ] });
}
function OrdersPage() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  reactExports.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);
  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !actorFetching && isAuthenticated
  });
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-36" }),
      [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCardSkeleton, {}, n))
    ] }) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 px-6",
        "data-ocid": "orders-unauthenticated",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 48, className: "text-muted-foreground/40 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "Sign in to view orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Track your Assamese product orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => login(),
              className: "btn-primary border-0 px-8",
              "data-ocid": "orders-login",
              children: "Sign In"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", "data-ocid": "orders-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground mb-4", children: "My Orders" }),
    (isLoading || actorFetching) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCardSkeleton, {}, n)) }),
    !isLoading && !actorFetching && (orders == null ? void 0 : orders.length) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", "data-ocid": "orders-empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 32, className: "text-muted-foreground/60" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground mb-1", children: "No orders yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Start exploring authentic Assamese products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "btn-primary border-0 px-8",
          "data-ocid": "orders-start-shopping",
          children: "Shop Now"
        }
      ) })
    ] }),
    !isLoading && !actorFetching && orders && orders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderCard, { order }, String(order.id))) })
  ] }) });
}
export {
  OrdersPage as default
};
