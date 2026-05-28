import type { CustomerReview, Product } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useReviews } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { MessageSquarePlus, ShoppingBag, Star } from "lucide-react";

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          // biome-ignore lint/suspicious/noArrayIndexKey:
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "fill-secondary text-secondary"
              : "fill-muted text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────────────────────
function ReviewCard({
  review,
  index,
}: {
  review: CustomerReview;
  index: number;
}) {
  const date = new Date(
    Number(review.createdAt) / 1_000_000,
  ).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
      data-ocid={`reviews.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-foreground truncate">
            {review.reviewerName}
          </p>
          <p className="text-xs text-muted-foreground font-body mt-0.5">
            {date}
          </p>
        </div>
        <StarRating rating={Number(review.rating)} />
      </div>
      <p className="font-body text-sm text-foreground leading-relaxed">
        {review.reviewText}
      </p>
      {review.productName && (
        <Badge
          variant="secondary"
          className="self-start text-xs font-body truncate max-w-[90%]"
        >
          {review.productName}
        </Badge>
      )}
    </div>
  );
}

// ─── Featured Product Panel ────────────────────────────────────────────────
function FeaturedProductPanel({ product }: { product: Product }) {
  const discountedPrice =
    product.discountPercent > 0n
      ? Number(product.price) * (1 - Number(product.discountPercent) / 100)
      : null;

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden shadow-sm sticky top-24"
      data-ocid="reviews.featured_product_card"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.imageUrls[0] || "/assets/images/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        {product.discountPercent > 0n && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            {Number(product.discountPercent)}% OFF
          </Badge>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-body uppercase tracking-widest text-secondary mb-1">
          Featured Product
        </p>
        <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display text-xl font-bold text-primary">
            ₹
            {discountedPrice !== null
              ? Math.round(discountedPrice)
              : Number(product.price)}
          </span>
          {discountedPrice !== null && (
            <span className="text-sm text-muted-foreground line-through font-body">
              ₹{Number(product.price)}
            </span>
          )}
        </div>
        <Link
          to="/products/$id"
          params={{ id: String(product.id) }}
          className="block"
        >
          <Button
            className="w-full gap-2"
            data-ocid="reviews.view_product_button"
          >
            <ShoppingBag className="w-4 h-4" /> View Product
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyReviews() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      data-ocid="reviews.empty_state"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <MessageSquarePlus className="w-8 h-8 text-primary" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">
        No reviews yet
      </h3>
      <p className="font-body text-sm text-muted-foreground max-w-xs">
        Be the first to share your experience with AssamRoots products.
      </p>
      <Link to="/home">
        <Button
          variant="default"
          className="mt-2"
          data-ocid="reviews.shop_now_button"
        >
          Start Shopping
        </Button>
      </Link>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function ReviewsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton array
          key={i}
          className="bg-card border border-border rounded-xl p-5 space-y-3"
        >
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews();
  const { data: products = [], isLoading: productsLoading } = useProducts({
    limit: 1,
  });
  const featuredProduct = products[0] ?? null;

  return (
    <Layout>
      {/* Header */}
      <section
        className="bg-card border-b border-border px-6 py-10 md:px-12"
        data-ocid="reviews.page_header"
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-body uppercase tracking-widest text-secondary mb-1">
            What our customers say
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Customer Reviews
          </h1>
          {reviews.length > 0 && (
            <p className="mt-2 font-body text-muted-foreground">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""} from our
              community
            </p>
          )}
        </div>
      </section>

      {/* Two-panel layout */}
      <section
        className="bg-background px-4 py-10 md:px-12 md:py-14"
        data-ocid="reviews.content_section"
      >
        <div className="max-w-6xl mx-auto">
          {reviewsLoading ? (
            <ReviewsSkeleton />
          ) : reviews.length === 0 ? (
            <EmptyReviews />
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Reviews panel — 65% */}
              <div className="flex-1 min-w-0" data-ocid="reviews.reviews_panel">
                <div className="grid gap-4 sm:grid-cols-2">
                  {reviews.map((review, i) => (
                    <ReviewCard
                      key={String(review.id)}
                      review={review}
                      index={i}
                    />
                  ))}
                </div>
              </div>

              {/* Featured product sidebar — 35% */}
              {!productsLoading && featuredProduct && (
                <div
                  className="w-full lg:w-80 xl:w-96 shrink-0"
                  data-ocid="reviews.product_sidebar"
                >
                  <FeaturedProductPanel product={featuredProduct} />
                </div>
              )}
              {productsLoading && (
                <div className="w-full lg:w-80 xl:w-96 shrink-0">
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-5 w-48 rounded" />
                      <Skeleton className="h-16 w-full rounded" />
                      <Skeleton className="h-9 w-full rounded" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
