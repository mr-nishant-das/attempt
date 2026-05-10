import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

// ─── Visual metadata keyed by slug (emoji + colour) ──────────────────────────
const SLUG_META: Record<string, { emoji: string; color: string }> = {
  "assam-tea": { emoji: "🍵", color: "bg-accent/15 border-accent/30" },
  "assamese-food": { emoji: "🍚", color: "bg-accent/15 border-accent/30" },
  "spices-herbs": {
    emoji: "🌶️",
    color: "bg-destructive/10 border-destructive/20",
  },
  "medicine-herbs": { emoji: "🌿", color: "bg-primary/10 border-primary/20" },
  "assamese-attire": {
    emoji: "👘",
    color: "bg-secondary/15 border-secondary/30",
  },
  "handloom-textiles": {
    emoji: "🧵",
    color: "bg-secondary/15 border-secondary/30",
  },
  handicrafts: { emoji: "🎋", color: "bg-primary/10 border-primary/20" },
  "art-paintings": { emoji: "🎨", color: "bg-muted border-border" },
  "books-literature": { emoji: "📚", color: "bg-muted border-border" },
  "chronicles-magazines": { emoji: "📰", color: "bg-muted border-border" },
  "musical-instruments": {
    emoji: "🥁",
    color: "bg-accent/15 border-accent/30",
  },
  "religious-puja": { emoji: "🪔", color: "bg-accent/15 border-accent/30" },
  "decorative-items": {
    emoji: "🏺",
    color: "bg-secondary/15 border-secondary/30",
  },
  "kitchen-cookware": { emoji: "🍳", color: "bg-primary/10 border-primary/20" },
  "living-room-decor": {
    emoji: "🛋️",
    color: "bg-secondary/15 border-secondary/30",
  },
};

function CategorySkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <Layout>
      <div className="px-4 py-4 pb-24">
        {/* Header */}
        <div className="mb-5">
          <h1 className="font-display text-2xl font-bold text-foreground">
            All Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore authentic Assamese products across {categories.length}{" "}
            categories
          </p>
        </div>

        {/* Category grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            data-ocid="categories-grid"
          >
            {categories.map((cat) => {
              const meta = SLUG_META[cat.slug] ?? {
                emoji: "📦",
                color: "bg-muted border-border",
              };
              return (
                <Link
                  key={cat.id.toString()}
                  to="/categories/$slug"
                  params={{ slug: cat.slug }}
                  data-ocid={`category-card-${cat.slug}`}
                  className="group bg-card rounded-2xl border border-border overflow-hidden transition-smooth hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
                >
                  {/* Category visual */}
                  <div
                    className={`aspect-[4/3] flex flex-col items-center justify-center gap-2 ${meta.color} relative overflow-hidden`}
                  >
                    <span
                      className="text-5xl sm:text-6xl"
                      role="img"
                      aria-label={cat.name}
                    >
                      {meta.emoji}
                    </span>
                  </div>

                  {/* Category info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h2>
                      <ChevronRight
                        size={14}
                        className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-smooth flex-none"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2 mb-2">
                      {cat.description}
                    </p>
                    {/* Subcategory tags */}
                    <div className="flex flex-wrap gap-1">
                      {cat.subCategories.slice(0, 3).map((sub) => (
                        <Badge
                          key={sub.id.toString()}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-border font-normal"
                        >
                          {sub.name}
                        </Badge>
                      ))}
                      {cat.subCategories.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-border font-normal"
                        >
                          +{cat.subCategories.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Browse all CTA */}
        <Link
          to="/products"
          search={{ q: undefined, category: undefined }}
          className="flex items-center justify-between mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 group hover:bg-primary/15 transition-smooth"
          data-ocid="browse-all-products"
        >
          <div>
            <p className="font-display font-bold text-foreground text-sm group-hover:text-primary transition-colors">
              Browse All Products
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explore our complete catalogue of Assamese products
            </p>
          </div>
          <ChevronRight
            size={18}
            className="text-primary group-hover:translate-x-0.5 transition-smooth"
          />
        </Link>
      </div>
    </Layout>
  );
}
