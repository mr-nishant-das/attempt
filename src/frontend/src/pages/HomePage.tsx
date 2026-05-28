import type { Product } from "@/backend";
import { CategoryTile } from "@/components/CategoryTile";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import {
  useBestSellers,
  useCategories,
  useFeaturedBlocks,
  useHeroBanners,
  useNewArrivals,
  useSiteSettings,
  useVideoByte,
} from "@/hooks/useQueries";
import type { FeaturedBlock, HeroBanner } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Flame,
  Play,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Static fallback banners ──────────────────────────────────────────────────

const FALLBACK_BANNERS: HeroBanner[] = [
  {
    id: 1n,
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
    title: "Fresh from Assam's Tea Gardens",
    subtitle: "Up to 20% off on premium orthodox teas this season",
    ctaText: "Shop Teas",
    ctaSlug: "assam-tea",
    order: 1n,
    isActive: true,
  },
  {
    id: 2n,
    imageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80",
    title: "Authentic Assamese Silk & Weaves",
    subtitle: "Celebrate the art of Mekhela Chador & Muga silk",
    ctaText: "Explore Handloom",
    ctaSlug: "handloom-textiles",
    order: 2n,
    isActive: true,
  },
  {
    id: 3n,
    imageUrl:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=80",
    title: "Authentic Assamese Kitchen & Spices",
    subtitle: "Clay cookware, Bhut Jolokia & traditional flavours",
    ctaText: "Shop Now",
    ctaSlug: "kitchen-cookware",
    order: 3n,
    isActive: true,
  },
];

const SHOP_BY_CATEGORY_FEATURED = [
  {
    slug: "assam-tea",
    name: "Assam Tea",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    tag: "Bestseller",
  },
  {
    slug: "handloom-textiles",
    name: "Handloom",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
    tag: "Trending",
  },
  {
    slug: "spices-herbs",
    name: "Spices",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    tag: "Hot 🌶️",
  },
  {
    slug: "handicrafts",
    name: "Handicrafts",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
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

function CategoryTilesSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2 px-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <Skeleton className="h-2.5 w-10" />
        </div>
      ))}
    </div>
  );
}

// ─── How It Works Section ────────────────────────────────────────────────────

const DEFAULT_HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Browse & Discover",
    description:
      "Explore 110+ authentic Assamese products — from Muga silk to premium tea.",
  },
  {
    icon: ShoppingCart,
    title: "Add to Cart",
    description:
      "Pick your favourites, choose quantity and options, and checkout securely.",
  },
  {
    icon: Truck,
    title: "Delivered to You",
    description:
      "Fast pan-India delivery brings Assam to your doorstep, wherever you are.",
  },
];

