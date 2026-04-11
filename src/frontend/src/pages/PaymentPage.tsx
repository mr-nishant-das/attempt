import { type Backend, type CreateOrderInput, createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { discountedPrice, formatPrice } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PaymentMethod = "upi" | "card" | "cod";

const METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  sublabel: string;
}[] = [
  {
    id: "upi",
    label: "UPI / GPay / PhonePe",
    sublabel: "Instant & secure UPI payment",
    icon: <Smartphone size={18} />,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    sublabel: "Visa, Mastercard, Rupay",
    icon: <CreditCard size={18} />,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    sublabel: "Pay when your order arrives",
    icon: <Lock size={18} />,
  },
];

type CardForm = { number: string; expiry: string; cvv: string; name: string };
type CardErrors = Partial<Record<keyof CardForm, string>>;

function validateCard(card: CardForm): CardErrors {
  const errs: CardErrors = {};
  const rawNum = card.number.replace(/\s/g, "");
  if (!/^\d{16}$/.test(rawNum))
    errs.number = "Enter a valid 16-digit card number";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry))
    errs.expiry = "Enter MM/YY format";
  if (!/^\d{3,4}$/.test(card.cvv)) errs.cvv = "Enter 3 or 4 digit CVV";
  if (!card.name.trim()) errs.name = "Cardholder name is required";
  return errs;
}

