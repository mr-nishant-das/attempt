import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { discountedPrice, formatPrice } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";

const FREE_DELIVERY_THRESHOLD = 49900; // paise = ₹499

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } =
    useCart();
  const navigate = useNavigate();

  const shipping = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : 5900;
  const grandTotal = totalPrice + shipping;
  const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - totalPrice;

  if (items.length === 0) {
    return (
      <Layout>
        <div
          className="flex flex-col items-center justify-center text-center py-20 px-6 min-h-[60vh]"
          data-ocid="cart-empty"
        >
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-5">
            <ShoppingBag size={40} className="text-muted-foreground/50" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs">
            Looks like you haven't added any authentic Assamese products yet.
            Start browsing!
          </p>
          <Link to="/home">
            <Button
              className="btn-primary border-0 px-8 h-12"
              data-ocid="cart-shop-now"
            >
              Start Shopping
            </Button>
          </Link>
          <Link
            to="/categories"
            className="mt-3 text-sm text-primary hover:underline"
          >
            Browse categories
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-4" data-ocid="cart-page">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-xl font-bold text-foreground">
            My Cart
          </h1>
          <Badge variant="secondary" className="text-xs font-semibold">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </Badge>
        </div>

        {/* Free delivery progress bar */}
        {amountToFreeDelivery > 0 && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 mb-4 flex items-center gap-2">
            <Truck size={16} className="text-accent flex-none" />
            <p className="text-xs text-accent-foreground font-medium">
              Add{" "}
              <span className="font-bold text-accent">
                ₹{Math.ceil(amountToFreeDelivery / 100)}
              </span>{" "}
              more for <span className="font-bold">FREE delivery</span>
            </p>
          </div>
        )}
        {amountToFreeDelivery <= 0 && (
          <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3 mb-4 flex items-center gap-2">
            <Truck size={16} className="text-secondary flex-none" />
            <p className="text-xs text-secondary font-semibold">
              🎉 You've unlocked FREE delivery!
            </p>
          </div>
        )}

        {/* Cart items */}
        <div className="space-y-3 mb-5" data-ocid="cart-items-list">
          {items.map(({ product, quantity }) => {
            // Explicit conversions: localStorage reviver restores bigint, but
            // guard with BigInt() in case an older entry slipped through as number.
            const priceBig = BigInt(product.price);
            const discountBig = BigInt(product.discountPercent);
            const finalPrice = discountedPrice(priceBig, discountBig);
            const itemSubtotal = finalPrice * BigInt(quantity);
            const hasDiscount = discountBig > 0n;

            return (
              <div
                key={product.id.toString()}
                className="bg-card border border-border rounded-xl p-3 flex gap-3 transition-smooth"
                data-ocid="cart-item"
              >
                {/* Product image */}
                <Link
                  to="/products/$id"
                  params={{ id: product.id.toString() }}
                  className="flex-none"
                >
                  <img
                    src={
                      product.imageUrls[0] ?? "/assets/images/placeholder.svg"
                    }
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-lg bg-muted"
                    loading="lazy"
                  />
                </Link>

                {/* Product details */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <Link
                    to="/products/$id"
                    params={{ id: product.id.toString() }}
                  >
                    <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
                      {product.title}
                    </p>
                  </Link>

                  <p className="text-xs text-muted-foreground">
                    {product.brand}
                  </p>

                  {/* Price row */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-foreground text-sm">
                      {formatPrice(finalPrice)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(priceBig)}
                        </span>
                        <span className="text-xs font-semibold text-secondary">
                          {discountBig.toString()}% off
                        </span>
                      </>
                    )}
                  </div>

                  {/* Quantity controls + remove */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(BigInt(product.id), quantity - 1)
                        }
                        className="p-2 hover:bg-muted transition-colors active:scale-95"
                        aria-label="Decrease quantity"
                        data-ocid="cart-qty-decrease"
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        className="text-sm font-bold px-3 min-w-[2rem] text-center"
                        aria-live="polite"
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(BigInt(product.id), quantity + 1)
                        }
                        disabled={quantity >= Number(product.stock)}
                        className="p-2 hover:bg-muted transition-colors active:scale-95 disabled:opacity-40"
                        aria-label="Increase quantity"
                        data-ocid="cart-qty-increase"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-foreground">
                        {formatPrice(itemSubtotal)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(BigInt(product.id))}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10"
                        aria-label={`Remove ${product.title} from cart`}
                        data-ocid="cart-item-remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Promo code stub */}
        <div className="bg-muted/40 border border-dashed border-border rounded-xl p-3 mb-4 flex items-center gap-2">
          <Tag size={15} className="text-muted-foreground flex-none" />
          <span className="text-sm text-muted-foreground">
            Have a promo code? Apply at checkout
          </span>
        </div>

        {/* Order Summary card */}
        <div
          className="bg-card border border-border rounded-xl p-4 space-y-2.5 mb-5"
          data-ocid="cart-order-summary"
        >
          <p className="font-display font-bold text-foreground text-sm">
            Price Breakdown
          </p>

          {items.map(({ product, quantity }) => {
            const finalPrice = discountedPrice(
              BigInt(product.price),
              BigInt(product.discountPercent),
            );
            return (
              <div
                key={product.id.toString()}
                className="flex justify-between text-xs"
              >
                <span className="text-muted-foreground line-clamp-1 pr-4">
                  {product.title} × {quantity}
                </span>
                <span className="font-medium text-foreground flex-none">
                  {formatPrice(finalPrice * BigInt(quantity))}
                </span>
              </div>
            );
          })}

          <Separator />

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">
              {formatPrice(BigInt(Math.round(totalPrice)))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Truck size={13} /> Delivery
            </span>
            {shipping === 0 ? (
              <span className="font-semibold text-secondary">FREE</span>
            ) : (
              <span className="font-medium text-foreground">
                {formatPrice(BigInt(shipping))}
              </span>
            )}
          </div>

          <Separator />

          <div className="flex justify-between text-base font-bold">
            <span className="text-foreground">Total Amount</span>
            <span className="text-primary">
              {formatPrice(BigInt(Math.round(grandTotal)))}
            </span>
          </div>

          {/* Savings callout */}
          {items.some((i) => BigInt(i.product.discountPercent) > 0n) && (
            <div className="bg-secondary/10 rounded-lg p-2 text-xs text-secondary font-semibold text-center">
              🎁 You're saving{" "}
              {formatPrice(
                BigInt(
                  Math.round(
                    items.reduce((acc, { product, quantity }) => {
                      const original = Number(product.price) * quantity;
                      const discounted =
                        ((Number(product.price) *
                          (100 - Number(product.discountPercent))) /
                          100) *
                        quantity;
                      return acc + (original - discounted);
                    }, 0),
                  ),
                ),
              )}{" "}
              on this order!
            </div>
          )}
        </div>

        {/* Checkout CTA */}
        <Button
          onClick={() => navigate({ to: "/checkout" })}
          className="w-full btn-primary border-0 h-13 text-base font-bold flex items-center justify-center gap-2"
          data-ocid="cart-checkout"
        >
          Proceed to Checkout
          <ArrowRight size={18} />
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1">
          <span>🔒</span> Safe & Secure Payments
        </p>
      </div>
    </Layout>
  );
}
