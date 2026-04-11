import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle2,
  ChefHat,
  Clock,
  Home,
  Leaf,
  Paintbrush,
  School,
} from "lucide-react";
import { useState } from "react";

// ─── Coming Soon service tiles ─────────────────────────────────────────────

const UPCOMING_SERVICES = [
  {
    icon: <Home size={22} />,
    name: "Home Services",
    desc: "Plumbers, electricians & home repair",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: <ChefHat size={22} />,
    name: "Catering",
    desc: "Authentic Assamese cuisine for events",
    color: "bg-secondary/15 text-secondary",
  },
  {
    icon: <Camera size={22} />,
    name: "Photography",
    desc: "Wedding & event photographers",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: <School size={22} />,
    name: "Tutoring",
    desc: "Assamese language & cultural classes",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: <Leaf size={22} />,
    name: "Farm Fresh",
    desc: "Direct from local Assamese farmers",
    color: "bg-secondary/15 text-secondary",
  },
  {
    icon: <Paintbrush size={22} />,
    name: "Artisan Workshops",
    desc: "Learn traditional crafts from masters",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: <BookOpen size={22} />,
    name: "Cultural Tours",
    desc: "Guided heritage & nature tours",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: <Home size={22} />,
    name: "Homestays",
    desc: "Authentic rural Assamese experience",
    color: "bg-secondary/15 text-secondary",
  },
];

const COMING_FEATURES = [
  "Verified local service providers",
  "Secure in-app booking & payment",
  "Community ratings & reviews",
  "Artisan profiles & portfolios",
];

// ─── Component ────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Simulate submission (no email backend wired)
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <Layout>
      <div className="px-4 py-4" data-ocid="services-page">
        {/* Hero banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary/25 via-primary/10 to-accent/15 border border-border rounded-2xl p-6 text-center mb-6">
          {/* Decorative circles */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/5 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-secondary/10 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="w-16 h-16 bg-card border-2 border-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Clock size={30} className="text-secondary" />
            </div>

            <h1 className="font-display text-3xl font-black text-foreground mb-2 tracking-tight">
              Services
            </h1>

            <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs font-bold mb-4 gap-1.5">
              🚧 Coming Soon
            </Badge>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              We&apos;re building a marketplace for authentic Assamese services
              — connecting you with local experts, artisans, and professionals
              from Assam.
            </p>
          </div>
        </div>

        {/* What we're building */}
        <div className="mb-6">
          <h2 className="font-display font-bold text-base text-foreground mb-3">
            Services we&apos;re building
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {UPCOMING_SERVICES.map((service) => (
              <div
                key={service.name}
                className="bg-card border border-border rounded-xl p-3.5 flex flex-col gap-2 opacity-75 hover:opacity-100 transition-smooth"
                data-ocid={`service-tile-${service.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-none ${service.color}`}
                >
                  {service.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground leading-tight">
                    {service.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature highlights */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <span className="text-primary">✦</span> What to expect
          </h3>
          <div className="space-y-2.5">
            {COMING_FEATURES.map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-secondary flex-none" />
                <p className="text-sm text-muted-foreground">{feat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email notify section */}
        <div
          className="bg-gradient-to-br from-primary/8 to-secondary/8 border border-primary/20 rounded-2xl p-5 mb-6"
          data-ocid="services-notify-section"
        >
          {submitted ? (
            <div
              className="text-center py-4"
              data-ocid="services-notify-success"
            >
              <CheckCircle2 size={36} className="text-secondary mx-auto mb-3" />
              <p className="font-display font-bold text-foreground mb-1">
                You&apos;re on the list! 🎉
              </p>
              <p className="text-sm text-muted-foreground">
                We&apos;ll notify you at{" "}
                <span className="font-semibold text-foreground">{email}</span>{" "}
                when Services launches.
              </p>
            </div>
          ) : (
            <>
              <p className="font-display font-bold text-base text-foreground mb-1">
                Be the first to know 🔔
              </p>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Enter your email and we&apos;ll notify you when the Services
                marketplace launches. No spam — only Assam goodness.
              </p>
              <form onSubmit={handleNotify} className="space-y-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="search-input h-11"
                  data-ocid="services-email-input"
                />
                <Button
                  type="submit"
                  disabled={submitting || !email.trim()}
                  className="w-full btn-primary border-0 h-11 gap-2"
                  data-ocid="services-notify-submit"
                >
                  {submitting ? "Submitting…" : "Notify Me When Live"}
                  {!submitting && <ArrowRight size={16} />}
                </Button>
              </form>
            </>
          )}
        </div>

        {/* Artisan offer CTA */}
        <div className="bg-muted/40 border border-border rounded-xl p-4 text-center mb-5">
          <p className="text-sm font-semibold text-foreground mb-1">
            🛕 Are you an Assamese artisan or service provider?
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Join our early access program and be among the first listed on
            AssamRoots Services
          </p>
          <Button
            variant="outline"
            className="border-primary/30 text-primary text-sm gap-2 h-9"
            data-ocid="services-provider-waitlist"
          >
            Apply as Provider <ArrowRight size={13} />
          </Button>
        </div>

        <div className="text-center">
          <Link
            to="/home"
            className="text-sm text-primary hover:underline font-medium"
          >
            ← Back to Shopping
          </Link>
        </div>
      </div>
    </Layout>
  );
}
