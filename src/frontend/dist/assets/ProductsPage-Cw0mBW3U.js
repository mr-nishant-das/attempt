import { b as useSearch, r as reactExports, j as jsxRuntimeExports, S as Skeleton } from "./index-CR5jwz_B.js";
import { u as useCart, L as Layout, a as SearchBar, X } from "./Layout-DhGPVLyq.js";
import { P as ProductCard } from "./ProductCard-BFwCZI74.js";
import { B as Badge } from "./badge-BNJmWZh5.js";
import { B as Button } from "./button-I5RPTQO5.js";
import { u as useCategories, h as useSearchProducts } from "./useQueries-CzNiaAGb.js";
import { c as createLucideIcon } from "./createLucideIcon-BOzMcLN1.js";
import "./types-Dmw7OeI0.js";
import "./star-BFTT8cOK.js";
import "./index-D3eYOVqY.js";
import "./useActor-DMra6ezJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" }
];
function ProductSkeletons() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 px-4 pb-4", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card rounded-lg border border-border overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-md" })
        ] })
      ]
    },
    `skel-${k}`
  )) });
}
function ProductsPage() {
  const search = useSearch({ from: "/products" });
  const searchQuery = search.q ?? "";
  const initCategorySlug = search.category;
  const { addItem, isInCart, getQuantity } = useCart();
  const [sort, setSort] = reactExports.useState("relevance");
  const [showFilterPanel, setShowFilterPanel] = reactExports.useState(false);
  const [selectedSlugs, setSelectedSlugs] = reactExports.useState(
    initCategorySlug ? [initCategorySlug] : []
  );
  const [minPrice, setMinPrice] = reactExports.useState(0);
  const [maxPrice, setMaxPrice] = reactExports.useState(99999999);
  const [minRating, setMinRating] = reactExports.useState(0);
  const [inStockOnly, setInStockOnly] = reactExports.useState(false);
  const { data: categories } = useCategories();
  const { data: rawProducts, isLoading } = useSearchProducts(searchQuery);
  const toggleCategory = (slug) => {
    setSelectedSlugs(
      (prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };
  const filtered = reactExports.useMemo(() => {
    let results = rawProducts ?? [];
    if (selectedSlugs.length > 0 && categories) {
      const catIds = categories.filter((c) => selectedSlugs.includes(c.slug)).map((c) => c.id);
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
        (a, b) => Number(b.rating) - Number(a.rating)
      );
    else if (sort === "newest")
      results = [...results].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt)
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
    sort
  ]);
  const activeFilters = [];
  for (const slug of selectedSlugs) {
    const cat = (categories ?? []).find((c) => c.slug === slug);
    activeFilters.push({ key: `cat-${slug}`, label: (cat == null ? void 0 : cat.name) ?? slug });
  }
  if (minPrice > 0)
    activeFilters.push({
      key: "minprice",
      label: `Min ₹${(minPrice / 100).toLocaleString("en-IN")}`
    });
  if (maxPrice < 99999999)
    activeFilters.push({
      key: "maxprice",
      label: `Max ₹${(maxPrice / 100).toLocaleString("en-IN")}`
    });
  if (minRating > 0)
    activeFilters.push({ key: "rating", label: `${minRating}★+` });
  if (inStockOnly) activeFilters.push({ key: "instock", label: "In Stock" });
  const removeFilter = (key) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { hideSearch: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-2 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBar, { initialFocus: !searchQuery }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-[72px] z-30 bg-background border-b border-border px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setShowFilterPanel(!showFilterPanel),
          className: `flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth border ${showFilterPanel || activeFilters.length > 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/40"}`,
          "data-ocid": "toggle-filters",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { size: 12 }),
            "Filters",
            activeFilters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary-foreground text-primary rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold", children: activeFilters.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-border flex-none" }),
      SORT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setSort(opt.value),
          className: `flex-none px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth border ${sort === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/40"}`,
          "data-ocid": `sort-${opt.value}`,
          children: opt.label
        },
        opt.value
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row", children: [
      showFilterPanel && /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "lg:w-64 lg:flex-none bg-card border-b lg:border-b-0 lg:border-r border-border px-4 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-sm text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 14 }),
            " Filters"
          ] }),
          activeFilters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: clearAllFilters,
              className: "text-xs text-destructive font-medium hover:underline",
              "data-ocid": "clear-all-filters",
              children: "Clear all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground uppercase tracking-wider mb-2", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto pr-1", children: (categories ?? []).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: "flex items-center gap-2 cursor-pointer group",
              "data-ocid": `filter-cat-${cat.slug}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: selectedSlugs.includes(cat.slug),
                    onChange: () => toggleCategory(cat.slug),
                    className: "w-4 h-4 rounded border-border accent-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground group-hover:text-primary transition-colors", children: cat.name })
              ]
            },
            cat.slug
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground uppercase tracking-wider mb-2", children: "Price Range" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            [
              { label: "Under ₹500", min: 0, max: 5e4 },
              { label: "₹500 – ₹1,000", min: 5e4, max: 1e5 },
              { label: "₹1,000 – ₹2,500", min: 1e5, max: 25e4 },
              { label: "₹2,500 – ₹5,000", min: 25e4, max: 5e5 },
              { label: "Above ₹5,000", min: 5e5, max: 99999999 }
            ].map((range) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-2 cursor-pointer group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "price-range",
                      checked: minPrice === range.min && maxPrice === range.max,
                      onChange: () => {
                        setMinPrice(range.min);
                        setMaxPrice(range.max);
                      },
                      className: "w-4 h-4 accent-primary"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground group-hover:text-primary transition-colors", children: range.label })
                ]
              },
              range.label
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "radio",
                  name: "price-range",
                  checked: minPrice === 0 && maxPrice === 99999999,
                  onChange: () => {
                    setMinPrice(0);
                    setMaxPrice(99999999);
                  },
                  className: "w-4 h-4 accent-primary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground group-hover:text-primary transition-colors", children: "All Prices" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground uppercase tracking-wider mb-2", children: "Min Rating" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            [4, 3, 2].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-2 cursor-pointer group",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "min-rating",
                      checked: minRating === r,
                      onChange: () => setMinRating(r),
                      className: "w-4 h-4 accent-primary"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground flex items-center gap-1", children: [
                    "★".repeat(r),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "& above" })
                  ] })
                ]
              },
              r
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "radio",
                  name: "min-rating",
                  checked: minRating === 0,
                  onChange: () => setMinRating(0),
                  className: "w-4 h-4 accent-primary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Any Rating" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "flex items-center gap-2 cursor-pointer",
            "data-ocid": "filter-instock",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: inStockOnly,
                  onChange: (e) => setInStockOnly(e.target.checked),
                  className: "w-4 h-4 rounded border-border accent-primary"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "In Stock Only" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "btn-primary border-0 w-full text-sm",
            onClick: () => setShowFilterPanel(false),
            "data-ocid": "apply-filters",
            children: "Apply Filters"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        (activeFilters.length > 0 || searchQuery) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 px-4 pt-3 pb-1", children: [
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs gap-1 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 10 }),
            "“",
            searchQuery,
            "”"
          ] }),
          activeFilters.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-xs gap-1 py-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors",
              onClick: () => removeFilter(f.key),
              "data-ocid": `filter-tag-${f.key}`,
              children: [
                f.label,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 })
              ]
            },
            f.key
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isLoading ? "Loading products…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Showing",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: filtered.length }),
          " ",
          "product",
          filtered.length !== 1 ? "s" : "",
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " ",
            "for",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
              "“",
              searchQuery,
              "”"
            ] })
          ] })
        ] }) }) }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductSkeletons, {}) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 px-6", "data-ocid": "products-empty", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-5xl mb-4", children: "🔍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg mb-1", children: "No products found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Try adjusting your filters or searching for something else." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: clearAllFilters,
              className: "text-sm",
              children: "Clear all filters"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", children: filtered.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductCard,
          {
            product: p,
            onAddToCart: addItem,
            inCart: isInCart(p.id),
            cartQty: getQuantity(p.id),
            "data-ocid": `product.item.${i + 1}`
          },
          p.id.toString()
        )) }) })
      ] })
    ] })
  ] });
}
export {
  ProductsPage as default
};
