import { j as jsxRuntimeExports, L as Link } from "./index-CstiQ4sz.js";
import { B as Badge } from "./badge-COIfXMhJ.js";
import { B as Button } from "./button-T7X4xHPX.js";
import { e as useFooterSettings } from "./useQueries-CA65lisC.js";
import { M as MapPin } from "./map-pin-U0yN2Gop.js";
import { S as ShoppingBag } from "./shopping-bag-D9TtHJ4I.js";
import { c as createLucideIcon } from "./createLucideIcon-ByrRp2U0.js";
import { A as ArrowRight } from "./arrow-right-C2C2K9N6.js";
import { C as ChevronRight } from "./chevron-right-C49853R9.js";
import { S as ShieldCheck } from "./shield-check-CLlROwmg.js";
import { T as Truck } from "./truck-kLCYE6aP.js";
import { L as Leaf } from "./leaf-jf1_lp7m.js";
import { S as Star } from "./star-185lLld2.js";
import "./index-DbvNitIR.js";
import "./backend-Dxpf4-N4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "rib7q0"
    }
  ],
  [
    "path",
    {
      d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "1ymkrd"
    }
  ]
];
const Quote = createLucideIcon("quote", __iconNode);
const CATEGORIES = [
  {
    slug: "tea",
    name: "Assam Tea",
    subtitle: "Premium Tea",
    image: "/assets/generated/cat-tea.dim_200x200.jpg",
    emoji: "🍵"
  },
  {
    slug: "food",
    name: "Food",
    subtitle: "Regional Foods",
    image: "/assets/generated/cat-food.dim_200x200.jpg",
    emoji: "🍲"
  },
  {
    slug: "handloom",
    name: "Handloom",
    subtitle: "Silk & Weaves",
    image: "/assets/generated/cat-handloom.dim_200x200.jpg",
    emoji: "🧵"
  },
  {
    slug: "crafts",
    name: "Handicrafts",
    subtitle: "Bamboo & Cane",
    image: "/assets/generated/cat-crafts.dim_200x200.jpg",
    emoji: "🪣"
  },
  {
    slug: "books",
    name: "Books",
    subtitle: "Books & Culture",
    image: "/assets/generated/cat-books.dim_200x200.jpg",
    emoji: "📚"
  },
  {
    slug: "attire",
    name: "Attire",
    subtitle: "Assamese Attire",
    image: "/assets/generated/cat-attire.dim_200x200.jpg",
    emoji: "👘"
  },
  {
    slug: "spices",
    name: "Spices",
    subtitle: "Assam Spices",
    image: "/assets/generated/cat-spices.dim_200x200.jpg",
    emoji: "🌶️"
  },
  {
    slug: "kitchen",
    name: "Kitchen",
    subtitle: "Kitchenware",
    image: "/assets/generated/cat-kitchen.dim_200x200.jpg",
    emoji: "🍳"
  }
];
const TRUST_CARDS = [
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 22 }),
    title: "Authentic Products",
    desc: "Directly sourced from Assamese artisans and local producers",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 22 }),
    title: "Secure Checkout",
    desc: "100% safe payments with end-to-end encryption",
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 22 }),
    title: "Fast Delivery",
    desc: "Pan-India delivery within 3–7 business days",
    color: "text-accent",
    bg: "bg-accent/20"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { size: 22 }),
    title: "100% Assamese",
    desc: "Every product certified to have authentic Assamese origin",
    color: "text-secondary",
    bg: "bg-secondary/10"
  }
];
const FEATURED_PRODUCTS = [
  {
    id: "1",
    title: "Heritage CTC Assam Tea – 500g",
    price: "₹499",
    originalPrice: "₹649",
    discount: "23% OFF",
    rating: 4.2,
    reviews: 1840,
    image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80",
    badge: "Bestseller"
  },
  {
    id: "2",
    title: "Handwoven Mekhela Chador – Silk Saree",
    price: "₹3,250",
    originalPrice: "₹4,200",
    discount: "23% OFF",
    rating: 4.5,
    reviews: 627,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
    badge: "Handcrafted"
  },
  {
    id: "3",
    title: "Bamboo Cane Basket Set – Traditional",
    price: "₹899",
    originalPrice: "₹1,199",
    discount: "25% OFF",
    rating: 4.3,
    reviews: 415,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    badge: "Artisan"
  },
  {
    id: "4",
    title: "Pure Assam Black Tea – First Flush",
    price: "₹749",
    originalPrice: "₹999",
    discount: "25% OFF",
    rating: 4.6,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
    badge: "Premium"
  }
];
const TESTIMONIALS = [
  {
    name: "Priya Sarma",
    location: "Bangalore",
    text: "Finally a platform that ships genuine Assam tea! The CTC blend I ordered tasted exactly like back home. Will order again for sure.",
    stars: 5,
    avatar: "PS"
  },
  {
    name: "Rahul Bora",
    location: "Delhi",
    text: "Gifted my mother a Mekhela Chador from AssamRoots for Bihu — she was in tears. The fabric quality is exceptional and delivery was super fast.",
    stars: 5,
    avatar: "RB"
  },
  {
    name: "Ananya Das",
    location: "London, UK",
    text: "Living abroad, I missed authentic Assamese flavors. AssamRoots ships internationally and the spices arrived fresh and perfectly packed.",
    stars: 5,
    avatar: "AD"
  }
];
function StarRating({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      size: 11,
      className: i <= Math.floor(rating) ? "fill-accent text-accent" : "fill-muted text-muted-foreground"
    },
    i
  )) });
}
function SectionHeader({
  label,
  title,
  action,
  actionHref
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary uppercase tracking-wider mb-0.5", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-black text-foreground leading-tight", children: title })
    ] }),
    action && actionHref && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: actionHref,
        className: "flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline",
        "data-ocid": "section-view-all",
        children: [
          action,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 })
        ]
      }
    )
  ] });
}
function LandingPage() {
  const { data: footerData } = useFooterSettings();
  const tagline = (footerData == null ? void 0 : footerData.tagline) || "Bringing Assam to the World";
  const copyrightText = (footerData == null ? void 0 : footerData.copyright) || `© ${(/* @__PURE__ */ new Date()).getFullYear()} AssamRoots. All rights reserved.`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "header",
      {
        className: "sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm",
        "data-ocid": "landing-header",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/logo.png",
              alt: "AssamRoots",
              className: "h-10 w-auto object-contain"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-xs font-semibold",
                "data-ocid": "landing-login-btn",
                children: "Sign In"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "btn-primary border-0 text-xs",
                "data-ocid": "landing-shop-btn",
                children: "Shop Now"
              }
            ) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative overflow-hidden bg-card",
        "data-ocid": "hero-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-56 sm:h-72 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: "/assets/generated/hero-assam-products.dim_1200x500.jpg",
                alt: "Authentic Assamese products",
                className: "w-full h-full object-cover object-center",
                loading: "eager"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col justify-center px-5 sm:px-8 max-w-2xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12, className: "text-primary-foreground/80" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary-foreground/80 font-semibold tracking-wide uppercase", children: "Straight from Assam" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl sm:text-4xl font-black text-primary-foreground leading-tight mb-2", children: [
                "Discover the",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "Heart of Assam" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary-foreground/85 mb-4 max-w-xs leading-relaxed", children: "Authentic tea, handloom, crafts & more — curated from local artisans & producers." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "btn-primary border-0 px-5 py-2.5 text-sm font-bold gap-1.5 h-auto",
                    "data-ocid": "hero-browse-cta",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 15 }),
                      "Browse Products"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/categories", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "px-4 py-2.5 text-sm font-semibold h-auto border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10",
                    "data-ocid": "hero-categories-cta",
                    children: "View Categories"
                  }
                ) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto flex items-center justify-around text-primary-foreground", children: [
            { value: "500+", label: "Products" },
            { value: "50+", label: "Artisans" },
            { value: "Pan-India", label: "Delivery" },
            { value: "100%", label: "Authentic" }
          ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black leading-none", children: stat.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium opacity-80 mt-0.5", children: stat.label })
          ] }, stat.label)) }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background px-4 pt-6 pb-4",
        "data-ocid": "categories-section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              label: "Shop by Category",
              title: "What are you looking for?",
              action: "All Categories",
              actionHref: "/categories"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2.5", children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/categories/$slug",
              params: { slug: cat.slug },
              "data-ocid": "landing-category-tile",
              className: "group flex flex-col items-center gap-1.5 rounded-xl p-2 bg-muted hover:bg-muted/60 active:scale-95 transition-smooth border border-border hover:border-primary/30",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg overflow-hidden bg-accent/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: cat.image,
                    alt: cat.name,
                    className: "w-full h-full object-cover",
                    loading: "lazy",
                    onError: (e) => {
                      var _a;
                      e.target.style.display = "none";
                      (_a = e.target.parentElement) == null ? void 0 : _a.insertAdjacentHTML(
                        "beforeend",
                        `<span class="text-2xl">${cat.emoji}</span>`
                      );
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-foreground text-center uppercase tracking-wide leading-tight", children: cat.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground text-center leading-tight hidden sm:block", children: cat.subtitle })
              ]
            },
            cat.slug
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/30 border-y border-border px-4 py-6",
        "data-ocid": "trust-section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { label: "Why Choose Us", title: "Why AssamRoots?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: TRUST_CARDS.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card rounded-xl p-4 border border-border flex flex-col gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-9 h-9 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`,
                    children: card.icon
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-foreground leading-tight", children: card.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: card.desc })
              ]
            },
            card.title
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background px-4 py-6",
        "data-ocid": "featured-products-section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionHeader,
            {
              label: "Editor's Pick",
              title: "Featured Products",
              action: "View All",
              actionHref: "/products"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide", children: FEATURED_PRODUCTS.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/products",
              "data-ocid": "landing-product-card",
              className: "group flex-none w-40 snap-start",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-product flex flex-col overflow-hidden h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-muted aspect-square overflow-hidden", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: product.image,
                      alt: product.title,
                      className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-1.5 left-1.5 bg-destructive text-destructive-foreground text-[9px] font-bold px-1 py-0.5 border-0", children: product.discount }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-1.5 right-1.5 bg-secondary text-secondary-foreground text-[9px] font-bold px-1 py-0.5 border-0", children: product.badge })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground line-clamp-2 leading-tight", children: product.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: product.rating }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                      "(",
                      product.reviews.toLocaleString(),
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-foreground", children: product.price }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground line-through", children: product.originalPrice })
                  ] })
                ] })
              ] })
            },
            product.id
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/30 border-t border-border px-4 py-6",
        "data-ocid": "testimonials-section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { label: "Customer Love", title: "What People Say" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide", children: TESTIMONIALS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex-none w-72 snap-start bg-card rounded-xl border border-border p-4 flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Quote,
                  {
                    size: 18,
                    className: "text-primary/40 fill-primary/10 flex-shrink-0"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground leading-relaxed flex-1", children: [
                  '"',
                  t.text,
                  '"'
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1 border-t border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary-foreground", children: t.avatar }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground truncate", children: t.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: t.stars }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: t.location })
                    ] })
                  ] })
                ] })
              ]
            },
            t.name
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-secondary px-4 py-8",
        "data-ocid": "cta-banner-section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto text-center flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16, className: "text-secondary-foreground/80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-secondary-foreground/80 uppercase tracking-widest", children: "Join AssamRoots Today" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-black text-secondary-foreground leading-tight max-w-xs", children: "Bringing Assam to Your Doorstep" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-secondary-foreground/80 max-w-xs leading-relaxed", children: "Shop 500+ authentic Assamese products with fast pan-India delivery. Sign up free and get exclusive access to new arrivals and artisan collections." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "bg-primary-foreground text-foreground font-bold px-6 py-2.5 text-sm h-auto hover:bg-primary-foreground/90 transition-smooth",
                "data-ocid": "cta-signup-btn",
                children: "Create Account"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/products", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "border-secondary-foreground/40 text-secondary-foreground px-5 py-2.5 text-sm h-auto font-semibold hover:bg-secondary-foreground/10",
                "data-ocid": "cta-browse-btn",
                children: [
                  "Browse All ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 13, className: "ml-1" })
                ]
              }
            ) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border px-4 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/home", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/logo.png",
              alt: "AssamRoots",
              className: "h-8 w-auto object-contain"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-muted-foreground italic", children: tagline })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: [
          { label: "About", href: "/about" },
          { label: "Products", href: "/products" },
          { label: "Categories", href: "/categories" },
          { label: "Reviews", href: "/reviews" }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: item.href,
            className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
            children: item.label
          },
          item.label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center mt-3", children: copyrightText })
    ] }) })
  ] });
}
export {
  LandingPage as default
};
