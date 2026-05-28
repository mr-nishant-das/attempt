import { j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-CR5jwz_B.js";
import { L as Layout } from "./Layout-DhGPVLyq.js";
import { B as Button } from "./button-I5RPTQO5.js";
import { e as useFooterSettings, f as useProducts } from "./useQueries-CzNiaAGb.js";
import { L as Leaf } from "./leaf-zbx-GHf1.js";
import { c as createLucideIcon } from "./createLucideIcon-BOzMcLN1.js";
import { P as Package } from "./package-DCbmyrTh.js";
import { A as ArrowRight } from "./arrow-right-XNiZt3Jl.js";
import "./index-D3eYOVqY.js";
import "./useActor-DMra6ezJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode);
const HERO_IMAGE = "https://images.unsplash.com/photo-1504387103978-e4ee71416c38?w=1400&q=80";
const storyCards = [
  {
    icon: Leaf,
    title: "Rooted in Assam",
    text: "Every product we carry is sourced directly from Assamese farmers, artisans, and makers — ensuring authenticity and fair trade at every step."
  },
  {
    icon: Heart,
    title: "Built for the Diaspora",
    text: "Whether you're in Guwahati or Geneva, AssamRoots brings the tastes, scents, and crafts of home directly to your doorstep."
  },
  {
    icon: Package,
    title: "Carefully Curated",
    text: "From Muga silk to first-flush Assam tea, our catalog celebrates the richness of Assamese culture across food, textiles, art, and tradition."
  }
];
function AboutPage() {
  const { data: footerSettings, isLoading } = useFooterSettings();
  const { data: products } = useProducts({ limit: 1 });
  const featuredProduct = products == null ? void 0 : products[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative h-72 md:h-96 flex items-end overflow-hidden",
        "data-ocid": "about.hero_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: HERO_IMAGE,
              alt: "Assam tea garden landscape",
              className: "absolute inset-0 w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 px-6 pb-8 md:px-12 md:pb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/70 text-sm font-body uppercase tracking-widest mb-1", children: "Our Story" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-5xl font-bold text-primary-foreground leading-tight", children: "About AssamRoots" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-primary-foreground/80 font-body text-base md:text-lg max-w-xl", children: "Bringing the heart of Assam to every corner of the world" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background px-6 py-12 md:px-12 md:py-16",
        "data-ocid": "about.content_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-5/6 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-4/6 rounded" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground font-body text-base md:text-lg leading-relaxed space-y-4", children: ((footerSettings == null ? void 0 : footerSettings.aboutContent) || "AssamRoots is an Assamese-first commerce and community platform dedicated to connecting Assamese people — especially the diaspora — with authentic products and services rooted in the cultural richness of Assam.\n\nFounded with a deep love for Assamese heritage, we are committed to being the most trusted marketplace for everything Assamese. From the golden fields of Muga silk to the misty tea estates of Jorhat, every product on our platform carries a piece of home.\n\nOur mission is simple: preserve, celebrate, and deliver the essence of Assam to the world.").split("\n").filter(Boolean).map((para, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey:
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: para }, i)
        )) }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/30 px-6 py-12 md:px-12 md:py-16",
        "data-ocid": "about.story_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10", children: "What We Stand For" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-3", children: storyCards.map(({ icon: Icon, title, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-xl p-6 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-shadow",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground mb-1", children: title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground leading-relaxed", children: text })
                ] })
              ]
            },
            title
          )) })
        ] })
      }
    ),
    featuredProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background px-6 py-12 md:px-12",
        "data-ocid": "about.featured_product_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center bg-card border border-border rounded-2xl overflow-hidden shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full md:w-64 h-48 md:h-64 shrink-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: featuredProduct.imageUrls[0] || "/assets/images/placeholder.svg",
              alt: featuredProduct.title,
              className: "w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body uppercase tracking-widest text-secondary mb-1", children: "Spotlight Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl md:text-2xl font-bold text-foreground mb-2", children: featuredProduct.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground mb-4 line-clamp-3", children: featuredProduct.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/products/$id",
                params: { id: String(featuredProduct.id) },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "default",
                    className: "gap-2",
                    "data-ocid": "about.featured_product_link",
                    children: [
                      "View Product ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                    ]
                  }
                )
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "bg-primary px-6 py-14 md:px-12 md:py-20 text-center",
        "data-ocid": "about.cta_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl md:text-4xl font-bold text-primary-foreground mb-3", children: "Ready to Explore?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-primary-foreground/80 text-base md:text-lg mb-8 max-w-xl mx-auto", children: "Browse our curated collection of authentic Assamese products or book a service for someone back home." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/home", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "secondary",
                size: "lg",
                className: "w-full sm:w-auto",
                "data-ocid": "about.explore_products_button",
                children: "Explore Our Products"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/services", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10",
                "data-ocid": "about.book_services_button",
                children: "Book Services"
              }
            ) })
          ] })
        ]
      }
    )
  ] });
}
export {
  AboutPage as default
};
