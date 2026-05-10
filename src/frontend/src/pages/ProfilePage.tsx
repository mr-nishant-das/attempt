import { type OrderPublic, OrderStatus, createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  LogIn,
  LogOut,
  Package,
  ShoppingBag,
  User,
  UserCircle,
} from "lucide-react";
import { useState } from "react";

// ─── Status config ───────────────────────────────────────────────────────────

type StatusConfig = { label: string; className: string };

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  [OrderStatus.Processing]: {
    label: "Processing",
    className: "bg-primary/15 text-primary border-0",
  },
  [OrderStatus.Confirmed]: {
    label: "Confirmed",
    className: "bg-accent/20 text-accent-foreground border-0",
  },
  [OrderStatus.Shipped]: {
    label: "Shipped",
    className: "bg-primary/15 text-primary border-0",
  },
  [OrderStatus.OutForDelivery]: {
    label: "Out for Delivery",
    className: "bg-accent/30 text-foreground border-0",
  },
  [OrderStatus.Delivered]: {
    label: "Delivered",
    className: "bg-secondary/20 text-secondary border-0",
  },
  [OrderStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive border-0",
  },
};

function formatOrderDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: OrderPublic }) {
  const statusConfig = STATUS_CONFIG[order.status] ?? {
    label: String(order.status),
    className: "bg-muted text-muted-foreground border-0",
  };
  const orderId = String(order.id);
  const firstImage = order.items[0]?.imageUrl;
  const extraItems = order.items.length - 1;

  return (
    <Link
      to="/order-tracking"
      search={{ orderId }}
      className="block"
      data-ocid="profile.order.item"
    >
      <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-smooth">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-foreground font-mono">
              #{orderId}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <Badge className={`text-[11px] flex-none ${statusConfig.className}`}>
            {statusConfig.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mb-3">
          {firstImage ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-none border border-border">
              <img
                src={firstImage}
                alt={order.items[0].title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-none">
              <Package size={16} className="text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-foreground font-medium truncate">
              {order.items[0]?.title ?? "Order items"}
            </p>
            {extraItems > 0 && (
              <p className="text-[11px] text-muted-foreground">
                +{extraItems} more {extraItems === 1 ? "item" : "items"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-bold text-foreground">
            ₹{(Number(order.totalAmount) / 100).toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
            View Details <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "account" | "orders";

// ─── Profile page ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    principalText,
    login,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [activeTab, setActiveTab] = useState<Tab>("account");

  const { data: orders, isLoading: ordersLoading } = useQuery<OrderPublic[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled:
      !!actor && !actorFetching && isAuthenticated && activeTab === "orders",
  });

  // Auth loading skeleton
  if (authLoading) {
    return (
      <Layout>
        <div className="px-4 py-6 space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="text-center py-16 px-6"
          data-ocid="profile.unauthenticated"
        >
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle size={40} className="text-muted-foreground/60" />
          </div>
          <p className="font-display font-bold text-lg text-foreground mb-1">
            Sign in to your profile
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            View your orders, manage addresses, and more
          </p>
          <Button
            onClick={() => login()}
            className="btn-primary border-0 px-8"
            data-ocid="profile.login_button"
          >
            <LogIn size={16} className="mr-2" />
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  const displayId = principalText
    ? `${principalText.slice(0, 8)}…${principalText.slice(-6)}`
    : "—";

  return (
    <Layout>
      <div className="px-4 py-4" data-ocid="profile.page">
        {/* Profile header card */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-none">
            <User size={28} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display font-bold text-foreground">My Account</p>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {displayId}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate({ to: "/home" });
            }}
            className="flex-none text-muted-foreground hover:text-destructive"
            data-ocid="profile.logout_button"
          >
            <LogOut size={16} />
          </Button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 bg-muted/40 rounded-lg p-1 mb-4"
          data-ocid="profile.tabs"
        >
          {(["account", "orders"] as Tab[]).map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`profile.${tab}.tab`}
            >
              {tab === "account" ? "My Account" : "My Orders"}
            </button>
          ))}
        </div>

        {/* Account tab */}
        {activeTab === "account" && (
          <div className="space-y-3" data-ocid="profile.account.panel">
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
              <div className="px-4 py-3">
                <p className="text-xs text-muted-foreground mb-0.5">User ID</p>
                <p className="text-sm font-mono text-foreground truncate">
                  {principalText ?? "—"}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs text-muted-foreground mb-0.5">
                  Authentication
                </p>
                <p className="text-sm text-foreground">Internet Identity</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <Link
                to="/orders"
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors"
                data-ocid="profile.orders_link"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    My Orders
                  </span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            </div>

            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20"
              onClick={() => {
                logout();
                navigate({ to: "/home" });
              }}
              data-ocid="profile.signout_button"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        )}

        {/* Orders tab */}
        {activeTab === "orders" && (
          <div data-ocid="profile.orders.panel">
            {(ordersLoading || actorFetching) && (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <Skeleton className="h-3 flex-1" />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!ordersLoading && !actorFetching && orders?.length === 0 && (
              <div
                className="text-center py-14"
                data-ocid="profile.orders.empty_state"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag size={28} className="text-muted-foreground/60" />
                </div>
                <p className="font-display font-semibold text-foreground mb-1">
                  No orders yet
                </p>
                <p className="text-sm text-muted-foreground mb-5">
                  Start exploring authentic Assamese products
                </p>
                <Link to="/home">
                  <Button
                    className="btn-primary border-0 px-8"
                    data-ocid="profile.orders.shop_button"
                  >
                    Shop Now
                  </Button>
                </Link>
              </div>
            )}

            {!ordersLoading &&
              !actorFetching &&
              orders &&
              orders.length > 0 && (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <OrderCard key={String(order.id)} order={order} />
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </Layout>
  );
}
