import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFooterSettings } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CheckCircle,
  ChevronRight,
  Leaf,
  MapPin,
  Quote,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

// ─── Static data ────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    slug: "tea",
    name: "Assam Tea",
    subtitle: "Premium Tea",
    image: "/assets/generated/cat-tea.dim_200x200.jpg",
    emoji: "🍵",
  },
  {
    slug: "food",
    name: "Food",
    subtitle: "Regional Foods",
    image: "/assets/generated/cat-food.dim_200x200.jpg",
    emoji: "🍲",
  },
  {
    slug: "handloom",
    name: "Handloom",
    subtitle: "Silk & Weaves",
    image: "/assets/generated/cat-handloom.dim_200x200.jpg",
    emoji: "🧵",
  },
  {
    slug: "crafts",
    name: "Handicrafts",
    subtitle: "Bamboo & Cane",
    image: "/assets/generated/cat-crafts.dim_200x200.jpg",
    emoji: "🪣",
  },
  {
    slug: "books",
    name: "Books",
    subtitle: "Books & Culture",
    image: "/assets/generated/cat-books.dim_200x200.jpg",
    emoji: "📚",
  },
  {
    slug: "attire",
    name: "Attire",
    subtitle: "Assamese Attire",
    image: "/assets/generated/cat-attire.dim_200x200.jpg",
    emoji: "👘",
  },
  {
    slug: "spices",
    name: "Spices",
    subtitle: "Assam Spices",
    image: "/assets/generated/cat-spices.dim_200x200.jpg",
    emoji: "🌶️",
  },
  {
    slug: "kitchen",
    name: "Kitchen",
    subtitle: "Kitchenware",
    image: "/assets/generated/cat-kitchen.dim_200x200.jpg",
    emoji: "🍳",
  },
];

const TRUST_CARDS = [
  {
    icon: <Award size={22} />,
    title: "Authentic Products",
    desc: "Directly sourced from Assamese artisans and local producers",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Secure Checkout",
    desc: "100% safe payments with end-to-end encryption",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: <Truck size={22} />,
    title: "Fast Delivery",
    desc: "Pan-India delivery within 3–7 business days",
    color: "text-accent",
    bg: "bg-accent/20",
  },
  {
    icon: <Leaf size={22} />,
    title: "100% Assamese",
    desc: "Every product certified to have authentic Assamese origin",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
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
    image:
      "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80",
    badge: "Bestseller",
  },
  {
    id: "2",
    title: "Handwoven Mekhela Chador – Silk Saree",
    price: "₹3,250",
    originalPrice: "₹4,200",
    discount: "23% OFF",
    rating: 4.5,
    reviews: 627,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
    badge: "Handcrafted",
  },
  {
    id: "3",
    title: "Bamboo Cane Basket Set – Traditional",
    price: "₹899",
    originalPrice: "₹1,199",
    discount: "25% OFF",
    rating: 4.3,
    reviews: 415,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    badge: "Artisan",
  },
  {
    id: "4",
    title: "Pure Assam Black Tea – First Flush",
    price: "₹749",
    originalPrice: "₹999",
    discount: "25% OFF",
    rating: 4.6,
    reviews: 2100,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
    badge: "Premium",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sarma",
    location: "Bangalore",
    text: "Finally a platform that ships genuine Assam tea! The CTC blend I ordered tasted exactly like back home. Will order again for sure.",
    stars: 5,
    avatar: "PS",
  },
  {
    name: "Rahul Bora",
    location: "Delhi",
    text: "Gifted my mother a Mekhela Chador from AssamRoots for Bihu — she was in tears. The fabric quality is exceptional and delivery was super fast.",
    stars: 5,
    avatar: "RB",
  },
  {
    name: "Ananya Das",
    location: "London, UK",
    text: "Living abroad, I missed authentic Assamese flavors. AssamRoots ships internationally and the spices arrived fresh and perfectly packed.",
    stars: 5,
    avatar: "AD",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={
            i <= Math.floor(rating)
              ? "fill-accent text-accent"
              : "fill-muted text-muted-foreground"
          }
        />
      ))}
    </span>
  );
}

