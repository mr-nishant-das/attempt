import { j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-BbgXscAi.js";
import { u as useCategories, L as Layout } from "./Layout-D5VIdwoN.js";
import { B as Badge } from "./badge-C-QwoaHS.js";
import { C as ChevronRight } from "./chevron-right-Duqqd7JQ.js";
import "./createLucideIcon-B6ccG8eC.js";
import "./useActor-AG09Vf65.js";
import "./index-_KOCx7qY.js";
const SLUG_META = {
  "assam-tea": { emoji: "🍵", color: "bg-accent/15 border-accent/30" },
  "assamese-food": { emoji: "🍚", color: "bg-accent/15 border-accent/30" },
  "spices-herbs": {
    emoji: "🌶️",
    color: "bg-destructive/10 border-destructive/20"
  },
  "medicine-herbs": { emoji: "🌿", color: "bg-primary/10 border-primary/20" },
  "assamese-attire": {
    emoji: "👘",
    color: "bg-secondary/15 border-secondary/30"
  },
  "handloom-textiles": {
    emoji: "🧵",
    color: "bg-secondary/15 border-secondary/30"
  },
  handicrafts: { emoji: "🎋", color: "bg-primary/10 border-primary/20" },
  "art-paintings": { emoji: "🎨", color: "bg-muted border-border" },
  "books-literature": { emoji: "📚", color: "bg-muted border-border" },
  "chronicles-magazines": { emoji: "📰", color: "bg-muted border-border" },
  "musical-instruments": {
    emoji: "🥁",
    color: "bg-accent/15 border-accent/30"
  },
  "religious-puja": { emoji: "🪔", color: "bg-accent/15 border-accent/30" },
  "decorative-items": {
    emoji: "🏺",
    color: "bg-secondary/15 border-secondary/30"
  },
  "kitchen-cookware": { emoji: "🍳", color: "bg-primary/10 border-primary/20" },
  "living-room-decor": {
    emoji: "🛋️",
    color: "bg-secondary/15 border-secondary/30"
  }
};
function CategorySkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-1/2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-12 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded-full" })
      ] })
    ] })
  ] });
}
function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "All Categories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        "Explore authentic Assamese products across ",
        categories.length,
        " ",
        "categories"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: Array.from({ length: 8 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
      /* @__PURE__ */ jsxRuntimeExports.jsx(CategorySkeleton, {}, i)
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
        "data-ocid": "categories-grid",
        children: categories.map((cat) => {
          const meta = SLUG_META[cat.slug] ?? {
            emoji: "📦",
            color: "bg-muted border-border"
          };
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/categories/$slug",
              params: { slug: cat.slug },
              "data-ocid": `category-card-${cat.slug}`,
              className: "group bg-card rounded-2xl border border-border overflow-hidden transition-smooth hover:shadow-md hover:border-primary/30 active:scale-[0.98]",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `aspect-[4/3] flex flex-col items-center justify-center gap-2 ${meta.color} relative overflow-hidden`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-5xl sm:text-6xl",
                        role: "img",
                        "aria-label": cat.name,
                        children: meta.emoji
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors", children: cat.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronRight,
                      {
                        size: 14,
                        className: "text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-smooth flex-none"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-tight line-clamp-2 mb-2", children: cat.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                    cat.subCategories.slice(0, 3).map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-[10px] px-1.5 py-0 border-border font-normal",
                        children: sub.name
                      },
                      sub.id.toString()
                    )),
                    cat.subCategories.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-[10px] px-1.5 py-0 border-border font-normal",
                        children: [
                          "+",
                          cat.subCategories.length - 3
                        ]
                      }
                    )
                  ] })
                ] })
              ]
            },
            cat.id.toString()
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/products",
        search: { q: void 0, category: void 0 },
        className: "flex items-center justify-between mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 group hover:bg-primary/15 transition-smooth",
        "data-ocid": "browse-all-products",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm group-hover:text-primary transition-colors", children: "Browse All Products" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Explore our complete catalogue of Assamese products" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronRight,
            {
              size: 18,
              className: "text-primary group-hover:translate-x-0.5 transition-smooth"
            }
          )
        ]
      }
    )
  ] }) });
}
export {
  CategoriesPage as default
};
