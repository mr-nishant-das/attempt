import { createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle2, LogIn, Package, ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";

// ─── Simple confetti burst (CSS-only, respects prefers-reduced-motion) ────

function ConfettiBurst() {
  const dots = [
    { color: "bg-primary", x: -60, y: -80, delay: 0 },
    { color: "bg-secondary", x: 60, y: -80, delay: 0.05 },
    { color: "bg-accent", x: -40, y: -100, delay: 0.1 },
    { color: "bg-primary", x: 40, y: -100, delay: 0.15 },
    { color: "bg-secondary", x: -80, y: -60, delay: 0.08 },
    { color: "bg-accent", x: 80, y: -60, delay: 0.12 },
    { color: "bg-primary", x: 0, y: -110, delay: 0.06 },
    { color: "bg-secondary", x: -20, y: -70, delay: 0.18 },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {dots.map((dot) => (
        <span
          key={`${dot.color}-${dot.x}-${dot.y}`}
          className={`absolute left-1/2 top-1/3 w-2.5 h-2.5 rounded-full ${dot.color} opacity-0 motion-safe:animate-confetti`}
          style={
            {
              "--tx": `${dot.x}px`,
              "--ty": `${dot.y}px`,
              animationDelay: `${dot.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function formatDeliveryDate(ts?: bigint): string {
  if (!ts) return "3–5 business days";
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function OrderCompletePage() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useSearch({ from: "/order-complete" });
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const redirected = useRef(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !redirected.current) {
      redirected.current = true;
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const orderIdBigInt = orderId ? BigInt(orderId) : undefined;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order-complete", orderId],
    queryFn: async () => {
      if (!actor || !orderIdBigInt) return null;
      return actor.getOrder(orderIdBigInt);
    },
    enabled: !!actor && !actorFetching && !!orderIdBigInt && isAuthenticated,
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="px-6 py-16 text-center space-y-4">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-8 w-56 mx-auto" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="text-center py-16 px-6"
          data-ocid="order-complete-unauthenticated"
        >
          <LogIn size={48} className="text-muted-foreground/40 mx-auto mb-4" />
          <p className="font-display font-bold text-lg text-foreground mb-1">
            Sign in to view order
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Access your order confirmation
          </p>
          <Button
            onClick={() => login()}
            className="btn-primary border-0 px-8"
            data-ocid="order-complete-login"
          >
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  if (isLoading && orderId) {
    return (
      <Layout>
        <div className="px-6 py-16 text-center space-y-4">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-8 w-56 mx-auto" />
          <Skeleton className="h-6 w-36 mx-auto" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </Layout>
    );
  }

  // No orderId in URL — friendly fallback instead of broken/blank screen
  if (!orderId) {
    return (
      <Layout>
        <div
          className="text-center px-6 py-10 relative"
          data-ocid="order-complete-no-id"
        >
          <ConfettiBurst />
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-secondary/15 border-4 border-secondary/30 flex items-center justify-center">
              <CheckCircle2
                size={44}
                className="text-secondary"
                strokeWidth={1.8}
              />
            </div>
            <div
              className="absolute w-32 h-32 rounded-full border-2 border-secondary/10 animate-ping"
              aria-hidden="true"
            />
          </div>

          <h1 className="font-display text-3xl font-black text-foreground mb-2 tracking-tight">
            Order Placed!
          </h1>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            Your order was placed successfully! 🎉
          </p>
          <div className="bg-card border border-border rounded-2xl p-4 text-left mb-6">
            <p className="text-sm text-foreground font-medium mb-1">
              What's next?
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Check your order history in your{" "}
              <Link to="/profile" className="text-primary font-medium">
                Profile
              </Link>{" "}
              for full details, status updates, and tracking information.
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 mb-6 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              🌿 Your purchase directly supports local Assamese artisans and
              farmers — thank you!
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/profile">
              <Button
                className="w-full btn-primary border-0 h-11 text-base"
                data-ocid="order-complete-view-orders"
              >
                View My Orders
              </Button>
            </Link>
            <Link to="/home">
              <Button
                variant="outline"
                className="w-full border-primary/30 text-primary h-11"
                data-ocid="order-complete-shop"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Query error fallback
  if (isError) {
    return (
      <Layout>
        <div
          className="text-center px-6 py-10"
          data-ocid="order-complete-error"
        >
          <div className="w-20 h-20 rounded-full bg-secondary/15 border-4 border-secondary/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2
              size={36}
              className="text-secondary"
              strokeWidth={1.8}
            />
          </div>
          <h1 className="font-display text-2xl font-black text-foreground mb-2">
            Order Placed!
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Your order was placed. We couldn't load the details right now —
            check your order history in{" "}
            <Link to="/profile" className="text-primary font-medium">
              Profile
            </Link>{" "}
            for full details.
          </p>
          <div className="space-y-3">
            <Link to="/profile">
              <Button
                className="w-full btn-primary border-0 h-11"
                data-ocid="order-complete-profile"
              >
                View My Orders
              </Button>
            </Link>
            <Link to="/home">
              <Button
                variant="outline"
                className="w-full border-primary/30 text-primary h-11"
                data-ocid="order-complete-shop"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const displayOrderId = orderId ?? "—";
  const itemCount = order?.items?.length ?? 0;
  const total = order
    ? `₹${(Number(order.totalAmount) / 100).toLocaleString("en-IN")}`
    : "";

  return (
    <Layout>
      <div
        className="text-center px-6 py-10 relative"
        data-ocid="order-complete"
      >
        <ConfettiBurst />

        {/* Success checkmark */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-secondary/15 border-4 border-secondary/30 flex items-center justify-center">
            <CheckCircle2
              size={44}
              className="text-secondary"
              strokeWidth={1.8}
            />
          </div>
          {/* Decorative rings */}
          <div
            className="absolute w-32 h-32 rounded-full border-2 border-secondary/10 animate-ping"
            aria-hidden="true"
          />
        </div>

        <h1 className="font-display text-3xl font-black text-foreground mb-2 tracking-tight">
          Order Placed!
        </h1>
        <p className="text-muted-foreground text-sm mb-1 leading-relaxed">
          Thank you for supporting authentic Assamese artisans 🙏
        </p>
        <p className="text-xs text-muted-foreground mb-6">
          Order ID:{" "}
          <span className="font-semibold text-foreground font-mono">
            #{displayOrderId}
          </span>
        </p>

        {/* Delivery info card */}
        <div className="bg-card border border-border rounded-2xl p-4 text-left mb-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-none">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                Estimated Delivery
              </p>
              <p className="text-xs text-muted-foreground">
                {order?.estimatedDelivery
                  ? formatDeliveryDate(order.estimatedDelivery)
                  : "3–5 business days"}
              </p>
            </div>
          </div>

          {/* Items summary */}
          {order && order.items.length > 0 ? (
            <div className="space-y-2">
              {order.items.slice(0, 3).map((item) => (
                <div
                  key={String(item.productId)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 bg-muted rounded-lg flex-none overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag
                          size={14}
                          className="text-muted-foreground"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-foreground font-medium truncate flex-1 min-w-0">
                    {item.title}
                  </p>
                  <p className="text-xs font-semibold text-foreground flex-none">
                    ×{Number(item.quantity)}
                  </p>
                </div>
              ))}
              {itemCount > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  +{itemCount - 3} more {itemCount - 3 === 1 ? "item" : "items"}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center">
              Order confirmed
            </p>
          )}

          {total && (
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Amount paid</span>
              <span className="text-sm font-bold text-foreground">{total}</span>
            </div>
          )}
        </div>

        {/* Warm message banner */}
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 mb-6 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            🌿 Your purchase directly supports local Assamese artisans and
            farmers — thank you!
          </p>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link to="/order-tracking" search={{ orderId: displayOrderId }}>
            <Button
              className="w-full btn-primary border-0 h-11 text-base"
              data-ocid="order-complete-track"
            >
              Track My Order
            </Button>
          </Link>
          <Link to="/home">
            <Button
              variant="outline"
              className="w-full border-primary/30 text-primary h-11"
              data-ocid="order-complete-shop"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
