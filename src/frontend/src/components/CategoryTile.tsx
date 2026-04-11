import type { Category } from "@/types";
import { Link } from "@tanstack/react-router";

const CATEGORY_EMOJI: Record<string, string> = {
  tea: "🍵",
  spices: "🌶️",
  handloom: "🧵",
  crafts: "🪣",
  food: "🍲",
  books: "📚",
  attire: "👘",
  kitchen: "🍳",
};

interface CategoryTileProps {
  category: Category;
}

export function CategoryTile({ category }: CategoryTileProps) {
  const emoji = CATEGORY_EMOJI[category.slug] ?? "🛍️";

  return (
    <Link
      to="/categories/$slug"
      params={{ slug: category.slug }}
      data-ocid="category-tile"
      className="category-tile hover:bg-primary/10 hover:border-primary/30 border border-transparent active:scale-95 transition-smooth min-w-0"
    >
      <div className="w-12 h-12 flex items-center justify-center text-3xl">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-10 h-10 object-contain"
            loading="lazy"
          />
        ) : (
          <span role="img" aria-label={category.name}>
            {emoji}
          </span>
        )}
      </div>
      <span className="text-xs font-bold text-foreground uppercase tracking-wide text-center leading-tight">
        {category.name}
      </span>
      {category.description && (
        <span className="text-[10px] text-muted-foreground text-center line-clamp-1 leading-tight">
          {category.description}
        </span>
      )}
    </Link>
  );
}
