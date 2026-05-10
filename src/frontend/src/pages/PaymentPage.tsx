import { type Backend, type CreateOrderInput, createActor } from "@/backend";
import { DeliveryType } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { discountedPrice, formatPrice } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Info,
  Lock,
  LogIn,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type PaymentMethod = "online" | "cod";

// Razorpay response type
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Structured address saved by CheckoutPage
interface CheckoutAddress {
  name: string;
  phone: string;
  houseNo: string;
  street: string;
  locality: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

function readDeliveryFromSession(): {
  deliveryType: DeliveryType;
  deliveryCost: number;
} {
  const rawType = sessionStorage.getItem("checkout_delivery_type");
  const rawCost = sessionStorage.getItem("checkout_delivery_cost");
  const deliveryType =
    rawType === "Express" ? DeliveryType.Express : DeliveryType.Standard;
  const deliveryCost = rawCost ? Number.parseInt(rawCost, 10) : 5900;
  return { deliveryType, deliveryCost };
}

export default function PaymentPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState<PaymentMethod>("online");
  const [loading, setLoading] = useState(false);
  const [rzpLoaded, setRzpLoaded] = useState(false);

  const { deliveryType, deliveryCost } = readDeliveryFromSession();
  const grandTotal = totalPrice + deliveryCost;
  const isExpress = deliveryType === DeliveryType.Express;
  const deliveryLabel = isExpress ? "Express Delivery" : "Standard Delivery";

