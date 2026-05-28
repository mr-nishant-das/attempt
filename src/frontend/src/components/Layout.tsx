import { BottomNav } from "@/components/BottomNav";
import { SearchBar } from "@/components/SearchBar";
import { useCart } from "@/hooks/useCart";
import { useFooterSettings, useSiteSettings } from "@/hooks/useQueries";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Facebook,
  Grid3X3,
  Home,
  Instagram,
  MessageCircle,
  Search,
  ShoppingCart,
  UserCircle,
  Wrench,
  Youtube,
} from "lucide-react";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
  /** Hide the sticky search bar (e.g. on product detail pages) */
  hideSearch?: boolean;
}

// Desktop sidebar nav items (same as BottomNav)
const SIDEBAR_ITEMS = [
  {
    label: "Home",
    to: "/home" as const,
    icon: <Home size={18} />,
    ocid: "sidebar-nav-home",
  },
  {
    label: "Categories",
    to: "/categories" as const,
    icon: <Grid3X3 size={18} />,
    ocid: "sidebar-nav-categories",
  },
  {
    label: "Search",
    to: "/products" as const,
    icon: <Search size={18} />,
    ocid: "sidebar-nav-search",
    search: {
      q: undefined as string | undefined,
      category: undefined as string | undefined,
    },
  },
  {
    label: "Services",
    to: "/services" as const,
    icon: <Wrench size={18} />,
    ocid: "sidebar-nav-services",
  },
  {
    label: "Cart",
    to: "/cart" as const,
    icon: <ShoppingCart size={18} />,
    ocid: "sidebar-nav-cart",
  },
  {
    label: "Profile",
    to: "/profile" as const,
    icon: <UserCircle size={18} />,
    ocid: "sidebar-nav-profile",
  },
];

// ─── Footer Component ──────────────────────────────────────────────────────────────────────────
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram size={18} />,
  facebook: <Facebook size={18} />,
  whatsapp: <MessageCircle size={18} />,
  youtube: <Youtube size={18} />,
};

