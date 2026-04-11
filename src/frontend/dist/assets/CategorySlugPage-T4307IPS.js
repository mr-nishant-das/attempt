import { b as useParams, r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-DUDks8tZ.js";
import { u as useCart, L as Layout, H as House } from "./Layout-wDipB2fn.js";
import { P as ProductCard } from "./ProductCard-DGOH-9lE.js";
import { B as Badge } from "./badge-JG62ASI1.js";
import { C as ChevronRight } from "./chevron-right-C5ZUEs1Y.js";
import "./createLucideIcon-Ccmnz96I.js";
import "./button-qd45FsLj.js";
import "./index-Dip9vu6-.js";
import "./types-Dmw7OeI0.js";
import "./star-CE6VNDC6.js";
const CATEGORY_MAP = {
  tea: {
    id: 1n,
    name: "Tea",
    slug: "tea",
    description: "Premium Assam teas from the world's finest tea gardens in the Brahmaputra valley. Includes CTC, Orthodox, Green, and rare White teas.",
    imageUrl: "",
    subCategories: ["All", "CTC", "Orthodox", "Green", "White", "Flavoured"],
    emoji: "🍵",
    productCount: 24,
    bannerColor: "bg-accent/20"
  },
  spices: {
    id: 2n,
    name: "Spices",
    slug: "spices",
    description: "Authentic Assam spices and condiments including the world-famous Bhut Jolokia ghost chilli.",
    imageUrl: "",
    subCategories: ["All", "Chilli", "Pickle", "Sauce", "Masala"],
    emoji: "🌶️",
    productCount: 18,
    bannerColor: "bg-destructive/10"
  },
  handloom: {
    id: 3n,
    name: "Handloom",
    slug: "handloom",
    description: "Handwoven Assamese textiles from master weavers in Sualkuchi and Majuli island.",
    imageUrl: "",
    subCategories: ["All", "Mekhela", "Gamosa", "Muga", "Pat Silk"],
    emoji: "🧵",
    productCount: 31,
    bannerColor: "bg-secondary/15"
  },
  crafts: {
    id: 4n,
    name: "Crafts",
    slug: "crafts",
    description: "Bamboo, cane, and traditional crafts handmade by skilled Assamese artisans.",
    imageUrl: "",
    subCategories: ["All", "Baskets", "Furniture", "Décor", "Toys"],
    emoji: "🪣",
    productCount: 15,
    bannerColor: "bg-primary/10"
  },
  food: {
    id: 5n,
    name: "Food",
    slug: "food",
    description: "Regional Assamese foods — GI-tagged Joha rice, organic produce, dried fish, and traditional preserves.",
    imageUrl: "",
    subCategories: ["All", "Rice", "Pickle", "Snacks", "Organic"],
    emoji: "🍲",
    productCount: 22,
    bannerColor: "bg-accent/15"
  },
  books: {
    id: 6n,
    name: "Books",
    slug: "books",
    description: "Assamese literature, cultural history, poetry, and children's books.",
    imageUrl: "",
    subCategories: ["All", "Fiction", "History", "Poetry", "Children"],
    emoji: "📚",
    productCount: 12,
    bannerColor: "bg-muted"
  },
  attire: {
    id: 7n,
    name: "Attire",
    slug: "attire",
    description: "Traditional Assamese clothing — Dhoti, Riha, and festive wear for all occasions.",
    imageUrl: "",
    subCategories: ["All", "Men", "Women", "Children", "Accessories"],
    emoji: "👘",
    productCount: 19,
    bannerColor: "bg-secondary/15"
  },
  kitchen: {
    id: 8n,
    name: "Kitchen",
    slug: "kitchen",
    description: "Traditional Assamese kitchenware — Bell metal (kah), clay pots, and bamboo utensils.",
    imageUrl: "",
    subCategories: ["All", "Bell Metal", "Clay", "Bamboo", "Brass"],
    emoji: "🍳",
    productCount: 11,
    bannerColor: "bg-primary/10"
  }
};
const ALL_PRODUCTS = [
  {
    id: 1n,
    title: "Heritage CTC Assam Tea — 500g",
    description: "Bold malty CTC tea.",
    price: 49900n,
    discountPercent: 10n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 1n,
    subCategory: "CTC",
    rating: 42n,
    reviewCount: 1280n,
    stock: 50n,
    brand: "Heritage Tea Co.",
    tags: ["tea", "ctc"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 7n,
    title: "Orthodox Green Tea Tin — 100g",
    description: "Premium green tea from Darrang.",
    price: 38000n,
    discountPercent: 12n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 1n,
    subCategory: "Green",
    rating: 45n,
    reviewCount: 234n,
    stock: 35n,
    brand: "Darrang Gardens",
    tags: ["tea", "green"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 13n,
    title: "Assam White Tea — 50g",
    description: "Rare white tea from Dibrugarh.",
    price: 68000n,
    discountPercent: 0n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 1n,
    subCategory: "White",
    rating: 48n,
    reviewCount: 56n,
    stock: 20n,
    brand: "Dibrugarh Gardens",
    tags: ["tea", "white"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 14n,
    title: "Masala Chai Blend — 250g",
    description: "Spiced Assam tea blend with cardamom and ginger.",
    price: 32000n,
    discountPercent: 5n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 1n,
    subCategory: "Flavoured",
    rating: 46n,
    reviewCount: 412n,
    stock: 80n,
    brand: "Heritage Tea Co.",
    tags: ["tea", "masala"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 2n,
    title: "Handwoven Mekhela Chador — Silk Saree",
    description: "Traditional Assamese silk saree.",
    price: 325000n,
    discountPercent: 5n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 3n,
    subCategory: "Mekhela",
    rating: 47n,
    reviewCount: 312n,
    stock: 8n,
    brand: "Majuli Weavers",
    tags: ["handloom", "silk"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 8n,
    title: "Gamosa — Traditional Cotton Towel",
    description: "The iconic red-bordered cotton gamosa.",
    price: 12000n,
    discountPercent: 0n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 3n,
    subCategory: "Gamosa",
    rating: 49n,
    reviewCount: 1500n,
    stock: 100n,
    brand: "Sualkuchi Textiles",
    tags: ["gamosa", "cotton"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 9n,
    title: "Assam Silk Muga Stole",
    description: "Golden muga silk stole.",
    price: 185000n,
    discountPercent: 8n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 3n,
    subCategory: "Muga",
    rating: 46n,
    reviewCount: 178n,
    stock: 15n,
    brand: "Sualkuchi Weavers",
    tags: ["silk", "muga"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 3n,
    title: "Bamboo Cane Basket Set — 3 Pieces",
    description: "Handcrafted storage baskets.",
    price: 49900n,
    discountPercent: 0n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 4n,
    subCategory: "Baskets",
    rating: 44n,
    reviewCount: 89n,
    stock: 23n,
    brand: "Bongaigaon Crafts",
    tags: ["bamboo"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 4n,
    title: "Joha Scented Rice — 1kg",
    description: "Aromatic short-grain rice.",
    price: 18000n,
    discountPercent: 8n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 5n,
    subCategory: "Rice",
    rating: 48n,
    reviewCount: 560n,
    stock: 200n,
    brand: "Kamrup Organics",
    tags: ["rice"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 6n,
    title: "Assam Bhut Jolokia Pickle — 250g",
    description: "Fiery ghost chilli pickle.",
    price: 22000n,
    discountPercent: 0n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 2n,
    subCategory: "Pickle",
    rating: 46n,
    reviewCount: 720n,
    stock: 75n,
    brand: "Tezpur Spice House",
    tags: ["pickle"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 10n,
    title: "Bhut Jolokia Hot Sauce — 100ml",
    description: "Ghost pepper hot sauce.",
    price: 29900n,
    discountPercent: 5n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 2n,
    subCategory: "Sauce",
    rating: 44n,
    reviewCount: 320n,
    stock: 60n,
    brand: "Tezpur Spice House",
    tags: ["spicy", "sauce"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 11n,
    title: "Assamese Literature Collection — 5 Books",
    description: "Curated classic Assamese novels.",
    price: 75000n,
    discountPercent: 10n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 6n,
    subCategory: "Fiction",
    rating: 47n,
    reviewCount: 95n,
    stock: 40n,
    brand: "Purvoday Press",
    tags: ["books"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 5n,
    title: "Clay Pot Utensil Set",
    description: "Traditional earthenware for cooking.",
    price: 89900n,
    discountPercent: 15n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 8n,
    subCategory: "Clay",
    rating: 43n,
    reviewCount: 42n,
    stock: 12n,
    brand: "Hajo Pottery",
    tags: ["clay"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  },
  {
    id: 12n,
    title: "Brass Bell Metal Utensil Set",
    description: "Traditional kah (bell metal) utensils.",
    price: 219000n,
    discountPercent: 0n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 8n,
    subCategory: "Bell Metal",
    rating: 48n,
    reviewCount: 63n,
    stock: 9n,
    brand: "Sarthebari Crafts",
    tags: ["kitchen", "brass"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n
  }
];
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
function CategorySlugPage() {
  const { slug } = useParams({ from: "/categories/$slug" });
  const { addItem, isInCart, getQuantity } = useCart();
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("All");
  const category = CATEGORY_MAP[slug];
  const allCategoryProducts = category ? ALL_PRODUCTS.filter((p) => p.category === category.id) : [];
  const filteredProducts = activeTab === "All" ? allCategoryProducts : allCategoryProducts.filter((p) => p.subCategory === activeTab);
  reactExports.useEffect(() => {
    setIsLoading(true);
    setActiveTab("All");
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, [slug]);
  if (!category) {
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `${category.bannerColor} px-4 py-5 border-b border-border`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "nav",
            {
              className: "flex items-center gap-1 text-xs text-muted-foreground mb-3",
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", role: "img", "aria-label": category.name, children: category.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: category.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: category.description })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              category.productCount,
              "+ products"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs border-border", children: "Authentic & Handpicked" })
          ] })
        ]
      }
    ),
    category.subCategories.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-[64px] z-20 bg-background border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 overflow-x-auto scrollbar-none px-4 py-2", children: category.subCategories.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setActiveTab(sub),
        className: `flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-smooth whitespace-nowrap border ${activeTab === sub ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/40"}`,
        "data-ocid": `subcategory-tab-${sub.toLowerCase().replace(/\s+/g, "-")}`,
        children: sub
      },
      sub
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 pb-24", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsSkeleton, {}) : filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16", "data-ocid": "subcategory-empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-5xl mb-4", children: "📦" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: "Coming Soon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1 mb-4", children: [
        "Products in ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: activeTab }),
        " are being curated and will be available soon."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("All"),
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
        activeTab !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " ",
          "in",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: activeTab })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: filteredProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductCard,
        {
          product: p,
          onAddToCart: addItem,
          inCart: isInCart(p.id),
          cartQty: getQuantity(p.id)
        },
        p.id.toString()
      )) })
    ] }) })
  ] });
}
export {
  CategorySlugPage as default
};