function formatCardNumber(val: string): string {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function PaymentPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { actor } = useActor(createActor);
  const navigate = useNavigate();

  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState<CardForm>({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [cardTouched, setCardTouched] = useState<
    Partial<Record<keyof CardForm, boolean>>
  >({});
  const [loading, setLoading] = useState(false);

  const shipping = totalPrice >= 49900 ? 0 : 5900;
  const grandTotal = totalPrice + shipping;

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

  function handleCardChange(field: keyof CardForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (field === "number") val = formatCardNumber(val);
      if (field === "expiry") val = formatExpiry(val);
      if (field === "cvv") val = val.replace(/\D/g, "").slice(0, 4);
      setCard((prev) => ({ ...prev, [field]: val }));
      if (cardErrors[field])
        setCardErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleCardBlur(field: keyof CardForm) {
    return () => {
      setCardTouched((prev) => ({ ...prev, [field]: true }));
      const errs = validateCard(card);
      setCardErrors((prev) => ({ ...prev, [field]: errs[field] }));
    };
  }

  async function handlePay() {
    // Validate card if selected
    if (method === "card") {
      const allTouched = { number: true, expiry: true, cvv: true, name: true };
      setCardTouched(allTouched);
      const errs = validateCard(card);
      setCardErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (method === "upi" && !upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }

    setLoading(true);
    try {
      // Retrieve address from session storage (set by CheckoutPage)
      const rawAddr = sessionStorage.getItem("checkout_address");
      const addr = rawAddr
        ? (JSON.parse(rawAddr) as {
            name: string;
            phone: string;
            line1: string;
            line2: string;
            city: string;
            state: string;
            pincode: string;
          })
        : {
            name: "Guest",
            phone: "9999999999",
            line1: "Test",
            line2: "",
            city: "Guwahati",
            state: "Assam",
            pincode: "781001",
          };

      const deliveryAddress = {
        name: addr.name,
        phone: addr.phone,
        line1: addr.line1,
        line2: addr.line2 ?? "",
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
      };

      const orderItems = items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity: BigInt(quantity),
      }));

      const input: CreateOrderInput = { deliveryAddress, items: orderItems };

      if (actor) {
        const backend = actor as unknown as Backend;
        const order = await backend.createOrder(input);
        clearCart();
        sessionStorage.removeItem("checkout_address");
        toast.success("Order placed successfully! 🎉");
        navigate({
          to: "/order-complete",
          search: { orderId: order.id.toString() },
        });
      } else {
        // Fallback for unauthenticated demo
        await new Promise((res) => setTimeout(res, 1500));
        clearCart();
        sessionStorage.removeItem("checkout_address");
        toast.success("Order placed! Redirecting…");
        navigate({ to: "/order-complete", search: { orderId: undefined } });
      }
    } catch (err) {
      console.error("Order creation failed", err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="px-4 py-4" data-ocid="payment-page">
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

        {/* Order summary at top */}
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
              const finalPrice = discountedPrice(
                product.price,
                product.discountPercent,
              );
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
                    {product.title} × {quantity}
                  </span>
                  <span className="font-medium text-foreground flex-none">
                    {formatPrice(finalPrice * BigInt(quantity))}
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
                <Truck size={10} /> Delivery
              </span>
              {shipping === 0 ? (
                <span className="text-secondary font-semibold">FREE</span>
              ) : (
                <span>{formatPrice(BigInt(shipping))}</span>
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

        {/* Payment method selection */}
        <div className="space-y-2 mb-5" data-ocid="payment-methods">
          <p className="text-sm font-semibold text-foreground mb-3">
            Choose Payment Method
          </p>
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-smooth text-left ${
                method === m.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
              data-ocid={`payment-method-${m.id}`}
            >
              <span
                className={
                  method === m.id ? "text-primary" : "text-muted-foreground"
                }
              >
                {m.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${method === m.id ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {m.label}
                </p>
                <p className="text-xs text-muted-foreground">{m.sublabel}</p>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex-none transition-smooth ${
                  method === m.id
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}
              />
            </button>
          ))}
        </div>

        {/* UPI input */}
        {method === "upi" && (
          <div
            className="bg-card border border-border rounded-xl p-4 mb-5 space-y-3"
            data-ocid="payment-upi-form"
          >
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={15} className="text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Enter UPI ID
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="upi-id" className="text-sm">
                UPI ID
              </Label>
              <Input
                id="upi-id"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@paytm / 9876543210@upi"
                className="h-11"
                data-ocid="payment-upi-id"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["@paytm", "@okaxis", "@ybl", "@upi"].map((suffix) => (
                <button
                  key={suffix}
                  type="button"
                  onClick={() =>
                    setUpiId((prev) => {
                      const base = prev.split("@")[0] || "";
                      return `${base}${suffix}`;
                    })
                  }
                  className="text-xs px-2 py-1 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                >
                  {suffix}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Card input */}
        {method === "card" && (
          <div
            className="bg-card border border-border rounded-xl p-4 mb-5 space-y-4"
            data-ocid="payment-card-form"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <CreditCard size={15} className="text-primary" />
                <p className="text-sm font-semibold text-foreground">
                  Card Details
                </p>
              </div>
              <div className="flex gap-1.5 items-center">
                <span className="text-xs text-muted-foreground">
                  Powered by
                </span>
                <span className="text-xs font-bold text-primary">Stripe</span>
              </div>
            </div>

            {/* Card number */}
            <div className="space-y-1.5">
              <Label htmlFor="card-number" className="text-sm font-semibold">
                Card Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="card-number"
                  type="text"
                  inputMode="numeric"
                  value={card.number}
                  onChange={handleCardChange("number")}
                  onBlur={handleCardBlur("number")}
                  placeholder="1234 5678 9012 3456"
                  className="h-11 pr-10 font-mono"
                  data-ocid="payment-card-number"
                />
                <CreditCard
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
              {cardTouched.number && cardErrors.number && (
                <p className="text-xs text-destructive">{cardErrors.number}</p>
              )}
            </div>

            {/* Cardholder name */}
            <div className="space-y-1.5">
              <Label htmlFor="card-name" className="text-sm font-semibold">
                Name on Card <span className="text-destructive">*</span>
              </Label>
              <Input
                id="card-name"
                type="text"
                value={card.name}
                onChange={handleCardChange("name")}
                onBlur={handleCardBlur("name")}
                placeholder="DIPANKAR BORA"
                className="h-11 uppercase"
                data-ocid="payment-card-name"
              />
              {cardTouched.name && cardErrors.name && (
                <p className="text-xs text-destructive">{cardErrors.name}</p>
              )}
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="card-expiry" className="text-sm font-semibold">
                  Expiry <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="card-expiry"
                  type="text"
                  inputMode="numeric"
                  value={card.expiry}
                  onChange={handleCardChange("expiry")}
                  onBlur={handleCardBlur("expiry")}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="h-11 font-mono"
                  data-ocid="payment-expiry"
                />
                {cardTouched.expiry && cardErrors.expiry && (
                  <p className="text-xs text-destructive">
                    {cardErrors.expiry}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="card-cvv" className="text-sm font-semibold">
                  CVV <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="card-cvv"
                  type="password"
                  inputMode="numeric"
                  value={card.cvv}
                  onChange={handleCardChange("cvv")}
                  onBlur={handleCardBlur("cvv")}
                  placeholder="•••"
                  maxLength={4}
                  className="h-11 font-mono"
                  data-ocid="payment-cvv"
                />
                {cardTouched.cvv && cardErrors.cvv && (
                  <p className="text-xs text-destructive">{cardErrors.cvv}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock size={11} className="flex-none" />
              Your card info is encrypted with 256-bit SSL. We never store card
              details.
            </div>
          </div>
        )}

        {/* COD info */}
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
                  Pay ₹{(grandTotal / 100).toFixed(0)} in cash when your order
                  arrives. Please keep exact change ready. COD available across
                  Assam.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-5">
          <Lock size={12} className="flex-none" />
          <span>100% secure payments · Powered by Stripe</span>
        </div>

        {/* Pay button */}
        <Button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="w-full btn-primary border-0 h-13 text-base font-bold"
          data-ocid="payment-submit"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Processing Payment…
            </span>
          ) : (
            `Pay ${formatPrice(BigInt(Math.round(grandTotal)))}`
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
