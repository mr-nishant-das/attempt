import { a as useParams, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-BbgXscAi.js";
import { a as useCart, m as useProduct, L as Layout, H as House, S as ShoppingCart, c as useProductsByCategory } from "./Layout-D5VIdwoN.js";
import { P as ProductCard } from "./ProductCard-DtnkZxjG.js";
import { B as Badge } from "./badge-C-QwoaHS.js";
import { B as Button } from "./button-BlVWhxCp.js";
import { d as discountedPrice, r as ratingToFloat, f as formatPrice } from "./types-Dmw7OeI0.js";
import { C as ChevronRight } from "./chevron-right-Duqqd7JQ.js";
import { C as ChevronLeft } from "./chevron-left-BwQNoTGq.js";
import { P as Package } from "./package-CpMG6Sad.js";
import { C as CircleCheck } from "./circle-check-7z_XzidA.js";
import { M as Minus } from "./minus-DlftvBWF.js";
import { P as Plus } from "./plus-npCZ6K7R.js";
import { Z as Zap } from "./zap-D7amUizV.js";
import { T as Truck } from "./truck-CXXYj72I.js";
import { c as createLucideIcon } from "./createLucideIcon-B6ccG8eC.js";
import { I as Info } from "./info-D61WKYVk.js";
import { S as ShieldCheck } from "./shield-check-BezuT3zB.js";
import { L as Leaf } from "./leaf-Z9iyf1Xy.js";
import { S as Star } from "./star-BDDH8dDi.js";
import "./useActor-AG09Vf65.js";
import "./index-_KOCx7qY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$1);
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
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
const CATEGORY_OPTIONS = {
  "assam-tea": [
    { label: "Pack Size", choices: ["50g", "100g", "250g", "500g", "1kg"] },
    { label: "Tea Type", choices: ["Loose Leaf", "CTC", "Dust", "Teabag"] }
  ],
  "assamese-food": [
    { label: "Pack Size", choices: ["200g", "500g", "1kg"] },
    { label: "Serving Type", choices: ["Ready to Eat", "Cook at Home"] }
  ],
  "spices-herbs": [
    { label: "Pack Size", choices: ["50g", "100g", "250g", "500g"] },
    { label: "Form", choices: ["Whole", "Coarsely Ground", "Fine Powder"] }
  ],
  "medicine-herbs": [
    { label: "Pack Size", choices: ["50g", "100g", "250g"] },
    { label: "Form", choices: ["Dried", "Powder", "Capsule"] }
  ],
  "assamese-attire": [
    { label: "Size", choices: ["XS", "S", "M", "L", "XL", "XXL"] },
    {
      label: "Colour",
      choices: ["Natural White", "Ivory", "Silk Gold", "Deep Red"]
    }
  ],
  "handloom-textiles": [
    { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
    { label: "Style", choices: ["Traditional", "Contemporary"] }
  ],
  "muga-silk": [
    { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
    { label: "Style", choices: ["Traditional", "Contemporary"] }
  ],
  "pat-silk": [
    { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
    { label: "Style", choices: ["Traditional", "Contemporary"] }
  ],
  "eri-silk": [
    { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
    { label: "Style", choices: ["Traditional", "Contemporary"] }
  ],
  "cotton-handloom": [
    { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
    { label: "Style", choices: ["Traditional", "Contemporary"] }
  ],
  handicrafts: [
    { label: "Finish", choices: ["Natural", "Lacquered", "Hand-painted"] },
    { label: "Size", choices: ["Small", "Medium", "Large"] }
  ],
  "art-paintings": [
    { label: "Size", choices: ["A4", "A3", "A2", "Custom"] },
    { label: "Frame", choices: ["Unframed", "Framed"] }
  ],
  "books-literature": [
    { label: "Format", choices: ["Paperback", "Hardcover", "Digital PDF"] },
    { label: "Language", choices: ["Assamese", "English", "Bilingual"] }
  ],
  "chronicles-magazines": [
    { label: "Edition", choices: ["Latest", "Back Issues"] },
    { label: "Format", choices: ["Print", "Digital PDF"] }
  ],
  "musical-instruments": [
    { label: "Material", choices: ["Traditional", "Premium"] },
    { label: "Finish", choices: ["Natural", "Polished"] }
  ],
  "religious-puja": [
    { label: "Size", choices: ["Small", "Medium", "Large"] },
    { label: "Material", choices: ["Brass", "Copper", "Wood"] }
  ],
  "decorative-items": [
    { label: "Size", choices: ["Small", "Medium", "Large"] },
    { label: "Colour", choices: ["Natural", "Painted", "Gold"] }
  ],
  "kitchen-cookware": [
    { label: "Size", choices: ["Small", "Medium", "Large", "Set"] },
    { label: "Material", choices: ["Brass", "Aluminium", "Wood", "Clay"] }
  ],
  "living-room-decor": [
    { label: "Size", choices: ["Small", "Medium", "Large"] },
    { label: "Style", choices: ["Traditional", "Modern"] }
  ]
};
const PRODUCT_HIGHLIGHTS = {
  "assam-tea": [
    "Garden-fresh from Brahmaputra valley estates",
    "FSSAI certified — safe for daily consumption",
    "Rich in natural antioxidants and polyphenols",
    "Sustainably harvested with no artificial additives"
  ],
  "assamese-food": [
    "Traditional family recipes, made in Assam",
    "Vacuum-sealed to retain freshness and aroma",
    "No artificial colours, preservatives, or flavours",
    "Ships hygienically packed across India & internationally"
  ],
  "spices-herbs": [
    "Sourced directly from Assamese farms and forest villages",
    "Sun-dried and naturally processed without chemicals",
    "Rich in essential oils, delivering authentic Assamese aroma",
    "No artificial flavours, fillers, or additives"
  ],
  "medicine-herbs": [
    "100% natural — no synthetic additives",
    "Lab-tested for purity, potency, and microbial safety",
    "Rooted in centuries of traditional Assamese herbal knowledge",
    "Ethically wildcrafted or sustainably cultivated"
  ],
  "assamese-attire": [
    "Handwoven by skilled artisans in Assam's weaving districts",
    "Authentic Assamese motifs — Kalka, Miri, and floral patterns",
    "Pre-washed and colourfast — OEKO-TEX certified fabric",
    "Perfect for Bihu festivals, weddings, and ceremonies"
  ],
  "handloom-textiles": [
    "Certified handloom product from Sualkuchi",
    "Each piece is unique — hand-woven variation is natural",
    "Supports master weavers and multigenerational families",
    "Registered under Handloom Mark Scheme, Govt. of India"
  ],
  handicrafts: [
    "Each piece handcrafted by trained artisans from Assam",
    "Natural raw materials sustainably harvested",
    "No two pieces are identical — artisanal variation is the charm",
    "Supports traditional Assamese craft communities"
  ],
  "kitchen-cookware": [
    "Traditional materials naturally enhance food flavour",
    "Handcrafted using age-old metallurgy techniques",
    "Durable with proper seasoning and care",
    "Free from synthetic coatings — safe for all food"
  ]
};
const HOW_TO_USE = {
  "assam-tea": "Bring fresh water to 95°C. Add 1 teaspoon (2g) per cup. Steep for 3–4 minutes for a golden brew. Add milk and sugar to taste, or enjoy black.",
  "assamese-food": "Store in a cool, dry place away from direct sunlight. For dried items, soak in warm water for 15–20 minutes before cooking. Refrigerate after opening.",
  "spices-herbs": "Use whole spices for tempering in hot oil. For ground powders, add mid-way or at the end of cooking to preserve aroma. Store in an airtight glass container.",
  "medicine-herbs": "Consult a qualified Ayurvedic practitioner before starting any herbal regimen. Standard dosage: 1–2g twice daily with warm water or honey.",
  "assamese-attire": "Hand wash gently in cold water using mild detergent. Do not wring — lay flat to dry in shade. Iron on medium heat on the reverse side.",
  "handloom-textiles": "Hand wash gently in cool water with mild soap. Dry in shade. Iron on medium-low heat on the fabric reverse. Fold neatly and store in a breathable bag.",
  handicrafts: "Dust regularly with a soft, dry cloth. For bamboo and cane items, wipe with a slightly damp cloth and dry immediately.",
  "kitchen-cookware": "Season new brass and bell metal cookware by coating lightly with oil before first use. Wash with mild soap and lukewarm water. Dry immediately after washing."
};
const CONTENTS_LABEL = {
  "assam-tea": "Ingredients",
  "assamese-food": "Ingredients",
  "spices-herbs": "Ingredients",
  "medicine-herbs": "Ingredients",
  "books-literature": "Contents",
  "chronicles-magazines": "Contents",
  handicrafts: "Materials",
  "art-paintings": "Materials",
  "musical-instruments": "Materials",
  "religious-puja": "Materials",
  "decorative-items": "Materials",
  "kitchen-cookware": "Materials",
  "handloom-textiles": "Materials",
  "muga-silk": "Materials",
  "pat-silk": "Materials",
  "eri-silk": "Materials",
  "cotton-handloom": "Materials",
  "assamese-attire": "Materials",
  "living-room-decor": "Materials"
};
const CONTENTS_LIST = {
  "assam-tea": [
    "100% Pure Assam Tea Leaves (Camellia sinensis var. assamica)",
    "No artificial flavours, colours, or preservatives",
    "Packed in food-grade resealable kraft pouch"
  ],
  "assamese-food": [
    "Primary produce sourced from Assam's certified farms",
    "Traditional sun-dried or cold-pressed processing",
    "No synthetic additives — FSSAI compliant"
  ],
  "spices-herbs": [
    "100% pure Assamese spice — no fillers or anti-caking agents",
    "Natural sun-drying process without artificial heat",
    "Packed in resealable airtight pouches"
  ],
  "medicine-herbs": [
    "100% wildcrafted or organically cultivated Assamese herb",
    "No synthetic binders or chemical preservatives",
    "Third-party lab-tested for purity and potency"
  ],
  "assamese-attire": [
    "Primary fabric: Handloom silk / cotton / blended yarn",
    "Natural or vegetable-derived dyes where applicable",
    "Traditional hand-embroidered motifs"
  ],
  "handloom-textiles": [
    "Yarn: Natural silk, cotton, or blended as labelled",
    "Dye: OEKO-TEX compliant, colourfast treatment",
    "Weave: Traditional throw-shuttle handloom, Sualkuchi"
  ],
  handicrafts: [
    "Primary material: Bamboo / Cane / Clay / Bell Metal (as labelled)",
    "Natural or food-safe non-toxic finish",
    "No MDF, plastics, or synthetic composites"
  ],
  "kitchen-cookware": [
    "Primary material: Brass / Bell Metal / Clay / Bamboo (as labelled)",
    "No synthetic non-stick coatings",
    "Includes care guide leaflet"
  ]
};
function StarRow({
  rating,
  reviewCount
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Star,
      {
        size: 15,
        className: i <= full ? "fill-accent text-accent" : half && i === full + 1 ? "fill-accent/50 text-accent" : "fill-muted text-muted-foreground"
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: rating.toFixed(1) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
      "· ",
      reviewCount.toLocaleString("en-IN"),
      " reviews"
    ] })
  ] });
}
function DetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-24 px-4 space-y-4 mt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full rounded-2xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-3/4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-1/2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-2/3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" })
  ] });
}
function OptionSelector({
  label,
  choices,
  selected,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-foreground uppercase tracking-wider", children: [
      label,
      ":",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary normal-case tracking-normal font-semibold", children: selected })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: choices.map((choice) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(choice),
        className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-smooth ${selected === choice ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary/50"}`,
        "data-ocid": `product-option-${label.toLowerCase().replace(/\s+/g, "-")}-${choice.toLowerCase().replace(/\s+/g, "-")}`,
        children: choice
      },
      choice
    )) })
  ] });
}
function QuantityStepper({
  value,
  onChange,
  max
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground uppercase tracking-wider", children: "Quantity:" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-muted/50 rounded-xl border border-border p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(Math.max(1, value - 1)),
          disabled: value <= 1,
          className: "w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-card transition-smooth disabled:opacity-40",
          "aria-label": "Decrease quantity",
          "data-ocid": "product-qty-dec",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 14 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-[2.5rem] text-center text-sm font-bold tabular-nums text-foreground", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(Math.min(max, value + 1)),
          disabled: value >= max,
          className: "w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-card transition-smooth disabled:opacity-40",
          "aria-label": "Increase quantity",
          "data-ocid": "product-qty-inc",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 })
        }
      )
    ] })
  ] });
}
function SectionHeading({
  icon: Icon,
  title
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: "text-primary flex-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: title })
  ] });
}
function RelatedProducts({
  product,
  categorySlug,
  onAddToCart,
  isInCart,
  getQuantity
}) {
  const { data: relatedRaw } = useProductsByCategory(product.category, {
    limit: 20
  });
  const related = (relatedRaw ?? []).filter((p) => p.id !== product.id).slice(0, 6);
  if (related.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-border space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "More from this category" }),
      categorySlug && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/categories/$slug",
          params: { slug: categorySlug },
          className: "text-xs text-primary font-semibold hover:underline",
          children: "View all"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4", children: related.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductCard,
      {
        product: p,
        onAddToCart,
        inCart: isInCart(p.id),
        cartQty: getQuantity(p.id)
      },
      p.id.toString()
    )) })
  ] });
}
function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const { addItem, isInCart, getQuantity, updateQuantity } = useCart();
  const [imgIdx, setImgIdx] = reactExports.useState(0);
  const [qty, setQty] = reactExports.useState(1);
  const [selectedOptions, setSelectedOptions] = reactExports.useState({});
  const { data: product, isLoading } = useProduct(id);
  reactExports.useEffect(() => {
    setImgIdx(0);
    setQty(1);
  }, [id]);
  const categorySlug = product ? inferCategorySlug(product) : "";
  const options = CATEGORY_OPTIONS[categorySlug] ?? [];
  reactExports.useEffect(() => {
    const defaults = {};
    for (const opt of options) {
      defaults[opt.label] = opt.choices[0];
    }
    if (Object.keys(defaults).length > 0) setSelectedOptions(defaults);
  }, [categorySlug]);
  const highlights = PRODUCT_HIGHLIGHTS[categorySlug] ?? [];
  const howToUse = HOW_TO_USE[categorySlug] ?? "";
  const contentsLabel = CONTENTS_LABEL[categorySlug] ?? "What's Inside";
  const contentsList = CONTENTS_LIST[categorySlug] ?? [];
  if (isLoading || !product && isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { hideSearch: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 rounded" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DetailSkeleton, {})
    ] });
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 px-6", "data-ocid": "product-not-found", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-5xl mb-4", children: "🔍" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg", children: "Product not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 mb-4", children: "This product may have been removed or the link is incorrect." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/products",
          search: { q: void 0, category: void 0 },
          className: "text-primary text-sm font-semibold hover:underline",
          children: "Browse all products"
        }
      )
    ] }) });
  }
  const finalPrice = discountedPrice(product.price, product.discountPercent);
  const hasDiscount = product.discountPercent > 0n;
  const rating = ratingToFloat(product.rating);
  const cartQty = getQuantity(product.id);
  const inCart = isInCart(product.id);
  const outOfStock = product.stock <= 0n;
  const lowStock = !outOfStock && product.stock < 10n;
  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { hideSearch: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: "flex items-center gap-1 text-xs text-muted-foreground px-4 py-3 overflow-x-auto scrollbar-none",
        "aria-label": "Breadcrumb",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/home",
              className: "flex items-center gap-1 hover:text-primary transition-colors flex-none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 11 }),
                " Home"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 11, className: "flex-none" }),
          categorySlug && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/categories/$slug",
                params: { slug: categorySlug },
                className: "hover:text-primary transition-colors flex-none capitalize",
                children: categorySlug.replace(/-/g, " ")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 11, className: "flex-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium truncate", children: product.title })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative mx-4 rounded-2xl overflow-hidden bg-muted aspect-square shadow-sm",
        "data-ocid": "product-image-gallery",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.imageUrls[imgIdx] ?? "/assets/images/placeholder.svg",
              alt: product.title,
              className: "w-full h-full object-cover",
              loading: "eager"
            }
          ),
          hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute top-3 left-3 bg-destructive text-destructive-foreground border-0 font-bold text-sm px-2.5 py-1", children: [
            Number(product.discountPercent),
            "% OFF"
          ] }),
          outOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/60 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground text-lg", children: "Out of Stock" }) }),
          product.imageUrls.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setImgIdx((i) => Math.max(0, i - 1)),
                disabled: imgIdx === 0,
                className: "absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center disabled:opacity-30 transition-smooth hover:bg-card",
                "aria-label": "Previous image",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setImgIdx(
                  (i) => Math.min(product.imageUrls.length - 1, i + 1)
                ),
                disabled: imgIdx === product.imageUrls.length - 1,
                className: "absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center disabled:opacity-30 transition-smooth hover:bg-card",
                "aria-label": "Next image",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
              }
            )
          ] })
        ]
      }
    ),
    product.imageUrls.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1.5 mt-3", children: product.imageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setImgIdx(i),
        className: `transition-smooth rounded-full ${i === imgIdx ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-muted-foreground/30"}`,
        "aria-label": `Image ${i + 1}`
      },
      url
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 mt-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest", children: product.brand }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "text-[10px] border-primary/30 text-primary font-semibold",
            children: product.subCategory
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground leading-tight", children: product.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StarRow, { rating, reviewCount: Number(product.reviewCount) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-black text-foreground", children: formatPrice(finalPrice) }),
        hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg text-muted-foreground line-through", children: formatPrice(product.price) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-secondary/20 text-secondary border-secondary/30 font-bold text-xs px-2.5 py-1", children: [
            "Save ",
            formatPrice(product.price - finalPrice)
          ] })
        ] })
      ] }),
      outOfStock ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 text-destructive text-sm font-semibold",
          "data-ocid": "product-out-of-stock",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 15 }),
            " Out of Stock"
          ]
        }
      ) : lowStock ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-amber-600 text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 15 }),
        " Only ",
        Number(product.stock),
        " left — order soon!"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-secondary text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15 }),
        " In Stock"
      ] })
    ] }),
    options.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mx-4 mt-5 bg-muted/30 rounded-2xl p-4 space-y-4 border border-border",
        "data-ocid": "product-options",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Customise Your Order" }),
          options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            OptionSelector,
            {
              label: opt.label,
              choices: opt.choices,
              selected: selectedOptions[opt.label] ?? opt.choices[0],
              onChange: (v) => setSelectedOptions((prev) => ({ ...prev, [opt.label]: v }))
            },
            opt.label
          ))
        ]
      }
    ),
    !outOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mx-4 mt-4 bg-muted/30 rounded-2xl p-4 border border-border",
        "data-ocid": "product-quantity-section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          QuantityStepper,
          {
            value: qty,
            onChange: setQty,
            max: Math.min(10, Number(product.stock))
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 mt-4", children: inCart ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-secondary/10 border border-secondary/30 rounded-2xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18, className: "text-secondary flex-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground flex-1", children: "Added to Cart" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => updateQuantity(product.id, cartQty - 1),
              className: "w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-smooth",
              "aria-label": "Decrease",
              "data-ocid": "product-detail-qty-dec",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold w-6 text-center tabular-nums", children: cartQty }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => updateQuantity(product.id, cartQty + 1),
              className: "w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-smooth",
              "aria-label": "Increase",
              "data-ocid": "product-detail-qty-inc",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cart", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "w-full h-12 border-primary/30 text-primary font-semibold rounded-xl",
          "data-ocid": "product-detail-view-cart",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 16, className: "mr-2" }),
            " View Cart"
          ]
        }
      ) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          disabled: outOfStock,
          onClick: handleAddToCart,
          className: "flex-1 h-12 text-base font-semibold bg-primary text-primary-foreground hover:opacity-90 border-0 gap-2 transition-smooth rounded-xl",
          "data-ocid": "product-detail-add-cart",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 18 }),
            " Add to Cart"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          disabled: outOfStock,
          onClick: () => {
            handleAddToCart();
          },
          className: "flex-1 h-12 text-base font-semibold bg-secondary text-secondary-foreground hover:opacity-90 border-0 gap-2 transition-smooth rounded-xl",
          "data-ocid": "product-detail-buy-now",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 18 }),
            " Buy Now"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-4 mt-4 bg-muted/30 rounded-2xl p-4 border border-border space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Delivery & Returns" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 15, className: "text-primary mt-0.5 flex-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Delivery Estimate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "5–7 days within Assam · 7–10 days elsewhere in India · 15–20 days international" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 15, className: "text-primary mt-0.5 flex-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Cash on Delivery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Available for all valid Assam pincodes" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 15, className: "text-primary mt-0.5 flex-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Free Returns" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Hassle-free returns within 7 days of delivery" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-4 mt-4 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl p-4 border border-border space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { icon: Info, title: "About This Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: product.description })
      ] }),
      highlights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl p-4 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { icon: Sparkles, title: "Key Highlights" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: highlights.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-start gap-2.5 text-sm text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ShieldCheck,
                {
                  size: 14,
                  className: "text-secondary flex-none mt-0.5"
                }
              ),
              h
            ]
          },
          h
        )) })
      ] }),
      contentsList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl p-4 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { icon: Leaf, title: contentsLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: contentsList.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-start gap-2.5 text-sm text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary flex-none mt-2" }),
              item
            ]
          },
          item
        )) })
      ] }),
      howToUse && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl p-4 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { icon: BookOpen, title: "How to Use" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: howToUse })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border border-border overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Product Details" }) }),
        [
          { label: "Brand", value: product.brand },
          { label: "Sub-category", value: product.subCategory },
          {
            label: "Rating",
            value: `${rating.toFixed(1)} / 5 (${Number(product.reviewCount).toLocaleString("en-IN")} reviews)`
          },
          {
            label: "Stock",
            value: outOfStock ? "Out of Stock" : `${Number(product.stock)} units available`
          }
        ].map(({ label, value }, i, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center gap-3 px-4 py-3 ${i !== arr.length - 1 ? "border-b border-border" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wide min-w-[110px]", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: value })
            ]
          },
          label
        ))
      ] }),
      product.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Tags" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: product.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "text-xs border-border capitalize cursor-pointer hover:border-primary/40 hover:text-primary transition-smooth",
            children: t
          },
          t
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        RelatedProducts,
        {
          product,
          categorySlug,
          onAddToCart: addItem,
          isInCart,
          getQuantity
        }
      )
    ] })
  ] }) });
}
function inferCategorySlug(product) {
  const sub = product.subCategory.toLowerCase();
  const teaTerms = [
    "ctc",
    "orthodox",
    "green tea",
    "white tea",
    "flavoured",
    "single estate",
    "chai"
  ];
  if (teaTerms.some((t) => sub.includes(t))) return "assam-tea";
  const foodTerms = [
    "dried",
    "grains",
    "rice",
    "pulses",
    "pickle",
    "oil",
    "ghee",
    "sweets",
    "snacks"
  ];
  if (foodTerms.some((t) => sub.includes(t))) return "assamese-food";
  const spiceTerms = [
    "spice",
    "chilli",
    "pepper",
    "masala",
    "jolokia",
    "herbs"
  ];
  if (spiceTerms.some((t) => sub.includes(t))) return "spices-herbs";
  const attireTerms = [
    "mekhela",
    "chador",
    "dhoti",
    "kurta",
    "gamosa",
    "bihu dress",
    "festive attire",
    "traditional wear"
  ];
  if (attireTerms.some((t) => sub.includes(t))) return "assamese-attire";
  if (sub.includes("muga")) return "muga-silk";
  if (sub.includes("pat silk")) return "pat-silk";
  if (sub.includes("eri")) return "eri-silk";
  if (sub.includes("cotton handloom")) return "cotton-handloom";
  if (sub.includes("handloom") || sub.includes("silk") || sub.includes("weave"))
    return "handloom-textiles";
  if (sub.includes("bamboo") || sub.includes("cane") || sub.includes("craft") || sub.includes("pottery") || sub.includes("bell metal"))
    return "handicrafts";
  if (sub.includes("painting") || sub.includes("art") || sub.includes("canvas"))
    return "art-paintings";
  if (sub.includes("book") || sub.includes("fiction") || sub.includes("poetry") || sub.includes("literature"))
    return "books-literature";
  if (sub.includes("magazine") || sub.includes("chronicle") || sub.includes("journal"))
    return "chronicles-magazines";
  if (sub.includes("dhol") || sub.includes("pepa") || sub.includes("gogona") || sub.includes("instrument") || sub.includes("dotara"))
    return "musical-instruments";
  if (sub.includes("puja") || sub.includes("religious") || sub.includes("brass") || sub.includes("lamp"))
    return "religious-puja";
  if (sub.includes("decor") || sub.includes("wall")) return "decorative-items";
  if (sub.includes("cookware") || sub.includes("utensil") || sub.includes("kitchen") || sub.includes("clay pot"))
    return "kitchen-cookware";
  if (sub.includes("living") || sub.includes("cushion") || sub.includes("mat"))
    return "living-room-decor";
  if (sub.includes("medicine") || sub.includes("herb") || sub.includes("ayurved"))
    return "medicine-herbs";
  return "";
}
export {
  ProductDetailPage as default
};
