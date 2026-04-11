import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import type { Category, Product } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Category master data ────────────────────────────────────────────────────
const CATEGORY_MAP: Record<
  string,
  Category & { emoji: string; productCount: number; bannerColor: string }
> = {
  tea: {
    id: 1n,
    name: "Tea",
    slug: "tea",
    description:
      "Premium Assam teas from the world's finest tea gardens in the Brahmaputra valley. Includes CTC, Orthodox, Green, and rare White teas.",
    imageUrl: "",
    subCategories: ["All", "CTC", "Orthodox", "Green", "White", "Flavoured"],
    emoji: "🍵",
    productCount: 24,
    bannerColor: "bg-accent/20",
  },
  spices: {
    id: 2n,
    name: "Spices",
    slug: "spices",
    description:
      "Authentic Assam spices and condiments including the world-famous Bhut Jolokia ghost chilli.",
    imageUrl: "",
    subCategories: ["All", "Chilli", "Pickle", "Sauce", "Masala"],
    emoji: "🌶️",
    productCount: 18,
    bannerColor: "bg-destructive/10",
  },
  handloom: {
    id: 3n,
    name: "Handloom",
    slug: "handloom",
    description:
      "Handwoven Assamese textiles from master weavers in Sualkuchi and Majuli island.",
    imageUrl: "",
    subCategories: ["All", "Mekhela", "Gamosa", "Muga", "Pat Silk"],
    emoji: "🧵",
    productCount: 31,
    bannerColor: "bg-secondary/15",
  },
  crafts: {
    id: 4n,
    name: "Crafts",
    slug: "crafts",
    description:
      "Bamboo, cane, and traditional crafts handmade by skilled Assamese artisans.",
    imageUrl: "",
    subCategories: ["All", "Baskets", "Furniture", "Décor", "Toys"],
    emoji: "🪣",
    productCount: 15,
    bannerColor: "bg-primary/10",
  },
  food: {
    id: 5n,
    name: "Food",
    slug: "food",
    description:
      "Regional Assamese foods — GI-tagged Joha rice, organic produce, dried fish, and traditional preserves.",
    imageUrl: "",
    subCategories: ["All", "Rice", "Pickle", "Snacks", "Organic"],
    emoji: "🍲",
    productCount: 22,
    bannerColor: "bg-accent/15",
  },
  books: {
    id: 6n,
    name: "Books",
    slug: "books",
    description:
      "Assamese literature, cultural history, poetry, and children's books.",
    imageUrl: "",
    subCategories: ["All", "Fiction", "History", "Poetry", "Children"],
    emoji: "📚",
    productCount: 12,
    bannerColor: "bg-muted",
  },
  attire: {
    id: 7n,
    name: "Attire",
    slug: "attire",
    description:
      "Traditional Assamese clothing — Dhoti, Riha, and festive wear for all occasions.",
    imageUrl: "",
    subCategories: ["All", "Men", "Women", "Children", "Accessories"],
    emoji: "👘",
    productCount: 19,
    bannerColor: "bg-secondary/15",
  },
  kitchen: {
    id: 8n,
    name: "Kitchen",
    slug: "kitchen",
    description:
      "Traditional Assamese kitchenware — Bell metal (kah), clay pots, and bamboo utensils.",
    imageUrl: "",
    subCategories: ["All", "Bell Metal", "Clay", "Bamboo", "Brass"],
    emoji: "🍳",
    productCount: 11,
    bannerColor: "bg-primary/10",
  },
};

// ─── Products dataset ────────────────────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
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
    updatedAt: 0n,
  },
];

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {["a", "b", "c", "d", "e", "f"].map((k) => (
        <div
          key={`skel-${k}`}
          className="bg-card rounded-lg border border-border overflow-hidden"
        >
          <Skeleton className="aspect-square w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CategorySlugPage() {
  const { slug } = useParams({ from: "/categories/$slug" });
  const { addItem, isInCart, getQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const category = CATEGORY_MAP[slug];
  const allCategoryProducts = category
    ? ALL_PRODUCTS.filter((p) => p.category === category.id)
    : [];

  const filteredProducts =
    activeTab === "All"
      ? allCategoryProducts
      : allCategoryProducts.filter((p) => p.subCategory === activeTab);

  // biome-ignore lint/correctness/useExhaustiveDependencies: slug is a route param, intentional reset trigger
  useEffect(() => {
    setIsLoading(true);
    setActiveTab("All");
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, [slug]);

  if (!category) {
    return (
      <Layout>
        <div className="text-center py-16 px-6" data-ocid="category-not-found">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-display font-bold text-foreground text-lg">
            Category not found
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            This category doesn&apos;t exist or may have been removed.
          </p>
          <Link
            to="/categories"
            className="text-primary text-sm hover:underline font-semibold"
          >
            View all categories
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Banner */}
      <div
        className={`${category.bannerColor} px-4 py-5 border-b border-border`}
      >
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1 text-xs text-muted-foreground mb-3"
          aria-label="Breadcrumb"
        >
          <Link
            to="/home"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home size={11} /> Home
          </Link>
          <ChevronRight size={11} />
          <Link
            to="/categories"
            className="hover:text-primary transition-colors"
          >
            Categories
          </Link>
          <ChevronRight size={11} />
          <span className="text-foreground font-medium">{category.name}</span>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-4xl" role="img" aria-label={category.name}>
            {category.emoji}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold text-foreground">
              {category.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {category.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {category.productCount}+ products
          </Badge>
          <Badge variant="outline" className="text-xs border-border">
            Authentic &amp; Handpicked
          </Badge>
        </div>
      </div>

      {/* Subcategory tabs */}
      {category.subCategories.length > 1 && (
        <div className="sticky top-[64px] z-20 bg-background border-b border-border">
          <div className="flex gap-1 overflow-x-auto scrollbar-none px-4 py-2">
            {category.subCategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setActiveTab(sub)}
                className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-smooth whitespace-nowrap border ${
                  activeTab === sub
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40"
                }`}
                data-ocid={`subcategory-tab-${sub.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="px-4 py-4 pb-24">
        {isLoading ? (
          <ProductsSkeleton />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16" data-ocid="subcategory-empty">
            <p className="text-5xl mb-4">📦</p>
            <p className="font-display font-bold text-foreground">
              Coming Soon
            </p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Products in <strong>{activeTab}</strong> are being curated and
              will be available soon.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("All")}
              className="text-primary text-sm font-semibold hover:underline"
            >
              View all {category.name} products
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-3">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredProducts.length}
              </span>{" "}
              products
              {activeTab !== "All" && (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-foreground">
                    {activeTab}
                  </span>
                </>
              )}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id.toString()}
                  product={p}
                  onAddToCart={addItem}
                  inCart={isInCart(p.id)}
                  cartQty={getQuantity(p.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
