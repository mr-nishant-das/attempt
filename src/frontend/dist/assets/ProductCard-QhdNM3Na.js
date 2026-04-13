import { j as jsxRuntimeExports, L as Link } from "./index-D4oc9L-H.js";
import { B as Badge } from "./badge-BLfyvmpN.js";
import { B as Button } from "./button-BheL6zVp.js";
import { d as discountedPrice, r as ratingToFloat, f as formatPrice } from "./types-Dmw7OeI0.js";
import { a as ShoppingCart } from "./Layout-CddzSLPN.js";
import { S as Star } from "./star-9xHOeBLP.js";
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      size: 12,
      className: i <= full ? "fill-accent text-accent" : half && i === full + 1 ? "fill-accent/50 text-accent" : "fill-muted text-muted-foreground"
    },
    i
  )) });
}
function ProductCard({
  product,
  onAddToCart,
  inCart,
  cartQty
}) {
  const finalPrice = discountedPrice(product.price, product.discountPercent);
  const hasDiscount = product.discountPercent > 0n;
  const rating = ratingToFloat(product.rating);
  const imageUrl = product.imageUrls[0] ?? "/assets/images/placeholder.svg";
  const outOfStock = product.stock <= 0n;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "card-product group flex flex-col overflow-hidden",
      "data-ocid": "product-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/products/$id", params: { id: product.id.toString() }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-muted aspect-square overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imageUrl,
              alt: product.title,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy"
            }
          ),
          hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5 border-0", children: [
            Number(product.discountPercent),
            "% OFF"
          ] }),
          outOfStock && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/70 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm font-semibold", children: "Out of Stock" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 p-3 gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/products/$id", params: { id: product.id.toString() }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors", children: product.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "(",
              Number(product.reviewCount),
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 mt-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-foreground", children: formatPrice(finalPrice) }),
            hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground line-through", children: formatPrice(product.price) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              disabled: outOfStock,
              onClick: () => onAddToCart == null ? void 0 : onAddToCart(product),
              "data-ocid": "product-add-to-cart",
              className: `w-full mt-1 text-xs font-semibold transition-smooth ${inCart ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "btn-primary border-0"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 13, className: "mr-1" }),
                inCart ? `In Cart (${cartQty})` : "Add to Cart"
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  ProductCard as P
};
