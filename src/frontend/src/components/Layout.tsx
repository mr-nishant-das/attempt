import { BottomNav } from "@/components/BottomNav";
import { SearchBar } from "@/components/SearchBar";
import { useCart } from "@/hooks/useCart";
import { useSiteSettings } from "@/hooks/useQueries";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Grid3X3,
  Home,
  Search,
  ShoppingCart,
  UserCircle,
  Wrench,
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
      <footer className="bg-muted/40 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground">
              © {new Date().getFullYear()} AssamRoots. Authentic Assamese
              products &amp; services.
            </p>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "assamroots")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Built with love using caffeine.ai
            </a>
          </div>
        </div>
      </footer>

      {/* ── Bottom navigation — mobile only ── */}
      <BottomNav cartCount={totalItems} />
    </div>
  );
}
