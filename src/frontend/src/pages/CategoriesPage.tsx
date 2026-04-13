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
    name: "Assam Tea",
    slug: "assam-tea",
    description:
      "Authentic teas from the Brahmaputra valley — from bold CTC to delicate white teas",
    imageUrl: "",
    subCategories: [
      "CTC Tea",
      "Orthodox Tea",
      "Green Tea",
      "White Tea",
      "Flavoured Tea",
      "Premium Single Estate",
    ],
    productCount: 24,
    emoji: "🍵",
    color: "bg-accent/15 border-accent/30",
  },
  {
    id: 2n,
    name: "Assamese Food",
    slug: "assamese-food",
    description:
      "Traditional Assamese pantry staples — grains, pulses, pickles, and dried produce",
    imageUrl: "",
    subCategories: [
      "Dried Vegetables",
      "Grains & Rice",
      "Pulses & Lentils",
      "Pickles & Chutneys",
      "Oils & Ghee",
      "Sweets & Snacks",
    ],
    productCount: 22,
    emoji: "🍚",
    color: "bg-accent/15 border-accent/30",
  },
  {
    id: 3n,
    name: "Spices & Herbs",
    slug: "spices-herbs",
    description:
      "Aromatic spices and culinary herbs sourced from the hills and plains of Assam",
    imageUrl: "",
    subCategories: [
      "Whole Spices",
      "Ground Spices",
      "Herb Blends",
      "Chilli Products",
      "Rare & Exotic Spices",
    ],
    productCount: 18,
    emoji: "🌶️",
    color: "bg-destructive/10 border-destructive/20",
  },
  {
    id: 4n,
    name: "Medicine & Herbs",
    slug: "medicine-herbs",
    description:
      "Traditional Assamese medicinal herbs, herbal teas, and natural wellness products",
    imageUrl: "",
    subCategories: [
      "Medicinal Herbs",
      "Herbal Tea Blends",
      "Ayurvedic Products",
      "Traditional Remedies",
    ],
    productCount: 10,
    emoji: "🌿",
    color: "bg-primary/10 border-primary/20",
  },
  {
    id: 5n,
    name: "Assamese Attire",
    slug: "assamese-attire",
    description:
      "Handwoven clothing from Assam's rich subcultures — Assamese, Boro, Mising, and Karbi traditions",
    imageUrl: "",
    subCategories: [
      "Assamese Traditional",
      "Boro Attire",
      "Mising Attire",
      "Karbi Attire",
      "Festival Wear",
      "Kids Wear",
    ],
    productCount: 19,
    emoji: "👘",
    color: "bg-secondary/15 border-secondary/30",
  },
  {
    id: 6n,
    name: "Handloom & Textiles",
    slug: "handloom-textiles",
    description:
      "Fine handwoven textiles, Muga silk, Eri silk, and traditional Assamese fabric",
    imageUrl: "",
    subCategories: [
      "Mekhela Chador",
      "Gamosa",
      "Muga Silk",
      "Eri Silk",
      "Stoles & Shawls",
      "Fabric Rolls",
    ],
    productCount: 31,
    emoji: "🧵",
    color: "bg-secondary/15 border-secondary/30",
  },
  {
    id: 7n,
    name: "Handicrafts",
    slug: "handicrafts",
    description:
      "Intricate Assamese craftsmanship — bamboo, cane, bell metal, pottery, and woodwork",
    imageUrl: "",
    subCategories: [
      "Bamboo Crafts",
      "Cane Crafts",
      "Bell Metal Craft",
      "Pottery & Clay",
      "Wood Crafts",
      "Tribal Crafts",
    ],
    productCount: 15,
    emoji: "🎋",
    color: "bg-primary/10 border-primary/20",
  },
  {
    id: 8n,
    name: "Art & Paintings",
    slug: "art-paintings",
    description:
      "Authentic Assamese artwork — traditional Sattriya art, folk paintings, and modern Assamese art",
    imageUrl: "",
    subCategories: [
      "Traditional Art",
      "Sattriya Art",
      "Folk Paintings",
      "Modern Assamese Art",
      "Prints & Posters",
    ],
    productCount: 9,
    emoji: "🎨",
    color: "bg-muted border-border",
  },
  {
    id: 9n,
    name: "Books & Literature",
    slug: "books-literature",
    description:
      "Assamese novels, poetry, history, and literature celebrating the heritage of Assam",
    imageUrl: "",
    subCategories: [
      "Assamese Novels",
      "Poetry & Drama",
      "History & Culture",
      "Children Books",
      "Academic & Reference",
    ],
    productCount: 12,
    emoji: "📚",
    color: "bg-muted border-border",
  },
  {
    id: 10n,
    name: "Chronicles & Magazines",
    slug: "chronicles-magazines",
    description:
      "Assamese periodicals, cultural magazines, and chronicles documenting Assamese life",
    imageUrl: "",
    subCategories: [
      "Monthly Magazines",
      "Cultural Chronicles",
      "Literary Journals",
      "Collector Editions",
    ],
    productCount: 8,
    emoji: "📰",
    color: "bg-muted border-border",
  },
  {
    id: 11n,
    name: "Musical Instruments",
    slug: "musical-instruments",
    description:
      "Traditional Assamese musical instruments — dhol, dotara, pepa, tokari, and more",
    imageUrl: "",
    subCategories: [
      "String Instruments",
      "Wind Instruments",
      "Percussion Instruments",
      "Traditional Sets",
      "Accessories",
    ],
    productCount: 14,
    emoji: "🥁",
    color: "bg-accent/15 border-accent/30",
  },
  {
    id: 12n,
    name: "Religious & Puja Items",
    slug: "religious-puja",
    description:
      "Sacred items for Assamese rituals — idols, diyas, incense, puja sets, and spiritual accessories",
    imageUrl: "",
    subCategories: [
      "Idols & Figurines",
      "Diyas & Lamps",
      "Incense & Dhoop",
      "Puja Sets",
      "Prayer Accessories",
    ],
    productCount: 16,
    emoji: "🪔",
    color: "bg-accent/15 border-accent/30",
  },
  {
    id: 13n,
    name: "Decorative Items",
    slug: "decorative-items",
    description:
      "Beautiful Assamese decorative pieces — wall art, table decor, and traditional ornaments",
    imageUrl: "",
    subCategories: [
      "Wall Decor",
      "Table Decor",
      "Traditional Ornaments",
      "Seasonal Decor",
      "Gifting Items",
    ],
    productCount: 11,
    emoji: "🏺",
    color: "bg-secondary/15 border-secondary/30",
  },
  {
    id: 14n,
    name: "Kitchen & Cookware",
    slug: "kitchen-cookware",
    description:
      "Traditional Assamese kitchen essentials — bell metal utensils, bamboo cookware, and clay vessels",
    imageUrl: "",
    subCategories: [
      "Bell Metal Utensils",
      "Bamboo Kitchenware",
      "Clay Pots & Vessels",
      "Traditional Cookware",
      "Kitchen Accessories",
    ],
    productCount: 11,
    emoji: "🍳",
    color: "bg-primary/10 border-primary/20",
  },
  {
    id: 15n,
    name: "Living Room Decor",
    slug: "living-room-decor",
    description:
      "Assamese living room pieces — bamboo and cane furniture, traditional decor, and artisan crafts",
    imageUrl: "",
    subCategories: [
      "Bamboo Furniture",
      "Cane Furniture",
      "Traditional Decor",
      "Cushion Covers & Textiles",
      "Statement Pieces",
    ],
    productCount: 9,
    emoji: "🛋️",
    color: "bg-secondary/15 border-secondary/30",
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
