import { j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-CstiQ4sz.js";
import { L as Layout } from "./Layout-BaVl6Ee_.js";
import { e as useFooterSettings } from "./useQueries-CA65lisC.js";
import { c as createLucideIcon } from "./createLucideIcon-ByrRp2U0.js";
import { R as RotateCcw } from "./rotate-ccw-BRDRrY9k.js";
import "./backend-Dxpf4-N4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode);
const DEFAULT_POLICY = `Return & Refund Policy

Last updated: ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}

1. RETURNS
We accept returns within 7 days of delivery for eligible products. To initiate a return, please contact us at assamshop@assamroots.shop with your order number and reason for return.

2. NON-RETURNABLE ITEMS
The following categories are non-returnable due to hygiene and safety reasons:
• Food items, teas, spices, and edible products
• Opened or used products
• Perishable goods
• Customised or personalised items

3. ELIGIBLE ITEMS FOR RETURN
• Clothing, textiles, and handloom products (unused, with original tags)
• Books and printed materials
• Decorative items and crafts (unused, undamaged)
• Puja items and religious artefacts (unused)

4. REFUND PROCESS
Once your returned item is received and inspected, we will notify you by email. If approved, your refund will be processed within 5–7 business days to your original payment method. For Cash on Delivery orders, refunds are issued via bank transfer.

5. DAMAGED OR DEFECTIVE ITEMS
If you receive a damaged or defective product, please send us a photo and your order details at assamshop@assamroots.shop within 48 hours of delivery. We will arrange a replacement or full refund at no cost to you.

6. EXCHANGE POLICY
Exchanges are accepted for sizing or quality issues on eligible clothing and handloom items within 7 days of delivery. Contact us at assamshop@assamroots.shop to initiate an exchange.

7. SHIPPING COSTS FOR RETURNS
Return shipping costs are borne by the customer unless the item is damaged or defective. We recommend using a trackable shipping service for returns.

8. CONTACT US
For any questions about our return and refund policy, please reach out:
• Email: assamshop@assamroots.shop
• We aim to respond within 1–2 business days.`;
function PolicyContent({ text }) {
  const paragraphs = text.split(/\n\n+/);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: paragraphs.map((para, i) => {
    const lines = para.trim().split("\n");
    const isHeading = lines[0].match(/^\d+\.\s+[A-Z]/) || lines[0].match(/^[A-Z][A-Z\s&]+$/);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: isHeading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground mb-1.5", children: lines[0] }),
      lines.slice(1).map((line, j) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-sm text-muted-foreground leading-relaxed",
          children: line
        },
        j.toString()
      ))
    ] }) : lines.map((line, j) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-sm text-muted-foreground leading-relaxed",
        children: line
      },
      j.toString()
    )) }, i.toString());
  }) });
}
function RefundPolicyPage() {
  var _a;
  const { data: footerSettings, isLoading } = useFooterSettings();
  const policyText = ((_a = footerSettings == null ? void 0 : footerSettings.policyContent) == null ? void 0 : _a.trim()) || DEFAULT_POLICY;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto px-4 py-6 pb-24",
      "data-ocid": "refund-policy.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/home",
            className: "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-5",
            "data-ocid": "refund-policy.back_link",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 13 }),
              " Back to Home"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 18, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground", children: "Return & Refund Policy" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "AssamRoots — Authentic Assamese products" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 mt-3", children: [
            "For queries, contact us at",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "mailto:assamshop@assamroots.shop",
                className: "text-primary font-semibold hover:underline",
                children: "assamshop@assamroots.shop"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl p-5", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "refund-policy.loading_state", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full rounded" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PolicyContent, { text: policyText }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "Need help with an order?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Reach us at",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "mailto:assamshop@assamroots.shop",
                className: "text-primary font-semibold hover:underline",
                children: "assamshop@assamroots.shop"
              }
            ),
            " ",
            "— we respond within 1–2 business days."
          ] })
        ] })
      ]
    }
  ) });
}
export {
  RefundPolicyPage as default
};
