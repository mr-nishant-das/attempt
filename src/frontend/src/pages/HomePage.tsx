import { CategoryTile } from "@/components/CategoryTile";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import type { Category, Product } from "@/types";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Flame, ShieldCheck, Truck, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Static data ────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: 1n,
    name: "Assam Tea",
    slug: "tea",
    description: "Premium Tea",
    imageUrl: "",
    subCategories: [],
  },
  {
    id: 2n,
    name: "Spices",
    slug: "spices",
    description: "Assam Spices",
    imageUrl: "",
    subCategories: [],
  },
  {
    id: 3n,
    name: "Handloom",
    slug: "handloom",
    description: "Handloom Weaves",
    imageUrl: "",
    subCategories: [],
  },
  {
    id: 4n,
    name: "Crafts",
    slug: "crafts",
    description: "Bamboo & Cane",
    imageUrl: "",
    subCategories: [],
  },
  {
    id: 5n,
    name: "Food",
    slug: "food",
    description: "Regional Foods",
    imageUrl: "",
    subCategories: [],
  },
  {
    id: 6n,
    name: "Books",
    slug: "books",
    description: "Books & Culture",
    imageUrl: "",
    subCategories: [],
  },
  {
    id: 7n,
    name: "Attire",
    slug: "attire",
    description: "Assamese Attire",
    imageUrl: "",
    subCategories: [],
  },
  {
    id: 8n,
    name: "Kitchen",
    slug: "kitchen",
    description: "Kitchenware",
    imageUrl: "",
    subCategories: [],
  },
];

const HERO_BANNERS = [
  {
    id: 1,
    image: "/assets/generated/banner-tea-harvest.dim_900x400.jpg",
    badge: "NEW HARVEST",
    badgeColor: "bg-primary text-primary-foreground",
    title: "Fresh from Assam's\nTea Gardens",
    subtitle: "Up to 20% off on premium orthodox teas this season",
    cta: "Shop Teas",
    slug: "tea",
  },
  {
    id: 2,
    image: "/assets/generated/banner-handloom.dim_900x400.jpg",
    badge: "HANDLOOM FESTIVAL",
    badgeColor: "bg-secondary text-secondary-foreground",
    title: "Authentic Assamese\nSilk & Weaves",
    subtitle: "Celebrate the art of Mekhela Chador & Muga silk",
    cta: "Explore Handloom",
    slug: "handloom",
  },
  {
    id: 3,
    image: "/assets/generated/banner-spices-kitchen.dim_900x400.jpg",
    badge: "KITCHEN ESSENTIALS",
    badgeColor: "bg-accent text-accent-foreground",
    title: "Authentic Assamese\nKitchen & Spices",
    subtitle: "Clay cookware, Bhut Jolokia & traditional flavours",
    cta: "Shop Now",
    slug: "kitchen",
  },
];

