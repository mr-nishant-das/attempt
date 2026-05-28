import { j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-CR5jwz_B.js";
import { L as Layout } from "./Layout-DhGPVLyq.js";
import { B as Badge } from "./badge-BNJmWZh5.js";
import { B as Button } from "./button-I5RPTQO5.js";
import { g as useReviews, f as useProducts } from "./useQueries-CzNiaAGb.js";
import { c as createLucideIcon } from "./createLucideIcon-BOzMcLN1.js";
import { S as ShoppingBag } from "./shopping-bag-CkxU1Cf2.js";
import { S as Star } from "./star-BFTT8cOK.js";
import "./index-D3eYOVqY.js";
import "./useActor-DMra6ezJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  ["path", { d: "M12 7v6", key: "lw1j43" }],
  ["path", { d: "M9 10h6", key: "9gxzsh" }]
];
const MessageSquarePlus = createLucideIcon("message-square-plus", __iconNode);
function StarRating({ rating, max = 5 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", "aria-label": `${rating} out of ${max} stars`, children: Array.from({ length: max }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      className: `w-4 h-4 ${i < rating ? "fill-secondary text-secondary" : "fill-muted text-muted-foreground/40"}`
    },
    i
  )) });
}
function ReviewCard({
  review,
  index
}) {
  const date = new Date(
    Number(review.createdAt) / 1e6
  ).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow",
      "data-ocid": `reviews.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground truncate", children: review.reviewerName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-0.5", children: date })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: Number(review.rating) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-foreground leading-relaxed", children: review.reviewText }),
        review.productName && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: "self-start text-xs font-body truncate max-w-[90%]",
            children: review.productName
          }
        )
      ]
    }
  );
}
function FeaturedProductPanel({ product }) {
  const discountedPrice = product.discountPercent > 0n ? Number(product.price) * (1 - Number(product.discountPercent) / 100) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl overflow-hidden shadow-sm sticky top-24",
      "data-ocid": "reviews.featured_product_card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.imageUrls[0] || "/assets/images/placeholder.svg",
              alt: product.title,
              className: "w-full h-full object-cover"
            }
          ),
          product.discountPercent > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute top-2 right-2 bg-primary text-primary-foreground", children: [
            Number(product.discountPercent),
            "% OFF"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body uppercase tracking-widest text-secondary mb-1", children: "Featured Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold text-foreground mb-2 line-clamp-2", children: product.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground mb-3 line-clamp-3", children: product.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl font-bold text-primary", children: [
              "₹",
              discountedPrice !== null ? Math.round(discountedPrice) : Number(product.price)
            ] }),
            discountedPrice !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground line-through font-body", children: [
              "₹",
              Number(product.price)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/products/$id",
              params: { id: String(product.id) },
              className: "block",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "w-full gap-2",
                  "data-ocid": "reviews.view_product_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
                    " View Product"
                  ]
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function EmptyReviews() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
      "data-ocid": "reviews.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquarePlus, { className: "w-8 h-8 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold text-foreground", children: "No reviews yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground max-w-xs", children: "Be the first to share your experience with AssamRoots products." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "default",
            className: "mt-2",
            "data-ocid": "reviews.shop_now_button",
            children: "Start Shopping"
          }
        ) })
      ]
    }
  );
}
function ReviewsSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl p-5 space-y-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 rounded-full" })
      ]
    },
    i
  )) });
}
function ReviewsPage() {
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews();
  const { data: products = [], isLoading: productsLoading } = useProducts({
    limit: 1
  });
  const featuredProduct = products[0] ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-card border-b border-border px-6 py-10 md:px-12",
        "data-ocid": "reviews.page_header",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body uppercase tracking-widest text-secondary mb-1", children: "What our customers say" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-bold text-foreground", children: "Customer Reviews" }),
          reviews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 font-body text-muted-foreground", children: [
            reviews.length,
            " review",
            reviews.length !== 1 ? "s" : "",
            " from our community"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background px-4 py-10 md:px-12 md:py-14",
        "data-ocid": "reviews.content_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto", children: reviewsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewsSkeleton, {}) : reviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyReviews, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", "data-ocid": "reviews.reviews_panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: reviews.map((review, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReviewCard,
            {
              review,
              index: i
            },
            String(review.id)
          )) }) }),
          !productsLoading && featuredProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-full lg:w-80 xl:w-96 shrink-0",
              "data-ocid": "reviews.product_sidebar",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedProductPanel, { product: featuredProduct })
            }
          ),
          productsLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-80 xl:w-96 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 rounded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 rounded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded" })
            ] })
          ] }) })
        ] }) })
      }
    )
  ] });
}
export {
  ReviewsPage as default
};
