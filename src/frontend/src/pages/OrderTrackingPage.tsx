import { OrderStatus, createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  LogIn,
  MapPin,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";

// ─── Timeline step definition ─────────────────────────────────────────────

type StepId =
  | "processing"
  | "confirmed"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

interface TimelineStep {
  id: StepId;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  statuses: OrderStatus[];
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: "processing",
    label: "Order Placed",
    sublabel: "We received your order",
    icon: <CheckCircle2 size={18} />,
    statuses: [OrderStatus.Processing],
  },
  {
    id: "confirmed",
    label: "Confirmed",
    sublabel: "Payment confirmed",
    icon: <Package size={18} />,
    statuses: [OrderStatus.Confirmed],
  },
  {
    id: "shipped",
    label: "Shipped",
    sublabel: "On its way to you",
    icon: <Truck size={18} />,
    statuses: [OrderStatus.Shipped],
  },
  {
    id: "out_for_delivery",
    label: "Out for Delivery",
    sublabel: "With your delivery partner",
    icon: <MapPin size={18} />,
    statuses: [OrderStatus.OutForDelivery],
  },
  {
    id: "delivered",
    label: "Delivered",
    sublabel: "Enjoy your purchase!",
    icon: <PackageCheck size={18} />,
    statuses: [OrderStatus.Delivered],
  },
];

const STATUS_ORDER: OrderStatus[] = [
  OrderStatus.Processing,
  OrderStatus.Confirmed,
  OrderStatus.Shipped,
  OrderStatus.OutForDelivery,
  OrderStatus.Delivered,
];

function getStatusIndex(status: OrderStatus): number {
  return STATUS_ORDER.indexOf(status);
}

function getStepState(
  step: TimelineStep,
  currentStatus: OrderStatus,
): "done" | "active" | "pending" {
  const currentIdx = getStatusIndex(currentStatus);
  const stepIdx = Math.max(...step.statuses.map((s) => getStatusIndex(s)));
  if (currentIdx > stepIdx) return "done";
  if (step.statuses.includes(currentStatus)) return "active";
  return "pending";
}

