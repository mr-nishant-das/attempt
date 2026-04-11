import { type OrderPublic, OrderStatus, createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, LogIn, Package, ShoppingBag } from "lucide-react";
import { useEffect } from "react";

// ─── Status badge config ──────────────────────────────────────────────────

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

// ─── Order Card ───────────────────────────────────────────────────────────

function OrderCard({ order }: { order: OrderPublic }) {
  const statusConfig = STATUS_CONFIG[order.status] ?? {
    label: order.status,
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
      data-ocid={`order-row-${orderId}`}
    >
      <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-smooth">
        {/* Top row */}
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

        {/* Items preview */}
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

        {/* Bottom row */}
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

// ─── Skeleton loader ──────────────────────────────────────────────────────

function OrderCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor(createActor);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const { data: orders, isLoading } = useQuery<OrderPublic[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });

  // Auth guard states
  if (authLoading) {
    return (
      <Layout>
        <div className="px-4 py-4 space-y-3">
          <Skeleton className="h-8 w-36" />
          {[1, 2, 3].map((n) => (
            <OrderCardSkeleton key={n} />
          ))}
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="text-center py-16 px-6"
          data-ocid="orders-unauthenticated"
        >
          <LogIn size={48} className="text-muted-foreground/40 mx-auto mb-4" />
          <p className="font-display font-bold text-lg text-foreground mb-1">
            Sign in to view orders
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Track your Assamese product orders
          </p>
          <Button
            onClick={() => login()}
            className="btn-primary border-0 px-8"
            data-ocid="orders-login"
          >
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-4" data-ocid="orders-page">
        <h1 className="font-display text-xl font-bold text-foreground mb-4">
          My Orders
        </h1>

        {/* Loading state */}
        {(isLoading || actorFetching) && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <OrderCardSkeleton key={n} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !actorFetching && orders?.length === 0 && (
          <div className="text-center py-16" data-ocid="orders-empty">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-muted-foreground/60" />
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
                data-ocid="orders-start-shopping"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        )}

        {/* Order list */}
        {!isLoading && !actorFetching && orders && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={String(order.id)} order={order} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
