import type { Product } from "@/backend";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { useCategories, useSearchProducts } from "@/hooks/useQueries";
import { useSearch } from "@tanstack/react-router";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

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
  const initCategorySlug = (search as { q?: string; category?: string })
    .category;

  const { addItem, isInCart, getQuantity } = useCart();
  const [sort, setSort] = useState("relevance");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    initCategorySlug ? [initCategorySlug] : [],
  );
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999999);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: categories } = useCategories();
  const { data: rawProducts, isLoading } = useSearchProducts(searchQuery);

  const toggleCategory = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const filtered = useMemo(() => {
    let results: Product[] = rawProducts ?? [];

    // Category filter — match by slug via categories list
    if (selectedSlugs.length > 0 && categories) {
      const catIds = categories
        .filter((c) => selectedSlugs.includes(c.slug))
        .map((c) => c.id);
      results = results.filter((p) => catIds.includes(p.category));
    }

    if (minPrice > 0)
      results = results.filter((p) => Number(p.price) >= minPrice);
    if (maxPrice < 99999999)
      results = results.filter((p) => Number(p.price) <= maxPrice);
    if (minRating > 0)
      results = results.filter((p) => Number(p.rating) / 10 >= minRating);
    if (inStockOnly) results = results.filter((p) => p.stock > 0n);

    if (sort === "price_asc")
      results = [...results].sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price_desc")
      results = [...results].sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === "rating")
      results = [...results].sort(
        (a, b) => Number(b.rating) - Number(a.rating),
      );
    else if (sort === "newest")
      results = [...results].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt),
      );

    return results;
  }, [
    rawProducts,
    categories,
    selectedSlugs,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    sort,
  ]);

  const activeFilters: ActiveFilter[] = [];
  for (const slug of selectedSlugs) {
    const cat = (categories ?? []).find((c) => c.slug === slug);
    activeFilters.push({ key: `cat-${slug}`, label: cat?.name ?? slug });
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
      setSelectedSlugs((prev) => prev.filter((s) => `cat-${s}` !== key));
    else if (key === "minprice") setMinPrice(0);
    else if (key === "maxprice") setMaxPrice(99999999);
    else if (key === "rating") setMinRating(0);
    else if (key === "instock") setInStockOnly(false);
  };

  const clearAllFilters = () => {
    setSelectedSlugs([]);
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
        {/* Filter panel */}
        {showFilterPanel && (
          <aside className="lg:w-64 lg:flex-none bg-card border-b lg:border-b-0 lg:border-r border-border px-4 py-4">
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
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(categories ?? []).map((cat) => (
                  <label
                    key={cat.slug}
                    className="flex items-center gap-2 cursor-pointer group"
                    data-ocid={`filter-cat-${cat.slug}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSlugs.includes(cat.slug)}
                      onChange={() => toggleCategory(cat.slug)}
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
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
            <div className="mb-5">
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
              className="btn-primary border-0 w-full text-sm"
              onClick={() => setShowFilterPanel(false)}
              data-ocid="apply-filters"
            >
              Apply Filters
            </Button>
          </aside>
        )}

        {/* Main content */}
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
                  {f.label} <X size={10} />
                </Badge>
              ))}
            </div>
          )}

          {/* Results count */}
          <div className="px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                "Loading products…"
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  product{filtered.length !== 1 ? "s" : ""}
                  {searchQuery && (
                    <>
                      {" "}
                      for{" "}
                      <span className="font-semibold text-foreground">
                        &ldquo;{searchQuery}&rdquo;
                      </span>
                    </>
                  )}
                </>
              )}
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
                {filtered.map((p, i) => (
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
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
