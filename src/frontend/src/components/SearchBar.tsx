import { searchProducts } from "@/data/catalog";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const QUICK_LINKS = [
  { label: "Tea", slug: "assam-tea" },
  { label: "Handloom", slug: "handloom-textiles" },
  { label: "Spices", slug: "spices-herbs" },
  { label: "Crafts", slug: "handicrafts" },
  { label: "Food", slug: "assamese-food" },
  { label: "Music", slug: "musical-instruments" },
];

interface SearchBarProps {
  initialFocus?: boolean;
  placeholder?: string;
}

export function SearchBar({ initialFocus, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialFocus) inputRef.current?.focus();
  }, [initialFocus]);

  // Live suggestions from shared catalog
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const results = searchProducts(query);
    const seen = new Set<string>();
    const titles: string[] = [];
    for (const p of results) {
      if (!seen.has(p.title) && titles.length < 7) {
        seen.add(p.title);
        titles.push(p.title);
      }
    }
    return titles;
  }, [query]);

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
      {/* Search input */}
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-4 text-muted-foreground pointer-events-none z-10"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder={placeholder ?? "Search tea, spices, handloom, crafts…"}
          className="search-input w-full pl-12 pr-11 h-11 text-sm"
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
            className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Quick-link chips */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5 scrollbar-none">
        {QUICK_LINKS.map((link) => (
          <button
            key={link.slug}
            type="button"
            onClick={() =>
              navigate({ to: "/categories/$slug", params: { slug: link.slug } })
            }
            className="flex-none px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-smooth whitespace-nowrap"
            data-ocid={`search-quick-link-${link.slug}`}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Suggestions dropdown */}
      {focused && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden list-none p-0 m-0">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
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
