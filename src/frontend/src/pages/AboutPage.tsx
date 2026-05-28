import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFooterSettings, useProducts } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Leaf, Package } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504387103978-e4ee71416c38?w=1400&q=80";

const storyCards = [
  {
    icon: Leaf,
    title: "Rooted in Assam",
    text: "Every product we carry is sourced directly from Assamese farmers, artisans, and makers — ensuring authenticity and fair trade at every step.",
  },
  {
    icon: Heart,
    title: "Built for the Diaspora",
    text: "Whether you're in Guwahati or Geneva, AssamRoots brings the tastes, scents, and crafts of home directly to your doorstep.",
  },
  {
    icon: Package,
    title: "Carefully Curated",
    text: "From Muga silk to first-flush Assam tea, our catalog celebrates the richness of Assamese culture across food, textiles, art, and tradition.",
  },
];

export default function AboutPage() {
  const { data: footerSettings, isLoading } = useFooterSettings();
  const { data: products } = useProducts({ limit: 1 });
  const featuredProduct = products?.[0];

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative h-72 md:h-96 flex items-end overflow-hidden"
        data-ocid="about.hero_section"
      >
        <img
          src={HERO_IMAGE}
          alt="Assam tea garden landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
        <div className="relative z-10 px-6 pb-8 md:px-12 md:pb-12">
          <p className="text-primary-foreground/70 text-sm font-body uppercase tracking-widest mb-1">
            Our Story
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
            About AssamRoots
          </h1>
          <p className="mt-2 text-primary-foreground/80 font-body text-base md:text-lg max-w-xl">
            Bringing the heart of Assam to every corner of the world
          </p>
        </div>
      </section>

      {/* About Content */}
      <section
        className="bg-background px-6 py-12 md:px-12 md:py-16"
        data-ocid="about.content_section"
      >
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-5/6 rounded" />
              <Skeleton className="h-5 w-4/6 rounded" />
            </div>
          ) : (
            <div className="text-foreground font-body text-base md:text-lg leading-relaxed space-y-4">
              {(
                footerSettings?.aboutContent ||
                "AssamRoots is an Assamese-first commerce and community platform dedicated to connecting Assamese people — especially the diaspora — with authentic products and services rooted in the cultural richness of Assam.\n\nFounded with a deep love for Assamese heritage, we are committed to being the most trusted marketplace for everything Assamese. From the golden fields of Muga silk to the misty tea estates of Jorhat, every product on our platform carries a piece of home.\n\nOur mission is simple: preserve, celebrate, and deliver the essence of Assam to the world."
              )
                .split("\n")
                .filter(Boolean)
                .map((para, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey:
                  <p key={i}>{para}</p>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Story Cards */}
      <section
        className="bg-muted/30 px-6 py-12 md:px-12 md:py-16"
        data-ocid="about.story_section"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {storyCards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-6 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Teaser */}
      {featuredProduct && (
        <section
          className="bg-background px-6 py-12 md:px-12"
          data-ocid="about.featured_product_section"
        >
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="w-full md:w-64 h-48 md:h-64 shrink-0 overflow-hidden">
              <img
                src={
                  featuredProduct.imageUrls[0] ||
                  "/assets/images/placeholder.svg"
                }
                alt={featuredProduct.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-8 flex-1">
              <p className="text-xs font-body uppercase tracking-widest text-secondary mb-1">
                Spotlight Product
              </p>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                {featuredProduct.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3">
                {featuredProduct.description}
              </p>
              <Link
                to="/products/$id"
                params={{ id: String(featuredProduct.id) }}
              >
                <Button
                  variant="default"
                  className="gap-2"
                  data-ocid="about.featured_product_link"
                >
                  View Product <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="bg-primary px-6 py-14 md:px-12 md:py-20 text-center"
        data-ocid="about.cta_section"
      >
        <h2 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mb-3">
          Ready to Explore?
        </h2>
        <p className="font-body text-primary-foreground/80 text-base md:text-lg mb-8 max-w-xl mx-auto">
          Browse our curated collection of authentic Assamese products or book a
          service for someone back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/home">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              data-ocid="about.explore_products_button"
            >
              Explore Our Products
            </Button>
          </Link>
          <Link to="/services">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
              data-ocid="about.book_services_button"
            >
              Book Services
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