function formatDeliveryDate(ts?: bigint): string {
  if (!ts) return "3–5 business days";
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatOrderDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useSearch({ from: "/order-tracking" });
  const { actor, isFetching: actorFetching } = useActor(createActor);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const orderIdBigInt = orderId ? BigInt(orderId) : undefined;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!actor || !orderIdBigInt) return null;
      return actor.getOrder(orderIdBigInt);
    },
    enabled: !!actor && !actorFetching && !!orderIdBigInt && isAuthenticated,
  });

  // Auth guard
  if (authLoading) {
    return (
      <Layout>
        <div className="px-4 py-6 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="text-center py-16 px-6"
          data-ocid="tracking-unauthenticated"
        >
          <LogIn size={48} className="text-muted-foreground/40 mx-auto mb-4" />
          <p className="font-display font-bold text-lg text-foreground mb-1">
            Sign in to track order
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Track your Assamese product deliveries
          </p>
          <Button
            onClick={() => login()}
            className="btn-primary border-0 px-8"
            data-ocid="tracking-login"
          >
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  if (!orderId) {
    return (
      <Layout>
        <div className="text-center py-16 px-6" data-ocid="tracking-no-order">
          <Package
            size={48}
            className="text-muted-foreground/40 mx-auto mb-4"
          />
          <p className="font-display font-bold text-lg text-foreground mb-1">
            No order selected
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Select an order from your order history
          </p>
          <Link to="/orders">
            <Button className="btn-primary border-0 px-8">View Orders</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (isLoading || actorFetching) {
    return (
      <Layout>
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (isError || !order) {
    return (
      <Layout>
        <div className="text-center py-16 px-6" data-ocid="tracking-error">
          <XCircle size={48} className="text-destructive/60 mx-auto mb-4" />
          <p className="font-display font-bold text-lg text-foreground mb-1">
            Order not found
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn't find order #{orderId}
          </p>
          <Link to="/orders">
            <Button className="btn-primary border-0 px-8">
              View All Orders
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const currentStatus = order.status;
  const isCancelled = currentStatus === OrderStatus.Cancelled;
  const isDelivered = currentStatus === OrderStatus.Delivered;

  return (
    <Layout>
      <div className="px-4 py-4" data-ocid="order-tracking">
        {/* Back + Title */}
        <div className="flex items-center gap-2 mb-4">
          <Link
            to="/orders"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to orders"
          >
            <ChevronLeft size={22} />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground leading-tight">
              Track Order
            </h1>
            <p className="text-xs text-muted-foreground">#{orderId}</p>
          </div>
        </div>

        {/* Status banner */}
        {isCancelled ? (
          <div
            className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-5 flex items-center gap-3"
            data-ocid="tracking-status-banner"
          >
            <XCircle size={24} className="text-destructive flex-none" />
            <div>
              <p className="font-bold text-sm text-foreground">
                Order Cancelled
              </p>
              <p className="text-xs text-muted-foreground">
                Placed on {formatOrderDate(order.createdAt)}
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`rounded-xl p-4 mb-5 flex items-center gap-3 border ${
              isDelivered
                ? "bg-secondary/10 border-secondary/20"
                : "bg-primary/10 border-primary/20"
            }`}
            data-ocid="tracking-status-banner"
          >
            {isDelivered ? (
              <PackageCheck size={24} className="text-secondary flex-none" />
            ) : (
              <Truck
                size={24}
                className="text-primary flex-none animate-pulse"
              />
            )}
            <div>
              <p className="font-bold text-sm text-foreground">
                {isDelivered
                  ? "Delivered!"
                  : currentStatus.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={11} />
                {isDelivered
                  ? `Delivered on ${formatDeliveryDate(order.estimatedDelivery)}`
                  : `Est. delivery: ${formatDeliveryDate(order.estimatedDelivery)}`}
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {!isCancelled && (
          <div
            className="bg-card border border-border rounded-xl p-4 mb-4"
            data-ocid="tracking-timeline"
          >
            <p className="font-semibold text-sm text-foreground mb-4">
              Delivery Timeline
            </p>
            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, i) => {
                const state = getStepState(step, currentStatus);
                return (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-none transition-smooth ${
                          state === "done"
                            ? "bg-secondary text-secondary-foreground"
                            : state === "active"
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.icon}
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-8 mt-0.5 transition-smooth ${state === "done" ? "bg-secondary" : "bg-border"}`}
                        />
                      )}
                    </div>
                    <div className="pt-1.5 pb-3 min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          state === "active"
                            ? "text-primary"
                            : state === "done"
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.sublabel}
                      </p>
                    </div>
                    {state === "active" && (
                      <div className="pt-2 flex-none">
                        <Badge className="bg-primary/15 text-primary border-0 text-[10px]">
                          Active
                        </Badge>
                      </div>
                    )}
                    {state === "done" && (
                      <div className="pt-2 flex-none">
                        <Badge className="bg-secondary/15 text-secondary border-0 text-[10px]">
                          Done
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order items */}
        <div
          className="bg-card border border-border rounded-xl p-4 mb-4"
          data-ocid="tracking-items"
        >
          <p className="font-semibold text-sm text-foreground mb-3">
            {order.items.length} {order.items.length === 1 ? "item" : "items"}{" "}
            in this order
          </p>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={String(item.productId)}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-none">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={18} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {Number(item.quantity)}
                  </p>
                </div>
                <p className="text-sm font-bold text-foreground flex-none">
                  ₹{(Number(item.price) / 100).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total paid</span>
            <span className="font-bold text-foreground">
              ₹{(Number(order.totalAmount) / 100).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Delivery address */}
        <div
          className="bg-muted/40 border border-border rounded-xl p-4 mb-5"
          data-ocid="tracking-address"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Delivery Address
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {order.deliveryAddress.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {order.deliveryAddress.houseNo}, {order.deliveryAddress.street}
          </p>
          {order.deliveryAddress.locality && (
            <p className="text-xs text-muted-foreground">
              {order.deliveryAddress.locality}
              {order.deliveryAddress.landmark
                ? `, near ${order.deliveryAddress.landmark}`
                : ""}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {order.deliveryAddress.city}, {order.deliveryAddress.state} –{" "}
            {order.deliveryAddress.pincode}
          </p>
          <p className="text-xs text-muted-foreground">
            {order.deliveryAddress.phone}
          </p>
        </div>

        <Link to="/home">
          <Button
            variant="outline"
            className="w-full border-primary/30 text-primary"
            data-ocid="tracking-continue-shopping"
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