function HowItWorksSection({
  steps,
}: { steps?: { title: string; description: string }[] | null }) {
  const items = steps && steps.length === 3 ? steps : DEFAULT_HOW_IT_WORKS;
  const icons = [Search, ShoppingCart, Truck];
  return (
    <section
      aria-label="How it works"
      className="px-4"
      data-ocid="how-it-works.section"
    >
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-display text-base font-bold text-foreground">
          How It Works
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((step, i) => {
          const Icon = icons[i] ?? Search;
          return (
            <div
              key={step.title}
              className="flex flex-col items-center text-center bg-card border border-border rounded-2xl px-2 py-4 gap-2 shadow-sm"
              data-ocid={`how-it-works.step.${i + 1}`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                <Icon size={18} className="text-primary" />
              </div>
              <p className="text-[11px] font-bold text-foreground leading-snug">
                {step.title}
              </p>
              <p className="text-[9px] text-muted-foreground leading-relaxed line-clamp-3">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Hero Banner Carousel ────────────────────────────────────────────────────

function HeroBannerCarousel({
  tagline,
  subtitle,
}: { tagline?: string | null; subtitle?: string | null }) {
  const { data: fetchedBanners, isLoading } = useHeroBanners();
  const banners =
    fetchedBanners && fetchedBanners.length > 0
      ? fetchedBanners
      : FALLBACK_BANNERS;

  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback((count: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, 4000);
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      setActive(0);
      startTimer(banners.length);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length, startTimer]);

  const goTo = (idx: number) => {
    setActive(idx);
    startTimer(banners.length);
  };

  if (isLoading) {
    return (
      <div className="mx-4 rounded-2xl overflow-hidden">
        <Skeleton className="w-full aspect-[16/7] rounded-2xl" />
      </div>
    );
  }

  const banner = banners[active] ?? banners[0];
  if (!banner) return null;

  return (
    <div
      className="relative mx-4 rounded-2xl overflow-hidden shadow-md"
      data-ocid="hero-banner-carousel"
    >
      {/* App tagline strip above carousel */}
      {tagline && (
        <div className="relative z-20 bg-primary/95 px-4 py-1.5 text-center">
          <p className="text-[11px] font-bold text-primary-foreground tracking-wide">
            {tagline}
          </p>
          {subtitle && (
            <p className="text-[9px] text-primary-foreground/80 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="relative aspect-[16/7] w-full">
        {banners.map((b, i) => (
          <div
            key={b.id.toString()}
            className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={b.imageUrl}
              alt={b.title}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col justify-center px-5 py-4">
          <h1 className="font-display text-lg font-black text-card leading-snug whitespace-pre-line mb-1">
            {banner.title}
          </h1>
          <p className="text-[11px] text-card/80 mb-3 leading-tight max-w-[55%]">
            {banner.subtitle}
          </p>
          <Link
            to="/categories/$slug"
            params={{ slug: banner.ctaSlug }}
            className="self-start bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full hover:opacity-90 active:scale-95 transition-smooth"
            data-ocid={`hero-cta-${banner.ctaSlug}`}
          >
            {banner.ctaText}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
        {banners.map((b, i) => (
          <button
            key={b.id.toString()}
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
  if (products.length === 0)
    return (
      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
        No products yet — check back soon!
      </div>
    );
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
      <Link to="/categories/$slug" params={{ slug: "assam-tea" }}>
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-border">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80"
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

// ─── Featured Block Modal ─────────────────────────────────────────────────────

function FeaturedBlockModal({
  block,
  onClose,
}: {
  block: FeaturedBlock;
  onClose: () => void;
}) {
  // Trap focus & close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center w-full h-full m-0 max-w-none max-h-none bg-transparent p-0 border-0"
      data-ocid="featured-block.dialog"
      aria-label={block.title}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      {/* Modal panel */}
      <div className="relative z-10 bg-card w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl">
        {/* Close button */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-foreground line-clamp-1">
            {block.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Close"
            data-ocid="featured-block.close_button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Content images grid */}
          {block.contentImages && block.contentImages.length > 0 && (
            <div
              className={`grid gap-2 ${block.contentImages.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
            >
              {block.contentImages.map((imgUrl, idx) => (
                <img
                  key={imgUrl || idx.toString()}
                  src={imgUrl}
                  alt={`${block.title} ${idx + 1}`}
                  className="w-full rounded-xl object-cover aspect-video"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {/* Rich HTML content */}
          {block.content && (
            <div
              className="prose prose-sm max-w-none text-foreground [&_h1]:font-display [&_h2]:font-display [&_h3]:font-display [&_a]:text-primary [&_img]:rounded-xl [&_img]:w-full"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-controlled HTML content
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}

// ─── Featured Blocks Row Skeleton ─────────────────────────────────────────────

function FeaturedBlocksSkeleton() {
  return (
    <div className="flex gap-3 px-4 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-none w-36">
          <Skeleton className="h-24 w-full rounded-xl mb-2" />
          <Skeleton className="h-3 w-4/5 mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

// ─── Stories & Highlights Section ────────────────────────────────────────────

function StoriesHighlights() {
  const { data: blocks, isLoading } = useFeaturedBlocks();
  const [activeBlock, setActiveBlock] = useState<FeaturedBlock | null>(null);

  if (isLoading) {
    return (
      <section aria-label="Stories and highlights" className="pt-1">
        <div className="flex items-center px-4 mb-3">
          <h2 className="font-display text-base font-bold text-foreground">
            📖 Stories &amp; Highlights
          </h2>
        </div>
        <FeaturedBlocksSkeleton />
      </section>
    );
  }

  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      <section
        aria-label="Stories and highlights"
        className="pt-1"
        data-ocid="stories-highlights.section"
      >
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="font-display text-base font-bold text-foreground">
            📖 Stories &amp; Highlights
          </h2>
        </div>
        <div
          className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-none"
          data-ocid="stories-highlights.list"
        >
          {blocks.map((block, idx) => (
            <button
              type="button"
              key={block.id.toString()}
              onClick={() => setActiveBlock(block)}
              className="flex-none w-36 text-left group active:scale-[0.97] transition-smooth"
              data-ocid={`stories-highlights.item.${idx + 1}`}
            >
              <div className="relative rounded-xl overflow-hidden border border-border shadow-sm aspect-[3/2] mb-2 group-hover:shadow-md transition-shadow">
                {block.thumbnailUrl ? (
                  <img
                    src={block.thumbnailUrl}
                    alt={block.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-2xl">
                    📖
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-card/80 flex items-center justify-center shadow">
                  <ChevronRight size={11} className="text-foreground" />
                </div>
              </div>
              <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 px-0.5">
                {block.title}
              </p>
            </button>
          ))}
        </div>
      </section>

      {activeBlock && (
        <FeaturedBlockModal
          block={activeBlock}
          onClose={() => setActiveBlock(null)}
        />
      )}
    </>
  );
}

// ─── Video Byte Section ───────────────────────────────────────────────────────

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

function getYouTubeEmbedUrl(url: string): string {
  // Handle youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch)
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortMatch[1]}`;
  // Handle youtube.com/watch?v=VIDEO_ID
  const longMatch = url.match(/[?&]v=([^?&]+)/);
  if (longMatch)
    return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${longMatch[1]}`;
  return url;
}

function VideoByteSection() {
  const { data: videoByte, isLoading } = useVideoByte();
  const hasVideo = !isLoading && videoByte?.enabled && videoByte.url;

  return (
    <section
      aria-label="Our Story video"
      className="px-4"
      data-ocid="video-byte.section"
    >
      {/* Section heading */}
      <div className="flex items-center gap-2 mb-3 px-0">
        <h2 className="font-display text-base font-bold text-foreground">
          🎬 Our Story
        </h2>
      </div>

      {/* Video container with diagonal Assamese gradient */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, #C0392B 0%, #8B1A1A 30%, #7D5A00 70%, #D4A017 100%)",
        }}
      >
        {/* AssamRoots branding overlay at top */}
        <div className="relative z-10 px-5 pt-5 pb-3 flex items-center gap-2">
          <div className="flex-1">
            <p
              className="font-display font-black text-3xl md:text-5xl text-white leading-none tracking-tight"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
            >
              AssamRoots
            </p>
            <p className="text-white/70 text-xs mt-1 font-medium tracking-wide">
              Authentic Assam, Delivered to Your Door
            </p>
          </div>
        </div>

        {/* Video or placeholder */}
        <div className="relative mx-4 mb-5 rounded-xl overflow-hidden bg-black/30">
          {isLoading ? (
            <div className="aspect-video flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            </div>
          ) : hasVideo ? (
            isYouTubeUrl(videoByte!.url) ? (
              <iframe
                src={getYouTubeEmbedUrl(videoByte!.url)}
                title={videoByte!.title || "AssamRoots Story"}
                className="w-full aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoByte!.url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
                title={videoByte!.title || "AssamRoots Story"}
              />
            )
          ) : (
            /* Placeholder when no video set */
            <div
              className="aspect-video flex flex-col items-center justify-center gap-3 bg-black/20"
              data-ocid="video-byte.empty_state"
            >
              <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <Play size={28} className="text-white ml-1" />
              </div>
              <p className="text-white/80 text-sm font-semibold">
                Video coming soon…
              </p>
              <p className="text-white/50 text-xs text-center px-4">
                Our story and the heart behind AssamRoots
              </p>
            </div>
          )}
        </div>

        {/* Decorative bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, #D4A017, #C0392B, #2D6A4F)",
          }}
        />
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { addItem, isInCart, getQuantity } = useCart();

  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: siteSettings } = useSiteSettings();
  const { data: bestSellers, isLoading: bestSellersLoading } =
    useBestSellers(8);
  const { data: newArrivals, isLoading: newArrivalsLoading } =
    useNewArrivals(6);

  // First 8 categories for the tile grid
  const homeCategories = (categories ?? []).slice(0, 8);

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
        <DealsStrip />

        <section aria-label="Featured promotions">
          <HeroBannerCarousel
            tagline={siteSettings?.heroTagline}
            subtitle={siteSettings?.heroSubtitle}
          />
        </section>

        {/* How It Works */}
        <HowItWorksSection steps={siteSettings?.howitworksSteps} />

        {/* Category tiles */}
        <section aria-label="Browse categories">
          <SectionHeaderNoSearch title="Shop by Category" to="/categories" />
          {catsLoading ? (
            <CategoryTilesSkeleton />
          ) : homeCategories.length > 0 ? (
            <div
              className="grid grid-cols-4 gap-2 px-4"
              data-ocid="category-tiles-grid"
            >
              {homeCategories.map((cat) => (
                <CategoryTile key={cat.id.toString()} category={cat} compact />
              ))}
            </div>
          ) : (
            <CategoryTilesSkeleton />
          )}
        </section>

        <section
          aria-label="Bestsellers"
          className="bg-muted/20 pt-4 pb-2 rounded-2xl mx-2"
        >
          <SectionHeader title="🔥 Bestsellers" to="/products" />
          <HorizontalProductRow
            products={bestSellers ?? []}
            isLoading={bestSellersLoading}
            onAddToCart={handleAddToCart}
            isInCart={isInCart}
            getQuantity={getQuantity}
          />
        </section>

        <section aria-label="New arrivals" className="pt-1">
          <SectionHeader title="✨ New Arrivals" to="/products" />
          <HorizontalProductRow
            products={newArrivals ?? []}
            isLoading={newArrivalsLoading}
            onAddToCart={handleAddToCart}
            isInCart={isInCart}
            getQuantity={getQuantity}
          />
        </section>

        <PromoBanner />
        <ShopByCategoryGrid />

        {/* Stories & Highlights — admin-managed featured content blocks */}
        <StoriesHighlights />

        {/* Video Byte — Our Story section */}
        <VideoByteSection />

        <TrustBadges />

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
