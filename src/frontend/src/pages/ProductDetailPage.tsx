import { createActor } from "@/backend";
import type { Product } from "@/backend";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { useProduct, useProductsByCategory } from "@/hooks/useQueries";
import { discountedPrice, formatPrice, ratingToFloat } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Info,
  Leaf,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Product options by category slug ────────────────────────────────────────
const CATEGORY_OPTIONS: Record<string, { label: string; choices: string[] }[]> =
  {
    "assam-tea": [
      { label: "Pack Size", choices: ["50g", "100g", "250g", "500g", "1kg"] },
      { label: "Tea Type", choices: ["Loose Leaf", "CTC", "Dust", "Teabag"] },
    ],
    "assamese-food": [
      { label: "Pack Size", choices: ["200g", "500g", "1kg"] },
      { label: "Serving Type", choices: ["Ready to Eat", "Cook at Home"] },
    ],
    "spices-herbs": [
      { label: "Pack Size", choices: ["50g", "100g", "250g", "500g"] },
      { label: "Form", choices: ["Whole", "Coarsely Ground", "Fine Powder"] },
    ],
    "medicine-herbs": [
      { label: "Pack Size", choices: ["50g", "100g", "250g"] },
      { label: "Form", choices: ["Dried", "Powder", "Capsule"] },
    ],
    "assamese-attire": [
      { label: "Size", choices: ["XS", "S", "M", "L", "XL", "XXL"] },
      {
        label: "Colour",
        choices: ["Natural White", "Ivory", "Silk Gold", "Deep Red"],
      },
    ],
    "handloom-textiles": [
      { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
      { label: "Style", choices: ["Traditional", "Contemporary"] },
    ],
    "muga-silk": [
      { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
      { label: "Style", choices: ["Traditional", "Contemporary"] },
    ],
    "pat-silk": [
      { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
      { label: "Style", choices: ["Traditional", "Contemporary"] },
    ],
    "eri-silk": [
      { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
      { label: "Style", choices: ["Traditional", "Contemporary"] },
    ],
    "cotton-handloom": [
      { label: "Size", choices: ["S", "M", "L", "XL", "XXL", "Custom"] },
      { label: "Style", choices: ["Traditional", "Contemporary"] },
    ],
    handicrafts: [
      { label: "Finish", choices: ["Natural", "Lacquered", "Hand-painted"] },
      { label: "Size", choices: ["Small", "Medium", "Large"] },
    ],
    "art-paintings": [
      { label: "Size", choices: ["A4", "A3", "A2", "Custom"] },
      { label: "Frame", choices: ["Unframed", "Framed"] },
    ],
    "books-literature": [
      { label: "Format", choices: ["Paperback", "Hardcover", "Digital PDF"] },
      { label: "Language", choices: ["Assamese", "English", "Bilingual"] },
    ],
    "chronicles-magazines": [
      { label: "Edition", choices: ["Latest", "Back Issues"] },
      { label: "Format", choices: ["Print", "Digital PDF"] },
    ],
    "musical-instruments": [
      { label: "Material", choices: ["Traditional", "Premium"] },
      { label: "Finish", choices: ["Natural", "Polished"] },
    ],
    "religious-puja": [
      { label: "Size", choices: ["Small", "Medium", "Large"] },
      { label: "Material", choices: ["Brass", "Copper", "Wood"] },
    ],
    "decorative-items": [
      { label: "Size", choices: ["Small", "Medium", "Large"] },
      { label: "Colour", choices: ["Natural", "Painted", "Gold"] },
    ],
    "kitchen-cookware": [
      { label: "Size", choices: ["Small", "Medium", "Large", "Set"] },
      { label: "Material", choices: ["Brass", "Aluminium", "Wood", "Clay"] },
    ],
    "living-room-decor": [
      { label: "Size", choices: ["Small", "Medium", "Large"] },
      { label: "Style", choices: ["Traditional", "Modern"] },
    ],
  };

const PRODUCT_HIGHLIGHTS: Record<string, string[]> = {
  "assam-tea": [
    "Garden-fresh from Brahmaputra valley estates",
    "FSSAI certified — safe for daily consumption",
    "Rich in natural antioxidants and polyphenols",
    "Sustainably harvested with no artificial additives",
  ],
  "assamese-food": [
    "Traditional family recipes, made in Assam",
    "Vacuum-sealed to retain freshness and aroma",
    "No artificial colours, preservatives, or flavours",
    "Ships hygienically packed across India & internationally",
  ],
  "spices-herbs": [
    "Sourced directly from Assamese farms and forest villages",
    "Sun-dried and naturally processed without chemicals",
    "Rich in essential oils, delivering authentic Assamese aroma",
    "No artificial flavours, fillers, or additives",
  ],
  "medicine-herbs": [
    "100% natural — no synthetic additives",
    "Lab-tested for purity, potency, and microbial safety",
    "Rooted in centuries of traditional Assamese herbal knowledge",
    "Ethically wildcrafted or sustainably cultivated",
  ],
  "assamese-attire": [
    "Handwoven by skilled artisans in Assam's weaving districts",
    "Authentic Assamese motifs — Kalka, Miri, and floral patterns",
    "Pre-washed and colourfast — OEKO-TEX certified fabric",
    "Perfect for Bihu festivals, weddings, and ceremonies",
  ],
  "handloom-textiles": [
    "Certified handloom product from Sualkuchi",
    "Each piece is unique — hand-woven variation is natural",
    "Supports master weavers and multigenerational families",
    "Registered under Handloom Mark Scheme, Govt. of India",
  ],
  handicrafts: [
    "Each piece handcrafted by trained artisans from Assam",
    "Natural raw materials sustainably harvested",
    "No two pieces are identical — artisanal variation is the charm",
    "Supports traditional Assamese craft communities",
  ],
  "kitchen-cookware": [
    "Traditional materials naturally enhance food flavour",
    "Handcrafted using age-old metallurgy techniques",
    "Durable with proper seasoning and care",
    "Free from synthetic coatings — safe for all food",
  ],
};

const HOW_TO_USE: Record<string, string> = {
  "assam-tea":
    "Bring fresh water to 95°C. Add 1 teaspoon (2g) per cup. Steep for 3–4 minutes for a golden brew. Add milk and sugar to taste, or enjoy black.",
  "assamese-food":
    "Store in a cool, dry place away from direct sunlight. For dried items, soak in warm water for 15–20 minutes before cooking. Refrigerate after opening.",
  "spices-herbs":
    "Use whole spices for tempering in hot oil. For ground powders, add mid-way or at the end of cooking to preserve aroma. Store in an airtight glass container.",
  "medicine-herbs":
    "Consult a qualified Ayurvedic practitioner before starting any herbal regimen. Standard dosage: 1–2g twice daily with warm water or honey.",
  "assamese-attire":
    "Hand wash gently in cold water using mild detergent. Do not wring — lay flat to dry in shade. Iron on medium heat on the reverse side.",
  "handloom-textiles":
    "Hand wash gently in cool water with mild soap. Dry in shade. Iron on medium-low heat on the fabric reverse. Fold neatly and store in a breathable bag.",
  handicrafts:
    "Dust regularly with a soft, dry cloth. For bamboo and cane items, wipe with a slightly damp cloth and dry immediately.",
  "kitchen-cookware":
    "Season new brass and bell metal cookware by coating lightly with oil before first use. Wash with mild soap and lukewarm water. Dry immediately after washing.",
};

const CONTENTS_LABEL: Record<string, string> = {
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
  "living-room-decor": "Materials",
};

const CONTENTS_LIST: Record<string, string[]> = {
  "assam-tea": [
    "100% Pure Assam Tea Leaves (Camellia sinensis var. assamica)",
    "No artificial flavours, colours, or preservatives",
    "Packed in food-grade resealable kraft pouch",
  ],
  "assamese-food": [
    "Primary produce sourced from Assam's certified farms",
    "Traditional sun-dried or cold-pressed processing",
    "No synthetic additives — FSSAI compliant",
  ],
  "spices-herbs": [
    "100% pure Assamese spice — no fillers or anti-caking agents",
    "Natural sun-drying process without artificial heat",
    "Packed in resealable airtight pouches",
  ],
  "medicine-herbs": [
    "100% wildcrafted or organically cultivated Assamese herb",
    "No synthetic binders or chemical preservatives",
    "Third-party lab-tested for purity and potency",
  ],
  "assamese-attire": [
    "Primary fabric: Handloom silk / cotton / blended yarn",
    "Natural or vegetable-derived dyes where applicable",
    "Traditional hand-embroidered motifs",
  ],
  "handloom-textiles": [
    "Yarn: Natural silk, cotton, or blended as labelled",
    "Dye: OEKO-TEX compliant, colourfast treatment",
    "Weave: Traditional throw-shuttle handloom, Sualkuchi",
  ],
  handicrafts: [
    "Primary material: Bamboo / Cane / Clay / Bell Metal (as labelled)",
    "Natural or food-safe non-toxic finish",
    "No MDF, plastics, or synthetic composites",
  ],
  "kitchen-cookware": [
    "Primary material: Brass / Bell Metal / Clay / Bamboo (as labelled)",
    "No synthetic non-stick coatings",
    "Includes care guide leaflet",
  ],
};

// ─── Star rating ──────────────────────────────────────────────────────────────
function StarRow({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={15}
            className={
              i <= full
                ? "fill-accent text-accent"
                : half && i === full + 1
                  ? "fill-accent/50 text-accent"
                  : "fill-muted text-muted-foreground"
            }
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-muted-foreground">
        · {reviewCount.toLocaleString("en-IN")} reviews
      </span>
    </div>
  );
}

// ─── Detail skeleton ──────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="pb-24 px-4 space-y-4 mt-4">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

// ─── Option Selector ──────────────────────────────────────────────────────────
function OptionSelector({
  label,
  choices,
  selected,
  onChange,
}: {
  label: string;
  choices: string[];
  selected: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-foreground uppercase tracking-wider">
        {label}:{" "}
        <span className="text-primary normal-case tracking-normal font-semibold">
          {selected}
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {choices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onChange(choice)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-smooth ${
              selected === choice
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-foreground hover:border-primary/50"
            }`}
            data-ocid={`product-option-${label.toLowerCase().replace(/\s+/g, "-")}-${choice.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Quantity Stepper ─────────────────────────────────────────────────────────
function QuantityStepper({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (n: number) => void;
  max: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <p className="text-xs font-bold text-foreground uppercase tracking-wider">
        Quantity:
      </p>
      <div className="flex items-center gap-1 bg-muted/50 rounded-xl border border-border p-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-card transition-smooth disabled:opacity-40"
          aria-label="Decrease quantity"
          data-ocid="product-qty-dec"
        >
          <Minus size={14} />
        </button>
        <span className="min-w-[2.5rem] text-center text-sm font-bold tabular-nums text-foreground">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground hover:bg-card transition-smooth disabled:opacity-40"
          aria-label="Increase quantity"
          data-ocid="product-qty-inc"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} className="text-primary flex-none" />
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
    </div>
  );
}

// ─── Related Products inner component ────────────────────────────────────────
function RelatedProducts({
  product,
  categorySlug,
  onAddToCart,
  isInCart,
  getQuantity,
}: {
  product: Product;
  categorySlug: string;
  onAddToCart: (p: Product) => void;
  isInCart: (id: bigint) => boolean;
  getQuantity: (id: bigint) => number;
}) {
  const { data: relatedRaw } = useProductsByCategory(product.category, {
    limit: 20,
  });
  const related = (relatedRaw ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 6);

  if (related.length === 0) return null;

  return (
    <div className="pt-2 border-t border-border space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          More from this category
        </h2>
        {categorySlug && (
          <Link
            to="/categories/$slug"
            params={{ slug: categorySlug }}
            className="text-xs text-primary font-semibold hover:underline"
          >
            View all
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {related.map((p) => (
          <ProductCard
            key={p.id.toString()}
            product={p}
            onAddToCart={onAddToCart}
            inCart={isInCart(p.id)}
            cartQty={getQuantity(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const { addItem, isInCart, getQuantity, updateQuantity } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [vendorName, setVendorName] = useState<string | null>(null);

  const { data: product, isLoading } = useProduct(id);
  const { actor, isFetching: actorFetching } = useActor(createActor);

  // Fetch vendor attribution
  useEffect(() => {
    if (!actor || actorFetching || !id) return;
    actor
      .getVendorForProduct(id)
      .then((result) => {
        if (result) setVendorName(result.businessName);
      })
      .catch(() => {});
  }, [actor, actorFetching, id]);

  // Reset image index when id changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset
  useEffect(() => {
    setImgIdx(0);
    setQty(1);
  }, [id]);

  // We don't have a category object directly — but we can determine slug from category id
  // by using product.subCategory context or a minimal fetch (avoid extra round-trip here)
  // Instead, we'll use the CATEGORY_OPTIONS lookup by matching slug patterns
  // The product.subCategory is a string like "CTC Tea", "Orthodox Tea" etc.
  // We need to guess the category slug from the product to get options/highlights

  // Build options from category slug derived from available data
  // We'll store a "guessed" slug or look it up as we know the category ids are backend-driven
  // For a clean implementation we just try to use the subCategory or fetch category separately
  // Since we can't cheaply get slug from category id here, we pass product.category (bigint)
  // and let RelatedProducts handle that part; for options/highlights we use a best-effort lookup

  // Infer category slug from product's subCategory string for options/highlights lookup.
  // This is a best-effort inference since we only have category id, not slug, in the product.
  const categorySlug = product ? inferCategorySlug(product) : "";

  const options = CATEGORY_OPTIONS[categorySlug] ?? [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset when options change
  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const opt of options) {
      defaults[opt.label] = opt.choices[0];
    }
    if (Object.keys(defaults).length > 0) setSelectedOptions(defaults);
  }, [categorySlug]);

  const highlights = PRODUCT_HIGHLIGHTS[categorySlug] ?? [];
  const howToUse = HOW_TO_USE[categorySlug] ?? "";
  const contentsLabel = CONTENTS_LABEL[categorySlug] ?? "What's Inside";
  const contentsList = CONTENTS_LIST[categorySlug] ?? [];

  if (isLoading || (!product && isLoading)) {
    return (
      <Layout hideSearch>
        <div className="px-4 py-3">
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <DetailSkeleton />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-16 px-6" data-ocid="product-not-found">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-display font-bold text-foreground text-lg">
            Product not found
          </p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            This product may have been removed or the link is incorrect.
          </p>
          <Link
            to="/products"
            search={{ q: undefined, category: undefined }}
            className="text-primary text-sm font-semibold hover:underline"
          >
            Browse all products
          </Link>
        </div>
      </Layout>
    );
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

  return (
    <Layout hideSearch>
      <div className="pb-32">
        {/* ── Breadcrumb ── */}
        <nav
          className="flex items-center gap-1 text-xs text-muted-foreground px-4 py-3 overflow-x-auto scrollbar-none"
          aria-label="Breadcrumb"
        >
          <Link
            to="/home"
            className="flex items-center gap-1 hover:text-primary transition-colors flex-none"
          >
            <Home size={11} /> Home
          </Link>
          <ChevronRight size={11} className="flex-none" />
          {categorySlug && (
            <>
              <Link
                to="/categories/$slug"
                params={{ slug: categorySlug }}
                className="hover:text-primary transition-colors flex-none capitalize"
              >
                {categorySlug.replace(/-/g, " ")}
              </Link>
              <ChevronRight size={11} className="flex-none" />
            </>
          )}
          <span className="text-foreground font-medium truncate">
            {product.title}
          </span>
        </nav>

        {/* ── Image Gallery ── */}
        <div
          className="relative mx-4 rounded-2xl overflow-hidden bg-muted aspect-square shadow-sm"
          data-ocid="product-image-gallery"
        >
          <img
            src={product.imageUrls[imgIdx] ?? "/assets/images/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground border-0 font-bold text-sm px-2.5 py-1">
              {Number(product.discountPercent)}% OFF
            </Badge>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="font-display font-bold text-foreground text-lg">
                Out of Stock
              </span>
            </div>
          )}
          {product.imageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                disabled={imgIdx === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center disabled:opacity-30 transition-smooth hover:bg-card"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setImgIdx((i) =>
                    Math.min(product.imageUrls.length - 1, i + 1),
                  )
                }
                disabled={imgIdx === product.imageUrls.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center disabled:opacity-30 transition-smooth hover:bg-card"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Image dots */}
        {product.imageUrls.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {product.imageUrls.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setImgIdx(i)}
                className={`transition-smooth rounded-full ${i === imgIdx ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-muted-foreground/30"}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* ── Product Hero Info ── */}
        <div className="px-4 mt-5 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {product.brand}
            </p>
            <span className="text-muted-foreground/40">·</span>
            <Badge
              variant="outline"
              className="text-[10px] border-primary/30 text-primary font-semibold"
            >
              {product.subCategory}
            </Badge>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
            {product.title}
          </h1>

          <StarRow rating={rating} reviewCount={Number(product.reviewCount)} />

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-black text-foreground">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-bold text-xs px-2.5 py-1">
                  Save {formatPrice(product.price - finalPrice)}
                </Badge>
              </>
            )}
          </div>

          {vendorName && (
            <p className="text-sm text-muted-foreground">
              Supplied by{" "}
              <span className="font-medium text-foreground">{vendorName}</span>
            </p>
          )}

          {outOfStock ? (
            <div
              className="flex items-center gap-2 text-destructive text-sm font-semibold"
              data-ocid="product-out-of-stock"
            >
              <Package size={15} /> Out of Stock
            </div>
          ) : lowStock ? (
            <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold">
              <Package size={15} /> Only {Number(product.stock)} left — order
              soon!
            </div>
          ) : (
            <div className="flex items-center gap-2 text-secondary text-sm font-semibold">
              <CheckCircle2 size={15} /> In Stock
            </div>
          )}
        </div>

        {/* ── Customise ── */}
        {options.length > 0 && (
          <div
            className="mx-4 mt-5 bg-muted/30 rounded-2xl p-4 space-y-4 border border-border"
            data-ocid="product-options"
          >
            <h2 className="text-base font-semibold text-foreground">
              Customise Your Order
            </h2>
            {options.map((opt) => (
              <OptionSelector
                key={opt.label}
                label={opt.label}
                choices={opt.choices}
                selected={selectedOptions[opt.label] ?? opt.choices[0]}
                onChange={(v) =>
                  setSelectedOptions((prev) => ({ ...prev, [opt.label]: v }))
                }
              />
            ))}
          </div>
        )}

        {/* ── Quantity ── */}
        {!outOfStock && (
          <div
            className="mx-4 mt-4 bg-muted/30 rounded-2xl p-4 border border-border"
            data-ocid="product-quantity-section"
          >
            <QuantityStepper
              value={qty}
              onChange={setQty}
              max={Math.min(10, Number(product.stock))}
            />
          </div>
        )}

        {/* ── CTA Buttons ── */}
        <div className="px-4 mt-4">
          {inCart ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/30 rounded-2xl p-4">
                <CheckCircle2 size={18} className="text-secondary flex-none" />
                <span className="text-sm font-semibold text-foreground flex-1">
                  Added to Cart
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, cartQty - 1)}
                    className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-smooth"
                    aria-label="Decrease"
                    data-ocid="product-detail-qty-dec"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-6 text-center tabular-nums">
                    {cartQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, cartQty + 1)}
                    className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center text-foreground hover:bg-muted transition-smooth"
                    aria-label="Increase"
                    data-ocid="product-detail-qty-inc"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <Link to="/cart">
                <Button
                  variant="outline"
                  className="w-full h-12 border-primary/30 text-primary font-semibold rounded-xl"
                  data-ocid="product-detail-view-cart"
                >
                  <ShoppingCart size={16} className="mr-2" /> View Cart
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                disabled={outOfStock}
                onClick={handleAddToCart}
                className="flex-1 h-12 text-base font-semibold bg-primary text-primary-foreground hover:opacity-90 border-0 gap-2 transition-smooth rounded-xl"
                data-ocid="product-detail-add-cart"
              >
                <ShoppingCart size={18} /> Add to Cart
              </Button>
              <Button
                disabled={outOfStock}
                onClick={() => {
                  handleAddToCart();
                }}
                className="flex-1 h-12 text-base font-semibold bg-secondary text-secondary-foreground hover:opacity-90 border-0 gap-2 transition-smooth rounded-xl"
                data-ocid="product-detail-buy-now"
              >
                <Zap size={18} /> Buy Now
              </Button>
            </div>
          )}
        </div>

        {/* ── Delivery & Returns ── */}
        <div className="mx-4 mt-4 bg-muted/30 rounded-2xl p-4 border border-border space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            Delivery & Returns
          </h2>
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <Truck size={15} className="text-primary mt-0.5 flex-none" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Delivery Estimate
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  5–7 days within Assam · 7–10 days elsewhere in India · 15–20
                  days international
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package size={15} className="text-primary mt-0.5 flex-none" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Cash on Delivery
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Available for all valid Assam pincodes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw size={15} className="text-primary mt-0.5 flex-none" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Free Returns
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hassle-free returns within 7 days of delivery
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/refund-policy"
            className="text-xs text-primary font-medium underline hover:text-primary/80 transition-colors"
            data-ocid="product-detail.refund_policy_link"
          >
            View Return &amp; Refund Policy
          </Link>
        </div>

        {/* ── About This Product ── */}
        <div className="mx-4 mt-4 space-y-5">
          <div className="bg-card rounded-2xl p-4 border border-border space-y-4">
            <SectionHeading icon={Info} title="About This Product" />
            <p className="text-sm text-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {highlights.length > 0 && (
            <div className="bg-card rounded-2xl p-4 border border-border">
              <SectionHeading icon={Sparkles} title="Key Highlights" />
              <ul className="space-y-2.5">
                {highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <ShieldCheck
                      size={14}
                      className="text-secondary flex-none mt-0.5"
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {contentsList.length > 0 && (
            <div className="bg-card rounded-2xl p-4 border border-border">
              <SectionHeading icon={Leaf} title={contentsLabel} />
              <ul className="space-y-2">
                {contentsList.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-none mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {howToUse && (
            <div className="bg-card rounded-2xl p-4 border border-border">
              <SectionHeading icon={BookOpen} title="How to Use" />
              <p className="text-sm text-foreground leading-relaxed">
                {howToUse}
              </p>
            </div>
          )}

          {/* Product Details Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">
                Product Details
              </h2>
            </div>
            {[
              { label: "Brand", value: product.brand },
              { label: "Sub-category", value: product.subCategory },
              {
                label: "Rating",
                value: `${rating.toFixed(1)} / 5 (${Number(product.reviewCount).toLocaleString("en-IN")} reviews)`,
              },
              {
                label: "Stock",
                value: outOfStock
                  ? "Out of Stock"
                  : `${Number(product.stock)} units available`,
              },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                className={`flex items-center gap-3 px-4 py-3 ${i !== arr.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide min-w-[110px]">
                  {label}
                </span>
                <span className="text-sm text-foreground">{value}</span>
              </div>
            ))}
          </div>

          {product.tags.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-foreground">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="text-xs border-border capitalize cursor-pointer hover:border-primary/40 hover:text-primary transition-smooth"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          <RelatedProducts
            product={product}
            categorySlug={categorySlug}
            onAddToCart={addItem}
            isInCart={isInCart}
            getQuantity={getQuantity}
          />
        </div>
      </div>
    </Layout>
  );
}

// ─── Infer category slug from product data ────────────────────────────────────
// Maps common subCategory strings to their parent category slug.
// This is a best-effort inference since we don't have a getCategoryById call here.
function inferCategorySlug(product: Product): string {
  const sub = product.subCategory.toLowerCase();
  const teaTerms = [
    "ctc",
    "orthodox",
    "green tea",
    "white tea",
    "flavoured",
    "single estate",
    "chai",
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
    "snacks",
  ];
  if (foodTerms.some((t) => sub.includes(t))) return "assamese-food";

  const spiceTerms = [
    "spice",
    "chilli",
    "pepper",
    "masala",
    "jolokia",
    "herbs",
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
    "traditional wear",
  ];
  if (attireTerms.some((t) => sub.includes(t))) return "assamese-attire";

  if (sub.includes("muga")) return "muga-silk";
  if (sub.includes("pat silk")) return "pat-silk";
  if (sub.includes("eri")) return "eri-silk";
  if (sub.includes("cotton handloom")) return "cotton-handloom";
  if (sub.includes("handloom") || sub.includes("silk") || sub.includes("weave"))
    return "handloom-textiles";

  if (
    sub.includes("bamboo") ||
    sub.includes("cane") ||
    sub.includes("craft") ||
    sub.includes("pottery") ||
    sub.includes("bell metal")
  )
    return "handicrafts";
  if (sub.includes("painting") || sub.includes("art") || sub.includes("canvas"))
    return "art-paintings";
  if (
    sub.includes("book") ||
    sub.includes("fiction") ||
    sub.includes("poetry") ||
    sub.includes("literature")
  )
    return "books-literature";
  if (
    sub.includes("magazine") ||
    sub.includes("chronicle") ||
    sub.includes("journal")
  )
    return "chronicles-magazines";
  if (
    sub.includes("dhol") ||
    sub.includes("pepa") ||
    sub.includes("gogona") ||
    sub.includes("instrument") ||
    sub.includes("dotara")
  )
    return "musical-instruments";
  if (
    sub.includes("puja") ||
    sub.includes("religious") ||
    sub.includes("brass") ||
    sub.includes("lamp")
  )
    return "religious-puja";
  if (sub.includes("decor") || sub.includes("wall")) return "decorative-items";
  if (
    sub.includes("cookware") ||
    sub.includes("utensil") ||
    sub.includes("kitchen") ||
    sub.includes("clay pot")
  )
    return "kitchen-cookware";
  if (sub.includes("living") || sub.includes("cushion") || sub.includes("mat"))
    return "living-room-decor";
  if (
    sub.includes("medicine") ||
    sub.includes("herb") ||
    sub.includes("ayurved")
  )
    return "medicine-herbs";

  return "";
}
