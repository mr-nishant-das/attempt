import { a as useParams, r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-BbgXscAi.js";
import { a as useCart, b as useCategoryBySlug, c as useProductsByCategory, L as Layout, H as House } from "./Layout-D5VIdwoN.js";
import { P as ProductCard } from "./ProductCard-DtnkZxjG.js";
import { B as Badge } from "./badge-C-QwoaHS.js";
import { C as ChevronRight } from "./chevron-right-Duqqd7JQ.js";
import "./createLucideIcon-B6ccG8eC.js";
import "./useActor-AG09Vf65.js";
import "./button-BlVWhxCp.js";
import "./index-_KOCx7qY.js";
import "./types-Dmw7OeI0.js";
import "./star-BDDH8dDi.js";
const CATEGORY_EMOJI = {
  "assam-tea": "🍵",
  "spices-herbs": "🌶️",
  "handloom-textiles": "🧵",
  handicrafts: "🎋",
  "assamese-food": "🍚",
  "books-literature": "📚",
  "assamese-attire": "👘",
  "kitchen-cookware": "🍳",
  "medicine-herbs": "🌿",
  "chronicles-magazines": "📰",
  "musical-instruments": "🥁",
  "religious-puja": "🪔",
  "decorative-items": "🏺",
  "art-paintings": "🎨",
  "living-room-decor": "🛋️"
};
const BANNER_COLORS = {
  "assam-tea": "bg-accent/20",
  "assamese-food": "bg-secondary/10",
  "spices-herbs": "bg-destructive/10",
  "handloom-textiles": "bg-primary/10",
  handicrafts: "bg-muted/40",
  "assamese-attire": "bg-secondary/10",
  "books-literature": "bg-primary/10",
  "kitchen-cookware": "bg-accent/20",
  "medicine-herbs": "bg-secondary/10",
  "chronicles-magazines": "bg-muted/40",
  "musical-instruments": "bg-primary/10",
  "religious-puja": "bg-accent/20",
  "decorative-items": "bg-secondary/10",
  "art-paintings": "bg-primary/10",
  "living-room-decor": "bg-muted/40"
};
function ProductsSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card rounded-lg border border-border overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-1/2" })
        ] })
      ]
    },
    `skel-${k}`
  )) });
}
function BannerSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border-b border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" })
    ] })
  ] });
}
function CategorySlugPage() {
  const { slug } = useParams({ from: "/categories/$slug" });
  const { addItem, isInCart, getQuantity } = useCart();
  const [activeSubTab, setActiveSubTab] = reactExports.useState("All");
  const {
    data: category,
    isLoading: catLoading,
    isError: catError
  } = useCategoryBySlug(slug);
  const { data: allProducts, isLoading: prodsLoading } = useProductsByCategory(
    category == null ? void 0 : category.id,
    { limit: 200 }
  );
  reactExports.useEffect(() => {
    setActiveSubTab("All");
  }, [slug]);
  const subCategoryTabs = reactExports.useMemo(() => {
    if (!category) return ["All"];
    return ["All", ...category.subCategories.map((s) => s.name)];
  }, [category]);
  const filteredProducts = reactExports.useMemo(() => {
    if (!allProducts) return [];
    if (activeSubTab === "All") return allProducts;
    return allProducts.filter((p) => p.subCategory === activeSubTab);
  }, [allProducts, activeSubTab]);
  const subCatCounts = reactExports.useMemo(() => {
    const counts = { All: (allProducts == null ? void 0 : allProducts.length) ?? 0 };
    if (category) {
      for (const sub of category.subCategories) {
        counts[sub.name] = (allProducts ?? []).filter(
          (p) => p.subCategory === sub.name
        ).length;
      }
    }
    return counts;
  }, [allProducts, category]);
  const emoji = CATEGORY_EMOJI[slug] ?? "🛍️";
  const bannerColor = BANNER_COLORS[slug] ?? "bg-muted/30";
  if (catLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BannerSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsSkeleton, {}) })
    ] });
  }
  if (catError || !category) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 px-6", "data-ocid": "category-not-found", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-5xl mb-4", children: "🔍" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg", children: "Category not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 mb-4", children: "This category doesn't exist or may have been removed." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/categories",
          className: "text-primary text-sm hover:underline font-semibold",
          children: "View all categories"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${bannerColor} border-b border-border`, children: [
      category.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-32 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: category.imageUrl,
            alt: category.name,
            className: "w-full h-full object-cover",
            loading: "eager"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-end px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-3xl",
              role: "img",
              "aria-label": category.name,
              children: emoji
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-black text-card leading-tight", children: category.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[10px] bg-primary/80 text-primary-foreground border-0 px-2 py-0.5", children: [
                (allProducts == null ? void 0 : allProducts.length) ?? 0,
                "+ products"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] border-card/50 text-card/90",
                  children: "Authentic & Handpicked"
                }
              )
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "nav",
          {
            className: "flex items-center gap-1 text-xs text-muted-foreground mb-2",
            "aria-label": "Breadcrumb",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/home",
                  className: "flex items-center gap-1 hover:text-primary transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 11 }),
                    " Home"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 11 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/categories",
                  className: "hover:text-primary transition-colors",
                  children: "Categories"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 11 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: category.name })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: category.description })
      ] })
    ] }),
    subCategoryTabs.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-[64px] z-20 bg-background border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 overflow-x-auto scrollbar-none px-4 py-2.5", children: subCategoryTabs.map((sub) => {
      const count = subCatCounts[sub] ?? 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveSubTab(sub),
          className: `flex-none flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-smooth whitespace-nowrap border ${activeSubTab === sub ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/40"}`,
          "data-ocid": `subcategory-tab-${sub.toLowerCase().replace(/\s+/g, "-")}`,
          children: [
            sub,
            count > 0 && sub !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeSubTab === sub ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`,
                children: count
              }
            )
          ]
        },
        sub
      );
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 pb-24", children: prodsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsSkeleton, {}) : filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", "data-ocid": "subcategory-empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-5xl mb-4", children: "📦" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: "Coming Soon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1 mb-4", children: [
        "Products in ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: activeSubTab }),
        " are being curated and will be available soon."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveSubTab("All"),
          className: "text-primary text-sm font-semibold hover:underline",
          children: [
            "View all ",
            category.name,
            " products"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
        "Showing",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: filteredProducts.length }),
        " ",
        "products",
        activeSubTab !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " ",
          "in",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: activeSubTab })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: filteredProducts.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductCard,
        {
          product: p,
          onAddToCart: addItem,
          inCart: isInCart(p.id),
          cartQty: getQuantity(p.id),
          "data-ocid": `product.item.${i + 1}`
        },
        p.id.toString()
      )) })
    ] }) })
  ] });
}
export {
  CategorySlugPage as default
};
