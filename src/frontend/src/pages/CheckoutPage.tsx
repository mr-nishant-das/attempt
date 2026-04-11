import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { discountedPrice, formatPrice } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// Indian pincode validation — 6 digits starting with 1-9
const PINCODE_RE = /^[1-9][0-9]{5}$/;
const PHONE_RE = /^(\+91[-\s]?)?[6-9]\d{9}$/;

// Serviceable Assam pincodes (sample for MVP)
const SERVICEABLE_PINCODES = new Set([
  "781001",
  "781006",
  "781007",
  "781003",
  "781005",
  "782001",
  "782002",
  "784001",
  "785001",
  "786001",
  "787001",
  "788001",
  "788002",
  "783101",
  "781101",
]);

type FormState = {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): FormErrors {
  const errs: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 3)
    errs.name = "Full name must be at least 3 characters";
  if (!PHONE_RE.test(form.phone.replace(/\s/g, "")))
    errs.phone = "Enter a valid 10-digit Indian mobile number";
  if (!form.line1.trim() || form.line1.trim().length < 5)
    errs.line1 = "Please enter a complete address";
  if (!form.city.trim()) errs.city = "City is required";
  if (!form.state.trim()) errs.state = "State is required";
  if (!PINCODE_RE.test(form.pincode))
    errs.pincode = "Enter a valid 6-digit pincode";
  return errs;
}

type PincodeStatus = "idle" | "checking" | "serviceable" | "not-serviceable";

