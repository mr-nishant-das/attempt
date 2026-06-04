import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, e as ue } from "./index-CstiQ4sz.js";
import { VendorType, createActor } from "./backend-Dxpf4-N4.js";
import { B as Badge } from "./badge-COIfXMhJ.js";
import { u as useImageUpload } from "./useImageUpload-INUKTvRa.js";
import { u as useCategories, o as useVendorMyProducts, p as useVendorSubmitProduct, q as useVendorUpdateProductQuantity } from "./useQueries-CA65lisC.js";
import { c as createLucideIcon, u as useActor, a as useQuery } from "./createLucideIcon-ByrRp2U0.js";
import { S as Store } from "./store-Dj_Vp66S.js";
import { L as LogOut } from "./log-out-BMJ7Yvti.js";
import { C as Clock } from "./clock-CYsheCFv.js";
import { P as Package } from "./package-B99SaNTR.js";
import { S as ShoppingBag } from "./shopping-bag-D9TtHJ4I.js";
import { C as CircleX } from "./circle-x-Bt1znnOM.js";
import { C as CircleCheck } from "./circle-check-DYqL9Alt.js";
import { C as ChevronUp, I as Image } from "./image-D83V5NNz.js";
import { T as TriangleAlert } from "./triangle-alert-FdPIaJup.js";
import { T as Trash2 } from "./trash-2-Bx-_1ZeS.js";
import { U as Upload } from "./upload-CV9VWsTf.js";
import { T as Tag } from "./tag-BAplgXF0.js";
import { S as Sparkles } from "./sparkles-D_jY4KUy.js";
import "./index-DbvNitIR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "10", x2: "10", y1: "15", y2: "9", key: "c1nkhi" }],
  ["line", { x1: "14", x2: "14", y1: "15", y2: "9", key: "h65svq" }]
];
const CirclePause = createLucideIcon("circle-pause", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode);
function StatusBadge({ status }) {
  const config = {
    pending: {
      label: "Pending Review",
      className: "bg-accent/15 text-accent-foreground border-accent/30"
    },
    approved: {
      label: "Active",
      className: "bg-secondary/15 text-secondary-foreground border-secondary/30"
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/15 text-destructive border-destructive/30"
    },
    suspended: {
      label: "Suspended",
      className: "bg-muted text-muted-foreground border-border"
    }
  };
  const { label, className } = config[status] ?? config.pending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `text-xs font-semibold ${className}`, children: label });
}
const STATUS_ICONS = {
  pending: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 32, className: "text-accent" }),
  approved: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 32, className: "text-secondary" }),
  rejected: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 32, className: "text-destructive" }),
  suspended: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePause, { size: 32, className: "text-muted-foreground" })
};
function VendorDashboardPage() {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [showProductForm, setShowProductForm] = reactExports.useState(false);
  const [vendorStatus, setVendorStatus] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    const token = localStorage.getItem("vendorSession");
    if (!token) {
      navigate({ to: "/vendor-login" });
      return;
    }
    (async () => {
      try {
        const result = await actor.getVendorStatusBySession(token);
        const statusStr = result ? typeof result === "object" ? Object.keys(result)[0] : String(result) : null;
        if (!result || statusStr === null) {
          localStorage.removeItem("vendorSession");
          localStorage.removeItem("vendorEmail");
          localStorage.removeItem("vendorSession");
          navigate({ to: "/vendor-login" });
          return;
        }
        if (statusStr !== "approved") {
          setVendorStatus(statusStr);
          return;
        }
        setVendorStatus("approved");
      } catch {
        navigate({ to: "/vendor-login" });
      }
    })();
  }, [actor, isFetching, navigate]);
  const profileQuery = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: async () => {
      if (!actor) return { err: "Not connected" };
      return actor.getMyVendorProfile();
    },
    enabled: !!actor && !isFetching
  });
  const ordersQuery = useQuery({
    queryKey: ["vendor-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyVendorOrders();
    },
    enabled: !!actor && !isFetching && activeTab === "orders"
  });
  const handleLogout = () => {
    localStorage.removeItem("vendorSession");
    navigate({ to: "/vendor-login" });
  };
  const profile = profileQuery.data && "ok" in profileQuery.data ? profileQuery.data.ok : null;
  if (vendorStatus && vendorStatus !== "approved") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-md p-8 max-w-md w-full text-center border border-border", children: [
      vendorStatus === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-4", children: "⏳" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "Application Under Review" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Your vendor application is being reviewed. You will be notified at your email once approved." })
      ] }),
      vendorStatus === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-4", children: "❌" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "Application Rejected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Your vendor application was rejected. Please contact assamshop@assamroots.shop for more information." })
      ] }),
      vendorStatus === "suspended" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-4", children: "⚠️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "Account Suspended" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Your vendor account has been suspended. Please contact assamshop@assamroots.shop." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            localStorage.removeItem("vendorSession");
            localStorage.removeItem("vendorEmail");
            localStorage.removeItem("vendorSessionToken");
            window.location.href = "/vendor-login";
          },
          className: "bg-destructive text-destructive-foreground px-6 py-2 rounded-lg hover:bg-destructive/90 transition-colors",
          children: "Log Out"
        }
      )
    ] }) });
  }
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 12 }),
          " Vendor Portal"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleLogout,
            "data-ocid": "vendor-dashboard.logout_button",
            className: "text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-smooth",
            "aria-label": "Logout",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 14 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6", children: profileQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-xl" })
    ] }) : profile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: STATUS_ICONS[profile.status] ?? /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 28, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-black text-foreground truncate", children: profile.businessName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: profile.status }),
              profile.vendorType === VendorType.brand ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-bold uppercase tracking-wider", children: "Brand Vendor" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider", children: "Raw Material Supplier" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              profile.contactEmail,
              " · ",
              profile.phone
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: profile.categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium",
                children: cat
              },
              cat
            )) })
          ] })
        ] }),
        profile.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-5 mb-5 rounded-xl border border-accent/30 bg-accent/10 p-3 flex gap-2 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Clock,
            {
              size: 16,
              className: "text-accent mt-0.5 flex-shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: "Your application is under review. The AssamRoots team will verify your details and get back to you within 2–3 business days." })
        ] }),
        profile.status === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-5 mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive font-semibold", children: "Application not approved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Contact",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "mailto:assamshop@assamroots.shop",
                className: "text-primary underline",
                children: "assamshop@assamroots.shop"
              }
            ),
            " ",
            "for questions."
          ] })
        ] })
      ] }),
      profile.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 bg-card rounded-xl border border-border p-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("overview"),
              "data-ocid": "vendor-dashboard.overview_tab",
              className: `flex-1 h-9 rounded-lg text-sm font-semibold transition-smooth ${activeTab === "overview" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              children: "Overview"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("orders"),
              "data-ocid": "vendor-dashboard.orders_tab",
              className: `flex-1 h-9 rounded-lg text-sm font-semibold transition-smooth ${activeTab === "orders" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              children: "Orders"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab("products"),
              "data-ocid": "vendor-dashboard.products_tab",
              className: `flex-1 h-9 rounded-lg text-sm font-semibold transition-smooth ${activeTab === "products" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              children: "My Products"
            }
          )
        ] }),
        activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "Assigned Products" }),
          profile.assignedProductIds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center",
              "data-ocid": "vendor-dashboard.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Package,
                  {
                    size: 32,
                    className: "text-muted-foreground mx-auto mb-3"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No products assigned yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "The admin will assign products to your vendor account." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: profile.assignedProductIds.map((id, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 rounded-xl border border-border bg-card p-3",
              "data-ocid": `vendor-dashboard.product.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 18, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                  "Product ID: ",
                  id
                ] })
              ]
            },
            id
          )) })
        ] }),
        activeTab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "Order Activity" }),
          ordersQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: "h-16 w-full rounded-xl"
            },
            i
          )) }) : (ordersQuery.data ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl border border-dashed border-border bg-card p-8 text-center",
              "data-ocid": "vendor-dashboard.orders_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ShoppingBag,
                  {
                    size: 32,
                    className: "text-muted-foreground mx-auto mb-3"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No orders yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Orders for your products will appear here." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: (ordersQuery.data ?? []).map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-border bg-card p-4 space-y-1",
              "data-ocid": `vendor-dashboard.order.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: order.productName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-primary", children: [
                    "₹",
                    order.totalPrice.toLocaleString("en-IN")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "Qty: ",
                    Number(order.quantity)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "Order #",
                    order.orderId
                  ] })
                ] })
              ]
            },
            order.orderId
          )) })
        ] }),
        activeTab === "products" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          VendorProductsTab,
          {
            sessionToken: localStorage.getItem("vendorSession") ?? "",
            showForm: showProductForm,
            onToggleForm: () => setShowProductForm((s) => !s)
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-border bg-card p-8 text-center",
        "data-ocid": "vendor-dashboard.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 32, className: "text-destructive mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Unable to load profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Please check your connection or sign in again." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleLogout,
              className: "mt-4 text-xs text-primary underline underline-offset-2",
              children: "Sign in again"
            }
          )
        ]
      }
    ) })
  ] });
}
function ProductStatusBadge({
  status
}) {
  const config = {
    pending: {
      label: "Pending Review",
      className: "bg-accent/15 text-accent-foreground border-accent/30"
    },
    approved: {
      label: "Approved",
      className: "bg-secondary/15 text-secondary-foreground border-secondary/30"
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/15 text-destructive border-destructive/30"
    }
  };
  const { label, className } = config[status] ?? config.pending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `text-xs font-semibold ${className}`, children: label });
}
function HowToGetLiveStepper() {
  const steps = [
    {
      num: 1,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 18, className: "text-primary" }),
      title: "Submit Your Product",
      desc: "Fill in product details, pricing, and upload images."
    },
    {
      num: 2,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 18, className: "text-accent" }),
      title: "Admin Review",
      desc: "Our team checks compliance, adds taxes & sets the final price."
    },
    {
      num: 3,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 18, className: "text-secondary" }),
      title: "Goes Live",
      desc: "Your product becomes visible to all AssamRoots customers."
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4", children: "How to get your products live" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start gap-0", children: steps.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center relative",
        children: [
          idx < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-5 left-1/2 w-full h-0.5 bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 w-10 h-10 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center mb-2 shadow-sm", children: step.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground text-center leading-snug", children: step.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center mt-0.5 leading-relaxed px-1", children: step.desc })
        ]
      },
      step.num
    )) })
  ] });
}
function VendorProductsTab({
  sessionToken,
  showForm,
  onToggleForm
}) {
  const { actor, isFetching } = useActor(createActor);
  const categoriesQuery = useCategories();
  const myProductsQuery = useVendorMyProducts(sessionToken);
  const submitMutation = useVendorSubmitProduct();
  const updateQuantityMutation = useVendorUpdateProductQuantity();
  const { uploadFile } = useImageUpload();
  const [vendorType, setVendorType] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    productName: "",
    vendorName: "",
    description: "",
    category: "",
    basePrice: "",
    imageUrls: [],
    fssaiDocumentUrl: void 0,
    mrp: "",
    supplyPrice: "",
    moq: "",
    pricePerKg: "",
    availableQuantityKg: ""
  });
  const [uploadingImages, setUploadingImages] = reactExports.useState(false);
  const [uploadingFssai, setUploadingFssai] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [formError, setFormError] = reactExports.useState("");
  const [updatingStockId, setUpdatingStockId] = reactExports.useState(null);
  const [newStockValue, setNewStockValue] = reactExports.useState("");
  const [resubmitProductId, setResubmitProductId] = reactExports.useState(
    null
  );
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    if (form.imageUrls.length + files.length > 5) {
      setFormError("Maximum 5 images allowed.");
      return;
    }
    setUploadingImages(true);
    setFormError("");
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadFile(file);
        urls.push(url);
      }
      setForm((p) => ({ ...p, imageUrls: [...p.imageUrls, ...urls] }));
    } catch {
      setFormError("Failed to upload one or more images.");
    } finally {
      setUploadingImages(false);
    }
  };
  const handleFssaiUpload = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setUploadingFssai(true);
    setFormError("");
    try {
      const url = await uploadFile(file);
      setForm((p) => ({ ...p, fssaiDocumentUrl: url }));
    } catch {
      setFormError("Failed to upload FSSAI document.");
    } finally {
      setUploadingFssai(false);
    }
  };
  const removeImage = (idx) => {
    setForm((p) => ({
      ...p,
      imageUrls: p.imageUrls.filter((_, i) => i !== idx)
    }));
  };
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    actor.getMyVendorProfile().then((res) => {
      if ("ok" in res) {
        setVendorType(res.ok.vendorType);
      }
    });
  }, [actor, isFetching]);
  const handleSubmit = async () => {
    if (!form.productName.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!form.vendorName.trim()) {
      setFormError("Vendor/brand name is required.");
      return;
    }
    if (!form.description.trim()) {
      setFormError("Description is required.");
      return;
    }
    if (!form.category) {
      setFormError("Please select a category.");
      return;
    }
    if (!form.basePrice || Number(form.basePrice) <= 0) {
      setFormError("Enter a valid base price.");
      return;
    }
    if (form.imageUrls.length === 0) {
      setFormError("Upload at least one product image.");
      return;
    }
    if (vendorType === VendorType.brand) {
      if (!form.mrp || Number(form.mrp) <= 0) {
        setFormError("MRP is required for brand vendors.");
        return;
      }
      if (!form.supplyPrice || Number(form.supplyPrice) <= 0) {
        setFormError("Supply price is required for brand vendors.");
        return;
      }
      if (Number(form.supplyPrice) >= Number(form.mrp)) {
        setFormError("Supply price must be less than MRP.");
        return;
      }
      if (!form.moq || Number(form.moq) <= 0) {
        setFormError("MOQ (minimum order quantity) is required.");
        return;
      }
    }
    if (vendorType === VendorType.rawMaterial) {
      if (!form.pricePerKg || Number(form.pricePerKg) <= 0) {
        setFormError("Price per kg is required for raw material suppliers.");
        return;
      }
      if (!form.availableQuantityKg || Number(form.availableQuantityKg) <= 0) {
        setFormError("Available quantity in kg is required.");
        return;
      }
    }
    setSubmitting(true);
    setFormError("");
    try {
      const input = {
        productName: form.productName.trim(),
        vendorName: form.vendorName.trim(),
        description: form.description.trim(),
        category: form.category,
        basePrice: BigInt(Math.round(Number(form.basePrice) * 100)),
        imageUrls: form.imageUrls,
        fssaiDocumentUrl: form.fssaiDocumentUrl,
        vendorType: vendorType === VendorType.brand ? VendorType.brand : VendorType.rawMaterial,
        ...vendorType === VendorType.brand ? {
          mrp: BigInt(Math.round(Number(form.mrp) * 100)),
          supplyPrice: BigInt(Math.round(Number(form.supplyPrice) * 100)),
          moq: BigInt(Math.round(Number(form.moq)))
        } : {},
        ...vendorType === VendorType.rawMaterial ? {
          pricePerKg: BigInt(Math.round(Number(form.pricePerKg) * 100)),
          availableQuantityKg: BigInt(
            Math.round(Number(form.availableQuantityKg))
          )
        } : {}
      };
      await submitMutation.mutateAsync({ sessionToken, input });
      ue.success("Product submitted successfully!");
      setForm({
        productName: "",
        vendorName: "",
        description: "",
        category: "",
        basePrice: "",
        imageUrls: [],
        fssaiDocumentUrl: void 0,
        mrp: "",
        supplyPrice: "",
        moq: "",
        pricePerKg: "",
        availableQuantityKg: ""
      });
      onToggleForm();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to submit product."
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleUpdateStock = async (productId) => {
    if (!newStockValue || Number(newStockValue) <= 0) {
      ue.error("Enter a valid quantity in kg.");
      return;
    }
    try {
      await updateQuantityMutation.mutateAsync({
        sessionToken,
        productId,
        newQuantityKg: BigInt(Math.round(Number(newStockValue)))
      });
      ue.success("Stock updated successfully!");
      setUpdatingStockId(null);
      setNewStockValue("");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to update stock."
      );
    }
  };
  const handleResubmit = (product) => {
    var _a;
    setForm({
      productName: product.productName,
      vendorName: product.vendorName,
      description: product.description,
      category: product.category,
      basePrice: (Number(product.basePrice) / 100).toFixed(2),
      imageUrls: product.imageUrls,
      fssaiDocumentUrl: ((_a = product.fssaiDocumentUrl) == null ? void 0 : _a[0]) ?? void 0,
      mrp: product.mrp ? (Number(product.mrp) / 100).toFixed(2) : "",
      supplyPrice: product.supplyPrice ? (Number(product.supplyPrice) / 100).toFixed(2) : "",
      moq: product.moq ? String(Number(product.moq)) : "",
      pricePerKg: product.pricePerKg ? (Number(product.pricePerKg) / 100).toFixed(2) : "",
      availableQuantityKg: product.availableQuantityKg ? String(Number(product.availableQuantityKg)) : ""
    });
    setResubmitProductId(product.id);
    if (!showForm) onToggleForm();
    setTimeout(
      () => {
        var _a2;
        return (_a2 = document.getElementById("productName")) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth", block: "center" });
      },
      100
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HowToGetLiveStepper, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "My Products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            setResubmitProductId(null);
            setForm({
              productName: "",
              vendorName: "",
              description: "",
              category: "",
              basePrice: "",
              imageUrls: [],
              fssaiDocumentUrl: void 0,
              mrp: "",
              supplyPrice: "",
              moq: "",
              pricePerKg: "",
              availableQuantityKg: ""
            });
            onToggleForm();
          },
          "data-ocid": "vendor-dashboard.submit_product_button",
          className: "h-9 px-4 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth flex items-center gap-1.5",
          children: [
            showForm ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 16 }),
            showForm ? "Close Form" : "Submit New Product"
          ]
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full bg-gradient-to-r from-primary via-accent to-secondary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-bold text-foreground", children: resubmitProductId ? "Edit & Resubmit Product" : "Submit New Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "productName",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                children: "Product Name *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "productName",
                type: "text",
                placeholder: "e.g. Organic Assam Tea 250g",
                value: form.productName,
                onChange: (e) => {
                  setForm((p) => ({ ...p, productName: e.target.value }));
                  setFormError("");
                },
                disabled: submitting,
                "data-ocid": "vendor-dashboard.product_name_input",
                className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "The name customers will see on the products page" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "vendorName",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                children: "Vendor / Brand Name *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "vendorName",
                type: "text",
                placeholder: "e.g. Brahmaputra Teas",
                value: form.vendorName,
                onChange: (e) => {
                  setForm((p) => ({ ...p, vendorName: e.target.value }));
                  setFormError("");
                },
                disabled: submitting,
                "data-ocid": "vendor-dashboard.vendor_name_input",
                className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "description",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                children: "Description *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "description",
                placeholder: "Describe your product — ingredients, origin, usage, etc.",
                value: form.description,
                onChange: (e) => {
                  setForm((p) => ({ ...p, description: e.target.value }));
                  setFormError("");
                },
                disabled: submitting,
                rows: 4,
                "data-ocid": "vendor-dashboard.product_description_input",
                className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 resize-none"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Describe the product — ingredients, origin, how it is made or harvested" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "category",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                children: "Category *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "category",
                value: form.category,
                onChange: (e) => {
                  setForm((p) => ({ ...p, category: e.target.value }));
                  setFormError("");
                },
                disabled: submitting || categoriesQuery.isLoading,
                "data-ocid": "vendor-dashboard.product_category_select",
                className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a category" }),
                  (categoriesQuery.data ?? []).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat.name, children: cat.name }, cat.id.toString()))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Select the category that best fits your product" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "basePrice",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                children: "Base Price (INR) *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "basePrice",
                type: "number",
                placeholder: "e.g. 299",
                value: form.basePrice,
                onChange: (e) => {
                  setForm((p) => ({ ...p, basePrice: e.target.value }));
                  setFormError("");
                },
                disabled: submitting,
                min: 1,
                "data-ocid": "vendor-dashboard.product_price_input",
                className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "The price at which you supply this product to AssamRoots (before tax)" })
          ] }),
          vendorType === VendorType.brand && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-amber-800 uppercase tracking-wide", children: "Brand Vendor Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "mrp",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "MRP (₹) *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "mrp",
                  type: "number",
                  placeholder: "e.g. 499",
                  value: form.mrp,
                  onChange: (e) => {
                    setForm((p) => ({ ...p, mrp: e.target.value }));
                    setFormError("");
                  },
                  disabled: submitting,
                  min: 1,
                  "data-ocid": "vendor-dashboard.product_mrp_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "The maximum retail price printed on your packaging" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "supplyPrice",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "Supply Price (₹) *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "supplyPrice",
                  type: "number",
                  placeholder: "e.g. 350",
                  value: form.supplyPrice,
                  onChange: (e) => {
                    setForm((p) => ({ ...p, supplyPrice: e.target.value }));
                    setFormError("");
                  },
                  disabled: submitting,
                  min: 1,
                  "data-ocid": "vendor-dashboard.product_supply_price_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "The price at which you supply this product to AssamRoots (must be lower than MRP)" }),
              form.supplyPrice && form.mrp && Number(form.supplyPrice) >= Number(form.mrp) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12 }),
                "Supply price should be less than MRP for both parties to profit."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "moq",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "Minimum Order Quantity (units) *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "moq",
                  type: "number",
                  placeholder: "e.g. 50",
                  value: form.moq,
                  onChange: (e) => {
                    setForm((p) => ({ ...p, moq: e.target.value }));
                    setFormError("");
                  },
                  disabled: submitting,
                  min: 1,
                  "data-ocid": "vendor-dashboard.product_moq_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Minimum quantity per order you can supply" })
            ] })
          ] }),
          vendorType === VendorType.rawMaterial && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-emerald-800 uppercase tracking-wide", children: "Raw Material Supplier Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "pricePerKg",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "Price per kg (₹/kg) *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "pricePerKg",
                  type: "number",
                  placeholder: "e.g. 120",
                  value: form.pricePerKg,
                  onChange: (e) => {
                    setForm((p) => ({ ...p, pricePerKg: e.target.value }));
                    setFormError("");
                  },
                  disabled: submitting,
                  min: 1,
                  "data-ocid": "vendor-dashboard.product_price_per_kg_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Your asking rate per kilogram for bulk supply" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "availableQuantityKg",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "Available Quantity (kg) *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "availableQuantityKg",
                  type: "number",
                  placeholder: "e.g. 500",
                  value: form.availableQuantityKg,
                  onChange: (e) => {
                    setForm((p) => ({
                      ...p,
                      availableQuantityKg: e.target.value
                    }));
                    setFormError("");
                  },
                  disabled: submitting,
                  min: 1,
                  "data-ocid": "vendor-dashboard.product_available_qty_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "How many kilograms you currently have available" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "productImages",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                children: [
                  "Product Images *",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case font-normal", children: "(up to 5)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1.5", children: "Upload clear photos of your product (or raw material)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "productImages",
                type: "file",
                accept: "image/*",
                multiple: true,
                onChange: handleImageUpload,
                disabled: submitting || uploadingImages,
                "data-ocid": "vendor-dashboard.product_images_input",
                className: "w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-60"
              }
            ),
            uploadingImages && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Uploading images…" }),
            form.imageUrls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: form.imageUrls.map((url, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative w-16 h-16 rounded-lg overflow-hidden border border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: url,
                      alt: `Product ${idx + 1}`,
                      className: "w-full h-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeImage(idx),
                      className: "absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center",
                      "aria-label": "Remove image",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 10 })
                    }
                  )
                ]
              },
              url
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "fssaiDoc",
                className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                children: [
                  "FSSAI Document",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case font-normal", children: "(required for food products)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1.5", children: "Required for food products — upload your FSSAI registration certificate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "fssaiDoc",
                type: "file",
                accept: ".pdf,.jpg,.jpeg,.png",
                onChange: handleFssaiUpload,
                disabled: submitting || uploadingFssai,
                "data-ocid": "vendor-dashboard.product_fssai_input",
                className: "w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-60"
              }
            ),
            uploadingFssai && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Uploading document…" }),
            form.fssaiDocumentUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-secondary mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 12 }),
              " FSSAI document uploaded"
            ] })
          ] }),
          formError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: formError }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleSubmit,
              disabled: submitting,
              "data-ocid": "vendor-dashboard.product_submit_button",
              className: "w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90",
              children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 16 }),
                resubmitProductId ? "Resubmit Product" : "Submit Product"
              ] })
            }
          )
        ] })
      ] })
    ] }),
    myProductsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }, i)) }) : (myProductsQuery.data ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-2xl border border-dashed border-primary/30 bg-card p-10 text-center",
        "data-ocid": "vendor-dashboard.products_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 32, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-foreground", children: "No products submitted yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed", children: "Start by submitting your first product. Once approved by our team, it will appear on the AssamRoots products page." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setResubmitProductId(null);
                if (!showForm) onToggleForm();
                setTimeout(
                  () => {
                    var _a;
                    return (_a = document.getElementById("productName")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "center" });
                  },
                  100
                );
              },
              "data-ocid": "vendor-dashboard.submit_first_product_button",
              className: "mt-5 h-12 px-8 rounded-xl font-display font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth active:scale-95 flex items-center gap-2 mx-auto",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 18 }),
                "Submit Your First Product"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: (myProductsQuery.data ?? []).map((product, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-4 space-y-2",
        "data-ocid": `vendor-dashboard.product.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              product.imageUrls[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: product.imageUrls[0],
                  alt: product.productName,
                  className: "w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 18, className: "text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: product.productName }),
                product.vendorType === VendorType.brand ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "MRP: ₹",
                    (Number(product.mrp ?? 0) / 100).toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "Supply: ₹",
                    (Number(product.supplyPrice ?? 0) / 100).toFixed(2)
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "₹",
                    (Number(product.pricePerKg ?? 0) / 100).toFixed(2),
                    "/kg"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "Stock: ",
                    Number(product.availableQuantityKg ?? 0),
                    " kg"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ProductStatusBadge, { status: product.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Submitted",
              " ",
              new Date(
                Number(product.submittedAt) / 1e6
              ).toLocaleDateString("en-IN")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: product.category })
          ] }),
          product.status === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            product.rejectionReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-destructive/30 bg-destructive/10 p-3 flex gap-2 items-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  size: 14,
                  className: "text-destructive mt-0.5 flex-shrink-0"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-destructive", children: "Reason for rejection" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: product.rejectionReason })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleResubmit(product),
                "data-ocid": `vendor-dashboard.edit_resubmit_button.${i + 1}`,
                className: "h-9 px-4 rounded-lg text-xs font-semibold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-smooth flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 13 }),
                  "Edit & Resubmit"
                ]
              }
            )
          ] }),
          product.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2.5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleCheck,
              {
                size: 15,
                className: "text-secondary flex-shrink-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-secondary", children: "Live on AssamRoots" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Your product is visible to all customers on the products page" })
            ] }),
            product.finalPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs font-semibold text-secondary whitespace-nowrap", children: [
              "₹",
              (Number(product.finalPrice) / 100).toFixed(2)
            ] })
          ] }),
          product.vendorType === VendorType.rawMaterial && product.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1", children: updatingStockId === product.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                placeholder: "New qty (kg)",
                value: newStockValue,
                onChange: (e) => setNewStockValue(e.target.value),
                className: "h-8 w-28 rounded-lg border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40",
                min: 1
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleUpdateStock(product.id),
                disabled: updateQuantityMutation.isPending,
                "data-ocid": `vendor-dashboard.update_stock_confirm.${i + 1}`,
                className: "h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-smooth disabled:opacity-60",
                children: updateQuantityMutation.isPending ? "Saving…" : "Save"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setUpdatingStockId(null);
                  setNewStockValue("");
                },
                className: "h-8 px-3 rounded-lg text-xs font-semibold bg-muted text-muted-foreground hover:bg-muted/80 transition-smooth",
                children: "Cancel"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setUpdatingStockId(product.id);
                setNewStockValue(
                  String(product.availableQuantityKg ?? "")
                );
              },
              "data-ocid": `vendor-dashboard.update_stock_button.${i + 1}`,
              className: "h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-600/10 text-emerald-700 border border-emerald-200 hover:bg-emerald-600/20 transition-smooth",
              children: "Update Stock"
            }
          ) })
        ]
      },
      product.id.toString()
    )) })
  ] });
}
export {
  VendorDashboardPage as default
};
