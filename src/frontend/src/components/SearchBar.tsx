import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "Assam CTC Tea",
  "Mekhela Chador",
  "Bamboo Craft",
  "Gamosa",
  "Black Rice",
  "Joha Rice",
  "Tamul",
  "Assamese Sweets",
  "Handloom Saree",
  "Brass Utensils",
];

const QUICK_LINKS = [
  { label: "Tea", slug: "tea" },
  { label: "Handloom", slug: "handloom" },
  { label: "Spices", slug: "spices" },
  { label: "Crafts", slug: "crafts" },
  { label: "Food", slug: "food" },
];

interface SearchBarProps {
  /** Set to true to focus the input on mount */
  initialFocus?: boolean;
  placeholder?: string;
}

export function SearchBar({ initialFocus, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus on mount when requested
  useEffect(() => {
    if (initialFocus) {
      inputRef.current?.focus();
    }
  }, [initialFocus]);

  const filtered = query.trim()
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS.slice(0, 6);

  const handleSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      setFocused(false);
      inputRef.current?.blur();
      navigate({
        to: "/products",
        search: { q: term.trim(), category: undefined },
      });
    },
    [navigate],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(query);
    if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-3 text-muted-foreground pointer-events-none z-10"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder={
            placeholder ?? "Search authentic Assamese products, crafts…"
          }
          className="search-input w-full pl-9 pr-9 h-10 text-sm"
          onFocus={() => setFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          data-ocid="search-input"
          aria-label="Search products"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Quick links */}
      <div className="flex gap-2 mt-2 overflow-x-auto pb-0.5">
        {QUICK_LINKS.map((link) => (
          <button
            key={link.slug}
            type="button"
            onClick={() =>
              navigate({ to: "/categories/$slug", params: { slug: link.slug } })
            }
            className="flex-none px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-smooth whitespace-nowrap"
            data-ocid={`search-quick-link-${link.slug}`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Suggestions dropdown */}
      {focused && filtered.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden list-none p-0 m-0">
          {filtered.map((s) => (
            <li key={s}>
              <button
                type="button"
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setQuery(s);
                  handleSearch(s);
                }}
              >
                <Search size={13} className="text-muted-foreground flex-none" />
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
