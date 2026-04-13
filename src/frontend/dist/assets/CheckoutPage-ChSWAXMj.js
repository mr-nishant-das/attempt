import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-D4oc9L-H.js";
import { u as useCart, L as Layout } from "./Layout-CddzSLPN.js";
import { B as Button } from "./button-BheL6zVp.js";
import { T as TriangleAlert, C as Checkbox } from "./checkbox-IsnKOkzL.js";
import { L as Label, I as Input } from "./label-P3qVKHAO.js";
import { S as Separator } from "./separator-iGl_Yi_h.js";
import { u as useAuth } from "./useAuth-E-HR_wVi.js";
import { d as discountedPrice, f as formatPrice } from "./types-Dmw7OeI0.js";
import { S as ShoppingBag } from "./shopping-bag-BQ9V6C93.js";
import { M as MapPin } from "./map-pin-BBGBNV4Y.js";
import { C as CircleX } from "./circle-x-DIQXjPRy.js";
import { C as CircleCheck } from "./circle-check-CScK-JOr.js";
import { T as Truck } from "./truck-C47g66Kf.js";
import { A as ArrowRight } from "./arrow-right-zJ08A8vB.js";
import "./createLucideIcon-DMAq5fnw.js";
import "./index-CT5_lWjy.js";
import "./index-BdIKiqEc.js";
import "./index-BmjgszZ4.js";
const PINCODE_RE = /^[1-9][0-9]{5}$/;
const PHONE_RE = /^(\+91[-\s]?)?[6-9]\d{9}$/;
const SERVICEABLE_PINCODES = /* @__PURE__ */ new Set([
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
  "781101"
]);
function validateForm(form) {
  const errs = {};
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
const INTERNATIONAL_KEYWORDS = /* @__PURE__ */ new Set([
  "abroad",
  "usa",
  "uk",
  "united kingdom",
  "united states",
  "canada",
  "australia",
  "uae",
  "dubai",
  "singapore",
  "malaysia",
  "germany",
  "france",
  "italy",
  "netherlands",
  "sweden",
  "norway",
  "denmark",
  "switzerland",
  "new zealand",
  "japan",
  "china",
  "south korea",
  "hong kong",
  "qatar",
  "kuwait",
  "bahrain",
  "saudi arabia",
  "oman"
]);
const INDIAN_STATES = /* @__PURE__ */ new Set([
  "andhra pradesh",
  "arunachal pradesh",
  "assam",
  "bihar",
  "chhattisgarh",
  "goa",
  "gujarat",
  "haryana",
  "himachal pradesh",
  "jharkhand",
  "karnataka",
  "kerala",
  "madhya pradesh",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil nadu",
  "telangana",
  "tripura",
  "uttar pradesh",
  "uttarakhand",
  "west bengal",
  "delhi",
  "jammu and kashmir",
  "ladakh",
  "chandigarh",
  "puducherry",
  "andaman and nicobar",
  "dadra and nagar haveli",
  "daman and diu",
  "lakshadweep"
]);
function getDisclaimerType(stateValue) {
  const normalized = stateValue.trim().toLowerCase();
  if (!normalized) return "none";
  if (normalized === "assam") return "none";
  if (INTERNATIONAL_KEYWORDS.has(normalized)) return "international";
  if (INDIAN_STATES.has(normalized)) return "india";
  return "international";
}
function CheckoutPage() {
  const { items, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = reactExports.useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Assam",
    pincode: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState({});
  const [pincodeStatus, setPincodeStatus] = reactExports.useState("idle");
  const [disclaimerAccepted, setDisclaimerAccepted] = reactExports.useState(false);
  const disclaimerType = getDisclaimerType(form.state);
  const shipping = totalPrice >= 49900 ? 0 : 5900;
  const grandTotal = totalPrice + shipping;
  reactExports.useEffect(() => {
    if (form.pincode.length === 6) {
      setPincodeStatus("checking");
      const timer = setTimeout(() => {
        setPincodeStatus(
          SERVICEABLE_PINCODES.has(form.pincode) ? "serviceable" : "not-serviceable"
        );
      }, 600);
      return () => clearTimeout(timer);
    }
    setPincodeStatus("idle");
  }, [form.pincode]);
  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: void 0 }));
      if (field === "state") setDisclaimerAccepted(false);
    };
  }
  function handleBlur(field) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const fieldErrors = validateForm(form);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    };
  }
  function handleSubmit(e) {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true])
    );
    setTouched(allTouched);
    const fieldErrors = validateForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    if (pincodeStatus === "not-serviceable") return;
    if (disclaimerType !== "none" && !disclaimerAccepted) return;
    sessionStorage.setItem("checkout_address", JSON.stringify(form));
    navigate({ to: "/payment" });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 px-6 text-center",
        "data-ocid": "checkout-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 48, className: "text-muted-foreground/40 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-2", children: "Nothing to checkout" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Your cart is empty. Add some products first!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => navigate({ to: "/home" }),
              className: "btn-primary border-0",
              children: "Continue Shopping"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", "data-ocid": "checkout-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 20, className: "text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Delivery Address" })
    ] }),
    !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-accent/10 border border-accent/20 rounded-xl p-3 mb-4 text-xs text-accent-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "💡 Tip:" }),
      " Log in to save your address for faster checkout next time."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "checkout-name", className: "text-sm font-semibold", children: [
            "Full Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "checkout-name",
              type: "text",
              value: form.name,
              onChange: handleChange("name"),
              onBlur: handleBlur("name"),
              placeholder: "Dipankar Bora",
              className: "h-11",
              "aria-describedby": errors.name ? "name-error" : void 0,
              "data-ocid": "checkout-name"
            }
          ),
          touched.name && errors.name && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              id: "name-error",
              className: "text-xs text-destructive flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 11 }),
                " ",
                errors.name
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "checkout-phone", className: "text-sm font-semibold", children: [
            "Mobile Number ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-11 flex items-center px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground font-mono font-semibold flex-none", children: "+91" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "checkout-phone",
                type: "tel",
                value: form.phone,
                onChange: handleChange("phone"),
                onBlur: handleBlur("phone"),
                placeholder: "98765 43210",
                className: "h-11",
                maxLength: 14,
                "aria-describedby": errors.phone ? "phone-error" : void 0,
                "data-ocid": "checkout-phone"
              }
            )
          ] }),
          touched.phone && errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              id: "phone-error",
              className: "text-xs text-destructive flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 11 }),
                " ",
                errors.phone
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "checkout-line1", className: "text-sm font-semibold", children: [
            "Address Line 1 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "checkout-line1",
              type: "text",
              value: form.line1,
              onChange: handleChange("line1"),
              onBlur: handleBlur("line1"),
              placeholder: "House/Flat No., Building, Street",
              className: "h-11",
              "data-ocid": "checkout-line1"
            }
          ),
          touched.line1 && errors.line1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 11 }),
            " ",
            errors.line1
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Label,
            {
              htmlFor: "checkout-line2",
              className: "text-sm font-semibold text-muted-foreground",
              children: [
                "Address Line 2",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: "(optional)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "checkout-line2",
              type: "text",
              value: form.line2,
              onChange: handleChange("line2"),
              placeholder: "Area, Colony, Landmark",
              className: "h-11",
              "data-ocid": "checkout-line2"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "checkout-city",
                className: "text-sm font-semibold",
                children: [
                  "City ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "checkout-city",
                type: "text",
                value: form.city,
                onChange: handleChange("city"),
                onBlur: handleBlur("city"),
                placeholder: "Guwahati",
                className: "h-11",
                "data-ocid": "checkout-city"
              }
            ),
            touched.city && errors.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 11 }),
              " ",
              errors.city
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "checkout-state",
                className: "text-sm font-semibold",
                children: [
                  "State ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "checkout-state",
                type: "text",
                value: form.state,
                onChange: handleChange("state"),
                onBlur: handleBlur("state"),
                placeholder: "Assam",
                className: "h-11",
                "data-ocid": "checkout-state"
              }
            ),
            touched.state && errors.state && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 11 }),
              " ",
              errors.state
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Label,
            {
              htmlFor: "checkout-pincode",
              className: "text-sm font-semibold",
              children: [
                "Pincode ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "checkout-pincode",
                type: "text",
                inputMode: "numeric",
                value: form.pincode,
                onChange: handleChange("pincode"),
                onBlur: handleBlur("pincode"),
                placeholder: "781001",
                maxLength: 6,
                className: `h-11 pr-10 ${pincodeStatus === "serviceable" ? "border-secondary focus:border-secondary" : pincodeStatus === "not-serviceable" ? "border-destructive focus:border-destructive" : ""}`,
                "data-ocid": "checkout-pincode"
              }
            ),
            pincodeStatus === "checking" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" }) }),
            pincodeStatus === "serviceable" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleCheck,
              {
                size: 16,
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
              }
            ),
            pincodeStatus === "not-serviceable" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleX,
              {
                size: 16,
                className: "absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
              }
            )
          ] }),
          pincodeStatus === "serviceable" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-secondary flex items-center gap-1 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11 }),
            " Delivery available to this pincode!"
          ] }),
          pincodeStatus === "not-serviceable" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 11 }),
            " Sorry, we don't deliver to this pincode yet."
          ] }),
          touched.pincode && errors.pincode && pincodeStatus === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 11 }),
            " ",
            errors.pincode
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-muted/40 border border-border rounded-xl p-4",
          "data-ocid": "checkout-order-summary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 15, className: "text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                "Order Summary (",
                totalItems,
                " ",
                totalItems === 1 ? "item" : "items",
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 mb-3", children: items.map(({ product, quantity }) => {
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
                        className: "w-8 h-8 object-cover rounded flex-none bg-muted"
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(BigInt(Math.round(totalPrice))) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 11 }),
                  " Delivery"
                ] }),
                shipping === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary font-semibold", children: "FREE" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(BigInt(shipping)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: formatPrice(BigInt(Math.round(grandTotal))) })
            ] })
          ]
        }
      ),
      disclaimerType !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3",
          "data-ocid": "checkout-disclaimer-banner",
          "aria-label": "Shipping disclaimer",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  size: 18,
                  className: "text-amber-600 flex-none mt-0.5",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-amber-900", children: "Important Shipping Notice" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-800 leading-relaxed", children: disclaimerType === "india" ? "Orders from outside Assam may take 5–10 business days due to inter-state logistics and availability at the time of dispatch. We will notify you if any item is unavailable for export." : "International orders may take 15–30 business days. Export availability depends on customs regulations. Certain items (food, herbs, liquids) may be restricted for international shipment. We will notify you if any adjustment is needed before dispatch." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  id: "disclaimer-accept",
                  checked: disclaimerAccepted,
                  onCheckedChange: (checked) => setDisclaimerAccepted(checked === true),
                  className: "mt-0.5 border-amber-500 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600",
                  "data-ocid": "checkout-disclaimer-checkbox"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "disclaimer-accept",
                  className: "text-xs text-amber-900 font-medium leading-relaxed cursor-pointer",
                  children: "I understand and accept the above shipping terms"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          className: "w-full btn-primary border-0 h-12 text-base font-bold flex items-center justify-center gap-2",
          disabled: pincodeStatus === "not-serviceable" || pincodeStatus === "checking" || disclaimerType !== "none" && !disclaimerAccepted,
          "data-ocid": "checkout-submit",
          children: [
            "Continue to Payment",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18 })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground flex items-center justify-center gap-1", children: "🔒 Your information is secure and encrypted" })
    ] })
  ] }) });
}
export {
  CheckoutPage as default
};
