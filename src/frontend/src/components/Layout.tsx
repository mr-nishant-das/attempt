import { BottomNav } from "@/components/BottomNav";
import { SearchBar } from "@/components/SearchBar";
import { useCart } from "@/hooks/useCart";
import { Link } from "@tanstack/react-router";

interface LayoutProps {
  children: React.ReactNode;
  /** Hide the sticky search bar (e.g. on search page where input is already prominent) */
  hideSearch?: boolean;
}

export function Layout({ children, hideSearch }: LayoutProps) {
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky header */}
      <header className="sticky-header" data-ocid="main-header">
        <div className="max-w-lg mx-auto px-4 py-3 flex flex-col gap-2">
          {/* Brand row */}
          <div className="flex items-center justify-between">
            <Link
              to="/home"
              className="flex items-center gap-2"
              aria-label="AssamRoots home"
            >
              <span className="font-display text-xl font-black tracking-tight">
                <span className="text-primary">Assam</span>
                <span className="text-secondary">Roots</span>
              </span>
              <span className="badge-verified text-[10px] px-1.5 py-0.5">
                ✦ Authentic
              </span>
            </Link>
            <Link
              to="/orders"
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
              aria-label="My orders"
              data-ocid="header-orders-link"
            >
              Orders
            </Link>
          </div>

          {/* Search bar */}
          {!hideSearch && <SearchBar />}
        </div>
      </header>

      {/* Main content — pb-20 to clear bottom nav */}
      <main
        className="flex-1 pb-20 max-w-lg mx-auto w-full"
        data-ocid="main-content"
      >
        {children}
      </main>

      {/* Footer — minimal, sits above bottom nav */}
      <footer className="bg-muted/40 border-t border-border pb-20 max-w-lg mx-auto w-full">
        <div className="px-4 py-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Unified bottom navigation bar */}
      <BottomNav cartCount={totalItems} />
    </div>
  );
}
