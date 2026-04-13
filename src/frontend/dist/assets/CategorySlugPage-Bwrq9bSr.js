import { b as useParams, r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-D4oc9L-H.js";
import { u as useCart, L as Layout, H as House } from "./Layout-CddzSLPN.js";
import { P as ProductCard } from "./ProductCard-QhdNM3Na.js";
import { B as Badge } from "./badge-BLfyvmpN.js";
import { C as ChevronRight } from "./chevron-right-8e_waPuw.js";
import "./createLucideIcon-DMAq5fnw.js";
import "./button-BheL6zVp.js";
import "./index-CT5_lWjy.js";
import "./types-Dmw7OeI0.js";
import "./star-9xHOeBLP.js";
const CATEGORY_MAP = {
  "assam-tea": {
    id: 1n,
    name: "Assam Tea",
    slug: "assam-tea",
    description: "Authentic teas from the world's finest gardens in the Brahmaputra valley. Includes CTC, Orthodox, Green, White, and rare single-estate teas.",
    imageUrl: "",
    subCategories: [
      "All",
      "CTC Tea",
      "Orthodox Tea",
      "Green Tea",
      "White Tea",
      "Flavoured Tea",
      "Premium Single Estate"
    ],
    emoji: "🍵",
    productCount: 24,
    bannerColor: "bg-accent/20"
  },
  "assamese-food": {
    id: 2n,
    name: "Assamese Food",
    slug: "assamese-food",
    description: "Traditional Assamese pantry staples — GI-tagged Joha rice, organic grains, pulses, pickles, and dried produce.",
    imageUrl: "",
    subCategories: [
      "All",
      "Dried Vegetables",
      "Grains & Rice",
      "Pulses & Lentils",
      "Pickles & Chutneys",
      "Oils & Ghee",
      "Sweets & Snacks"
    ],
    emoji: "🍚",
    productCount: 22,
    bannerColor: "bg-accent/15"
  },
  "spices-herbs": {
    id: 3n,
    name: "Spices & Herbs",
    slug: "spices-herbs",
    description: "Aromatic spices and culinary herbs sourced from the hills and plains of Assam, including the world-famous Bhut Jolokia.",
    imageUrl: "",
    subCategories: [
      "All",
      "Whole Spices",
      "Ground Spices",
      "Herb Blends",
      "Chilli Products",
      "Rare & Exotic Spices"
    ],
    emoji: "🌶️",
    productCount: 18,
    bannerColor: "bg-destructive/10"
  },
  "medicine-herbs": {
    id: 4n,
    name: "Medicine & Herbs",
    slug: "medicine-herbs",
    description: "Traditional Assamese medicinal herbs, herbal teas, and natural wellness products rooted in centuries of indigenous knowledge.",
    imageUrl: "",
    subCategories: [
      "All",
      "Medicinal Herbs",
      "Herbal Tea Blends",
      "Ayurvedic Products",
      "Traditional Remedies"
    ],
    emoji: "🌿",
    productCount: 10,
    bannerColor: "bg-primary/10"
  },
  "assamese-attire": {
    id: 5n,
    name: "Assamese Attire",
    slug: "assamese-attire",
    description: "Handwoven clothing from Assam's rich subcultures — Assamese, Boro, Mising, and Karbi traditions for all occasions.",
    imageUrl: "",
    subCategories: [
      "All",
      "Assamese Traditional",
      "Boro Attire",
      "Mising Attire",
      "Karbi Attire",
      "Festival Wear",
      "Kids Wear"
    ],
    emoji: "👘",
    productCount: 19,
    bannerColor: "bg-secondary/15"
  },
  "handloom-textiles": {
    id: 6n,
    name: "Handloom & Textiles",
    slug: "handloom-textiles",
    description: "Fine handwoven textiles from master weavers in Sualkuchi and Majuli — Muga silk, Eri silk, Mekhela Chador, and Gamosa.",
    imageUrl: "",
    subCategories: [
      "All",
      "Mekhela Chador",
      "Gamosa",
      "Muga Silk",
      "Eri Silk",
      "Stoles & Shawls",
      "Fabric Rolls"
    ],
    emoji: "🧵",
    productCount: 31,
    bannerColor: "bg-secondary/15"
  },
  handicrafts: {
    id: 7n,
    name: "Handicrafts",
    slug: "handicrafts",
    description: "Intricate Assamese craftsmanship — bamboo, cane, bell metal, pottery, and woodwork by skilled artisans.",
    imageUrl: "",
    subCategories: [
      "All",
      "Bamboo Crafts",
      "Cane Crafts",
      "Bell Metal Craft",
      "Pottery & Clay",
      "Wood Crafts",
      "Tribal Crafts"
    ],
    emoji: "🎋",
    productCount: 15,
    bannerColor: "bg-primary/10"
  },
  "art-paintings": {
    id: 8n,
    name: "Art & Paintings",
    slug: "art-paintings",
    description: "Authentic Assamese artwork — traditional Sattriya art, folk paintings, and contemporary Assamese expressions.",
    imageUrl: "",
    subCategories: [
      "All",
      "Traditional Art",
      "Sattriya Art",
      "Folk Paintings",
      "Modern Assamese Art",
      "Prints & Posters"
    ],
    emoji: "🎨",
    productCount: 9,
    bannerColor: "bg-muted"
  },
  "books-literature": {
    id: 9n,
    name: "Books & Literature",
    slug: "books-literature",
    description: "Assamese novels, poetry, history, and literature celebrating the heritage and culture of Assam.",
    imageUrl: "",
    subCategories: [
      "All",
      "Assamese Novels",
      "Poetry & Drama",
      "History & Culture",
      "Children Books",
      "Academic & Reference"
    ],
    emoji: "📚",
    productCount: 12,
    bannerColor: "bg-muted"
  },
  "chronicles-magazines": {
    id: 10n,
    name: "Chronicles & Magazines",
    slug: "chronicles-magazines",
    description: "Assamese periodicals, cultural magazines, and chronicles documenting the ever-evolving Assamese life and thought.",
    imageUrl: "",
    subCategories: [
      "All",
      "Monthly Magazines",
      "Cultural Chronicles",
      "Literary Journals",
      "Collector Editions"
    ],
    emoji: "📰",
    productCount: 8,
    bannerColor: "bg-muted"
  },
  "musical-instruments": {
    id: 11n,
    name: "Musical Instruments",
    slug: "musical-instruments",
    description: "Traditional Assamese musical instruments — dhol, dotara, pepa, tokari, and more, handcrafted by local artisans.",
    imageUrl: "",
    subCategories: [
      "All",
      "String Instruments",
      "Wind Instruments",
      "Percussion Instruments",
      "Traditional Sets",
      "Accessories"
    ],
    emoji: "🥁",
    productCount: 14,
    bannerColor: "bg-accent/15"
  },
  "religious-puja": {
    id: 12n,
    name: "Religious & Puja Items",
    slug: "religious-puja",
    description: "Sacred items for Assamese rituals — idols, diyas, incense, puja sets, and spiritual accessories for every occasion.",
    imageUrl: "",
    subCategories: [
      "All",
      "Idols & Figurines",
      "Diyas & Lamps",
      "Incense & Dhoop",
      "Puja Sets",
      "Prayer Accessories"
    ],
    emoji: "🪔",
    productCount: 16,
    bannerColor: "bg-accent/20"
  },
  "decorative-items": {
    id: 13n,
    name: "Decorative Items",
    slug: "decorative-items",
    description: "Beautiful Assamese decorative pieces — wall art, table decor, and traditional ornaments that bring Assam home.",
    imageUrl: "",
    subCategories: [
      "All",
      "Wall Decor",
      "Table Decor",
      "Traditional Ornaments",
      "Seasonal Decor",
      "Gifting Items"
    ],
    emoji: "🏺",
    productCount: 11,
    bannerColor: "bg-secondary/15"
  },
  "kitchen-cookware": {
    id: 14n,
    name: "Kitchen & Cookware",
    slug: "kitchen-cookware",
    description: "Traditional Assamese kitchen essentials — bell metal (kah) utensils, bamboo cookware, and clay vessels.",
    imageUrl: "",
    subCategories: [
      "All",
      "Bell Metal Utensils",
      "Bamboo Kitchenware",
      "Clay Pots & Vessels",
      "Traditional Cookware",
      "Kitchen Accessories"
    ],
    emoji: "🍳",
    productCount: 11,
    bannerColor: "bg-primary/10"
  },
  "living-room-decor": {
    id: 15n,
    name: "Living Room Decor",
    slug: "living-room-decor",
    description: "Assamese living room pieces — bamboo and cane furniture, traditional decor, and artisan crafts that tell a story.",
    imageUrl: "",
    subCategories: [
      "All",
      "Bamboo Furniture",
      "Cane Furniture",
      "Traditional Decor",
      "Cushion Covers & Textiles",
      "Statement Pieces"
    ],
    emoji: "🛋️",
    productCount: 9,
    bannerColor: "bg-secondary/15"
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
    subCategory: "CTC Tea",
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
    subCategory: "Green Tea",
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
    subCategory: "White Tea",
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
    subCategory: "Flavoured Tea",
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
    category: 6n,
    subCategory: "Mekhela Chador",
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
    category: 6n,
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
    category: 6n,
    subCategory: "Muga Silk",
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
    category: 7n,
    subCategory: "Bamboo Crafts",
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
    category: 2n,
    subCategory: "Grains & Rice",
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
    category: 3n,
    subCategory: "Chilli Products",
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
    category: 3n,
    subCategory: "Chilli Products",
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
    category: 9n,
    subCategory: "Assamese Novels",
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
    category: 14n,
    subCategory: "Clay Pots & Vessels",
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
    category: 14n,
    subCategory: "Bell Metal Utensils",
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
