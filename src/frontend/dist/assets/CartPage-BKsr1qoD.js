import { u as useNavigate, j as jsxRuntimeExports, L as Link } from "./index-CstiQ4sz.js";
import { u as useCart, L as Layout } from "./Layout-BaVl6Ee_.js";
import { B as Badge } from "./badge-COIfXMhJ.js";
import { B as Button } from "./button-T7X4xHPX.js";
import { S as Separator } from "./separator-B5LqZPGs.js";
import { f as formatPrice, d as discountedPrice } from "./types-_UKd8--C.js";
import { S as ShoppingBag } from "./shopping-bag-D9TtHJ4I.js";
import { T as Truck } from "./truck-kLCYE6aP.js";
import { M as Minus } from "./minus-KMoffWer.js";
import { P as Plus } from "./plus-BmxuJhdF.js";
import { T as Trash2 } from "./trash-2-Bx-_1ZeS.js";
import { T as Tag } from "./tag-BAplgXF0.js";
import { A as ArrowRight } from "./arrow-right-C2C2K9N6.js";
import "./createLucideIcon-ByrRp2U0.js";
import "./useQueries-CA65lisC.js";
import "./backend-Dxpf4-N4.js";
import "./index-DbvNitIR.js";
import "./index-h3cuVvEG.js";
const FREE_DELIVERY_THRESHOLD = 49900;
function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const shipping = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : 5900;
  const grandTotal = totalPrice + shipping;
  const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - totalPrice;
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center text-center py-20 px-6 min-h-[60vh]",
        "data-ocid": "cart-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 40, className: "text-muted-foreground/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground mb-2", children: "Your cart is empty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-8 max-w-xs", children: "Looks like you haven't added any authentic Assamese products yet. Start browsing!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "btn-primary border-0 px-8 h-12",
              "data-ocid": "cart-shop-now",
              children: "Start Shopping"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/categories",
              className: "mt-3 text-sm text-primary hover:underline",
              children: "Browse categories"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", "data-ocid": "cart-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "My Cart" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs font-semibold", children: [
        totalItems,
        " ",
        totalItems === 1 ? "item" : "items"
      ] })
    ] }),
    amountToFreeDelivery > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-accent/10 border border-accent/20 rounded-xl p-3 mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16, className: "text-accent flex-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-accent-foreground font-medium", children: [
        "Add",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-accent", children: [
          "₹",
          Math.ceil(amountToFreeDelivery / 100)
        ] }),
        " ",
        "more for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "FREE delivery" })
      ] })
    ] }),
    amountToFreeDelivery <= 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/10 border border-secondary/20 rounded-xl p-3 mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16, className: "text-secondary flex-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-secondary font-semibold", children: "🎉 You've unlocked FREE delivery!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mb-5", "data-ocid": "cart-items-list", children: items.map(({ product, quantity }) => {
      const priceBig = BigInt(product.price);
      const discountBig = BigInt(product.discountPercent);
      const finalPrice = discountedPrice(priceBig, discountBig);
      const itemSubtotal = finalPrice * BigInt(quantity);
      const hasDiscount = discountBig > 0n;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3 flex gap-3 transition-smooth",
          "data-ocid": "cart-item",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/products/$id",
                params: { id: product.id.toString() },
                className: "flex-none",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: product.imageUrls[0] ?? "/assets/images/placeholder.svg",
                    alt: product.title,
                    className: "w-20 h-20 object-cover rounded-lg bg-muted",
                    loading: "lazy"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/products/$id",
                  params: { id: product.id.toString() },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors", children: product.title })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: product.brand }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground text-sm", children: formatPrice(finalPrice) }),
                hasDiscount && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground line-through", children: formatPrice(priceBig) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-secondary", children: [
                    discountBig.toString(),
                    "% off"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-border rounded-lg overflow-hidden", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => updateQuantity(BigInt(product.id), quantity - 1),
                      className: "p-2 hover:bg-muted transition-colors active:scale-95",
                      "aria-label": "Decrease quantity",
                      "data-ocid": "cart-qty-decrease",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 12 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-sm font-bold px-3 min-w-[2rem] text-center",
                      "aria-live": "polite",
                      children: quantity
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => updateQuantity(BigInt(product.id), quantity + 1),
                      disabled: quantity >= Number(product.stock),
                      className: "p-2 hover:bg-muted transition-colors active:scale-95 disabled:opacity-40",
                      "aria-label": "Increase quantity",
                      "data-ocid": "cart-qty-increase",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: formatPrice(itemSubtotal) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeItem(BigInt(product.id)),
                      className: "text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10",
                      "aria-label": `Remove ${product.title} from cart`,
                      "data-ocid": "cart-item-remove",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 })
                    }
                  )
                ] })
              ] })
            ] })
          ]
        },
        product.id.toString()
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 border border-dashed border-border rounded-xl p-3 mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 15, className: "text-muted-foreground flex-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Have a promo code? Apply at checkout" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 space-y-2.5 mb-5",
        "data-ocid": "cart-order-summary",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: "Price Breakdown" }),
          items.map(({ product, quantity }) => {
            const finalPrice = discountedPrice(
              BigInt(product.price),
              BigInt(product.discountPercent)
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex justify-between text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground line-clamp-1 pr-4", children: [
                    product.title,
                    " × ",
                    quantity
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground flex-none", children: formatPrice(finalPrice * BigInt(quantity)) })
                ]
              },
              product.id.toString()
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatPrice(BigInt(Math.round(totalPrice))) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 13 }),
              " Delivery"
            ] }),
            shipping === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-secondary", children: "FREE" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatPrice(BigInt(shipping)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-base font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Total Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: formatPrice(BigInt(Math.round(grandTotal))) })
          ] }),
          items.some((i) => BigInt(i.product.discountPercent) > 0n) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/10 rounded-lg p-2 text-xs text-secondary font-semibold text-center", children: [
            "🎁 You're saving",
            " ",
            formatPrice(
              BigInt(
                Math.round(
                  items.reduce((acc, { product, quantity }) => {
                    const original = Number(product.price) * quantity;
                    const discounted = Number(product.price) * (100 - Number(product.discountPercent)) / 100 * quantity;
                    return acc + (original - discounted);
                  }, 0)
                )
              )
            ),
            " ",
            "on this order!"
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        onClick: () => navigate({ to: "/checkout" }),
        className: "w-full btn-primary border-0 h-13 text-base font-bold flex items-center justify-center gap-2",
        "data-ocid": "cart-checkout",
        children: [
          "Proceed to Checkout",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18 })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔒" }),
      " Safe & Secure Payments"
    ] })
  ] }) });
}
export {
  CartPage as default
};
