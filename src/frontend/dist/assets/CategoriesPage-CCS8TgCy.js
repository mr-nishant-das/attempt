import { r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-DUDks8tZ.js";
import { L as Layout } from "./Layout-wDipB2fn.js";
import { B as Badge } from "./badge-JG62ASI1.js";
import { C as ChevronRight } from "./chevron-right-C5ZUEs1Y.js";
import "./createLucideIcon-Ccmnz96I.js";
import "./index-Dip9vu6-.js";
const CATEGORIES = [
  {
    id: 1n,
    name: "Tea",
    slug: "tea",
    description: "Premium Assam teas from valley gardens — CTC, Orthodox, Green & White",
    imageUrl: "",
    subCategories: ["CTC", "Orthodox", "Green", "White", "Flavoured"],
    productCount: 24,
    emoji: "🍵",
    color: "bg-accent/15 border-accent/30"
  },
  {
    id: 2n,
    name: "Spices",
    slug: "spices",
    description: "Authentic Assam spices, pickles, and condiments including the famous Bhut Jolokia",
    imageUrl: "",
    subCategories: ["Chilli", "Pickle", "Sauce", "Masala"],
    productCount: 18,
    emoji: "🌶️",
    color: "bg-destructive/10 border-destructive/20"
  },
  {
    id: 3n,
    name: "Handloom",
    slug: "handloom",
    description: "Handwoven Assamese textiles — Mekhela Chador, Gamosa, Muga silk, and Pat silk",
    imageUrl: "",
    subCategories: ["Mekhela", "Gamosa", "Muga", "Pat Silk"],
    productCount: 31,
    emoji: "🧵",
    color: "bg-secondary/15 border-secondary/30"
  },
  {
    id: 4n,
    name: "Crafts",
    slug: "crafts",
    description: "Bamboo, cane, and traditional crafts handmade by Assamese artisans",
    imageUrl: "",
    subCategories: ["Baskets", "Furniture", "Décor", "Toys"],
    productCount: 15,
    emoji: "🪣",
    color: "bg-primary/10 border-primary/20"
  },
  {
    id: 5n,
    name: "Food",
    slug: "food",
    description: "Regional Assamese foods — Joha rice, organic produce, dried fish, and more",
    imageUrl: "",
    subCategories: ["Rice", "Pickle", "Snacks", "Organic"],
    productCount: 22,
    emoji: "🍲",
    color: "bg-accent/15 border-accent/30"
  },
  {
    id: 6n,
    name: "Books",
    slug: "books",
    description: "Assamese literature, history, culture, and children's books",
    imageUrl: "",
    subCategories: ["Fiction", "History", "Poetry", "Children"],
    productCount: 12,
    emoji: "📚",
    color: "bg-muted border-border"
  },
  {
    id: 7n,
    name: "Attire",
    slug: "attire",
    description: "Traditional Assamese clothing — Dhoti, Riha, and festive wear",
    imageUrl: "",
    subCategories: ["Men", "Women", "Children", "Accessories"],
    productCount: 19,
    emoji: "👘",
    color: "bg-secondary/15 border-secondary/30"
  },
  {
    id: 8n,
    name: "Kitchen",
    slug: "kitchen",
    description: "Traditional kitchenware — Bell metal, clay pots, bamboo utensils",
    imageUrl: "",
    subCategories: ["Bell Metal", "Clay", "Bamboo", "Brass"],
    productCount: 11,
    emoji: "🍳",
    color: "bg-primary/10 border-primary/20"
  }
];
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
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "All Categories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        "Explore authentic Assamese products across ",
        CATEGORIES.length,
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
        children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/categories/$slug",
            params: { slug: cat.slug },
            "data-ocid": `category-card-${cat.slug}`,
            className: "group bg-card rounded-2xl border border-border overflow-hidden transition-smooth hover:shadow-md hover:border-primary/30 active:scale-[0.98]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `aspect-[4/3] flex flex-col items-center justify-center gap-2 ${cat.color} relative overflow-hidden`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-5xl sm:text-6xl",
                        role: "img",
                        "aria-label": cat.name,
                        children: cat.emoji
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-2 right-2 bg-card/80 backdrop-blur-sm text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-border", children: [
                      cat.productCount,
                      "+ items"
                    ] })
                  ]
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
                      children: sub
                    },
                    sub
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
        ))
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
