import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";
import { useSearch } from "@tanstack/react-router";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

// ─── Seed products ──────────────────────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
  {
    id: 1n,
    title: "Heritage CTC Assam Tea — 500g",
    description: "Bold malty CTC tea from Brahmaputra valley gardens.",
    price: 49900n,
    discountPercent: 10n,
    imageUrls: ["/assets/generated/product-ctc-tea.dim_400x400.jpg"],
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
    id: 2n,
    title: "Handwoven Mekhela Chador — Silk Saree",
    description: "Traditional Assamese silk saree.",
    price: 325000n,
    discountPercent: 5n,
    imageUrls: ["/assets/generated/product-mekhela-chador.dim_400x400.jpg"],
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
    id: 3n,
    title: "Bamboo Cane Basket Set — 3 Pieces",
    description: "Handcrafted storage baskets.",
    price: 49900n,
    discountPercent: 0n,
    imageUrls: ["/assets/generated/product-bamboo-basket.dim_400x400.jpg"],
    category: 4n,
    subCategory: "Baskets",
    rating: 44n,
    reviewCount: 89n,
    stock: 23n,
    brand: "Bongaigaon Crafts",
    tags: ["bamboo", "craft"],
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
    imageUrls: ["/assets/generated/product-joha-rice.dim_400x400.jpg"],
    category: 5n,
    subCategory: "Rice",
    rating: 48n,
    reviewCount: 560n,
    stock: 200n,
    brand: "Kamrup Organics",
    tags: ["rice", "organic"],
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
    imageUrls: ["/assets/generated/product-clay-pot.dim_400x400.jpg"],
    category: 8n,
    subCategory: "Clay",
    rating: 43n,
    reviewCount: 42n,
    stock: 12n,
    brand: "Hajo Pottery",
    tags: ["clay", "kitchen"],
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
    imageUrls: [
      "/assets/generated/product-bhut-jolokia-pickle.dim_400x400.jpg",
    ],
    category: 2n,
    subCategory: "Pickle",
    rating: 46n,
    reviewCount: 720n,
    stock: 75n,
    brand: "Tezpur Spice House",
    tags: ["pickle", "spicy"],
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
    imageUrls: ["/assets/generated/product-green-tea.dim_400x400.jpg"],
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
    id: 8n,
    title: "Gamosa — Traditional Cotton Towel",
    description: "The iconic red-bordered cotton gamosa.",
    price: 12000n,
    discountPercent: 0n,
    imageUrls: ["/assets/generated/product-gamosa.dim_400x400.jpg"],
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
    description: "Golden muga silk stole, handwoven.",
    price: 185000n,
    discountPercent: 8n,
    imageUrls: ["/assets/generated/product-mekhela-chador.dim_400x400.jpg"],
    category: 3n,
    subCategory: "Muga",
    rating: 46n,
    reviewCount: 178n,
    stock: 15n,
    brand: "Sualkuchi Weavers",
    tags: ["silk", "muga", "stole"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 10n,
    title: "Bhut Jolokia Hot Sauce — 100ml",
    description: "Ghost pepper hot sauce, made in Assam.",
    price: 29900n,
    discountPercent: 5n,
    imageUrls: [
      "/assets/generated/product-bhut-jolokia-pickle.dim_400x400.jpg",
    ],
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
    description: "Curated set of classic Assamese novels.",
    price: 75000n,
    discountPercent: 10n,
    imageUrls: ["/assets/generated/cat-books.dim_200x200.jpg"],
    category: 6n,
    subCategory: "Fiction",
    rating: 47n,
    reviewCount: 95n,
    stock: 40n,
    brand: "Purvoday Press",
    tags: ["books", "literature"],
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
    imageUrls: ["/assets/generated/cat-kitchen.dim_200x200.jpg"],
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

const CATEGORY_NAMES: Record<number, string> = {
  1: "Tea",
  2: "Spices",
  3: "Handloom",
  4: "Crafts",
  5: "Food",
  6: "Books",
  7: "Attire",
  8: "Kitchen",
};

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

const MIN_PRICE_OPTIONS = [0, 10000, 25000, 50000, 100000];
const MAX_PRICE_OPTIONS = [50000, 100000, 250000, 500000, 99999999];

interface ActiveFilter {
  key: string;
  label: string;
}

function ProductSkeletons() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 px-4 pb-4">
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
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const search = useSearch({ from: "/products" });
  const searchQuery = (search as { q?: string; category?: string }).q ?? "";
  const initCategory = (search as { q?: string; category?: string }).category;
  const { addItem, isInCart, getQuantity } = useCart();
  const [sort, setSort] = useState("relevance");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initCategory ? [Number.parseInt(initCategory)] : [],
  );
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999999);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isLoading] = useState(false);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  let filtered = ALL_PRODUCTS;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)),
    );
  }
  if (selectedCategories.length > 0) {
    filtered = filtered.filter((p) =>
      selectedCategories.includes(Number(p.category)),
    );
  }
  if (minPrice > 0)
    filtered = filtered.filter((p) => Number(p.price) >= minPrice);
  if (maxPrice < 99999999)
    filtered = filtered.filter((p) => Number(p.price) <= maxPrice);
  if (minRating > 0)
    filtered = filtered.filter((p) => Number(p.rating) / 10 >= minRating);
  if (inStockOnly) filtered = filtered.filter((p) => p.stock > 0n);

  if (sort === "price_asc")
    filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  else if (sort === "price_desc")
    filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
  else if (sort === "rating")
    filtered = [...filtered].sort(
      (a, b) => Number(b.rating) - Number(a.rating),
    );

  // Build active filter tags
  const activeFilters: ActiveFilter[] = [];
  for (const id of selectedCategories) {
    activeFilters.push({
      key: `cat-${id}`,
      label: CATEGORY_NAMES[id] ?? "Category",
    });
  }
  if (minPrice > 0)
    activeFilters.push({
      key: "minprice",
      label: `Min ₹${(minPrice / 100).toLocaleString("en-IN")}`,
    });
  if (maxPrice < 99999999)
    activeFilters.push({
      key: "maxprice",
      label: `Max ₹${(maxPrice / 100).toLocaleString("en-IN")}`,
    });
  if (minRating > 0)
    activeFilters.push({ key: "rating", label: `${minRating}★+` });
  if (inStockOnly) activeFilters.push({ key: "instock", label: "In Stock" });

  const removeFilter = (key: string) => {
    if (key.startsWith("cat-"))
      setSelectedCategories((prev) => prev.filter((id) => `cat-${id}` !== key));
    else if (key === "minprice") setMinPrice(0);
    else if (key === "maxprice") setMaxPrice(99999999);
    else if (key === "rating") setMinRating(0);
    else if (key === "instock") setInStockOnly(false);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(99999999);
    setMinRating(0);
    setInStockOnly(false);
  };

  return (
    <Layout hideSearch>
      {/* Sticky search */}
      <div className="px-4 pt-3 pb-2 bg-background">
        <SearchBar initialFocus={!searchQuery} />
      </div>

      {/* Sort bar */}
      <div className="sticky top-[72px] z-30 bg-background border-b border-border px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth border ${
            showFilterPanel || activeFilters.length > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border text-muted-foreground hover:border-primary/40"
          }`}
          data-ocid="toggle-filters"
        >
          <SlidersHorizontal size={12} />
          Filters
          {activeFilters.length > 0 && (
            <span className="bg-primary-foreground text-primary rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
              {activeFilters.length}
            </span>
          )}
        </button>
        <div className="w-px h-5 bg-border flex-none" />
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSort(opt.value)}
            className={`flex-none px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth border ${
              sort === opt.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/40"
            }`}
            data-ocid={`sort-${opt.value}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* ── Filter Panel (desktop sidebar / mobile panel) ── */}
        {showFilterPanel && (
          <aside className="lg:w-60 lg:flex-none bg-card border-b lg:border-b-0 lg:border-r border-border px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
                <Filter size={14} /> Filters
              </h2>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-destructive font-medium hover:underline"
                  data-ocid="clear-all-filters"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-5">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Category
              </p>
              <div className="space-y-2">
                {Object.entries(CATEGORY_NAMES).map(([idStr, name]) => {
                  const id = Number.parseInt(idStr);
                  return (
                    <label
                      key={id}
                      className="flex items-center gap-2 cursor-pointer group"
                      data-ocid={`filter-cat-${idStr}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(id)}
                        onChange={() => toggleCategory(id)}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                        {name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-5">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Price Range
              </p>
              <div className="space-y-2">
                {[
                  { label: "Under ₹500", min: 0, max: 50000 },
                  { label: "₹500 – ₹1,000", min: 50000, max: 100000 },
                  { label: "₹1,000 – ₹2,500", min: 100000, max: 250000 },
                  { label: "₹2,500 – ₹5,000", min: 250000, max: 500000 },
                  { label: "Above ₹5,000", min: 500000, max: 99999999 },
                ].map((range) => (
                  <label
                    key={range.label}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="price-range"
                      checked={minPrice === range.min && maxPrice === range.max}
                      onChange={() => {
                        setMinPrice(range.min);
                        setMaxPrice(range.max);
                      }}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {range.label}
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="price-range"
                    checked={minPrice === 0 && maxPrice === 99999999}
                    onChange={() => {
                      setMinPrice(0);
                      setMaxPrice(99999999);
                    }}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    All Prices
                  </span>
                </label>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-5">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Min Rating
              </p>
              <div className="space-y-2">
                {[4, 3, 2].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="min-rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(r)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground flex items-center gap-1">
                      {"★".repeat(r)}
                      <span className="text-muted-foreground">& above</span>
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="min-rating"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground">Any Rating</span>
                </label>
              </div>
            </div>

            {/* In Stock */}
            <div>
              <label
                className="flex items-center gap-2 cursor-pointer"
                data-ocid="filter-instock"
              >
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary"
                />
                <span className="text-sm font-semibold text-foreground">
                  In Stock Only
                </span>
              </label>
            </div>

            <Button
              className="btn-primary border-0 w-full mt-5 text-sm"
              onClick={() => setShowFilterPanel(false)}
              data-ocid="apply-filters"
            >
              Apply Filters
            </Button>
          </aside>
        )}

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Active filter tags */}
          {(activeFilters.length > 0 || searchQuery) && (
            <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1">
              {searchQuery && (
                <Badge variant="secondary" className="text-xs gap-1 py-1">
                  <Filter size={10} />
                  &ldquo;{searchQuery}&rdquo;
                </Badge>
              )}
              {activeFilters.map((f) => (
                <Badge
                  key={f.key}
                  variant="secondary"
                  className="text-xs gap-1 py-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => removeFilter(f.key)}
                  data-ocid={`filter-tag-${f.key}`}
                >
                  {f.label}
                  <X size={10} />
                </Badge>
              ))}
            </div>
          )}

          {/* Results count */}
          <div className="px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              products
            </p>
          </div>

          {/* Products grid */}
          {isLoading ? (
            <ProductSkeletons />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-6" data-ocid="products-empty">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-display font-bold text-foreground text-lg mb-1">
                No products found
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or searching for something else.
              </p>
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="text-sm"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="px-4 pb-24">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id.toString()}
                    product={p}
                    onAddToCart={addItem}
                    inCart={isInCart(p.id)}
                    cartQty={getQuantity(p.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// suppress unused import warning
void MIN_PRICE_OPTIONS;
void MAX_PRICE_OPTIONS;
