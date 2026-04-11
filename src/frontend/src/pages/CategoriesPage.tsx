import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/types";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Full category data with product counts ─────────────────────────────────
const CATEGORIES: (Category & {
  productCount: number;
  emoji: string;
  color: string;
})[] = [
  {
    id: 1n,
    name: "Tea",
    slug: "tea",
    description:
      "Premium Assam teas from valley gardens — CTC, Orthodox, Green & White",
    imageUrl: "",
    subCategories: ["CTC", "Orthodox", "Green", "White", "Flavoured"],
    productCount: 24,
    emoji: "🍵",
    color: "bg-accent/15 border-accent/30",
  },
  {
    id: 2n,
    name: "Spices",
    slug: "spices",
    description:
      "Authentic Assam spices, pickles, and condiments including the famous Bhut Jolokia",
    imageUrl: "",
    subCategories: ["Chilli", "Pickle", "Sauce", "Masala"],
    productCount: 18,
    emoji: "🌶️",
    color: "bg-destructive/10 border-destructive/20",
  },
  {
    id: 3n,
    name: "Handloom",
    slug: "handloom",
    description:
      "Handwoven Assamese textiles — Mekhela Chador, Gamosa, Muga silk, and Pat silk",
    imageUrl: "",
    subCategories: ["Mekhela", "Gamosa", "Muga", "Pat Silk"],
    productCount: 31,
    emoji: "🧵",
    color: "bg-secondary/15 border-secondary/30",
  },
  {
    id: 4n,
    name: "Crafts",
    slug: "crafts",
    description:
      "Bamboo, cane, and traditional crafts handmade by Assamese artisans",
    imageUrl: "",
    subCategories: ["Baskets", "Furniture", "Décor", "Toys"],
    productCount: 15,
    emoji: "🪣",
    color: "bg-primary/10 border-primary/20",
  },
  {
    id: 5n,
    name: "Food",
    slug: "food",
    description:
      "Regional Assamese foods — Joha rice, organic produce, dried fish, and more",
    imageUrl: "",
    subCategories: ["Rice", "Pickle", "Snacks", "Organic"],
    productCount: 22,
    emoji: "🍲",
    color: "bg-accent/15 border-accent/30",
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
    color: "bg-muted border-border",
  },
  {
    id: 7n,
    name: "Attire",
    slug: "attire",
    description:
      "Traditional Assamese clothing — Dhoti, Riha, and festive wear",
    imageUrl: "",
    subCategories: ["Men", "Women", "Children", "Accessories"],
    productCount: 19,
    emoji: "👘",
    color: "bg-secondary/15 border-secondary/30",
  },
  {
    id: 8n,
    name: "Kitchen",
    slug: "kitchen",
    description:
      "Traditional kitchenware — Bell metal, clay pots, bamboo utensils",
    imageUrl: "",
    subCategories: ["Bell Metal", "Clay", "Bamboo", "Brass"],
    productCount: 11,
    emoji: "🍳",
    color: "bg-primary/10 border-primary/20",
  },
];

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <Layout>
      <div className="px-4 py-4 pb-24">
        {/* Header */}
        <div className="mb-5">
          <h1 className="font-display text-2xl font-bold text-foreground">
            All Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore authentic Assamese products across {CATEGORIES.length}{" "}
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
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id.toString()}
                to="/categories/$slug"
                params={{ slug: cat.slug }}
                data-ocid={`category-card-${cat.slug}`}
                className="group bg-card rounded-2xl border border-border overflow-hidden transition-smooth hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
              >
                {/* Category visual */}
                <div
                  className={`aspect-[4/3] flex flex-col items-center justify-center gap-2 ${cat.color} relative overflow-hidden`}
                >
                  <span
                    className="text-5xl sm:text-6xl"
                    role="img"
                    aria-label={cat.name}
                  >
                    {cat.emoji}
                  </span>
                  {/* Product count pill */}
                  <span className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border border-border">
                    {cat.productCount}+ items
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
                        key={sub}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 border-border font-normal"
                      >
                        {sub}
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
            ))}
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
