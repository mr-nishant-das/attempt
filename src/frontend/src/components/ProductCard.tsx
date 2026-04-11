import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { discountedPrice, formatPrice, ratingToFloat } from "@/types";
import type { Product } from "@/types";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  inCart?: boolean;
  cartQty?: number;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= full
              ? "fill-accent text-accent"
              : half && i === full + 1
                ? "fill-accent/50 text-accent"
                : "fill-muted text-muted-foreground"
          }
        />
      ))}
    </span>
  );
}

export function ProductCard({
  product,
  onAddToCart,
  inCart,
  cartQty,
}: ProductCardProps) {
  const finalPrice = discountedPrice(product.price, product.discountPercent);
  const hasDiscount = product.discountPercent > 0n;
  const rating = ratingToFloat(product.rating);
  const imageUrl = product.imageUrls[0] ?? "/assets/images/placeholder.svg";
  const outOfStock = product.stock <= 0n;

  return (
    <div
      className="card-product group flex flex-col overflow-hidden"
      data-ocid="product-card"
    >
      <Link to="/products/$id" params={{ id: product.id.toString() }}>
        <div className="relative bg-muted aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            loading="lazy"
          />
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5 border-0">
              {Number(product.discountPercent)}% OFF
            </Badge>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <Link to="/products/$id" params={{ id: product.id.toString() }}>
          <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </p>
        </Link>

        <div className="flex items-center gap-1.5">
          <StarRating rating={rating} />
          <span className="text-xs text-muted-foreground">
            ({Number(product.reviewCount)})
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-base font-bold text-foreground">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <Button
          size="sm"
          disabled={outOfStock}
          onClick={() => onAddToCart?.(product)}
          data-ocid="product-add-to-cart"
          className={`w-full mt-1 text-xs font-semibold transition-smooth ${
            inCart
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
              : "btn-primary border-0"
          }`}
        >
          <ShoppingCart size={13} className="mr-1" />
          {inCart ? `In Cart (${cartQty})` : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