function AppFooter() {
  const { data: footerSettings } = useFooterSettings();
  const tagline = footerSettings?.tagline || "Bringing Assam to the World";
  const copyright =
    footerSettings?.copyright ||
    `© ${new Date().getFullYear()} AssamRoots. All rights reserved.`;
  const socialLinks = footerSettings?.socialLinks ?? [];

  return (
    <footer
      className="bg-muted/40 border-t border-border"
      data-ocid="site-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Branding */}
          <div className="footer-section space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-primary">
                AssamRoots
              </span>
            </div>
            <p className="footer-tagline text-sm text-muted-foreground leading-relaxed">
              {tagline}
            </p>
            <p className="footer-copyright text-xs text-muted-foreground/70">
              {copyright}
            </p>
          </div>

          {/* Column 2: About */}
          <div className="footer-section space-y-3">
            <h4 className="footer-header text-sm font-semibold text-foreground">
              About AssamRoots
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Learn the story behind our platform and our mission to connect
              Assam to the world.
            </p>
            <Link
              to="/about"
              className="footer-link inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              data-ocid="footer.about_link"
            >
              Read our story →
            </Link>
            <Link
              to="/refund-policy"
              className="footer-link inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              data-ocid="footer.refund_policy_link"
            >
              Refund Policy →
            </Link>
          </div>

          {/* Column 3: Reviews */}
          <div className="footer-section space-y-3">
            <h4 className="footer-header text-sm font-semibold text-foreground">
              Customer Reviews
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Read what customers say about authentic Assamese products and
              services.
            </p>
            <Link
              to="/reviews"
              className="footer-link inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              data-ocid="footer.reviews_link"
            >
              See all reviews →
            </Link>
          </div>

          {/* Column 4: Social */}
          <div className="footer-section space-y-3">
            <h4 className="footer-header text-sm font-semibold text-foreground">
              Follow Us
            </h4>
            <p className="text-xs text-muted-foreground">
              Stay connected with AssamRoots.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {socialLinks
                .filter((s) => s.enabled && s.url)
                .map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                    aria-label={s.platform}
                    data-ocid={`footer.social.${s.platform}`}
                  >
                    {SOCIAL_ICONS[s.platform.toLowerCase()] ?? (
                      <span className="text-xs">
                        {s.platform[0].toUpperCase()}
                      </span>
                    )}
                  </a>
                ))}
              {socialLinks.filter((s) => s.enabled && s.url).length === 0 && (
                <div className="flex items-center gap-3">
                  <span className="social-icon w-9 h-9 flex items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                    <Instagram size={18} />
                  </span>
                  <span className="social-icon w-9 h-9 flex items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                    <Facebook size={18} />
                  </span>
                  <span className="social-icon w-9 h-9 flex items-center justify-center rounded-full bg-muted text-muted-foreground/40">
                    <Youtube size={18} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children, hideSearch }: LayoutProps) {
  const { totalItems } = useCart();
  const { data: settings } = useSiteSettings();
  const location = useLocation();
  const pathname = location.pathname;

  // Dynamically update the favicon whenever faviconUrl changes
  useEffect(() => {
    const faviconUrl = settings?.faviconUrl;
    if (!faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [settings?.faviconUrl]);

  const logoSrc = settings?.logoUrl ?? "/assets/logo.png";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Sticky header ── */}
      <header className="sticky-header" data-ocid="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Brand row */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center gap-2 flex-none"
              aria-label="AssamRoots home"
            >
              <img
                src={logoSrc}
                alt="AssamRoots"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Search bar — desktop: inline in header */}
            {!hideSearch && (
              <div className="hidden lg:flex flex-1 max-w-2xl">
                <div className="w-full">
                  <div className="relative flex items-center">
                    <Search
                      size={16}
                      className="absolute left-4 text-muted-foreground pointer-events-none z-10"
                    />
                    <Link
                      to="/products"
                      search={{ q: undefined, category: undefined }}
                      className="search-input w-full pl-12 pr-4 h-11 text-sm flex items-center text-muted-foreground cursor-pointer"
                      data-ocid="header-search-link"
                    >
                      Search tea, spices, handloom, crafts…
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {hideSearch && <div className="flex-1" />}

            {/* Desktop nav links */}
            <nav
              className="hidden lg:flex items-center gap-1 flex-none"
              aria-label="Desktop navigation"
            >
              {SIDEBAR_ITEMS.map((item) => {
                const isActive =
                  item.to === "/home"
                    ? pathname === "/" || pathname === "/home"
                    : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    search={"search" in item ? item.search : undefined}
                    className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-medium transition-smooth relative ${
                      isActive
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                    data-ocid={item.ocid}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="relative inline-flex">
                      {item.icon}
                      {item.to === "/cart" && totalItems > 0 && (
                        <span
                          className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1 leading-none"
                          aria-label={`${totalItems} items in cart`}
                        >
                          {totalItems > 99 ? "99+" : totalItems}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] leading-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile search bar — shown below brand row on mobile */}
          {!hideSearch && (
            <div className="lg:hidden mt-3">
              <SearchBar />
            </div>
          )}
        </div>
      </header>

      {/* ── Body: sidebar + main ── */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-0 lg:px-8 lg:gap-6 xl:gap-8">
        {/* Desktop left sidebar */}
        <aside className="hidden lg:flex flex-col flex-none w-56 xl:w-64 py-6 space-y-1 self-start sticky top-[73px]">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-1">
            Navigation
          </p>
          {SIDEBAR_ITEMS.map((item) => {
            const isActive =
              item.to === "/home"
                ? pathname === "/" || pathname === "/home"
                : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                search={"search" in item ? item.search : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth relative ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
                data-ocid={`sidebar-link-${item.to.replace("/", "")}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="relative inline-flex flex-none">
                  {item.icon}
                  {item.to === "/cart" && totalItems > 0 && (
                    <span
                      className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1 leading-none"
                      aria-label={`${totalItems} items in cart`}
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          {/* Sidebar footer branding */}
          <div className="pt-6 px-3">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Authentic Assamese products &amp; services, delivered with care.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main
          className="flex-1 min-w-0 pb-24 lg:pb-10 px-0"
          data-ocid="main-content"
        >
          {children}
        </main>
      </div>

      {/* ── Footer ── */}
      <AppFooter />

      {/* ── Bottom navigation — mobile only ── */}
      <BottomNav cartCount={totalItems} />
    </div>
  );
}
