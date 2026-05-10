import type { Category } from "@/backend";
import { Link } from "@tanstack/react-router";

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

interface CategoryTileProps {
  category: Category;
  compact?: boolean;
}

export function CategoryTile({ category, compact }: CategoryTileProps) {
  const emoji = CATEGORY_EMOJI[category.slug] ?? "🛍️";

  return (
    <Link
      to="/categories/$slug"
      params={{ slug: category.slug }}
      data-ocid="category-tile"
      className="category-tile hover:bg-primary/10 hover:border-primary/30 border border-transparent active:scale-95 transition-smooth min-w-0 group overflow-hidden"
    >
      {/* Image or emoji thumbnail */}
      <div
        className={`relative flex items-center justify-center rounded-lg overflow-hidden mb-1.5 ${compact ? "w-12 h-12" : "w-14 h-14"}`}
      >
        {category.imageUrl ? (
          <>
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover transition-smooth group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-3xl">
            <span role="img" aria-label={category.name}>
              {emoji}
            </span>
          </div>
        )}
      </div>

      <span className="text-[10px] font-bold text-foreground uppercase tracking-wide text-center leading-tight line-clamp-2 px-0.5">
        {category.name}
      </span>
    </Link>
  );
}
