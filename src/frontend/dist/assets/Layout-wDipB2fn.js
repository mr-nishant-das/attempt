import { ag as useRouterState, j as jsxRuntimeExports, L as Link, r as reactExports, u as useNavigate } from "./index-DUDks8tZ.js";
import { c as createLucideIcon } from "./createLucideIcon-Ccmnz96I.js";
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
];
const Grid3x3 = createLucideIcon("grid-3x3", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
const NAV_ITEMS = [
  {
    label: "Home",
    to: "/home",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 22 }),
    ocid: "bottom-nav-home"
  },
  {
    label: "Categories",
    to: "/categories",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { size: 22 }),
    ocid: "bottom-nav-categories"
  },
  {
    label: "Search",
    to: "/products",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 22 }),
    ocid: "bottom-nav-search",
    search: {
      q: void 0,
      category: void 0
    }
  },
  {
    label: "Cart",
    to: "/cart",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 22 }),
    ocid: "bottom-nav-cart"
  },
  {
    label: "Account",
    to: "/orders",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 22 }),
    ocid: "bottom-nav-account"
  }
];
function BottomNav({ cartCount = 0 }) {
  const location = useLocation();
  const pathname = location.pathname;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "nav",
    {
      className: "fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.08)]",
      "aria-label": "Main navigation",
      "data-ocid": "bottom-nav",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-stretch h-16 max-w-lg mx-auto", children: NAV_ITEMS.map((item) => {
          const isActive = item.to === "/home" ? pathname === "/" || pathname === "/home" : pathname.startsWith(item.to);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.to,
              search: "search" in item ? item.search : void 0,
              className: `bottom-nav-item flex-1 relative px-1 ${isActive ? "bottom-nav-item-active" : "text-muted-foreground"}`,
              "aria-current": isActive ? "page" : void 0,
              "data-ocid": item.ocid,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-flex", children: [
                  item.icon,
                  item.to === "/cart" && cartCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1 leading-none",
                      "aria-label": `${cartCount} items in cart`,
                      children: cartCount > 99 ? "99+" : cartCount
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] mt-0.5 leading-tight", children: item.label })
              ]
            },
            item.to
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "env(safe-area-inset-bottom)" } })
      ]
    }
  );
}
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
  "Brass Utensils"
];
const QUICK_LINKS = [
  { label: "Tea", slug: "tea" },
  { label: "Handloom", slug: "handloom" },
  { label: "Spices", slug: "spices" },
  { label: "Crafts", slug: "crafts" },
  { label: "Food", slug: "food" }
];
function SearchBar({ initialFocus, placeholder }) {
  const [query, setQuery] = reactExports.useState("");
  const [focused, setFocused] = reactExports.useState(false);
  const containerRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    var _a;
    if (initialFocus) {
      (_a = inputRef.current) == null ? void 0 : _a.focus();
    }
  }, [initialFocus]);
  const filtered = query.trim() ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase())) : SUGGESTIONS.slice(0, 6);
  const handleSearch = reactExports.useCallback(
    (term) => {
      var _a;
      if (!term.trim()) return;
      setFocused(false);
      (_a = inputRef.current) == null ? void 0 : _a.blur();
      navigate({
        to: "/products",
        search: { q: term.trim(), category: void 0 }
      });
    },
    [navigate]
  );
  const handleKeyDown = (e) => {
    var _a;
    if (e.key === "Enter") handleSearch(query);
    if (e.key === "Escape") {
      setFocused(false);
      (_a = inputRef.current) == null ? void 0 : _a.blur();
    }
  };
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "relative w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Search,
        {
          size: 16,
          className: "absolute left-3 text-muted-foreground pointer-events-none z-10"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          type: "search",
          value: query,
          placeholder: placeholder ?? "Search authentic Assamese products, crafts…",
          className: "search-input w-full pl-9 pr-9 h-10 text-sm",
          onFocus: () => setFocused(true),
          onChange: (e) => setQuery(e.target.value),
          onKeyDown: handleKeyDown,
          "data-ocid": "search-input",
          "aria-label": "Search products"
        }
      ),
      query && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setQuery(""),
          className: "absolute right-3 text-muted-foreground hover:text-foreground transition-colors",
          "aria-label": "Clear search",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-2 overflow-x-auto pb-0.5", children: QUICK_LINKS.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: "/categories/$slug", params: { slug: link.slug } }),
        className: "flex-none px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-smooth whitespace-nowrap",
        "data-ocid": `search-quick-link-${link.slug}`,
        children: link.label
      },
      link.slug
    )) }),
    focused && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden list-none p-0 m-0", children: filtered.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors text-left",
        onMouseDown: (e) => {
          e.preventDefault();
          setQuery(s);
          handleSearch(s);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 13, className: "text-muted-foreground flex-none" }),
          s
        ]
      }
    ) }, s)) })
  ] });
}
const CART_KEY = "assam_roots_cart";
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
function computeState(items) {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => {
    const price = Number(i.product.price);
    const discount = Number(i.product.discountPercent);
    const final = price - price * discount / 100;
    return s + final * i.quantity;
  }, 0);
  return { items, totalItems, totalPrice };
}
function useCart() {
  const [items, setItems] = reactExports.useState(loadCart);
  reactExports.useEffect(() => {
    saveCart(items);
  }, [items]);
  const addItem = reactExports.useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity
        };
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  }, []);
  const removeItem = reactExports.useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);
  const updateQuantity = reactExports.useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems(
      (prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity } : i)
    );
  }, []);
  const clearCart = reactExports.useCallback(() => {
    setItems([]);
  }, []);
  const getQuantity = reactExports.useCallback(
    (productId) => {
      var _a;
      return ((_a = items.find((i) => i.product.id === productId)) == null ? void 0 : _a.quantity) ?? 0;
    },
    [items]
  );
  const isInCart = reactExports.useCallback(
    (productId) => {
      return items.some((i) => i.product.id === productId);
    },
    [items]
  );
  return {
    ...computeState(items),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getQuantity,
    isInCart
  };
}
function Layout({ children, hideSearch }) {
  const { totalItems } = useCart();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky-header", "data-ocid": "main-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto px-4 py-3 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/home",
            className: "flex items-center gap-2",
            "aria-label": "AssamRoots home",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl font-black tracking-tight", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Assam" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary", children: "Roots" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-verified text-[10px] px-1.5 py-0.5", children: "✦ Authentic" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/orders",
            className: "text-xs text-muted-foreground hover:text-primary transition-colors font-medium",
            "aria-label": "My orders",
            "data-ocid": "header-orders-link",
            children: "Orders"
          }
        )
      ] }),
      !hideSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBar, {})
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "main",
      {
        className: "flex-1 pb-20 max-w-lg mx-auto w-full",
        "data-ocid": "main-content",
        children
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-muted/40 border-t border-border pb-20 max-w-lg mx-auto w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ". Built with love using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : ""
          )}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-primary hover:underline",
          children: "caffeine.ai"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { cartCount: totalItems })
  ] });
}
export {
  House as H,
  Layout as L,
  SearchBar as S,
  X,
  ShoppingCart as a,
  useCart as u
};
