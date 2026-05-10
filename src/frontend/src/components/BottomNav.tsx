import { Link, useLocation } from "@tanstack/react-router";
import {
  Grid3X3,
  Home,
  Search,
  ShoppingCart,
  UserCircle,
  Wrench,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Home",
    to: "/home" as const,
    icon: <Home size={20} />,
    ocid: "bottom-nav-home",
  },
  {
    label: "Categories",
    to: "/categories" as const,
    icon: <Grid3X3 size={20} />,
    ocid: "bottom-nav-categories",
  },
  {
    label: "Search",
    to: "/products" as const,
    icon: <Search size={20} />,
    ocid: "bottom-nav-search",
    search: {
      q: undefined as string | undefined,
      category: undefined as string | undefined,
    },
  },
  {
    label: "Services",
    to: "/services" as const,
    icon: <Wrench size={20} />,
    ocid: "bottom-nav-services",
  },
  {
    label: "Cart",
    to: "/cart" as const,
    icon: <ShoppingCart size={20} />,
    ocid: "bottom-nav-cart",
  },
  {
    label: "Profile",
    to: "/profile" as const,
    icon: <UserCircle size={20} />,
    ocid: "bottom-nav-profile",
  },
];

interface BottomNavProps {
  cartCount?: number;
}

export function BottomNav({ cartCount = 0 }: BottomNavProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.08)] lg:hidden"
      aria-label="Main navigation"
      data-ocid="bottom-nav"
    >
      <div className="flex items-stretch h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === "/home"
              ? pathname === "/" || pathname === "/home"
              : pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              search={"search" in item ? item.search : undefined}
              className={`bottom-nav-item flex-1 relative px-0.5 ${
                isActive ? "bottom-nav-item-active" : "text-muted-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
              data-ocid={item.ocid}
            >
              <span className="relative inline-flex">
                {item.icon}
                {item.to === "/cart" && cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1 leading-none"
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
              <span className="text-[9px] mt-0.5 leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* iOS safe-area padding */}
      <div style={{ height: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}
