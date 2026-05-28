import { u as useNavigate, b as useSearch, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-CR5jwz_B.js";
import { O as OrderStatus, c as createActor } from "./useQueries-CzNiaAGb.js";
import { L as Layout } from "./Layout-DhGPVLyq.js";
import { B as Badge } from "./badge-BNJmWZh5.js";
import { B as Button } from "./button-I5RPTQO5.js";
import { u as useAuth } from "./useAuth-CQXdGqgC.js";
import { u as useActor, a as useQuery } from "./useActor-DMra6ezJ.js";
import { L as LogIn } from "./log-in-CtmyJVey.js";
import { P as Package } from "./package-DCbmyrTh.js";
import { C as CircleX } from "./circle-x-BqDl1OJ9.js";
import { C as ChevronLeft } from "./chevron-left-C1KMViUT.js";
import { c as createLucideIcon } from "./createLucideIcon-BOzMcLN1.js";
import { T as Truck } from "./truck-DO7SpthQ.js";
import { C as Clock } from "./clock-D4g52ooS.js";
import { M as MapPin } from "./map-pin-PFx-SA4g.js";
import { C as CircleCheck } from "./circle-check-of3grdI8.js";
import "./index-D3eYOVqY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 16 2 2 4-4", key: "gfu2re" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
];
const PackageCheck = createLucideIcon("package-check", __iconNode);
const TIMELINE_STEPS = [
  {
    id: "processing",
    label: "Order Placed",
    sublabel: "We received your order",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }),
    statuses: [OrderStatus.Processing]
  },
  {
    id: "confirmed",
    label: "Confirmed",
    sublabel: "Payment confirmed",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 18 }),
    statuses: [OrderStatus.Confirmed]
  },
  {
    id: "shipped",
    label: "Shipped",
    sublabel: "On its way to you",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 18 }),
    statuses: [OrderStatus.Shipped]
  },
  {
    id: "out_for_delivery",
    label: "Out for Delivery",
    sublabel: "With your delivery partner",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 18 }),
    statuses: [OrderStatus.OutForDelivery]
  },
  {
    id: "delivered",
    label: "Delivered",
    sublabel: "Enjoy your purchase!",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageCheck, { size: 18 }),
    statuses: [OrderStatus.Delivered]
  }
];
const STATUS_ORDER = [
  OrderStatus.Processing,
  OrderStatus.Confirmed,
  OrderStatus.Shipped,
  OrderStatus.OutForDelivery,
  OrderStatus.Delivered
];
function getStatusIndex(status) {
  return STATUS_ORDER.indexOf(status);
}
function getStepState(step, currentStatus) {
  const currentIdx = getStatusIndex(currentStatus);
  const stepIdx = Math.max(...step.statuses.map((s) => getStatusIndex(s)));
  if (currentIdx > stepIdx) return "done";
  if (step.statuses.includes(currentStatus)) return "active";
  return "pending";
}
function formatDeliveryDate(ts) {
  if (!ts) return "3–5 business days";
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function formatOrderDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function OrderTrackingPage() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useSearch({ from: "/order-tracking" });
  const { actor, isFetching: actorFetching } = useActor(createActor);
  reactExports.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);
  const orderIdBigInt = orderId ? BigInt(orderId) : void 0;
  const {
    data: order,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!actor || !orderIdBigInt) return null;
      return actor.getOrder(orderIdBigInt);
    },
    enabled: !!actor && !actorFetching && !!orderIdBigInt && isAuthenticated
  });
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" })
    ] }) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 px-6",
        "data-ocid": "tracking-unauthenticated",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 48, className: "text-muted-foreground/40 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "Sign in to track order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Track your Assamese product deliveries" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => login(),
              className: "btn-primary border-0 px-8",
              "data-ocid": "tracking-login",
              children: "Sign In"
            }
          )
        ]
      }
    ) });
  }
  if (!orderId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 px-6", "data-ocid": "tracking-no-order", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Package,
        {
          size: 48,
          className: "text-muted-foreground/40 mx-auto mb-4"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "No order selected" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Select an order from your order history" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "btn-primary border-0 px-8", children: "View Orders" }) })
    ] }) });
  }
  if (isLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" })
    ] }) });
  }
  if (isError || !order) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 px-6", "data-ocid": "tracking-error", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 48, className: "text-destructive/60 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "Order not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [
        "We couldn't find order #",
        orderId
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "btn-primary border-0 px-8", children: "View All Orders" }) })
    ] }) });
  }
  const currentStatus = order.status;
  const isCancelled = currentStatus === OrderStatus.Cancelled;
  const isDelivered = currentStatus === OrderStatus.Delivered;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", "data-ocid": "order-tracking", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/orders",
          className: "text-muted-foreground hover:text-foreground transition-colors",
          "aria-label": "Back to orders",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 22 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground leading-tight", children: "Track Order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "#",
          orderId
        ] })
      ] })
    ] }),
    isCancelled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-5 flex items-center gap-3",
        "data-ocid": "tracking-status-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 24, className: "text-destructive flex-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: "Order Cancelled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Placed on ",
              formatOrderDate(order.createdAt)
            ] })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `rounded-xl p-4 mb-5 flex items-center gap-3 border ${isDelivered ? "bg-secondary/10 border-secondary/20" : "bg-primary/10 border-primary/20"}`,
        "data-ocid": "tracking-status-banner",
        children: [
          isDelivered ? /* @__PURE__ */ jsxRuntimeExports.jsx(PackageCheck, { size: 24, className: "text-secondary flex-none" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Truck,
            {
              size: 24,
              className: "text-primary flex-none animate-pulse"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground", children: isDelivered ? "Delivered!" : currentStatus.replace(/([A-Z])/g, " $1").trim() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
              isDelivered ? `Delivered on ${formatDeliveryDate(order.estimatedDelivery)}` : `Est. delivery: ${formatDeliveryDate(order.estimatedDelivery)}`
            ] })
          ] })
        ]
      }
    ),
    !isCancelled && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 mb-4",
        "data-ocid": "tracking-timeline",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground mb-4", children: "Delivery Timeline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0", children: TIMELINE_STEPS.map((step, i) => {
            const state = getStepState(step, currentStatus);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-9 h-9 rounded-full flex items-center justify-center flex-none transition-smooth ${state === "done" ? "bg-secondary text-secondary-foreground" : state === "active" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`,
                    children: step.icon
                  }
                ),
                i < TIMELINE_STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-0.5 h-8 mt-0.5 transition-smooth ${state === "done" ? "bg-secondary" : "bg-border"}`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1.5 pb-3 min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-sm font-semibold ${state === "active" ? "text-primary" : state === "done" ? "text-foreground" : "text-muted-foreground"}`,
                    children: step.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: step.sublabel })
              ] }),
              state === "active" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 flex-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/15 text-primary border-0 text-[10px]", children: "Active" }) }),
              state === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 flex-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-secondary/15 text-secondary border-0 text-[10px]", children: "Done" }) })
            ] }, step.id);
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 mb-4",
        "data-ocid": "tracking-items",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-foreground mb-3", children: [
            order.items.length,
            " ",
            order.items.length === 1 ? "item" : "items",
            " ",
            "in this order"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg overflow-hidden bg-muted flex-none", children: item.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: item.imageUrl,
                    alt: item.title,
                    className: "w-full h-full object-cover"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 18, className: "text-muted-foreground" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: item.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Qty: ",
                    Number(item.quantity)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground flex-none", children: [
                  "₹",
                  (Number(item.price) / 100).toLocaleString("en-IN")
                ] })
              ]
            },
            String(item.productId)
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Total paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
              "₹",
              (Number(order.totalAmount) / 100).toLocaleString("en-IN")
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-muted/40 border border-border rounded-xl p-4 mb-5",
        "data-ocid": "tracking-address",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground uppercase tracking-wide", children: "Delivery Address" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: order.deliveryAddress.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            order.deliveryAddress.houseNo,
            ", ",
            order.deliveryAddress.street
          ] }),
          order.deliveryAddress.locality && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            order.deliveryAddress.locality,
            order.deliveryAddress.landmark ? `, near ${order.deliveryAddress.landmark}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            order.deliveryAddress.city,
            ", ",
            order.deliveryAddress.state,
            " –",
            " ",
            order.deliveryAddress.pincode
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: order.deliveryAddress.phone })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "outline",
        className: "w-full border-primary/30 text-primary",
        "data-ocid": "tracking-continue-shopping",
        children: "Continue Shopping"
      }
    ) })
  ] }) });
}
export {
  OrderTrackingPage as default
};
