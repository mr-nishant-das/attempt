import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useFooterSettings } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";

// ─── Default policy text ─────────────────────────────────────────────────────
const DEFAULT_POLICY = `Return & Refund Policy

Last updated: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}

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

// ─── Section renderer ─────────────────────────────────────────────────────────
function PolicyContent({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/);
  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => {
        const lines = para.trim().split("\n");
        const isHeading =
          lines[0].match(/^\d+\.\s+[A-Z]/) ||
          lines[0].match(/^[A-Z][A-Z\s&]+$/);
        return (
          <div key={i.toString()}>
            {isHeading ? (
              <>
                <h2 className="text-sm font-bold text-foreground mb-1.5">
                  {lines[0]}
                </h2>
                {lines.slice(1).map((line, j) => (
                  <p
                    key={j.toString()}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </>
            ) : (
              lines.map((line, j) => (
                <p
                  key={j.toString()}
                  className="text-sm text-muted-foreground leading-relaxed"
                >
                  {line}
                </p>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function RefundPolicyPage() {
  const { data: footerSettings, isLoading } = useFooterSettings();

  const policyText = footerSettings?.policyContent?.trim() || DEFAULT_POLICY;

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto px-4 py-6 pb-24"
        data-ocid="refund-policy.page"
      >
        {/* Back link */}
        <Link
          to="/home"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-5"
          data-ocid="refund-policy.back_link"
        >
          <ArrowLeft size={13} /> Back to Home
        </Link>

        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-none">
              <RotateCcw size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">
                Return &amp; Refund Policy
              </h1>
              <p className="text-xs text-muted-foreground">
                AssamRoots — Authentic Assamese products
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 mt-3">
            For queries, contact us at{" "}
            <a
              href="mailto:assamshop@assamroots.shop"
              className="text-primary font-semibold hover:underline"
            >
              assamshop@assamroots.shop
            </a>
          </p>
        </div>

        {/* Policy body */}
        <div className="bg-card border border-border rounded-2xl p-5">
          {isLoading ? (
            <div className="space-y-3" data-ocid="refund-policy.loading_state">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-full rounded" />
              ))}
            </div>
          ) : (
            <PolicyContent text={policyText} />
          )}
        </div>

        {/* Bottom contact nudge */}
        <div className="mt-5 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-4 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">
            Need help with an order?
          </p>
          <p className="text-xs text-muted-foreground">
            Reach us at{" "}
            <a
              href="mailto:assamshop@assamroots.shop"
              className="text-primary font-semibold hover:underline"
            >
              assamshop@assamroots.shop
            </a>{" "}
            — we respond within 1–2 business days.
          </p>
        </div>
      </div>
    </Layout>
  );
}
