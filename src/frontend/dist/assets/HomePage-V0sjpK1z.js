import { j as jsxRuntimeExports, L as Link, r as reactExports, S as Skeleton } from "./index-CR5jwz_B.js";
import { u as useCart, L as Layout, b as Search, S as ShoppingCart, X } from "./Layout-DhGPVLyq.js";
import { P as ProductCard } from "./ProductCard-BFwCZI74.js";
import { B as Badge } from "./badge-BNJmWZh5.js";
import { u as useCategories, j as useSiteSettings, k as useBestSellers, l as useNewArrivals, m as useHeroBanners, n as useFeaturedBlocks, o as useVideoByte } from "./useQueries-CzNiaAGb.js";
import { u as ue } from "./index-A4rxUgPY.js";
import { C as ChevronRight } from "./chevron-right-DsRoCsQ-.js";
import { Z as Zap } from "./zap-CZ4iIbhP.js";
import { T as Truck } from "./truck-DO7SpthQ.js";
import { c as createLucideIcon } from "./createLucideIcon-BOzMcLN1.js";
import { S as ShieldCheck } from "./shield-check-BUijJ5vW.js";
import "./button-I5RPTQO5.js";
import "./index-D3eYOVqY.js";
import "./types-Dmw7OeI0.js";
import "./star-BFTT8cOK.js";
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
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode);
const CATEGORY_EMOJI = {
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
  "living-room-decor": "🛋️"
};
function CategoryTile({ category, compact }) {
  const emoji = CATEGORY_EMOJI[category.slug] ?? "🛍️";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/categories/$slug",
      params: { slug: category.slug },
      "data-ocid": "category-tile",
      className: "category-tile hover:bg-primary/10 hover:border-primary/30 border border-transparent active:scale-95 transition-smooth min-w-0 group overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `relative flex items-center justify-center rounded-lg overflow-hidden mb-1.5 ${compact ? "w-12 h-12" : "w-14 h-14"}`,
            children: category.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: category.imageUrl,
                  alt: category.name,
                  className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
                  loading: "lazy"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-primary/10 flex items-center justify-center text-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "img", "aria-label": category.name, children: emoji }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-foreground uppercase tracking-wide text-center leading-tight line-clamp-2 px-0.5", children: category.name })
      ]
    }
  );
}
const FALLBACK_BANNERS = [
  {
    id: 1n,
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
    title: "Fresh from Assam's Tea Gardens",
    subtitle: "Up to 20% off on premium orthodox teas this season",
    ctaText: "Shop Teas",
    ctaSlug: "assam-tea",
    order: 1n,
    isActive: true
  },
  {
    id: 2n,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80",
    title: "Authentic Assamese Silk & Weaves",
    subtitle: "Celebrate the art of Mekhela Chador & Muga silk",
    ctaText: "Explore Handloom",
    ctaSlug: "handloom-textiles",
    order: 2n,
    isActive: true
  },
  {
    id: 3n,
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=80",
    title: "Authentic Assamese Kitchen & Spices",
    subtitle: "Clay cookware, Bhut Jolokia & traditional flavours",
    ctaText: "Shop Now",
    ctaSlug: "kitchen-cookware",
    order: 3n,
    isActive: true
  }
];
const SHOP_BY_CATEGORY_FEATURED = [
  {
    slug: "assam-tea",
    name: "Assam Tea",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    tag: "Bestseller"
  },
  {
    slug: "handloom-textiles",
    name: "Handloom",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
    tag: "Trending"
  },
  {
    slug: "spices-herbs",
    name: "Spices",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    tag: "Hot 🌶️"
  },
  {
    slug: "handicrafts",
    name: "Handicrafts",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    tag: "Handmade"
  }
];
function SectionHeader({ title, to }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        search: { q: void 0, category: void 0 },
        className: "flex items-center gap-0.5 text-xs text-primary font-semibold hover:underline",
        "data-ocid": "section-see-all",
        children: [
          "See all ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 })
        ]
      }
    )
  ] });
}
function SectionHeaderNoSearch({ title, to }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        className: "flex items-center gap-0.5 text-xs text-primary font-semibold hover:underline",
        "data-ocid": "section-see-all-cats",
        children: [
          "See all ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 })
        ]
      }
    )
  ] });
}
function ProductRowSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 px-4 overflow-hidden", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-none w-40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-xl mb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-4/5 mb-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3 mb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-lg" })
  ] }, i)) });
}
function CategoryTilesSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 px-4", children: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-lg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-10" })
  ] }, i)) });
}
const DEFAULT_HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Browse & Discover",
    description: "Explore 110+ authentic Assamese products — from Muga silk to premium tea."
  },
  {
    icon: ShoppingCart,
    title: "Add to Cart",
    description: "Pick your favourites, choose quantity and options, and checkout securely."
  },
  {
    icon: Truck,
    title: "Delivered to You",
    description: "Fast pan-India delivery brings Assam to your doorstep, wherever you are."
  }
];
function HowItWorksSection({
  steps
}) {
  const items = steps && steps.length === 3 ? steps : DEFAULT_HOW_IT_WORKS;
  const icons = [Search, ShoppingCart, Truck];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "aria-label": "How it works",
      className: "px-4",
      "data-ocid": "how-it-works.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "How It Works" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: items.map((step, i) => {
          const Icon = icons[i] ?? Search;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center text-center bg-card border border-border rounded-2xl px-2 py-4 gap-2 shadow-sm",
              "data-ocid": `how-it-works.step.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-foreground leading-snug", children: step.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground leading-relaxed line-clamp-3", children: step.description })
              ]
            },
            step.title
          );
        }) })
      ]
    }
  );
}
function HeroBannerCarousel({
  tagline,
  subtitle
}) {
  const { data: fetchedBanners, isLoading } = useHeroBanners();
  const banners = fetchedBanners && fetchedBanners.length > 0 ? fetchedBanners : FALLBACK_BANNERS;
  const [active, setActive] = reactExports.useState(0);
  const timerRef = reactExports.useRef(null);
  const startTimer = reactExports.useCallback((count) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, 4e3);
  }, []);
  reactExports.useEffect(() => {
    if (banners.length > 0) {
      setActive(0);
      startTimer(banners.length);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length, startTimer]);
  const goTo = (idx) => {
    setActive(idx);
    startTimer(banners.length);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4 rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-[16/7] rounded-2xl" }) });
  }
  const banner = banners[active] ?? banners[0];
  if (!banner) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative mx-4 rounded-2xl overflow-hidden shadow-md",
      "data-ocid": "hero-banner-carousel",
      children: [
        tagline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-20 bg-primary/95 px-4 py-1.5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-primary-foreground tracking-wide", children: tagline }),
          subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-primary-foreground/80 mt-0.5", children: subtitle })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[16/7] w-full", children: [
          banners.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0 pointer-events-none"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: b.imageUrl,
                    alt: b.title,
                    className: "w-full h-full object-cover",
                    loading: i === 0 ? "eager" : "lazy"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" })
              ]
            },
            b.id.toString()
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col justify-center px-5 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-black text-card leading-snug whitespace-pre-line mb-1", children: banner.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-card/80 mb-3 leading-tight max-w-[55%]", children: banner.subtitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/categories/$slug",
                params: { slug: banner.ctaSlug },
                className: "self-start bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-smooth",
                "data-ocid": `hero-cta-${banner.ctaSlug}`,
                children: banner.ctaText
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 right-4 flex items-center gap-1.5", children: banners.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => goTo(i),
            "aria-label": `Go to slide ${i + 1}`,
            className: `rounded-full transition-all duration-300 ${i === active ? "w-5 h-2 bg-primary-foreground" : "w-2 h-2 bg-card/50 hover:bg-card/80"}`
          },
          b.id.toString()
        )) })
      ]
    }
  );
}
function DealsStrip() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mx-4 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center gap-2 overflow-hidden",
      "data-ocid": "deals-strip",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 14, className: "text-primary flex-none animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 text-xs font-semibold text-primary overflow-x-auto scrollbar-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-none", children: "🎉 Free delivery above ₹499" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-none text-primary/50", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-none", children: "🌿 100% authentic products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-none text-primary/50", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-none", children: "🚀 Ships across India" })
        ] })
      ]
    }
  );
}
function HorizontalProductRow({
  products,
  isLoading,
  onAddToCart,
  isInCart,
  getQuantity
}) {
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(ProductRowSkeleton, {});
  if (products.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6 text-center text-sm text-muted-foreground", children: "No products yet — check back soon!" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-none",
      "data-ocid": "product-row",
      children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-none w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductCard,
        {
          product,
          onAddToCart,
          inCart: isInCart(product.id),
          cartQty: getQuantity(product.id)
        }
      ) }, product.id.toString()))
    }
  );
}
function PromoBanner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-4", "data-ocid": "promo-banner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories/$slug", params: { slug: "assam-tea" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl overflow-hidden shadow-sm border border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
        alt: "Explore Assam Tea",
        className: "w-full object-cover h-36",
        loading: "lazy"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-foreground/65 via-foreground/25 to-transparent flex items-center px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5", children: "☕ Premium Collection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-black text-card leading-tight mb-2", children: "Explore Assam Tea" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full", children: [
        "Shop Now ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 11 })
      ] })
    ] }) })
  ] }) }) });
}
function ShopByCategoryGrid() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-label": "Shop by category", className: "px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeaderNoSearch, { title: "Explore Categories", to: "/categories" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: SHOP_BY_CATEGORY_FEATURED.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/categories/$slug",
        params: { slug: cat.slug },
        className: "group relative rounded-2xl overflow-hidden border border-border shadow-sm aspect-[4/3] hover:shadow-md active:scale-[0.98] transition-smooth",
        "data-ocid": `category-grid-${cat.slug}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: cat.image,
              alt: cat.name,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-bold text-card", children: cat.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-card/70", children: "Explore →" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[9px] font-bold border-0 bg-primary/80 text-primary-foreground px-1.5 py-0.5", children: cat.tag })
          ] })
        ]
      },
      cat.slug
    )) })
  ] });
}
function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, label: "100% Authentic", sub: "Verified products" },
    { icon: Truck, label: "Pan-India Delivery", sub: "Fast & reliable" },
    { icon: Flame, label: "Fresh Arrivals", sub: "Every week" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4", "aria-label": "Why shop with us", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: badges.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl py-3 px-2 text-center flex flex-col items-center gap-1",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(b.icon, { size: 18, className: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold text-foreground leading-tight", children: b.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground leading-tight", children: b.sub })
      ]
    },
    b.label
  )) }) });
}
function FeaturedBlockModal({
  block,
  onClose
}) {
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "dialog",
    {
      open: true,
      className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center w-full h-full m-0 max-w-none max-h-none bg-transparent p-0 border-0",
      "data-ocid": "featured-block.dialog",
      "aria-label": block.title,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute inset-0 bg-foreground/60 backdrop-blur-sm",
            onClick: onClose,
            "aria-label": "Close"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 bg-card w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground line-clamp-1", children: block.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors",
                "aria-label": "Close",
                "data-ocid": "featured-block.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", children: [
            block.contentImages && block.contentImages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `grid gap-2 ${block.contentImages.length === 1 ? "grid-cols-1" : "grid-cols-2"}`,
                children: block.contentImages.map((imgUrl, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: imgUrl,
                    alt: `${block.title} ${idx + 1}`,
                    className: "w-full rounded-xl object-cover aspect-video",
                    loading: "lazy"
                  },
                  imgUrl || idx.toString()
                ))
              }
            ),
            block.content && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "prose prose-sm max-w-none text-foreground [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_a]:text-primary [&_img]:rounded-xl [&_img]:w-full",
                dangerouslySetInnerHTML: { __html: block.content }
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function FeaturedBlocksSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 px-4 overflow-hidden", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-none w-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl mb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-4/5 mb-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" })
  ] }, i)) });
}
function StoriesHighlights() {
  const { data: blocks, isLoading } = useFeaturedBlocks();
  const [activeBlock, setActiveBlock] = reactExports.useState(null);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-label": "Stories and highlights", className: "pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center px-4 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "📖 Stories & Highlights" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedBlocksSkeleton, {})
    ] });
  }
  if (!blocks || blocks.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "aria-label": "Stories and highlights",
        className: "pt-1",
        "data-ocid": "stories-highlights.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between px-4 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "📖 Stories & Highlights" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-none",
              "data-ocid": "stories-highlights.list",
              children: blocks.map((block, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveBlock(block),
                  className: "flex-none w-36 text-left group active:scale-[0.97] transition-smooth",
                  "data-ocid": `stories-highlights.item.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden border border-border shadow-sm aspect-[3/2] mb-2 group-hover:shadow-md transition-shadow", children: [
                      block.thumbnailUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: block.thumbnailUrl,
                          alt: block.title,
                          className: "w-full h-full object-cover group-hover:scale-105 transition-smooth",
                          loading: "lazy"
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-muted flex items-center justify-center text-2xl", children: "📖" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-card/80 flex items-center justify-center shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 11, className: "text-foreground" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground leading-snug line-clamp-2 px-0.5", children: block.title })
                  ]
                },
                block.id.toString()
              ))
            }
          )
        ]
      }
    ),
    activeBlock && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FeaturedBlockModal,
      {
        block: activeBlock,
        onClose: () => setActiveBlock(null)
      }
    )
  ] });
}
function isYouTubeUrl(url) {
  return /youtube\.com|youtu\.be/.test(url);
}
function getYouTubeEmbedUrl(url) {
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch)
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortMatch[1]}`;
  const longMatch = url.match(/[?&]v=([^?&]+)/);
  if (longMatch)
    return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${longMatch[1]}`;
  return url;
}
function VideoByteSection() {
  const { data: videoByte, isLoading } = useVideoByte();
  const hasVideo = !isLoading && (videoByte == null ? void 0 : videoByte.enabled) && videoByte.url;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "aria-label": "Our Story video",
      className: "px-4",
      "data-ocid": "video-byte.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3 px-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "🎬 Our Story" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative rounded-2xl overflow-hidden shadow-lg",
            style: {
              background: "linear-gradient(135deg, #C0392B 0%, #8B1A1A 30%, #7D5A00 70%, #D4A017 100%)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 px-5 pt-5 pb-3 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display font-black text-3xl md:text-5xl text-white leading-none tracking-tight",
                    style: { textShadow: "0 2px 12px rgba(0,0,0,0.4)" },
                    children: "AssamRoots"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-xs mt-1 font-medium tracking-wide", children: "Authentic Assam, Delivered to Your Door" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-4 mb-5 rounded-xl overflow-hidden bg-black/30", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin" }) }) : hasVideo ? isYouTubeUrl(videoByte.url) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "iframe",
                {
                  src: getYouTubeEmbedUrl(videoByte.url),
                  title: videoByte.title || "AssamRoots Story",
                  className: "w-full aspect-video",
                  allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                  allowFullScreen: true
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "video",
                {
                  src: videoByte.url,
                  autoPlay: true,
                  muted: true,
                  loop: true,
                  playsInline: true,
                  className: "w-full aspect-video object-cover",
                  title: videoByte.title || "AssamRoots Story"
                }
              ) : (
                /* Placeholder when no video set */
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "aspect-video flex flex-col items-center justify-center gap-3 bg-black/20",
                    "data-ocid": "video-byte.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 28, className: "text-white ml-1" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-sm font-semibold", children: "Video coming soon…" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-xs text-center px-4", children: "Our story and the heart behind AssamRoots" })
                    ]
                  }
                )
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute bottom-0 left-0 right-0 h-1",
                  style: {
                    background: "linear-gradient(90deg, #D4A017, #C0392B, #2D6A4F)"
                  }
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function HomePage() {
  const { addItem, isInCart, getQuantity } = useCart();
  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: siteSettings } = useSiteSettings();
  const { data: bestSellers, isLoading: bestSellersLoading } = useBestSellers(8);
  const { data: newArrivals, isLoading: newArrivalsLoading } = useNewArrivals(6);
  const homeCategories = (categories ?? []).slice(0, 8);
  const handleAddToCart = reactExports.useCallback(
    (product) => {
      addItem(product);
      ue.success(`${product.title.split("—")[0].trim()} added to cart`, {
        duration: 3e3,
        position: "bottom-center"
      });
    },
    [addItem]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DealsStrip, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "aria-label": "Featured promotions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeroBannerCarousel,
      {
        tagline: siteSettings == null ? void 0 : siteSettings.heroTagline,
        subtitle: siteSettings == null ? void 0 : siteSettings.heroSubtitle
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorksSection, { steps: siteSettings == null ? void 0 : siteSettings.howitworksSteps }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-label": "Browse categories", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeaderNoSearch, { title: "Shop by Category", to: "/categories" }),
      catsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryTilesSkeleton, {}) : homeCategories.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-4 gap-2 px-4",
          "data-ocid": "category-tiles-grid",
          children: homeCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryTile, { category: cat, compact: true }, cat.id.toString()))
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryTilesSkeleton, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "aria-label": "Bestsellers",
        className: "bg-muted/20 pt-4 pb-2 rounded-2xl mx-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "🔥 Bestsellers", to: "/products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HorizontalProductRow,
            {
              products: bestSellers ?? [],
              isLoading: bestSellersLoading,
              onAddToCart: handleAddToCart,
              isInCart,
              getQuantity
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-label": "New arrivals", className: "pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "✨ New Arrivals", to: "/products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HorizontalProductRow,
        {
          products: newArrivals ?? [],
          isLoading: newArrivalsLoading,
          onAddToCart: handleAddToCart,
          isInCart,
          getQuantity
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PromoBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShopByCategoryGrid, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StoriesHighlights, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VideoByteSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrustBadges, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/products",
        search: { q: void 0, category: void 0 },
        className: "flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-primary/30 bg-primary/5 text-primary font-bold text-sm hover:bg-primary/10 transition-smooth",
        "data-ocid": "view-all-products-cta",
        children: [
          "View All Assamese Products ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
        ]
      }
    ) })
  ] }) });
}
export {
  HomePage as default
};