const BESTSELLER_PRODUCTS: Product[] = [
  {
    id: 1n,
    title: "Heritage CTC Assam Tea — 500g",
    description: "Bold, malty CTC tea from the Brahmaputra valley.",
    price: 49900n,
    discountPercent: 10n,
    imageUrls: ["/assets/generated/product-ctc-tea.dim_400x400.jpg"],
    category: 1n,
    subCategory: "CTC",
    rating: 42n,
    reviewCount: 1280n,
    stock: 50n,
    brand: "Heritage Tea Co.",
    tags: ["tea"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 2n,
    title: "Handwoven Mekhela Chador — Silk",
    description: "Traditional Assamese two-piece silk drape.",
    price: 325000n,
    discountPercent: 5n,
    imageUrls: ["/assets/generated/product-mekhela-chador.dim_400x400.jpg"],
    category: 3n,
    subCategory: "Mekhela",
    rating: 47n,
    reviewCount: 312n,
    stock: 8n,
    brand: "Majuli Weavers",
    tags: ["handloom"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 3n,
    title: "Bamboo Cane Basket Set — 3 Pcs",
    description: "Handcrafted baskets from natural Assam bamboo.",
    price: 49900n,
    discountPercent: 0n,
    imageUrls: ["/assets/generated/product-bamboo-basket.dim_400x400.jpg"],
    category: 4n,
    subCategory: "Baskets",
    rating: 44n,
    reviewCount: 89n,
    stock: 23n,
    brand: "Bongaigaon Crafts",
    tags: ["bamboo"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 4n,
    title: "Joha Scented Rice — 1 kg",
    description: "Prized aromatic short-grain rice from Kamrup.",
    price: 18000n,
    discountPercent: 8n,
    imageUrls: ["/assets/generated/product-joha-rice.dim_400x400.jpg"],
    category: 5n,
    subCategory: "Rice",
    rating: 48n,
    reviewCount: 560n,
    stock: 200n,
    brand: "Kamrup Organics",
    tags: ["rice"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 5n,
    title: "Clay Pot Kitchen Utensil Set",
    description: "Traditional earthenware for authentic Assamese cooking.",
    price: 89900n,
    discountPercent: 15n,
    imageUrls: ["/assets/generated/product-clay-pot.dim_400x400.jpg"],
    category: 8n,
    subCategory: "Clay",
    rating: 43n,
    reviewCount: 42n,
    stock: 12n,
    brand: "Hajo Pottery",
    tags: ["clay"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 6n,
    title: "Bhut Jolokia Pickle — 250g",
    description: "Authentic ghost chilli pickle — fiery & tangy.",
    price: 22000n,
    discountPercent: 0n,
    imageUrls: [
      "/assets/generated/product-bhut-jolokia-pickle.dim_400x400.jpg",
    ],
    category: 2n,
    subCategory: "Pickle",
    rating: 46n,
    reviewCount: 720n,
    stock: 75n,
    brand: "Tezpur Spice House",
    tags: ["pickle"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 7n,
    title: "Assam Orthodox Green Tea — 100g",
    description: "First flush green tea with light floral notes.",
    price: 35000n,
    discountPercent: 12n,
    imageUrls: ["/assets/generated/product-green-tea.dim_400x400.jpg"],
    category: 1n,
    subCategory: "Green",
    rating: 45n,
    reviewCount: 234n,
    stock: 60n,
    brand: "Dibrugarh Estates",
    tags: ["tea", "green"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 8n,
    title: "Traditional Gamosa — Handwoven",
    description: "Sacred Assamese cotton towel with red border motifs.",
    price: 24900n,
    discountPercent: 0n,
    imageUrls: ["/assets/generated/product-gamosa.dim_400x400.jpg"],
    category: 3n,
    subCategory: "Gamosa",
    rating: 50n,
    reviewCount: 88n,
    stock: 45n,
    brand: "Sualkuchi Weavers",
    tags: ["handloom"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
];

const NEW_ARRIVAL_PRODUCTS: Product[] = [
  {
    id: 9n,
    title: "Mustard Oil Cold Pressed — 500ml",
    description: "Pure traditional Assamese mustard oil.",
    price: 32000n,
    discountPercent: 5n,
    imageUrls: ["/assets/generated/product-mustard-oil.dim_400x400.jpg"],
    category: 5n,
    subCategory: "Oil",
    rating: 44n,
    reviewCount: 156n,
    stock: 80n,
    brand: "Nagaon Naturals",
    tags: ["oil", "food"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 10n,
    title: "Assam Bhut Jolokia Sauce — 200ml",
    description: "Ghost pepper hot sauce with local spices.",
    price: 18500n,
    discountPercent: 0n,
    imageUrls: [
      "/assets/generated/product-bhut-jolokia-pickle.dim_400x400.jpg",
    ],
    category: 2n,
    subCategory: "Sauce",
    rating: 46n,
    reviewCount: 42n,
    stock: 35n,
    brand: "Tezpur Spice House",
    tags: ["sauce", "spicy"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 11n,
    title: "Bamboo Serving Tray — Large",
    description: "Hand-polished natural bamboo dining tray.",
    price: 67900n,
    discountPercent: 10n,
    imageUrls: ["/assets/generated/product-bamboo-basket.dim_400x400.jpg"],
    category: 8n,
    subCategory: "Tray",
    rating: 41n,
    reviewCount: 29n,
    stock: 18n,
    brand: "Bongaigaon Crafts",
    tags: ["bamboo", "kitchen"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 12n,
    title: "Joha Rice Premium — 5 kg",
    description: "Festival-grade Joha rice from certified farms.",
    price: 82000n,
    discountPercent: 5n,
    imageUrls: ["/assets/generated/product-joha-rice.dim_400x400.jpg"],
    category: 5n,
    subCategory: "Rice",
    rating: 49n,
    reviewCount: 190n,
    stock: 100n,
    brand: "Kamrup Organics",
    tags: ["rice", "organic"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 13n,
    title: "Heritage Assam Tea Gift Box",
    description: "Curated selection of 4 premium Assam teas.",
    price: 149900n,
    discountPercent: 8n,
    imageUrls: ["/assets/generated/product-ctc-tea.dim_400x400.jpg"],
    category: 1n,
    subCategory: "Gift",
    rating: 48n,
    reviewCount: 67n,
    stock: 20n,
    brand: "Heritage Tea Co.",
    tags: ["tea", "gift"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 14n,
    title: "Silk Stole — Muga & Eri Blend",
    description: "Soft handwoven stole with traditional Assamese patterns.",
    price: 185000n,
    discountPercent: 0n,
    imageUrls: ["/assets/generated/product-mekhela-chador.dim_400x400.jpg"],
    category: 3n,
    subCategory: "Stole",
    rating: 46n,
    reviewCount: 53n,
    stock: 12n,
    brand: "Majuli Weavers",
    tags: ["silk", "handloom"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
];

const SHOP_BY_CATEGORY_FEATURED = [
  {
    slug: "tea",
    name: "Assam Tea",
    image: "/assets/generated/category-tea.dim_400x400.jpg",
    tag: "Bestseller",
  },
  {
    slug: "handloom",
    name: "Handloom",
    image: "/assets/generated/category-handloom.dim_400x400.jpg",
    tag: "Trending",
  },
  {
    slug: "spices",
    name: "Spices",
    image: "/assets/generated/category-spices.dim_400x400.jpg",
    tag: "Hot 🌶️",
  },
  {
    slug: "crafts",
    name: "Handicrafts",
    image: "/assets/generated/category-crafts.dim_400x400.jpg",
    tag: "Handmade",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <h2 className="font-display text-base font-bold text-foreground">
        {title}
      </h2>
      <Link
        to={to}
        search={
          { q: undefined, category: undefined } as Record<
            string,
            string | undefined
          >
        }
        className="flex items-center gap-0.5 text-xs text-primary font-semibold hover:underline"
        data-ocid="section-see-all"
      >
        See all <ChevronRight size={13} />
      </Link>
    </div>
  );
}

function SectionHeaderNoSearch({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <h2 className="font-display text-base font-bold text-foreground">
        {title}
      </h2>
      <Link
        to={to}
        className="flex items-center gap-0.5 text-xs text-primary font-semibold hover:underline"
        data-ocid="section-see-all-cats"
      >
        See all <ChevronRight size={13} />
      </Link>
    </div>
  );
}

function ProductRowSkeleton() {
  return (
    <div className="flex gap-3 px-4 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-none w-40">
          <Skeleton className="h-40 w-full rounded-xl mb-2" />
          <Skeleton className="h-3 w-4/5 mb-1" />
          <Skeleton className="h-3 w-2/3 mb-2" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ─── Hero Banner Carousel ────────────────────────────────────────────────────

function HeroBannerCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (idx: number) => {
    setActive(idx);
    startTimer();
  };

  const banner = HERO_BANNERS[active];

  return (
    <div
      className="relative mx-4 rounded-2xl overflow-hidden shadow-md"
      data-ocid="hero-banner-carousel"
    >
      <div className="relative aspect-[16/7] w-full">
        {HERO_BANNERS.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={b.image}
              alt={b.title}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
          </div>
        ))}

        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-center px-5 py-4">
          <Badge
            className={`self-start text-[10px] font-bold px-2 py-0.5 mb-2 border-0 ${banner.badgeColor}`}
          >
            {banner.badge}
          </Badge>
          <h1 className="font-display text-lg font-black text-card leading-snug whitespace-pre-line mb-1">
            {banner.title}
          </h1>
          <p className="text-[11px] text-card/80 mb-3 leading-tight max-w-[55%]">
            {banner.subtitle}
          </p>
          <Link
            to="/categories/$slug"
            params={{ slug: banner.slug }}
            className="self-start bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-smooth"
            data-ocid={`hero-cta-${banner.slug}`}
          >
            {banner.cta}
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
        {HERO_BANNERS.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === active ? "w-5 h-2 bg-primary-foreground" : "w-2 h-2 bg-card/50 hover:bg-card/80"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Deals Strip ─────────────────────────────────────────────────────────────

function DealsStrip() {
  return (
    <div
      className="mx-4 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center gap-2 overflow-hidden"
      data-ocid="deals-strip"
    >
      <Zap size={14} className="text-primary flex-none animate-pulse" />
      <div className="flex gap-6 text-xs font-semibold text-primary overflow-x-auto scrollbar-none">
        <span className="flex-none">🎉 Free delivery above ₹499</span>
        <span className="flex-none text-primary/50">•</span>
        <span className="flex-none">🌿 100% authentic products</span>
        <span className="flex-none text-primary/50">•</span>
        <span className="flex-none">🚀 Ships across India</span>
      </div>
    </div>
  );
}

// ─── Category Tiles Row ───────────────────────────────────────────────────────

function CategoryTilesRow() {
  return (
    <section aria-label="Browse categories">
      <SectionHeaderNoSearch title="Shop by Category" to="/categories" />
      <div
        className="grid grid-cols-4 gap-2 px-4"
        data-ocid="category-tiles-grid"
      >
        {CATEGORIES.map((cat) => (
          <CategoryTile key={cat.id.toString()} category={cat} />
        ))}
      </div>
    </section>
  );
}

// ─── Horizontal Product Row ───────────────────────────────────────────────────

interface ProductRowProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart: (p: Product) => void;
  isInCart: (id: bigint) => boolean;
  getQuantity: (id: bigint) => number;
}

function HorizontalProductRow({
  products,
  isLoading,
  onAddToCart,
  isInCart,
  getQuantity,
}: ProductRowProps) {
  if (isLoading) return <ProductRowSkeleton />;

  return (
    <div
      className="flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-none"
      data-ocid="product-row"
    >
      {products.map((product) => (
        <div key={product.id.toString()} className="flex-none w-40">
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            inCart={isInCart(product.id)}
            cartQty={getQuantity(product.id)}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Promo Banner ─────────────────────────────────────────────────────────────

function PromoBanner() {
  return (
    <div className="mx-4" data-ocid="promo-banner">
      <Link to="/categories/$slug" params={{ slug: "tea" }}>
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-border">
          <img
            src="/assets/generated/promo-tea-collection.dim_900x300.jpg"
            alt="Explore Assam Tea"
            className="w-full object-cover h-36"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/65 via-foreground/25 to-transparent flex items-center px-5">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">
                ☕ Premium Collection
              </p>
              <h3 className="font-display text-base font-black text-card leading-tight mb-2">
                Explore Assam Tea
              </h3>
              <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                Shop Now <ChevronRight size={11} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Shop by Category Grid ────────────────────────────────────────────────────

function ShopByCategoryGrid() {
  return (
    <section aria-label="Shop by category" className="px-4">
      <SectionHeaderNoSearch title="Explore Categories" to="/categories" />
      <div className="grid grid-cols-2 gap-3">
        {SHOP_BY_CATEGORY_FEATURED.map((cat) => (
          <Link
            key={cat.slug}
            to="/categories/$slug"
            params={{ slug: cat.slug }}
            className="group relative rounded-2xl overflow-hidden border border-border shadow-sm aspect-[4/3] hover:shadow-md active:scale-[0.98] transition-smooth"
            data-ocid={`category-grid-${cat.slug}`}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-smooth group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
              <div>
                <p className="font-display text-sm font-bold text-card">
                  {cat.name}
                </p>
                <span className="text-[10px] text-card/70">Explore →</span>
              </div>
              <Badge className="text-[9px] font-bold border-0 bg-primary/80 text-primary-foreground px-1.5 py-0.5">
                {cat.tag}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Trust Badges ─────────────────────────────────────────────────────────────

function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, label: "100% Authentic", sub: "Verified products" },
    { icon: Truck, label: "Pan-India Delivery", sub: "Fast & reliable" },
    { icon: Flame, label: "Fresh Arrivals", sub: "Every week" },
  ];

  return (
    <section className="px-4" aria-label="Why shop with us">
      <div className="grid grid-cols-3 gap-2">
        {badges.map((b) => (
          <div
            key={b.label}
            className="bg-card border border-border rounded-xl py-3 px-2 text-center flex flex-col items-center gap-1"
          >
            <b.icon size={18} className="text-primary" />
            <p className="text-[10px] font-bold text-foreground leading-tight">
              {b.label}
            </p>
            <p className="text-[9px] text-muted-foreground leading-tight">
              {b.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { addItem, isInCart, getQuantity } = useCart();

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product);
      toast.success(`${product.title.split("—")[0].trim()} added to cart`, {
        duration: 3000,
        position: "bottom-center",
      });
    },
    [addItem],
  );

  return (
    <Layout>
      <div className="py-3 space-y-6">
        {/* Deals strip */}
        <DealsStrip />

        {/* Hero banner carousel */}
        <section aria-label="Featured promotions">
          <HeroBannerCarousel />
        </section>

        {/* Category tiles — all 8 visible in 4x2 grid */}
        <CategoryTilesRow />

        {/* Bestsellers — horizontal scroll */}
        <section
          aria-label="Bestsellers"
          className="bg-muted/20 pt-4 pb-2 rounded-2xl mx-2"
        >
          <SectionHeader title="🔥 Bestsellers" to="/products" />
          <HorizontalProductRow
            products={BESTSELLER_PRODUCTS}
            onAddToCart={handleAddToCart}
            isInCart={isInCart}
            getQuantity={getQuantity}
          />
        </section>

        {/* New arrivals — horizontal scroll */}
        <section aria-label="New arrivals" className="pt-1">
          <SectionHeader title="✨ New Arrivals" to="/products" />
          <HorizontalProductRow
            products={NEW_ARRIVAL_PRODUCTS}
            onAddToCart={handleAddToCart}
            isInCart={isInCart}
            getQuantity={getQuantity}
          />
        </section>

        {/* Promo banner */}
        <PromoBanner />

        {/* Shop by category - 2x2 image grid */}
        <ShopByCategoryGrid />

        {/* Trust badges */}
        <TrustBadges />

        {/* CTA to view all products */}
        <div className="px-4 pb-2">
          <Link
            to="/products"
            search={{ q: undefined, category: undefined }}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-primary/30 bg-primary/5 text-primary font-bold text-sm hover:bg-primary/10 transition-smooth"
            data-ocid="view-all-products-cta"
          >
            View All Assamese Products <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