function SectionHeader({
  label,
  title,
  action,
  actionHref,
}: {
  label?: string;
  title: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        {label && (
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">
            {label}
          </p>
        )}
        <h2 className="font-display text-xl font-black text-foreground leading-tight">
          {title}
        </h2>
      </div>
      {action && actionHref && (
        <a
          href={actionHref}
          className="flex items-center gap-0.5 text-xs font-semibold text-primary hover:underline"
          data-ocid="section-view-all"
        >
          {action} <ChevronRight size={13} />
        </a>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { data: footerData } = useFooterSettings();
  const tagline = footerData?.tagline || "Bringing Assam to the World";
  const copyrightText =
    footerData?.copyright ||
    `© ${new Date().getFullYear()} AssamRoots. All rights reserved.`;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── STICKY MINI HEADER ───────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
        data-ocid="landing-header"
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img
              src="/assets/logo.png"
              alt="AssamRoots"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-semibold"
                data-ocid="landing-login-btn"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/home">
              <Button
                size="sm"
                className="btn-primary border-0 text-xs"
                data-ocid="landing-shop-btn"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-card"
        data-ocid="hero-section"
      >
        {/* Hero image */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src="/assets/generated/hero-assam-products.dim_1200x500.jpg"
            alt="Authentic Assamese products"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />

          {/* Hero text overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} className="text-primary-foreground/80" />
              <span className="text-xs text-primary-foreground/80 font-semibold tracking-wide uppercase">
                Straight from Assam
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-primary-foreground leading-tight mb-2">
              Discover the
              <br />
              <span className="text-accent">Heart of Assam</span>
            </h1>
            <p className="text-sm text-primary-foreground/85 mb-4 max-w-xs leading-relaxed">
              Authentic tea, handloom, crafts & more — curated from local
              artisans &amp; producers.
            </p>
            <div className="flex items-center gap-3">
              <Link to="/home">
                <Button
                  className="btn-primary border-0 px-5 py-2.5 text-sm font-bold gap-1.5 h-auto"
                  data-ocid="hero-browse-cta"
                >
                  <ShoppingBag size={15} />
                  Browse Products
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  variant="outline"
                  className="px-4 py-2.5 text-sm font-semibold h-auto border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                  data-ocid="hero-categories-cta"
                >
                  View Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero stats bar */}
        <div className="bg-primary px-4 py-2.5">
          <div className="max-w-2xl mx-auto flex items-center justify-around text-primary-foreground">
            {[
              { value: "500+", label: "Products" },
              { value: "50+", label: "Artisans" },
              { value: "Pan-India", label: "Delivery" },
              { value: "100%", label: "Authentic" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm font-black leading-none">{stat.value}</p>
                <p className="text-[10px] font-medium opacity-80 mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES SECTION ───────────────────────────────────────── */}
      <section
        className="bg-background px-4 pt-6 pb-4"
        data-ocid="categories-section"
      >
        <div className="max-w-2xl mx-auto">
          <SectionHeader
            label="Shop by Category"
            title="What are you looking for?"
            action="All Categories"
            actionHref="/categories"
          />

          {/* Scrollable categories grid — 4 per row on mobile */}
          <div className="grid grid-cols-4 gap-2.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to="/categories/$slug"
                params={{ slug: cat.slug }}
                data-ocid="landing-category-tile"
                className="group flex flex-col items-center gap-1.5 rounded-xl p-2 bg-muted hover:bg-muted/60 active:scale-95 transition-smooth border border-border hover:border-primary/30"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (
                        e.target as HTMLImageElement
                      ).parentElement?.insertAdjacentHTML(
                        "beforeend",
                        `<span class="text-2xl">${cat.emoji}</span>`,
                      );
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-foreground text-center uppercase tracking-wide leading-tight">
                  {cat.name}
                </span>
                <span className="text-[9px] text-muted-foreground text-center leading-tight hidden sm:block">
                  {cat.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ────────────────────────────────────────────── */}
      <section
        className="bg-muted/30 border-y border-border px-4 py-6"
        data-ocid="trust-section"
      >
        <div className="max-w-2xl mx-auto">
          <SectionHeader label="Why Choose Us" title="Why AssamRoots?" />
          <div className="grid grid-cols-2 gap-3">
            {TRUST_CARDS.map((card) => (
              <div
                key={card.title}
                className="bg-card rounded-xl p-4 border border-border flex flex-col gap-2"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`}
                >
                  {card.icon}
                </div>
                <p className="font-bold text-sm text-foreground leading-tight">
                  {card.title}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────── */}
      <section
        className="bg-background px-4 py-6"
        data-ocid="featured-products-section"
      >
        <div className="max-w-2xl mx-auto">
          <SectionHeader
            label="Editor's Pick"
            title="Featured Products"
            action="View All"
            actionHref="/products"
          />

          {/* Horizontal scroll row */}
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {FEATURED_PRODUCTS.map((product) => (
              <a
                key={product.id}
                href="/products"
                data-ocid="landing-product-card"
                className="group flex-none w-40 snap-start"
              >
                <div className="card-product flex flex-col overflow-hidden h-full">
                  <div className="relative bg-muted aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                      loading="lazy"
                    />
                    <Badge className="absolute top-1.5 left-1.5 bg-destructive text-destructive-foreground text-[9px] font-bold px-1 py-0.5 border-0">
                      {product.discount}
                    </Badge>
                    <Badge className="absolute top-1.5 right-1.5 bg-secondary text-secondary-foreground text-[9px] font-bold px-1 py-0.5 border-0">
                      {product.badge}
                    </Badge>
                  </div>
                  <div className="p-2.5 flex flex-col gap-1">
                    <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                      {product.title}
                    </p>
                    <div className="flex items-center gap-1">
                      <StarRating rating={product.rating} />
                      <span className="text-[10px] text-muted-foreground">
                        ({product.reviews.toLocaleString()})
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-foreground">
                        {product.price}
                      </span>
                      <span className="text-[10px] text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section
        className="bg-muted/30 border-t border-border px-4 py-6"
        data-ocid="testimonials-section"
      >
        <div className="max-w-2xl mx-auto">
          <SectionHeader label="Customer Love" title="What People Say" />
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex-none w-72 snap-start bg-card rounded-xl border border-border p-4 flex flex-col gap-3"
              >
                <Quote
                  size={18}
                  className="text-primary/40 fill-primary/10 flex-shrink-0"
                />
                <p className="text-xs text-foreground leading-relaxed flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-foreground">
                      {t.avatar}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      {t.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <StarRating rating={t.stars} />
                      <span className="text-[10px] text-muted-foreground">
                        {t.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section
        className="bg-secondary px-4 py-8"
        data-ocid="cta-banner-section"
      >
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle size={16} className="text-secondary-foreground/80" />
            <span className="text-xs font-bold text-secondary-foreground/80 uppercase tracking-widest">
              Join AssamRoots Today
            </span>
          </div>
          <h2 className="font-display text-2xl font-black text-secondary-foreground leading-tight max-w-xs">
            Bringing Assam to Your Doorstep
          </h2>
          <p className="text-sm text-secondary-foreground/80 max-w-xs leading-relaxed">
            Shop 500+ authentic Assamese products with fast pan-India delivery.
            Sign up free and get exclusive access to new arrivals and artisan
            collections.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/signup">
              <Button
                className="bg-primary-foreground text-foreground font-bold px-6 py-2.5 text-sm h-auto hover:bg-primary-foreground/90 transition-smooth"
                data-ocid="cta-signup-btn"
              >
                Create Account
              </Button>
            </Link>
            <a href="/products">
              <Button
                variant="outline"
                className="border-secondary-foreground/40 text-secondary-foreground px-5 py-2.5 text-sm h-auto font-semibold hover:bg-secondary-foreground/10"
                data-ocid="cta-browse-btn"
              >
                Browse All <ArrowRight size={13} className="ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-card border-t border-border px-4 py-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link to="/home" className="flex items-center gap-2">
              <img
                src="/assets/logo.png"
                alt="AssamRoots"
                className="h-8 w-auto object-contain"
              />
              <span className="text-[11px] font-semibold text-muted-foreground italic">
                {tagline}
              </span>
            </Link>
            <div className="flex items-center gap-4">
              {[
                { label: "About", href: "/about" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "Reviews", href: "/reviews" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-3">
            {copyrightText}
          </p>
        </div>
      </footer>
    </div>
  );
}
