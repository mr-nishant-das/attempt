import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-CR5jwz_B.js";
import { D as DeliveryType, c as createActor } from "./useQueries-CzNiaAGb.js";
import { u as useCart, L as Layout } from "./Layout-DhGPVLyq.js";
import { B as Badge } from "./badge-BNJmWZh5.js";
import { B as Button } from "./button-I5RPTQO5.js";
import { S as Separator } from "./separator-BZtiGSZz.js";
import { u as useAuth } from "./useAuth-CQXdGqgC.js";
import { f as formatPrice, d as discountedPrice } from "./types-Dmw7OeI0.js";
import { u as useActor } from "./useActor-DMra6ezJ.js";
import { u as ue } from "./index-A4rxUgPY.js";
import { S as ShoppingBag } from "./shopping-bag-CkxU1Cf2.js";
import { L as Lock } from "./lock-CMedhAT_.js";
import { L as LogIn } from "./log-in-CtmyJVey.js";
import { S as Star } from "./star-BFTT8cOK.js";
import { Z as Zap } from "./zap-CZ4iIbhP.js";
import { T as Truck } from "./truck-DO7SpthQ.js";
import { c as createLucideIcon } from "./createLucideIcon-BOzMcLN1.js";
import { C as CircleCheck } from "./circle-check-of3grdI8.js";
import { I as Info } from "./info-mgZ7b2ZV.js";
import "./index-D3eYOVqY.js";
import "./index-FO0LPCQU.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode);
function readDeliveryFromSession() {
  const rawType = sessionStorage.getItem("checkout_delivery_type");
  const rawCost = sessionStorage.getItem("checkout_delivery_cost");
  const deliveryType = rawType === "Express" ? DeliveryType.Express : DeliveryType.Standard;
  const deliveryCost = rawCost ? Number.parseInt(rawCost, 10) : 5900;
  return { deliveryType, deliveryCost };
}
function PaymentPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = reactExports.useState("online");
  const [loading, setLoading] = reactExports.useState(false);
  const [rzpLoaded, setRzpLoaded] = reactExports.useState(false);
  const { deliveryType, deliveryCost } = readDeliveryFromSession();
  const grandTotal = totalPrice + deliveryCost;
  const isExpress = deliveryType === DeliveryType.Express;
  const deliveryLabel = isExpress ? "Express Delivery" : "Standard Delivery";
  reactExports.useEffect(() => {
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
      ue.error(
        "Payment gateway failed to load. Please refresh and try again."
      );
    };
    document.body.appendChild(script);
  }, []);
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
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 px-6 text-center",
        "data-ocid": "payment-signin-required",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 36, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-black text-foreground mb-2", children: "Sign in Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1 leading-relaxed max-w-xs", children: "Please sign in to complete your purchase — we'll send an order confirmation to your registered email." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-6 max-w-xs", children: "Your cart items are saved and will be waiting for you." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => navigate({ to: "/login" }),
              className: "btn-primary border-0 flex items-center gap-2 h-11 px-6 text-sm",
              "data-ocid": "payment-signin-button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 18 }),
                "Sign In to Continue"
              ]
            }
          )
        ]
      }
    ) });
  }
  function buildDeliveryAddress(addr) {
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
      pincode: addr.pincode
    };
  }
  async function createOrderInBackend(paymentMethod, paymentId) {
    if (!actor || actorFetching) {
      ue.error("Unable to connect. Please try again.");
      return;
    }
    const rawAddr = sessionStorage.getItem("checkout_address");
    if (!rawAddr) {
      ue.error(
        "Your address is missing — please go back and re-enter your delivery details."
      );
      return;
    }
    let addr;
    try {
      addr = JSON.parse(rawAddr);
    } catch {
      ue.error(
        "Your address data is invalid — please go back and re-enter your delivery details."
      );
      return;
    }
    const deliveryAddress = buildDeliveryAddress(addr);
    const { deliveryType: dt, deliveryCost: dc } = readDeliveryFromSession();
    const orderItems = items.map(({ product, quantity }) => ({
      productId: BigInt(product.id),
      quantity: BigInt(quantity)
    }));
    const input = {
      deliveryAddress,
      items: orderItems,
      paymentMethod: paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment",
      deliveryType: dt,
      deliveryCost: BigInt(dc)
    };
    const backend = actor;
    const order = await backend.createOrder(input);
    clearCart();
    sessionStorage.removeItem("checkout_address");
    sessionStorage.removeItem("checkout_delivery_type");
    sessionStorage.removeItem("checkout_delivery_cost");
    const successMsg = paymentMethod === "COD" ? "Order placed! Pay on delivery. 🎉" : `Order confirmed! Payment ID: ${paymentId ?? "N/A"} 🎉`;
    ue.success(successMsg);
    navigate({
      to: "/order-complete",
      search: { orderId: order.id.toString() }
    });
  }
  async function openRazorpay() {
    if (!actor || actorFetching) {
      ue.error("Unable to connect to payment service. Please try again.");
      setLoading(false);
      return;
    }
    const amountInPaise = Math.round(grandTotal);
    if (amountInPaise < 100) {
      ue.error("Order amount is too low for online payment (minimum ₹1).");
      setLoading(false);
      return;
    }
    const rawAddr = sessionStorage.getItem("checkout_address");
    const addr = rawAddr ? JSON.parse(rawAddr) : null;
    const receiptId = `receipt_${Date.now()}`;
    const backend = actor;
    let razorpayOrderId;
    try {
      const result = await backend.createRazorpayOrder(
        BigInt(amountInPaise),
        receiptId
      );
      if (result.__kind__ === "err") {
        ue.error(`Could not create payment order: ${result.err}`);
        setLoading(false);
        return;
      }
      razorpayOrderId = result.ok.orderId;
    } catch (err) {
      console.error("createRazorpayOrder failed", err);
      ue.error("Could not initialise payment. Please try again.");
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
      handler: async (response) => {
        try {
          const verifyResult = await backend.verifyRazorpayPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
          if (verifyResult.__kind__ === "err" || !verifyResult.ok) {
            ue.error(
              `Payment verification failed. Contact support with your payment ID: ${response.razorpay_payment_id}`
            );
            setLoading(false);
            return;
          }
          await createOrderInBackend("ONLINE", response.razorpay_payment_id);
        } catch (err) {
          console.error(
            "Order creation failed after payment verification",
            err
          );
          ue.error(
            `Payment received but order creation failed. Please contact support with payment ID: ${response.razorpay_payment_id}`
          );
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: (addr == null ? void 0 : addr.name) ?? "",
        contact: (addr == null ? void 0 : addr.phone) ?? ""
      },
      theme: { color: "#e65c00" },
      modal: {
        ondismiss: () => {
          setLoading(false);
          ue.info("Payment cancelled. Your cart is still saved.");
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.on(
      "payment.failed",
      (failResponse) => {
        var _a;
        console.error("Razorpay payment.failed", failResponse);
        ue.error(
          ((_a = failResponse.error) == null ? void 0 : _a.description) ? `Payment failed: ${failResponse.error.description}` : "Payment failed. Please try again or choose a different payment method."
        );
        setLoading(false);
      }
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
        const message = err instanceof Error ? err.message : "Failed to place order. Please try again.";
        ue.error(message);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!rzpLoaded) {
      ue.error("Payment gateway is loading. Please wait a moment.");
      return;
    }
    setLoading(true);
    try {
      await openRazorpay();
    } catch (err) {
      console.error("Razorpay error", err);
      ue.error("Could not open payment gateway. Please try again.");
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", "data-ocid": "payment-page", children: [
    loading && method === "cod" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4",
        "aria-live": "polite",
        "aria-label": "Placing your order",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-base", children: "Placing your order…" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Please don't close this page" })
        ]
      }
    ),
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
        className: "flex items-start gap-3 bg-secondary/10 border border-secondary/30 rounded-xl px-4 py-3.5 mb-5",
        role: "note",
        "data-ocid": "payment-cod-recommendation",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 18, className: "text-secondary flex-none mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Cash on Delivery Recommended" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: [
              "No processing fees for this prototype. Pay when your order arrives at your doorstep.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Online payment is also available." })
            ] })
          ] })
        ]
      }
    ),
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
            const priceBig = BigInt(product.price);
            const discountBig = BigInt(product.discountPercent);
            const qty = Number(quantity);
            const finalPrice = discountedPrice(priceBig, discountBig);
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
                    qty
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground flex-none", children: formatPrice(finalPrice * BigInt(qty)) })
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
                isExpress ? /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 10, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 10 }),
                deliveryLabel
              ] }),
              deliveryCost === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-semibold", children: "FREE" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(BigInt(deliveryCost)) })
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-5", "data-ocid": "payment-methods", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Choose Payment Method" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setMethod("online"),
          className: `w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-smooth text-left ${method === "online" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"}`,
          "data-ocid": "payment-method-online",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `mt-0.5 p-2 rounded-lg flex-none ${method === "online" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-bold ${method === "online" ? "text-foreground" : "text-muted-foreground"}`,
                  children: "Pay Online"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "UPI, Credit/Debit Card, Net Banking, Wallets — powered by Razorpay" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 mt-2 flex-wrap", children: ["UPI", "GPay", "PhonePe", "Visa", "Mastercard", "RuPay"].map(
                (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] px-1.5 py-0.5 bg-muted rounded font-medium text-muted-foreground",
                    children: b
                  },
                  b
                )
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-5 h-5 rounded-full border-2 flex-none mt-1 transition-smooth ${method === "online" ? "border-primary bg-primary" : "border-border"}`
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setMethod("cod"),
          className: `w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-smooth text-left ${method === "cod" ? "border-secondary bg-secondary/5" : "border-border bg-card hover:border-secondary/30"}`,
          "data-ocid": "payment-method-cod",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `mt-0.5 p-2 rounded-lg flex-none ${method === "cod" ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 20 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-bold ${method === "cod" ? "text-foreground" : "text-muted-foreground"}`,
                  children: "Cash on Delivery"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Pay in cash when your order arrives at your doorstep" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-secondary font-medium mt-1", children: "Available across all serviceable Assam pincodes" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-5 h-5 rounded-full border-2 flex-none mt-1 transition-smooth ${method === "cod" ? "border-secondary bg-secondary" : "border-border"}`
              }
            )
          ]
        }
      )
    ] }),
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
              "Pay",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatPrice(BigInt(Math.round(grandTotal))) }),
              " ",
              "in cash when your order arrives. Please keep exact change ready."
            ] })
          ] })
        ] })
      }
    ),
    method === "online" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-muted/40 border border-border rounded-xl p-4 mb-5",
        "data-ocid": "payment-online-info",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 18, className: "text-primary flex-none mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "Secure Razorpay Checkout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: 'Clicking "Place Order" will open the Razorpay secure payment window. Choose UPI, card, or net banking to complete your payment.' })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 flex gap-2 items-start",
        "data-ocid": "payment-test-note",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 14, className: "text-amber-600 flex-none mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Test mode active." }),
            " Use Razorpay test card",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-amber-100 px-1 rounded font-mono text-[11px]", children: "4111 1111 1111 1111" }),
            " ",
            "with any future expiry and CVV to simulate a payment. Switch to a live key from your Razorpay dashboard when going live."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 text-xs text-muted-foreground mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 12, className: "flex-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100% secure payments · Powered by Razorpay" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        onClick: handlePlaceOrder,
        disabled: loading,
        className: "w-full btn-primary border-0 h-12 text-base font-bold",
        "data-ocid": "payment-submit",
        children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" }),
          method === "cod" ? "Placing your order…" : "Initialising payment…"
        ] }) : method === "cod" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { size: 18 }),
          "Place Order (Cash on Delivery)"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 18 }),
          "Pay ",
          formatPrice(BigInt(Math.round(grandTotal))),
          " Online"
        ] })
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