export default function CheckoutPage() {
  const { items, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Assam",
    pincode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});
  const [pincodeStatus, setPincodeStatus] = useState<PincodeStatus>("idle");

  const shipping = totalPrice >= 49900 ? 0 : 5900;
  const grandTotal = totalPrice + shipping;

  // Simulate pincode check when pincode has 6 digits
  useEffect(() => {
    if (form.pincode.length === 6) {
      setPincodeStatus("checking");
      const timer = setTimeout(() => {
        setPincodeStatus(
          SERVICEABLE_PINCODES.has(form.pincode)
            ? "serviceable"
            : "not-serviceable",
        );
      }, 600);
      return () => clearTimeout(timer);
    }
    setPincodeStatus("idle");
  }, [form.pincode]);

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error on change
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleBlur(field: keyof FormState) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const fieldErrors = validateForm(form);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mark all touched
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true]),
    );
    setTouched(allTouched as Partial<Record<keyof FormState, boolean>>);
    const fieldErrors = validateForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    if (pincodeStatus === "not-serviceable") return;

    // Persist address data to sessionStorage for PaymentPage
    sessionStorage.setItem("checkout_address", JSON.stringify(form));
    navigate({ to: "/payment" });
  }

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center py-20 px-6 text-center"
          data-ocid="checkout-empty"
        >
          <ShoppingBag size={48} className="text-muted-foreground/40 mb-4" />
          <p className="font-display font-bold text-lg text-foreground mb-2">
            Nothing to checkout
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Your cart is empty. Add some products first!
          </p>
          <Button
            onClick={() => navigate({ to: "/home" })}
            className="btn-primary border-0"
          >
            Continue Shopping
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-4" data-ocid="checkout-page">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <MapPin size={20} className="text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">
            Delivery Address
          </h1>
        </div>

        {/* Auth nudge */}
        {!isAuthenticated && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 mb-4 text-xs text-accent-foreground">
            <span className="font-semibold">💡 Tip:</span> Log in to save your
            address for faster checkout next time.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Address form card */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="checkout-name" className="text-sm font-semibold">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="checkout-name"
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                placeholder="Dipankar Bora"
                className="h-11"
                aria-describedby={errors.name ? "name-error" : undefined}
                data-ocid="checkout-name"
              />
              {touched.name && errors.name && (
                <p
                  id="name-error"
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  <XCircle size={11} /> {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="checkout-phone" className="text-sm font-semibold">
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <span className="h-11 flex items-center px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground font-mono font-semibold flex-none">
                  +91
                </span>
                <Input
                  id="checkout-phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  placeholder="98765 43210"
                  className="h-11"
                  maxLength={14}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  data-ocid="checkout-phone"
                />
              </div>
              {touched.phone && errors.phone && (
                <p
                  id="phone-error"
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  <XCircle size={11} /> {errors.phone}
                </p>
              )}
            </div>

            {/* Address Line 1 */}
            <div className="space-y-1.5">
              <Label htmlFor="checkout-line1" className="text-sm font-semibold">
                Address Line 1 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="checkout-line1"
                type="text"
                value={form.line1}
                onChange={handleChange("line1")}
                onBlur={handleBlur("line1")}
                placeholder="House/Flat No., Building, Street"
                className="h-11"
                data-ocid="checkout-line1"
              />
              {touched.line1 && errors.line1 && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle size={11} /> {errors.line1}
                </p>
              )}
            </div>

            {/* Address Line 2 */}
            <div className="space-y-1.5">
              <Label
                htmlFor="checkout-line2"
                className="text-sm font-semibold text-muted-foreground"
              >
                Address Line 2{" "}
                <span className="text-xs font-normal">(optional)</span>
              </Label>
              <Input
                id="checkout-line2"
                type="text"
                value={form.line2}
                onChange={handleChange("line2")}
                placeholder="Area, Colony, Landmark"
                className="h-11"
                data-ocid="checkout-line2"
              />
            </div>

            {/* City + State grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="checkout-city"
                  className="text-sm font-semibold"
                >
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="checkout-city"
                  type="text"
                  value={form.city}
                  onChange={handleChange("city")}
                  onBlur={handleBlur("city")}
                  placeholder="Guwahati"
                  className="h-11"
                  data-ocid="checkout-city"
                />
                {touched.city && errors.city && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle size={11} /> {errors.city}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="checkout-state"
                  className="text-sm font-semibold"
                >
                  State <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="checkout-state"
                  type="text"
                  value={form.state}
                  onChange={handleChange("state")}
                  onBlur={handleBlur("state")}
                  placeholder="Assam"
                  className="h-11"
                  data-ocid="checkout-state"
                />
                {touched.state && errors.state && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle size={11} /> {errors.state}
                  </p>
                )}
              </div>
            </div>

            {/* Pincode with service check */}
            <div className="space-y-1.5">
              <Label
                htmlFor="checkout-pincode"
                className="text-sm font-semibold"
              >
                Pincode <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="checkout-pincode"
                  type="text"
                  inputMode="numeric"
                  value={form.pincode}
                  onChange={handleChange("pincode")}
                  onBlur={handleBlur("pincode")}
                  placeholder="781001"
                  maxLength={6}
                  className={`h-11 pr-10 ${
                    pincodeStatus === "serviceable"
                      ? "border-secondary focus:border-secondary"
                      : pincodeStatus === "not-serviceable"
                        ? "border-destructive focus:border-destructive"
                        : ""
                  }`}
                  data-ocid="checkout-pincode"
                />
                {pincodeStatus === "checking" && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {pincodeStatus === "serviceable" && (
                  <CheckCircle2
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
                  />
                )}
                {pincodeStatus === "not-serviceable" && (
                  <XCircle
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
                  />
                )}
              </div>
              {pincodeStatus === "serviceable" && (
                <p className="text-xs text-secondary flex items-center gap-1 font-medium">
                  <CheckCircle2 size={11} /> Delivery available to this pincode!
                </p>
              )}
              {pincodeStatus === "not-serviceable" && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <XCircle size={11} /> Sorry, we don't deliver to this pincode
                  yet.
                </p>
              )}
              {touched.pincode &&
                errors.pincode &&
                pincodeStatus === "idle" && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <XCircle size={11} /> {errors.pincode}
                  </p>
                )}
            </div>
          </div>

          {/* Order Summary */}
          <div
            className="bg-muted/40 border border-border rounded-xl p-4"
            data-ocid="checkout-order-summary"
          >
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={15} className="text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">
                Order Summary ({totalItems}{" "}
                {totalItems === 1 ? "item" : "items"})
              </p>
            </div>

            <div className="space-y-1.5 mb-3">
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
                      className="w-8 h-8 object-cover rounded flex-none bg-muted"
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

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(BigInt(Math.round(totalPrice)))}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Truck size={11} /> Delivery
                </span>
                {shipping === 0 ? (
                  <span className="text-secondary font-semibold">FREE</span>
                ) : (
                  <span>{formatPrice(BigInt(shipping))}</span>
                )}
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between text-sm font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">
                {formatPrice(BigInt(Math.round(grandTotal)))}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-primary border-0 h-12 text-base font-bold flex items-center justify-center gap-2"
            disabled={
              pincodeStatus === "not-serviceable" ||
              pincodeStatus === "checking"
            }
            data-ocid="checkout-submit"
          >
            Continue to Payment
            <ArrowRight size={18} />
          </Button>

          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            🔒 Your information is secure and encrypted
          </p>
        </form>
      </div>
    </Layout>
  );
}