  // Load Razorpay SDK from CDN
  useEffect(() => {
    const existing = document.getElementById("razorpay-script");
    if (existing) {
      setRzpLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRzpLoaded(true);
    script.onerror = () => {
      console.warn("Razorpay SDK failed to load");
      toast.error(
        "Payment gateway failed to load. Please refresh and try again.",
      );
    };
    document.body.appendChild(script);
  }, []);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <ShoppingBag size={48} className="text-muted-foreground/40 mb-4" />
          <p className="font-display font-bold text-lg mb-2">
            Nothing to pay for
          </p>
          <Button
            onClick={() => navigate({ to: "/home" })}
            className="btn-primary border-0"
          >
            Go Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  // ─── Sign-in guard ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 px-6 text-center"
          data-ocid="payment-signin-required"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
            <Lock size={36} className="text-primary" />
          </div>
          <h2 className="font-display text-xl font-black text-foreground mb-2">
            Sign in Required
          </h2>
          <p className="text-sm text-muted-foreground mb-1 leading-relaxed max-w-xs">
            Please sign in to complete your purchase — we'll send an order
            confirmation to your registered email.
          </p>
          <p className="text-xs text-muted-foreground mb-6 max-w-xs">
            Your cart items are saved and will be waiting for you.
          </p>
          <Button
            onClick={() => navigate({ to: "/login" })}
            className="btn-primary border-0 flex items-center gap-2 h-11 px-6 text-sm"
            data-ocid="payment-signin-button"
          >
            <LogIn size={18} />
            Sign In to Continue
          </Button>
        </div>
      </Layout>
    );
  }

  function buildDeliveryAddress(addr: CheckoutAddress) {
    return {
      name: addr.name,
      phone: addr.phone,
      houseNo: addr.houseNo,
      street: addr.street,
      locality: addr.locality,
      landmark: addr.landmark,
      city: addr.city,
      district: addr.district,
      state: addr.state,
      pincode: addr.pincode,
    };
  }

  async function createOrderInBackend(
    paymentMethod: "COD" | "ONLINE",
    paymentId?: string,
  ) {
    // Pre-flight: backend must be available
    if (!actor || actorFetching) {
      toast.error("Unable to connect. Please try again.");
      return;
    }

    // Pre-flight: address must exist
    const rawAddr = sessionStorage.getItem("checkout_address");
    if (!rawAddr) {
      toast.error(
        "Your address is missing — please go back and re-enter your delivery details.",
      );
      return;
    }

    let addr: CheckoutAddress;
    try {
      addr = JSON.parse(rawAddr) as CheckoutAddress;
    } catch {
      toast.error(
        "Your address data is invalid — please go back and re-enter your delivery details.",
      );
      return;
    }

    const deliveryAddress = buildDeliveryAddress(addr);
    const { deliveryType: dt, deliveryCost: dc } = readDeliveryFromSession();

    const orderItems = items.map(({ product, quantity }) => ({
      productId: BigInt(product.id),
      quantity: BigInt(quantity),
    }));

    const input: CreateOrderInput = {
      deliveryAddress,
      items: orderItems,
      paymentMethod:
        paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment",
      deliveryType: dt,
      deliveryCost: BigInt(dc),
    };

    // Call backend — any failure will be caught by the caller's try/catch
    const backend = actor as unknown as Backend;
    const order = await backend.createOrder(input);

    // Only clean up and navigate on success
    clearCart();
    sessionStorage.removeItem("checkout_address");
    sessionStorage.removeItem("checkout_delivery_type");
    sessionStorage.removeItem("checkout_delivery_cost");

    const successMsg =
      paymentMethod === "COD"
        ? "Order placed! Pay on delivery. 🎉"
        : `Order confirmed! Payment ID: ${paymentId ?? "N/A"} 🎉`;
    toast.success(successMsg);

    navigate({
      to: "/order-complete",
      search: { orderId: order.id.toString() },
    });
  }

  async function openRazorpay() {
    if (!actor || actorFetching) {
      toast.error("Unable to connect to payment service. Please try again.");
      setLoading(false);
      return;
    }

    // Validate minimum amount (100 paise = ₹1)
    const amountInPaise = Math.round(grandTotal);
    if (amountInPaise < 100) {
      toast.error("Order amount is too low for online payment (minimum ₹1).");
      setLoading(false);
      return;
    }

    const rawAddr = sessionStorage.getItem("checkout_address");
    const addr: CheckoutAddress | null = rawAddr
      ? (JSON.parse(rawAddr) as CheckoutAddress)
      : null;

    const receiptId = `receipt_${Date.now()}`;

    // Step 1: Create Razorpay order on backend
    const backend = actor as unknown as Backend;
    let razorpayOrderId: string;
    try {
      const result = await backend.createRazorpayOrder(
        BigInt(amountInPaise),
        receiptId,
      );
      if (result.__kind__ === "err") {
        toast.error(`Could not create payment order: ${result.err}`);
        setLoading(false);
        return;
      }
      razorpayOrderId = result.ok.orderId;
    } catch (err) {
      console.error("createRazorpayOrder failed", err);
      toast.error("Could not initialise payment. Please try again.");
      setLoading(false);
      return;
    }

    const rzpKey = "rzp_test_Six6S0hYJkJGqC";

    const options = {
      key: rzpKey,
      amount: amountInPaise,
      currency: "INR",
      name: "AssamRoots",
      description: "Order Payment",
      order_id: razorpayOrderId,
      handler: async (response: RazorpayResponse) => {
        // Step 2: Verify payment signature on backend
        try {
          const verifyResult = await backend.verifyRazorpayPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
          );

          if (verifyResult.__kind__ === "err" || !verifyResult.ok) {
            toast.error(
              `Payment verification failed. Contact support with your payment ID: ${response.razorpay_payment_id}`,
            );
            setLoading(false);
            return;
          }

          // Step 3: Only create order in backend after verified
          await createOrderInBackend("ONLINE", response.razorpay_payment_id);
        } catch (err) {
          console.error(
            "Order creation failed after payment verification",
            err,
          );
          toast.error(
            `Payment received but order creation failed. Please contact support with payment ID: ${response.razorpay_payment_id}`,
          );
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: addr?.name ?? "",
        contact: addr?.phone ?? "",
      },
      theme: { color: "#e65c00" },
      modal: {
        ondismiss: () => {
          setLoading(false);
          toast.info("Payment cancelled. Your cart is still saved.");
        },
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay(options);

    rzp.on(
      "payment.failed",
      (failResponse: { error: { description: string; code: string } }) => {
        console.error("Razorpay payment.failed", failResponse);
        toast.error(
          failResponse.error?.description
            ? `Payment failed: ${failResponse.error.description}`
            : "Payment failed. Please try again or choose a different payment method.",
        );
        setLoading(false);
      },
    );

    rzp.open();
  }

  async function handlePlaceOrder() {
    if (method === "cod") {
      setLoading(true);
      try {
        await createOrderInBackend("COD");
      } catch (err) {
        console.error("COD order creation failed", err);
        const message =
          err instanceof Error
            ? err.message
            : "Failed to place order. Please try again.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Online payment via Razorpay
    if (!rzpLoaded) {
      toast.error("Payment gateway is loading. Please wait a moment.");
      return;
    }
    setLoading(true);
    try {
      await openRazorpay();
    } catch (err) {
      console.error("Razorpay error", err);
      toast.error("Could not open payment gateway. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="px-4 py-4" data-ocid="payment-page">
        {/* Full-screen loading overlay while placing COD order */}
        {loading && method === "cod" && (
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
            aria-live="polite"
            aria-label="Placing your order"
          >
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-display font-semibold text-foreground text-base">
              Placing your order…
            </p>
            <p className="text-sm text-muted-foreground">
              Please don't close this page
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <Lock size={20} className="text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">
            Secure Payment
          </h1>
          <Badge
            variant="outline"
            className="ml-auto text-[10px] text-secondary border-secondary/40 px-2"
          >
            SSL Encrypted
          </Badge>
        </div>

        {/* ─── COD Recommendation Banner ──────────────────────────────── */}
        <div
          className="flex items-start gap-3 bg-secondary/10 border border-secondary/30 rounded-xl px-4 py-3.5 mb-5"
          role="note"
          data-ocid="payment-cod-recommendation"
        >
          <Star size={18} className="text-secondary flex-none mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">
              Cash on Delivery Recommended
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              No processing fees for this prototype. Pay when your order arrives
              at your doorstep.{" "}
              <span className="text-foreground font-medium">
                Online payment is also available.
              </span>
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div
          className="bg-card border border-border rounded-xl p-4 mb-5"
          data-ocid="payment-order-summary"
        >
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={14} className="text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">
              Order Summary ({items.length}{" "}
              {items.length === 1 ? "item" : "items"})
            </p>
          </div>

          <div className="space-y-2 mb-3">
            {items.map(({ product, quantity }) => {
              const priceBig = BigInt(product.price);
              const discountBig = BigInt(product.discountPercent);
              const qty = Number(quantity);
              const finalPrice = discountedPrice(priceBig, discountBig);
              return (
                <div
                  key={product.id.toString()}
                  className="flex items-center gap-2 text-xs"
                >
                  <img
                    src={
                      product.imageUrls[0] ?? "/assets/images/placeholder.svg"
                    }
                    alt={product.title}
                    className="w-8 h-8 rounded object-cover bg-muted flex-none"
                  />
                  <span className="text-muted-foreground flex-1 line-clamp-1 min-w-0">
                    {product.title} × {qty}
                  </span>
                  <span className="font-medium text-foreground flex-none">
                    {formatPrice(finalPrice * BigInt(qty))}
                  </span>
                </div>
              );
            })}
          </div>

          <Separator className="mb-3" />

          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(BigInt(Math.round(totalPrice)))}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span className="flex items-center gap-1">
                {isExpress ? (
                  <Zap size={10} className="text-primary" />
                ) : (
                  <Truck size={10} />
                )}
                {deliveryLabel}
              </span>
              {deliveryCost === 0 ? (
                <span className="text-secondary font-semibold">FREE</span>
              ) : (
                <span>{formatPrice(BigInt(deliveryCost))}</span>
              )}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-foreground">Total</span>
            <span className="text-lg font-black text-primary">
              {formatPrice(BigInt(Math.round(grandTotal)))}
            </span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3 mb-5" data-ocid="payment-methods">
          <p className="text-sm font-semibold text-foreground">
            Choose Payment Method
          </p>

          {/* Pay Online Card */}
          <button
            type="button"
            onClick={() => setMethod("online")}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-smooth text-left ${
              method === "online"
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/30"
            }`}
            data-ocid="payment-method-online"
          >
            <div
              className={`mt-0.5 p-2 rounded-lg flex-none ${method === "online" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              <CreditCard size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-bold ${method === "online" ? "text-foreground" : "text-muted-foreground"}`}
              >
                Pay Online
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                UPI, Credit/Debit Card, Net Banking, Wallets — powered by
                Razorpay
              </p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {["UPI", "GPay", "PhonePe", "Visa", "Mastercard", "RuPay"].map(
                  (b) => (
                    <span
                      key={b}
                      className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-medium text-muted-foreground"
                    >
                      {b}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex-none mt-1 transition-smooth ${
                method === "online"
                  ? "border-primary bg-primary"
                  : "border-border"
              }`}
            />
          </button>

          {/* Cash on Delivery Card */}
          <button
            type="button"
            onClick={() => setMethod("cod")}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-smooth text-left ${
              method === "cod"
                ? "border-secondary bg-secondary/5"
                : "border-border bg-card hover:border-secondary/30"
            }`}
            data-ocid="payment-method-cod"
          >
            <div
              className={`mt-0.5 p-2 rounded-lg flex-none ${method === "cod" ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}
            >
              <Banknote size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-bold ${method === "cod" ? "text-foreground" : "text-muted-foreground"}`}
              >
                Cash on Delivery
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pay in cash when your order arrives at your doorstep
              </p>
              <p className="text-xs text-secondary font-medium mt-1">
                Available across all serviceable Assam pincodes
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex-none mt-1 transition-smooth ${
                method === "cod"
                  ? "border-secondary bg-secondary"
                  : "border-border"
              }`}
            />
          </button>
        </div>

        {/* COD info panel */}
        {method === "cod" && (
          <div
            className="bg-muted/40 border border-border rounded-xl p-4 mb-5"
            data-ocid="payment-cod-info"
          >
            <div className="flex gap-3 items-start">
              <CheckCircle2
                size={18}
                className="text-secondary flex-none mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Cash on Delivery
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pay{" "}
                  <span className="font-semibold text-foreground">
                    {formatPrice(BigInt(Math.round(grandTotal)))}
                  </span>{" "}
                  in cash when your order arrives. Please keep exact change
                  ready.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Online payment info */}
        {method === "online" && (
          <div
            className="bg-muted/40 border border-border rounded-xl p-4 mb-5"
            data-ocid="payment-online-info"
          >
            <div className="flex gap-3 items-start">
              <Lock size={18} className="text-primary flex-none mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Secure Razorpay Checkout
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Clicking "Place Order" will open the Razorpay secure payment
                  window. Choose UPI, card, or net banking to complete your
                  payment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dev/test note */}
        <div
          className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 flex gap-2 items-start"
          data-ocid="payment-test-note"
        >
          <Info size={14} className="text-amber-600 flex-none mt-0.5" />
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Test mode active.</span> Use
            Razorpay test card{" "}
            <code className="bg-amber-100 px-1 rounded font-mono text-[11px]">
              4111 1111 1111 1111
            </code>{" "}
            with any future expiry and CVV to simulate a payment. Switch to a
            live key from your Razorpay dashboard when going live.
          </p>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-5">
          <Lock size={12} className="flex-none" />
          <span>100% secure payments · Powered by Razorpay</span>
        </div>

        {/* Place Order button */}
        <Button
          type="button"
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full btn-primary border-0 h-12 text-base font-bold"
          data-ocid="payment-submit"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              {method === "cod"
                ? "Placing your order…"
                : "Initialising payment…"}
            </span>
          ) : method === "cod" ? (
            <span className="flex items-center gap-2">
              <Banknote size={18} />
              Place Order (Cash on Delivery)
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CreditCard size={18} />
              Pay {formatPrice(BigInt(Math.round(grandTotal)))} Online
            </span>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-3">
          By placing your order, you agree to AssamRoots{" "}
          <span className="text-primary">Terms & Conditions</span>
        </p>
      </div>
    </Layout>
  );
}
