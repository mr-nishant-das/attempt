import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-D4oc9L-H.js";
import { c as createActor } from "./backend-_UQ-CFUH.js";
import { u as useCart, L as Layout } from "./Layout-CddzSLPN.js";
import { B as Badge } from "./badge-BLfyvmpN.js";
import { B as Button } from "./button-BheL6zVp.js";
import { L as Label, I as Input } from "./label-P3qVKHAO.js";
import { S as Separator } from "./separator-iGl_Yi_h.js";
import { d as discountedPrice, f as formatPrice } from "./types-Dmw7OeI0.js";
import { u as useActor } from "./useActor-Cd9Rra9U.js";
import { u as ue } from "./index-3971ZbfT.js";
import { S as ShoppingBag } from "./shopping-bag-BQ9V6C93.js";
import { c as createLucideIcon } from "./createLucideIcon-DMAq5fnw.js";
import { T as Truck } from "./truck-C47g66Kf.js";
import { C as CircleCheck } from "./circle-check-CScK-JOr.js";
import "./index-CT5_lWjy.js";
import "./index-BmjgszZ4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
];
const Smartphone = createLucideIcon("smartphone", __iconNode);
const METHODS = [
  {
    id: "upi",
    label: "UPI / GPay / PhonePe",
    sublabel: "Instant & secure UPI payment",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 18 })
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    sublabel: "Visa, Mastercard, Rupay",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 18 })
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    sublabel: "Pay when your order arrives",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 18 })
  }
];
function validateCard(card) {
  const errs = {};
  const rawNum = card.number.replace(/\s/g, "");
  if (!/^\d{16}$/.test(rawNum))
    errs.number = "Enter a valid 16-digit card number";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry))
    errs.expiry = "Enter MM/YY format";
  if (!/^\d{3,4}$/.test(card.cvv)) errs.cvv = "Enter 3 or 4 digit CVV";
  if (!card.name.trim()) errs.name = "Cardholder name is required";
  return errs;
}
function formatCardNumber(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}
function PaymentPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { actor } = useActor(createActor);
  const navigate = useNavigate();
  const [method, setMethod] = reactExports.useState("upi");
  const [upiId, setUpiId] = reactExports.useState("");
  const [card, setCard] = reactExports.useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [cardErrors, setCardErrors] = reactExports.useState({});
  const [cardTouched, setCardTouched] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(false);
  const shipping = totalPrice >= 49900 ? 0 : 5900;
  const grandTotal = totalPrice + shipping;
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 48, className: "text-muted-foreground/40 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg mb-2", children: "Nothing to pay for" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => navigate({ to: "/home" }),
          className: "btn-primary border-0",
          children: "Go Shopping"
        }
      )
    ] }) });
  }
  function handleCardChange(field) {
    return (e) => {
      let val = e.target.value;
      if (field === "number") val = formatCardNumber(val);
      if (field === "expiry") val = formatExpiry(val);
      if (field === "cvv") val = val.replace(/\D/g, "").slice(0, 4);
      setCard((prev) => ({ ...prev, [field]: val }));
      if (cardErrors[field])
        setCardErrors((prev) => ({ ...prev, [field]: void 0 }));
    };
  }
  function handleCardBlur(field) {
    return () => {
      setCardTouched((prev) => ({ ...prev, [field]: true }));
      const errs = validateCard(card);
      setCardErrors((prev) => ({ ...prev, [field]: errs[field] }));
    };
  }
  async function handlePay() {
    if (method === "card") {
      const allTouched = { number: true, expiry: true, cvv: true, name: true };
      setCardTouched(allTouched);
      const errs = validateCard(card);
      setCardErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (method === "upi" && !upiId.trim()) {
      ue.error("Please enter your UPI ID");
      return;
    }
    setLoading(true);
    try {
      const rawAddr = sessionStorage.getItem("checkout_address");
      const addr = rawAddr ? JSON.parse(rawAddr) : {
        name: "Guest",
        phone: "9999999999",
        line1: "Test",
        line2: "",
        city: "Guwahati",
        state: "Assam",
        pincode: "781001"
      };
      const deliveryAddress = {
        name: addr.name,
        phone: addr.phone,
        line1: addr.line1,
        line2: addr.line2 ?? "",
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode
      };
      const orderItems = items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity: BigInt(quantity)
      }));
      const input = { deliveryAddress, items: orderItems };
      if (actor) {
        const backend = actor;
        const order = await backend.createOrder(input);
        clearCart();
        sessionStorage.removeItem("checkout_address");
        ue.success("Order placed successfully! 🎉");
        navigate({
          to: "/order-complete",
          search: { orderId: order.id.toString() }
        });
      } else {
        await new Promise((res) => setTimeout(res, 1500));
        clearCart();
        sessionStorage.removeItem("checkout_address");
        ue.success("Order placed! Redirecting…");
        navigate({ to: "/order-complete", search: { orderId: void 0 } });
      }
    } catch (err) {
      console.error("Order creation failed", err);
      ue.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", "data-ocid": "payment-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 20, className: "text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Secure Payment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: "ml-auto text-[10px] text-secondary border-secondary/40 px-2",
          children: "SSL Encrypted"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 mb-5",
        "data-ocid": "payment-order-summary",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 14, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
              "Order Summary (",
              items.length,
              " ",
              items.length === 1 ? "item" : "items",
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-3", children: items.map(({ product, quantity }) => {
            const finalPrice = discountedPrice(
              product.price,
              product.discountPercent
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: product.imageUrls[0] ?? "/assets/images/placeholder.svg",
                      alt: product.title,
                      className: "w-8 h-8 rounded object-cover bg-muted flex-none"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground flex-1 line-clamp-1 min-w-0", children: [
                    product.title,
                    " × ",
                    quantity
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground flex-none", children: formatPrice(finalPrice * BigInt(quantity)) })
                ]
              },
              product.id.toString()
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(BigInt(Math.round(totalPrice))) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 10 }),
                " Delivery"
              ] }),
              shipping === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-semibold", children: "FREE" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(BigInt(shipping)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-black text-primary", children: formatPrice(BigInt(Math.round(grandTotal))) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-5", "data-ocid": "payment-methods", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-3", children: "Choose Payment Method" }),
      METHODS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setMethod(m.id),
          className: `w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-smooth text-left ${method === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`,
          "data-ocid": `payment-method-${m.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: method === m.id ? "text-primary" : "text-muted-foreground",
                children: m.icon
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-semibold ${method === m.id ? "text-foreground" : "text-muted-foreground"}`,
                  children: m.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: m.sublabel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-4 h-4 rounded-full border-2 flex-none transition-smooth ${method === m.id ? "border-primary bg-primary" : "border-border"}`
              }
            )
          ]
        },
        m.id
      ))
    ] }),
    method === "upi" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 mb-5 space-y-3",
        "data-ocid": "payment-upi-form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 15, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Enter UPI ID" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "upi-id", className: "text-sm", children: "UPI ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "upi-id",
                type: "text",
                value: upiId,
                onChange: (e) => setUpiId(e.target.value),
                placeholder: "yourname@paytm / 9876543210@upi",
                className: "h-11",
                "data-ocid": "payment-upi-id"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ["@paytm", "@okaxis", "@ybl", "@upi"].map((suffix) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setUpiId((prev) => {
                const base = prev.split("@")[0] || "";
                return `${base}${suffix}`;
              }),
              className: "text-xs px-2 py-1 rounded-full border border-border hover:border-primary hover:text-primary transition-colors",
              children: suffix
            },
            suffix
          )) })
        ]
      }
    ),
    method === "card" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 mb-5 space-y-4",
        "data-ocid": "payment-card-form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 15, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Card Details" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Powered by" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary", children: "Stripe" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "card-number", className: "text-sm font-semibold", children: [
              "Card Number ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "card-number",
                  type: "text",
                  inputMode: "numeric",
                  value: card.number,
                  onChange: handleCardChange("number"),
                  onBlur: handleCardBlur("number"),
                  placeholder: "1234 5678 9012 3456",
                  className: "h-11 pr-10 font-mono",
                  "data-ocid": "payment-card-number"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CreditCard,
                {
                  size: 16,
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                }
              )
            ] }),
            cardTouched.number && cardErrors.number && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: cardErrors.number })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "card-name", className: "text-sm font-semibold", children: [
              "Name on Card ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "card-name",
                type: "text",
                value: card.name,
                onChange: handleCardChange("name"),
                onBlur: handleCardBlur("name"),
                placeholder: "DIPANKAR BORA",
                className: "h-11 uppercase",
                "data-ocid": "payment-card-name"
              }
            ),
            cardTouched.name && cardErrors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: cardErrors.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "card-expiry", className: "text-sm font-semibold", children: [
                "Expiry ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "card-expiry",
                  type: "text",
                  inputMode: "numeric",
                  value: card.expiry,
                  onChange: handleCardChange("expiry"),
                  onBlur: handleCardBlur("expiry"),
                  placeholder: "MM/YY",
                  maxLength: 5,
                  className: "h-11 font-mono",
                  "data-ocid": "payment-expiry"
                }
              ),
              cardTouched.expiry && cardErrors.expiry && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: cardErrors.expiry })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "card-cvv", className: "text-sm font-semibold", children: [
                "CVV ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "card-cvv",
                  type: "password",
                  inputMode: "numeric",
                  value: card.cvv,
                  onChange: handleCardChange("cvv"),
                  onBlur: handleCardBlur("cvv"),
                  placeholder: "•••",
                  maxLength: 4,
                  className: "h-11 font-mono",
                  "data-ocid": "payment-cvv"
                }
              ),
              cardTouched.cvv && cardErrors.cvv && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: cardErrors.cvv })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 11, className: "flex-none" }),
            "Your card info is encrypted with 256-bit SSL. We never store card details."
          ] })
        ]
      }
    ),
    method === "cod" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-muted/40 border border-border rounded-xl p-4 mb-5",
        "data-ocid": "payment-cod-info",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CircleCheck,
            {
              size: 18,
              className: "text-secondary flex-none mt-0.5"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "Cash on Delivery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
              "Pay ₹",
              (grandTotal / 100).toFixed(0),
              " in cash when your order arrives. Please keep exact change ready. COD available across Assam."
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-xs text-muted-foreground mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 12, className: "flex-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100% secure payments · Powered by Stripe" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        onClick: handlePay,
        disabled: loading,
        className: "w-full btn-primary border-0 h-13 text-base font-bold",
        "data-ocid": "payment-submit",
        children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" }),
          "Processing Payment…"
        ] }) : `Pay ${formatPrice(BigInt(Math.round(grandTotal)))}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground mt-3", children: [
      "By placing your order, you agree to AssamRoots",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Terms & Conditions" })
    ] })
  ] }) });
}
export {
  PaymentPage as default
};
