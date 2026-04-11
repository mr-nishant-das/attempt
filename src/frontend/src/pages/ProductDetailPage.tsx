import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { discountedPrice, formatPrice, ratingToFloat } from "@/types";
import type { Product } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Full product catalogue ──────────────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
  {
    id: 1n,
    title: "Heritage CTC Assam Tea — 500g",
    description:
      "Bold, malty CTC tea from the Brahmaputra valley gardens. Perfect for a strong morning brew with milk. Sourced directly from OCIA-certified gardens in Upper Assam. Each pack is freshly rolled and dried using traditional methods that preserve maximum flavour and aroma.",
    price: 49900n,
    discountPercent: 10n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 1n,
    subCategory: "CTC",
    rating: 42n,
    reviewCount: 1280n,
    stock: 50n,
    brand: "Heritage Tea Co.",
    tags: ["tea", "ctc", "breakfast", "organic"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 2n,
    title: "Handwoven Mekhela Chador — Silk Saree",
    description:
      "Traditional Assamese two-piece silk drape with muga thread. Each piece is handwoven by master weavers in Sualkuchi — the silk city of Assam. The fabric features intricate motifs inspired by Assam's flora and fauna. Suitable for festivals, weddings, and formal occasions.",
    price: 325000n,
    discountPercent: 5n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 3n,
    subCategory: "Mekhela",
    rating: 47n,
    reviewCount: 312n,
    stock: 8n,
    brand: "Majuli Weavers",
    tags: ["handloom", "silk", "mekhela", "traditional"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 3n,
    title: "Bamboo Cane Basket Set — 3 Pieces",
    description:
      "Handcrafted storage baskets made from natural Assam bamboo. Eco-friendly, durable, and beautifully made by artisans in Bongaigaon. Each set includes three nesting baskets in different sizes, perfect for storage, gifting, or home décor.",
    price: 49900n,
    discountPercent: 0n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 4n,
    subCategory: "Baskets",
    rating: 44n,
    reviewCount: 89n,
    stock: 23n,
    brand: "Bongaigaon Crafts",
    tags: ["bamboo", "craft", "eco", "handmade"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 4n,
    title: "Joha Scented Rice — 1kg",
    description:
      "Prized aromatic short-grain rice from Kamrup district. Known for its distinctive fragrance and soft texture. GI-tagged product of Assam. Joha rice has been cultivated in the Brahmaputra plains for centuries and is considered a delicacy for special occasions.",
    price: 18000n,
    discountPercent: 8n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 5n,
    subCategory: "Rice",
    rating: 48n,
    reviewCount: 560n,
    stock: 200n,
    brand: "Kamrup Organics",
    tags: ["rice", "organic", "gi-tagged", "fragrant"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 5n,
    title: "Clay Pot Kitchen Utensil Set",
    description:
      "Traditional earthenware set for authentic Assamese cooking. Includes a cooking pot, storage jar, and serving bowl crafted by potters in Hajo. Clay cooking enhances food flavour naturally and retains minerals.",
    price: 89900n,
    discountPercent: 15n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 8n,
    subCategory: "Clay",
    rating: 43n,
    reviewCount: 42n,
    stock: 12n,
    brand: "Hajo Pottery",
    tags: ["clay", "kitchen", "traditional", "earthenware"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 6n,
    title: "Assam Bhut Jolokia Pickle — 250g",
    description:
      "Authentic ghost chilli pickle — fiery, tangy, and addictive. Made with the world-famous Bhut Jolokia grown in Tezpur, Assam. Handcrafted using a traditional recipe passed down through generations.",
    price: 22000n,
    discountPercent: 0n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 2n,
    subCategory: "Pickle",
    rating: 46n,
    reviewCount: 720n,
    stock: 75n,
    brand: "Tezpur Spice House",
    tags: ["pickle", "spicy", "bhut-jolokia", "authentic"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 7n,
    title: "Orthodox Green Tea Tin — 100g",
    description:
      "Premium green tea from Darrang district gardens. Carefully handpicked and processed to retain natural antioxidants. The golden-green leaves brew to a delicate, grassy liquor with subtle floral notes.",
    price: 38000n,
    discountPercent: 12n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 1n,
    subCategory: "Green",
    rating: 45n,
    reviewCount: 234n,
    stock: 35n,
    brand: "Darrang Gardens",
    tags: ["tea", "green", "orthodox", "antioxidant"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 8n,
    title: "Gamosa — Traditional Cotton Towel",
    description:
      "The iconic red-bordered cotton gamosa, a symbol of Assamese identity and respect. Handwoven in Sualkuchi. Presented as a symbol of honour and blessing, the gamosa is essential for every Assamese festival and ceremony.",
    price: 12000n,
    discountPercent: 0n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 3n,
    subCategory: "Gamosa",
    rating: 49n,
    reviewCount: 1500n,
    stock: 100n,
    brand: "Sualkuchi Textiles",
    tags: ["gamosa", "cotton", "traditional", "cultural"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 9n,
    title: "Assam Silk Muga Stole",
    description:
      "Golden muga silk stole, handwoven by skilled artisans in Sualkuchi. Muga silk, known for its natural golden sheen, is exclusive to Assam and highly prized worldwide.",
    price: 185000n,
    discountPercent: 8n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 3n,
    subCategory: "Muga",
    rating: 46n,
    reviewCount: 178n,
    stock: 15n,
    brand: "Sualkuchi Weavers",
    tags: ["silk", "muga", "stole", "handwoven"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 10n,
    title: "Bhut Jolokia Hot Sauce — 100ml",
    description:
      "Premium ghost pepper hot sauce made with fresh Bhut Jolokia from Tezpur. A small drop goes a long way in curries, marinades, or as a condiment.",
    price: 29900n,
    discountPercent: 5n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 2n,
    subCategory: "Sauce",
    rating: 44n,
    reviewCount: 320n,
    stock: 60n,
    brand: "Tezpur Spice House",
    tags: ["spicy", "sauce", "bhut-jolokia"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 11n,
    title: "Assamese Literature Collection — 5 Books",
    description:
      "Curated set of five classic Assamese novels including works by Laxminath Bezbaroa and Homen Borgohain. Ideal for anyone looking to connect with Assamese culture and literary heritage.",
    price: 75000n,
    discountPercent: 10n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 6n,
    subCategory: "Fiction",
    rating: 47n,
    reviewCount: 95n,
    stock: 40n,
    brand: "Purvoday Press",
    tags: ["books", "literature", "assamese", "fiction"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 12n,
    title: "Brass Bell Metal Utensil Set",
    description:
      "Traditional kah (bell metal) utensils from Sarthebari, the bell metal crafts hub of Assam. Includes plates, bowls, and a serving spoon. Bell metal is believed to have health benefits and is used in Assamese religious and daily ceremonies.",
    price: 219000n,
    discountPercent: 0n,
    imageUrls: ["/assets/images/placeholder.svg"],
    category: 8n,
    subCategory: "Bell Metal",
    rating: 48n,
    reviewCount: 63n,
    stock: 9n,
    brand: "Sarthebari Crafts",
    tags: ["kitchen", "brass", "bell-metal", "traditional"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
];

const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(
  ALL_PRODUCTS.map((p) => [p.id.toString(), p]),
);

const CATEGORY_SLUGS: Record<number, string> = {
  1: "tea",
  2: "spices",
  3: "handloom",
  4: "crafts",
  5: "food",
  6: "books",
  7: "attire",
  8: "kitchen",
};

const CATEGORY_NAMES: Record<number, string> = {
  1: "Tea",
  2: "Spices",
  3: "Handloom",
  4: "Crafts",
  5: "Food",
  6: "Books",
  7: "Attire",
  8: "Kitchen",
};

// ─── Star rating component ───────────────────────────────────────────────────
function StarRow({
  rating,
  reviewCount,
}: { rating: number; reviewCount: number }) {
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

// ─── Product detail skeleton ─────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="pb-24">
      <Skeleton className="aspect-square w-full" />
      <div className="px-4 mt-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const { addItem, isInCart, getQuantity, updateQuantity } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const product = PRODUCTS_BY_ID[id];
  const catId = product ? Number(product.category) : 0;
  const catSlug = CATEGORY_SLUGS[catId] ?? "products";
  const catName = CATEGORY_NAMES[catId] ?? "Products";

  // Related products: same category, excluding current
  const related = ALL_PRODUCTS.filter(
    (p) => p.category === product?.category && p.id !== product?.id,
  ).slice(0, 4);

  // biome-ignore lint/correctness/useExhaustiveDependencies: id is a route param, intentional reset trigger
  useEffect(() => {
    setIsLoading(true);
    setImgIdx(0);
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, [id]);

  if (!product && !isLoading) {
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

  if (isLoading || !product) {
    return (
      <Layout hideSearch>
        <div className="px-4 py-3">
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <DetailSkeleton />
      </Layout>
    );
  }

  const finalPrice = discountedPrice(product.price, product.discountPercent);
  const hasDiscount = product.discountPercent > 0n;
  const rating = ratingToFloat(product.rating);
  const qty = getQuantity(product.id);
  const inCart = isInCart(product.id);
  const outOfStock = product.stock <= 0n;
  const lowStock = !outOfStock && product.stock < 10n;

  return (
    <Layout hideSearch>
      <div className="pb-24">
        {/* Breadcrumb */}
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
          <Link
            to="/categories/$slug"
            params={{ slug: catSlug }}
            className="hover:text-primary transition-colors flex-none"
          >
            {catName}
          </Link>
          <ChevronRight size={11} className="flex-none" />
          <span className="text-foreground font-medium truncate">
            {product.title}
          </span>
        </nav>

        {/* Image gallery */}
        <div className="relative mx-4 rounded-2xl overflow-hidden bg-muted aspect-square">
          <img
            src={product.imageUrls[imgIdx] ?? "/assets/images/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground border-0 font-bold text-sm">
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

          {/* Gallery nav arrows */}
          {product.imageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                disabled={imgIdx === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center disabled:opacity-30 transition-smooth hover:bg-card"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center disabled:opacity-30 transition-smooth hover:bg-card"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail dots */}
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

        {/* Product details */}
        <div className="px-4 mt-4 space-y-4">
          {/* Brand */}
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {product.brand}
          </p>

          {/* Title */}
          <h1 className="font-display text-xl font-bold text-foreground leading-tight">
            {product.title}
          </h1>

          {/* Rating */}
          <StarRow rating={rating} reviewCount={Number(product.reviewCount)} />

          {/* Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-black text-foreground">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-bold text-xs">
                  You save {formatPrice(product.price - finalPrice)}
                </Badge>
              </>
            )}
          </div>

          {/* Stock status */}
          {outOfStock ? (
            <div className="flex items-center gap-2 text-destructive text-sm font-semibold">
              <Package size={15} /> Out of Stock
            </div>
          ) : lowStock ? (
            <div className="flex items-center gap-2 text-destructive text-sm font-semibold">
              <Package size={15} /> Only {Number(product.stock)} left in stock —
              order soon!
            </div>
          ) : (
            <div className="flex items-center gap-2 text-secondary text-sm font-semibold">
              <CheckCircle2 size={15} /> In Stock
            </div>
          )}

          {/* Delivery promise */}
          <div className="flex items-start gap-3 bg-muted rounded-xl p-3">
            <Truck size={16} className="text-primary mt-0.5 flex-none" />
            <div>
              <p className="text-xs font-bold text-foreground">
                Free delivery on orders above ₹499
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Estimated delivery: 3–7 business days
              </p>
            </div>
          </div>

          {/* Add to cart / quantity stepper */}
          {inCart ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/30 rounded-xl p-4">
                <CheckCircle2 size={18} className="text-secondary flex-none" />
                <span className="text-sm font-semibold text-foreground flex-1">
                  Added to Cart
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(product.id, qty - 1)}
                    className="h-8 w-8 p-0 text-base font-bold border-border"
                    aria-label="Decrease quantity"
                    data-ocid="product-detail-qty-dec"
                  >
                    −
                  </Button>
                  <span className="text-sm font-bold w-6 text-center tabular-nums">
                    {qty}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(product.id, qty + 1)}
                    className="h-8 w-8 p-0 text-base font-bold border-border"
                    aria-label="Increase quantity"
                    data-ocid="product-detail-qty-inc"
                  >
                    +
                  </Button>
                </div>
              </div>
              <Link to="/cart">
                <Button
                  variant="outline"
                  className="w-full h-12 border-primary/30 text-primary font-semibold"
                  data-ocid="product-detail-view-cart"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  View Cart
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                disabled={outOfStock}
                onClick={() => addItem(product)}
                className="flex-1 h-12 text-base font-semibold bg-primary text-primary-foreground hover:opacity-90 border-0 gap-2 transition-smooth"
                data-ocid="product-detail-add-cart"
              >
                <ShoppingCart size={18} />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                disabled={outOfStock}
                onClick={() => {
                  addItem(product);
                }}
                className="flex-1 h-12 text-base font-semibold bg-secondary text-secondary-foreground hover:opacity-90 border-0 gap-2 transition-smooth"
                data-ocid="product-detail-buy-now"
              >
                <Zap size={18} />
                Buy Now
              </Button>
            </div>
          )}

          {/* Description */}
          <div className="pt-2 border-t border-border">
            <h2 className="font-display font-bold text-sm text-foreground uppercase tracking-wide mb-2">
              Description
            </h2>
            <p className="text-sm text-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-sm text-foreground uppercase tracking-wide mb-2">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="text-xs border-border capitalize"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related products */}
          {related.length > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-sm text-foreground uppercase tracking-wide">
                  More in {catName}
                </h2>
                <Link
                  to="/categories/$slug"
                  params={{ slug: catSlug }}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {related.map((p) => (
                  <ProductCard
                    key={p.id.toString()}
                    product={p}
                    onAddToCart={addItem}
                    inCart={isInCart(p.id)}
                    cartQty={getQuantity(p.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
