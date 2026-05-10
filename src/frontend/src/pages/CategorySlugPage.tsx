import type { Product } from "@/backend";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { useCategoryBySlug, useProductsByCategory } from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ─── Category emoji mapping (local, no catalog dependency) ───────────────────
const CATEGORY_EMOJI: Record<string, string> = {
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
  "living-room-decor": "🛋️",
};

const BANNER_COLORS: Record<string, string> = {
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
  "living-room-decor": "bg-muted/40",
};

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

function BannerSkeleton() {
  return (
    <div className="bg-muted/30 border-b border-border">
      <Skeleton className="h-32 w-full" />
      <div className="px-4 py-3 space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export default function CategorySlugPage() {
  const { slug } = useParams({ from: "/categories/$slug" });
  const { addItem, isInCart, getQuantity } = useCart();
  const [activeSubTab, setActiveSubTab] = useState<string>("All");

  const {
    data: category,
    isLoading: catLoading,
    isError: catError,
  } = useCategoryBySlug(slug);

  const { data: allProducts, isLoading: prodsLoading } = useProductsByCategory(
    category?.id,
    { limit: 200 },
  );

  // Reset active tab when slug changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on slug change
  useEffect(() => {
    setActiveSubTab("All");
  }, [slug]);

  // Build tab list from backend subcategories
  const subCategoryTabs = useMemo(() => {
    if (!category) return ["All"];
    return ["All", ...category.subCategories.map((s) => s.name)];
  }, [category]);

  // Filter products by active sub-tab
  const filteredProducts = useMemo<Product[]>(() => {
    if (!allProducts) return [];
    if (activeSubTab === "All") return allProducts;
    return allProducts.filter((p) => p.subCategory === activeSubTab);
  }, [allProducts, activeSubTab]);

  // Count products per sub-tab
  const subCatCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allProducts?.length ?? 0 };
    if (category) {
      for (const sub of category.subCategories) {
        counts[sub.name] = (allProducts ?? []).filter(
          (p) => p.subCategory === sub.name,
        ).length;
      }
    }
    return counts;
  }, [allProducts, category]);

  const emoji = CATEGORY_EMOJI[slug] ?? "🛍️";
  const bannerColor = BANNER_COLORS[slug] ?? "bg-muted/30";

  if (catLoading) {
    return (
      <Layout>
        <BannerSkeleton />
        <div className="px-4 py-4">
          <ProductsSkeleton />
        </div>
      </Layout>
    );
  }

  if (catError || !category) {
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
      <div className={`${bannerColor} border-b border-border`}>
        {/* Hero image strip */}
        {category.imageUrl && (
          <div className="relative h-32 overflow-hidden">
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
            <div className="absolute inset-0 flex items-end px-4 pb-3">
              <div className="flex items-center gap-3">
                <span
                  className="text-3xl"
                  role="img"
                  aria-label={category.name}
                >
                  {emoji}
                </span>
                <div>
                  <h1 className="font-display text-xl font-black text-card leading-tight">
                    {category.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="text-[10px] bg-primary/80 text-primary-foreground border-0 px-2 py-0.5">
                      {allProducts?.length ?? 0}+ products
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] border-card/50 text-card/90"
                    >
                      Authentic &amp; Handpicked
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb + description */}
        <div className="px-4 py-3">
          <nav
            className="flex items-center gap-1 text-xs text-muted-foreground mb-2"
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
          <p className="text-xs text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        </div>
      </div>

      {/* Subcategory tabs */}
      {subCategoryTabs.length > 1 && (
        <div className="sticky top-[64px] z-20 bg-background border-b border-border">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none px-4 py-2.5">
            {subCategoryTabs.map((sub) => {
              const count = subCatCounts[sub] ?? 0;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setActiveSubTab(sub)}
                  className={`flex-none flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-smooth whitespace-nowrap border ${
                    activeSubTab === sub
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/40"
                  }`}
                  data-ocid={`subcategory-tab-${sub.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {sub}
                  {count > 0 && sub !== "All" && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeSubTab === sub ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="px-4 py-4 pb-24">
        {prodsLoading ? (
          <ProductsSkeleton />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16" data-ocid="subcategory-empty">
            <p className="text-5xl mb-4">📦</p>
            <p className="font-display font-bold text-foreground">
              Coming Soon
            </p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Products in <strong>{activeSubTab}</strong> are being curated and
              will be available soon.
            </p>
            <button
              type="button"
              onClick={() => setActiveSubTab("All")}
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
              {activeSubTab !== "All" && (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-foreground">
                    {activeSubTab}
                  </span>
                </>
              )}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filteredProducts.map((p, i) => (
                <ProductCard
                  key={p.id.toString()}
                  product={p}
                  onAddToCart={addItem}
                  inCart={isInCart(p.id)}
                  cartQty={getQuantity(p.id)}
                  data-ocid={`product.item.${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
