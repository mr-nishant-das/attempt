import {
  type ServiceRequestPublic,
  ServiceRequestStatus,
  ServiceType,
  createActor,
} from "@/backend";
import type {
  Category,
  SubCategory,
  VendorProductView,
  VendorStatus,
} from "@/backend";
import { Variant_pending_approved_rejected } from "@/backend";
import { ImageUpload } from "@/components/ImageUpload";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FeaturedBlock,
  type FeaturedBlockInput,
  type HeroBanner,
  type HeroBannerInput,
  useAdminFeaturedBlocks,
  useAdminHeroBanners,
  useFooterSettings,
  useReviews,
  useSaveSiteSettings,
  useSiteSettings,
} from "@/hooks/useQueries";
import { discountedPrice, formatPrice } from "@/types";
import type { Product } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@dfinity/principal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Edit,
  FolderTree,
  Globe,
  Home,
  Image,
  KeyRound,
  Layers,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Package,
  Paintbrush,
  PercentCircle,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Trash2,
  Truck,
  Users,
  Video,
  Warehouse,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminTab =
  | "homepage"
  | "herobanners"
  | "featuredblocks"
  | "video"
  | "products"
  | "categories"
  | "subcategories"
  | "services"
  | "inventory"
  | "discounts"
  | "branding"
  | "footer"
  | "vendors"
  | "vendorproducts";

interface ProductFormValues {
  title: string;
  description: string;
  price: string;
  discountPercent: string;
  category: string;
  subCategory: string;
  brand: string;
  imageUrl: string;
  stock: string;
  tags: string;
}

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

interface SubCategoryFormValues {
  name: string;
  imageUrl: string;
}

const BLANK_PRODUCT: ProductFormValues = {
  title: "",
  description: "",
  price: "",
  discountPercent: "0",
  category: "1",
  subCategory: "",
  brand: "",
  imageUrl: "",
  stock: "0",
  tags: "",
};

const BLANK_CATEGORY: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
};

const BLANK_SUBCATEGORY: SubCategoryFormValues = { name: "", imageUrl: "" };

// ─── Admin auth ───────────────────────────────────────────────────────────────
const SESSION_KEY = "adminSessionToken";
const SESSION_TS_KEY = "adminSessionTs";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

function isSessionValid(): boolean {
  const token = localStorage.getItem(SESSION_KEY);
  const ts = localStorage.getItem(SESSION_TS_KEY);
  if (!token || !ts) return false;
  const elapsed = Date.now() - Number(ts);
  return elapsed < SESSION_DURATION_MS;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_TS_KEY);
}

function createSession(token: string) {
  localStorage.setItem(SESSION_KEY, token);
  localStorage.setItem(SESSION_TS_KEY, String(Date.now()));
}

// ─── Admin Login Form (Two-Factor: Secret Key → Email OTP) ───────────────────
function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<"key" | "otp">("key");
  const [secretKey, setSecretKey] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { actor } = useActor(createActor);

  const handleKeySubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!secretKey.trim()) {
        setError("Please enter the Admin Secret Key.");
        return;
      }
      if (!actor) {
        setError("Connecting to backend… please wait.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await actor.adminVerifyKey(secretKey.trim());
        if ("ok" in res) {
          // Request OTP to be sent
          await actor.adminRequestOtp();
          setStep("otp");
        } else {
          setError(res.err ?? "Invalid key. Please try again.");
        }
      } catch {
        setError("Authentication error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [secretKey, actor],
  );

  const handleOtpSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!otp.trim() || otp.length < 6) {
        setError("Please enter the 6-digit verification code.");
        return;
      }
      if (!actor) return;
      setLoading(true);
      setError("");
      try {
        const res = await actor.adminVerifyOtp(otp.trim());
        if ("ok" in res) {
          createSession(res.ok);
          onSuccess();
        } else {
          setError(res.err ?? "Invalid code. Please try again.");
        }
      } catch {
        setError("Verification error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [otp, actor, onSuccess],
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl shadow-elevated p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
              <ShieldCheck size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Access
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === "key"
                ? "Enter your admin secret key to continue"
                : "Verify your identity"}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${step === "key" ? "bg-primary" : "bg-primary/40"}`}
            />
            <div
              className={`w-8 h-0.5 ${step === "otp" ? "bg-primary" : "bg-border"}`}
            />
            <div
              className={`w-2 h-2 rounded-full ${step === "otp" ? "bg-primary" : "bg-border"}`}
            />
          </div>

          {step === "key" ? (
            <form onSubmit={handleKeySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-secret-key"
                  className="text-sm font-semibold"
                >
                  Admin Secret Key
                </Label>
                <div className="relative">
                  <KeyRound
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    id="admin-secret-key"
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter secret key"
                    autoComplete="current-password"
                    className="h-12 pl-10 text-base"
                    data-ocid="admin.login.secretkey_input"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {error && (
                <div
                  className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
                  data-ocid="admin.login.error_state"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="btn-primary border-0 w-full h-11 text-sm font-semibold"
                disabled={loading}
                data-ocid="admin.login.submit_button"
              >
                {loading ? "Verifying…" : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A 6-digit verification code has been sent to{" "}
                  <span className="font-semibold text-foreground">
                    assamshop@assamroots.shop
                  </span>
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-otp" className="text-sm font-semibold">
                  Verification Code
                </Label>
                <Input
                  id="admin-otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="h-12 text-center text-xl tracking-[0.5em] font-mono"
                  data-ocid="admin.login.otp_input"
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div
                  className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
                  data-ocid="admin.login.otp_error_state"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="btn-primary border-0 w-full h-11 text-sm font-semibold"
                disabled={loading || otp.length < 6}
                data-ocid="admin.login.otp_submit_button"
              >
                {loading ? "Verifying…" : "Sign In"}
              </Button>

              <button
                type="button"
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  setStep("key");
                  setOtp("");
                  setError("");
                }}
                data-ocid="admin.login.back_button"
              >
                ← Back to key entry
              </button>
            </form>
          )}

          <p className="text-[11px] text-center text-muted-foreground">
            Session expires automatically after 30 minutes of inactivity.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Service helpers ──────────────────────────────────────────────────────────
const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.Ambulance]: "🚑 Ambulance",
  [ServiceType.Doctors]: "👨‍⚕️ Doctors",
  [ServiceType.Medicines]: "💊 Medicines",
  [ServiceType.FoodDelivery]: "🍱 Food Delivery",
  [ServiceType.Taxi]: "🚕 Taxi & Transport",
  [ServiceType.EventManagement]: "🎪 Event Management",
  [ServiceType.FuneralServices]: "🕯️ Funeral Services",
  [ServiceType.WeddingsAnniversaries]: "💒 Weddings & Anniversaries",
  [ServiceType.Gifting]: "🎁 Gifting",
  [ServiceType.VideoConferencing]: "📹 Video Conferencing",
  [ServiceType.SchoolAdmissions]: "🎓 School/College Admissions",
  [ServiceType.Tourism]: "🏔️ Tourism",
  [ServiceType.Other]: "🤝 Community Help",
};

const STATUS_CONFIG: Record<
  ServiceRequestStatus,
  { label: string; className: string }
> = {
  [ServiceRequestStatus.New]: {
    label: "New",
    className: "bg-primary/15 text-primary border-0",
  },
  [ServiceRequestStatus.Contacted]: {
    label: "Contacted",
    className: "bg-amber-500/20 text-amber-700 border-0",
  },
  [ServiceRequestStatus.Completed]: {
    label: "Completed",
    className: "bg-secondary/20 text-secondary border-0",
  },
  [ServiceRequestStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive border-0",
  },
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  max,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="h-9 text-sm"
        data-ocid={`admin.field.${id}`}
      />
    </div>
  );
}

function productToForm(p: Product): ProductFormValues {
  return {
    title: p.title,
    description: p.description,
    price: (Number(p.price) / 100).toString(),
    discountPercent: p.discountPercent.toString(),
    category: p.category.toString(),
    subCategory: p.subCategory,
    brand: p.brand,
    imageUrl: p.imageUrls[0] ?? "",
    stock: p.stock.toString(),
    tags: p.tags.join(", "),
  };
}

function formToProductInput(form: ProductFormValues) {
  return {
    title: form.title,
    description: form.description,
    price: BigInt(Math.round(Number.parseFloat(form.price || "0") * 100)),
    discountPercent: BigInt(
      Math.min(100, Math.max(0, Number.parseInt(form.discountPercent) || 0)),
    ),
    imageUrls: form.imageUrl ? [form.imageUrl] : [],
    category: BigInt(Number.parseInt(form.category) || 1),
    subCategory: form.subCategory,
    brand: form.brand,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    stock: BigInt(Math.max(0, Number.parseInt(form.stock) || 0)),
    rating: 0n,
    reviewCount: 0n,
  };
}

function categoryToForm(c: Category): CategoryFormValues {
  return {
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
  };
}

// ─── Tab navigation ───────────────────────────────────────────────────────────
const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "homepage", label: "Homepage", icon: <Home size={13} /> },
  { id: "herobanners", label: "Slideshow", icon: <Image size={13} /> },
  { id: "featuredblocks", label: "Stories", icon: <LayoutGrid size={13} /> },
  { id: "video", label: "Video", icon: <Video size={13} /> },
  { id: "products", label: "Products", icon: <Package size={13} /> },
  { id: "categories", label: "Categories", icon: <FolderTree size={13} /> },
  { id: "subcategories", label: "Sub-Cats", icon: <Layers size={13} /> },
  { id: "services", label: "Services", icon: <Bell size={13} /> },
  { id: "inventory", label: "Inventory", icon: <Warehouse size={13} /> },
  { id: "discounts", label: "Discounts", icon: <PercentCircle size={13} /> },
  { id: "branding", label: "Branding", icon: <Paintbrush size={13} /> },
  { id: "footer", label: "Footer", icon: <Globe size={13} /> },
  { id: "vendors", label: "Vendors", icon: <Users size={13} /> },
  {
    id: "vendorproducts",
    label: "Vendor Products",
    icon: <ShoppingBag size={13} />,
  },
];

// ─── Vendor Products Panel ────────────────────────────────────────────────────

function VendorProductsPanel() {
  const { actor } = useActor(createActor);
  const [products, setProducts] = useState<VendorProductView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [taxInputs, setTaxInputs] = useState<Record<string, number>>({});
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>(
    {},
  );
  const [showRejectInput, setShowRejectInput] = useState<
    Record<string, boolean>
  >({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  const sessionKey = localStorage.getItem(SESSION_KEY) ?? "";

  const loadProducts = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError(null);
    try {
      const res = await actor.adminListVendorProducts(sessionKey);
      setProducts(res as VendorProductView[]);
    } catch (_e) {
      setError("Failed to load vendor products");
    } finally {
      setLoading(false);
    }
  }, [actor, sessionKey]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const grouped = products.reduce<Record<string, VendorProductView[]>>(
    (acc, p) => {
      const key = p.vendorId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    },
    {},
  );

  const doAction = async (
    key: string,
    fn: () => Promise<{ ok?: unknown; err?: string }>,
  ) => {
    setActionLoading((p) => ({ ...p, [key]: true }));
    try {
      const res = await fn();
      if ("ok" in res) {
        toast.success("Action completed");
        await loadProducts();
      } else {
        toast.error(res.err ?? "Action failed");
        if (res.err === "Unauthorized") {
          clearSession();
          window.location.reload();
        }
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading((p) => ({ ...p, [key]: false }));
    }
  };

  if (selectedVendorId) {
    const vendorProducts = products.filter(
      (p) => p.vendorId.toString() === selectedVendorId,
    );
    const vendorName = vendorProducts[0]?.vendorName ?? "Vendor";
    const vendorEmail = vendorProducts[0]?.vendorEmail ?? "";
    const pending = vendorProducts.filter(
      (p) => p.status === Variant_pending_approved_rejected.pending,
    );
    const approved = vendorProducts.filter(
      (p) => p.status === Variant_pending_approved_rejected.approved,
    );
    const rejected = vendorProducts.filter(
      (p) => p.status === Variant_pending_approved_rejected.rejected,
    );

    return (
      <div className="space-y-5" data-ocid="admin.vendorproducts.detail">
        <button
          type="button"
          onClick={() => setSelectedVendorId(null)}
          className="text-xs text-primary hover:underline"
          data-ocid="admin.vendorproducts.back_button"
        >
          ← Back to all vendors
        </button>
        <PanelHeader
          title={`Products from ${vendorName}`}
          location={`${vendorEmail} — review, tax, and approve vendor-submitted products`}
        />

        {/* Pending */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">
            Pending ({pending.length})
          </h3>
          {pending.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No pending products.
            </p>
          ) : (
            <div className="space-y-4">
              {pending.map((product) => {
                const pid = product.id.toString();
                const tax = taxInputs[pid] ?? 0;
                const base = Number(product.basePrice) / 100;
                const final = base * (1 + tax / 100);
                return (
                  <div
                    key={pid}
                    className="bg-card border border-border rounded-xl p-4 space-y-3"
                    data-ocid={`admin.vendorproducts.item.${pid}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground">
                          {product.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Category: {product.category}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Base Price: ₹{base.toFixed(2)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        Pending
                      </Badge>
                    </div>

                    {product.imageUrls.length > 0 && (
                      <div className="flex gap-2">
                        {product.imageUrls.slice(0, 3).map((url) => (
                          <img
                            key={url}
                            src={url}
                            alt=""
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}

                    {product.fssaiDocumentUrl && (
                      <a
                        href={product.fssaiDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View FSSAI Document
                      </a>
                    )}

                    <div className="flex items-center gap-3">
                      <Label className="text-xs">Tax (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={tax}
                        onChange={(e) =>
                          setTaxInputs((p) => ({
                            ...p,
                            [pid]: Number(e.target.value),
                          }))
                        }
                        className="h-8 text-xs w-20"
                        data-ocid={`admin.vendorproducts.tax_input.${pid}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        Final: ₹{final.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        type="button"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-8 text-xs"
                        disabled={actionLoading[`approve-${pid}`]}
                        onClick={() =>
                          doAction(`approve-${pid}`, () =>
                            actor!.adminApproveVendorProduct(
                              sessionKey,
                              product.id,
                              BigInt(tax),
                              null,
                            ),
                          )
                        }
                        data-ocid={`admin.vendorproducts.approve_button.${pid}`}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8 text-xs"
                        disabled={actionLoading[`reject-${pid}`]}
                        onClick={() =>
                          setShowRejectInput((p) => ({ ...p, [pid]: !p[pid] }))
                        }
                        data-ocid={`admin.vendorproducts.reject_toggle.${pid}`}
                      >
                        Reject
                      </Button>
                    </div>

                    {showRejectInput[pid] && (
                      <div className="space-y-2">
                        <textarea
                          value={rejectReasons[pid] ?? ""}
                          onChange={(e) =>
                            setRejectReasons((p) => ({
                              ...p,
                              [pid]: e.target.value,
                            }))
                          }
                          placeholder="Reason for rejection"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                          rows={2}
                          data-ocid={`admin.vendorproducts.reject_reason.${pid}`}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="h-8 text-xs"
                          disabled={
                            !rejectReasons[pid]?.trim() ||
                            actionLoading[`reject-${pid}`]
                          }
                          onClick={() =>
                            doAction(`reject-${pid}`, () =>
                              actor!.adminRejectVendorProduct(
                                sessionKey,
                                product.id,
                                rejectReasons[pid] ?? "",
                              ),
                            )
                          }
                          data-ocid={`admin.vendorproducts.confirm_reject_button.${pid}`}
                        >
                          Confirm Reject
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Approved */}
        {approved.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-emerald-700 mb-3">
              Approved ({approved.length})
            </h3>
            <div className="space-y-3">
              {approved.map((product) => (
                <div
                  key={product.id.toString()}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-3"
                >
                  <p className="text-sm font-semibold text-emerald-800">
                    {product.productName}
                  </p>
                  <p className="text-xs text-emerald-700">
                    Final Price: ₹
                    {(Number(product.finalPrice ?? 0) / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected */}
        {rejected.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-red-700 mb-3">
              Rejected ({rejected.length})
            </h3>
            <div className="space-y-3">
              {rejected.map((product) => (
                <div
                  key={product.id.toString()}
                  className="bg-red-50 border border-red-200 rounded-xl p-3"
                >
                  <p className="text-sm font-semibold text-red-800">
                    {product.productName}
                  </p>
                  <p className="text-xs text-red-700">
                    Reason: {product.rejectionReason ?? "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="admin.vendorproducts.panel">
      <PanelHeader
        title="Vendor Products"
        location="Review and approve products submitted by vendors"
      />
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 animate-pulse space-y-2"
            >
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : Object.keys(grouped).length === 0 ? (
        <div
          className="text-center py-12"
          data-ocid="admin.vendorproducts.empty_state"
        >
          <ShoppingBag
            size={36}
            className="text-muted-foreground/30 mx-auto mb-3"
          />
          <p className="text-sm text-muted-foreground">
            No vendor products found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([vid, list]) => {
            const pendingCount = list.filter(
              (p) => p.status === Variant_pending_approved_rejected.pending,
            ).length;
            return (
              <button
                key={vid}
                type="button"
                className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-sm transition-shadow text-left w-full"
                onClick={() => setSelectedVendorId(vid)}
                data-ocid={`admin.vendorproducts.vendor_card.${vid}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {list[0]?.vendorName ?? "Unknown Vendor"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {list[0]?.vendorEmail ?? ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {list.length} product(s)
                    </p>
                  </div>
                  {pendingCount > 0 && (
                    <Badge variant="default" className="text-[10px]">
                      {pendingCount} pending
                    </Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Hero Banners Panel ───────────────────────────────────────────────────────

interface BannerFormValues {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaSlug: string;
  order: string;
  isActive: boolean;
  durationSeconds: string;
}

const BLANK_BANNER: BannerFormValues = {
  title: "",
  subtitle: "",
  imageUrl: "",
  ctaText: "Shop Now",
  ctaSlug: "",
  order: "1",
  isActive: true,
  durationSeconds: "5",
};

function bannerToForm(b: HeroBanner): BannerFormValues {
  return {
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.imageUrl,
    ctaText: b.ctaText,
    ctaSlug: b.ctaSlug,
    order: b.order.toString(),
    isActive: b.isActive,
    durationSeconds: Number(b.durationSeconds ?? 5n).toString(),
  };
}

function formToBannerInput(form: BannerFormValues): HeroBannerInput {
  return {
    title: form.title,
    subtitle: form.subtitle,
    imageUrl: form.imageUrl,
    ctaText: form.ctaText,
    ctaSlug: form.ctaSlug,
    order: BigInt(Number.parseInt(form.order) || 1),
    isActive: form.isActive,
    durationSeconds: BigInt(Number.parseInt(form.durationSeconds) || 5),
  };
}

function PanelHeader({ title, location }: { title: string; location: string }) {
  return (
    <div className="mb-5 pb-3 border-b border-border">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-xs text-muted-foreground mt-0.5">
        Appears on: <span className="font-medium">{location}</span>
      </p>
    </div>
  );
}

function HeroBannersPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: banners, isLoading } = useAdminHeroBanners();
  const [addOpen, setAddOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    banner: HeroBanner | null;
  }>({ open: false, banner: null });
  const [form, setForm] = useState<BannerFormValues>(BLANK_BANNER);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const setField = (key: keyof BannerFormValues) => (v: string | boolean) =>
    setForm((p) => ({ ...p, [key]: v }));

  const openAdd = () => {
    setForm(BLANK_BANNER);
    setAddOpen(true);
  };
  const openEdit = (b: HeroBanner) => {
    setForm(bannerToForm(b));
    setEditDialog({ open: true, banner: b });
  };

  type ActorExt = {
    adminAddHeroBanner: (
      adminToken: string,
      input: HeroBannerInput,
    ) => Promise<HeroBanner>;
    adminUpdateHeroBanner: (
      adminToken: string,
      id: bigint,
      input: HeroBannerInput,
    ) => Promise<
      { __kind__: "ok"; ok: HeroBanner } | { __kind__: "err"; err: string }
    >;
    adminDeleteHeroBanner: (
      adminToken: string,
      id: bigint,
    ) => Promise<
      { __kind__: "ok"; ok: boolean } | { __kind__: "err"; err: string }
    >;
  };

  const handleAdd = async () => {
    if (actorFetching) {
      toast.error("Still connecting, please try again in a moment.");
      return;
    }
    if (!actor || !form.title.trim()) return;
    setSaving(true);
    try {
      await (actor as unknown as ActorExt).adminAddHeroBanner(
        localStorage.getItem(SESSION_KEY) ?? "",
        formToBannerInput(form),
      );
      await queryClient.invalidateQueries({ queryKey: ["adminHeroBanners"] });
      await queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
      toast.success(
        "Slide saved! It will now appear in the homepage slideshow.",
      );
      setAddOpen(false);
    } catch {
      toast.error("Failed to add slide");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (actorFetching) {
      toast.error("Still connecting, please try again in a moment.");
      return;
    }
    if (!actor || !editDialog.banner || !form.title.trim()) return;
    setSaving(true);
    try {
      const updateResult = await (
        actor as unknown as ActorExt
      ).adminUpdateHeroBanner(
        localStorage.getItem(SESSION_KEY) ?? "",
        editDialog.banner.id,
        formToBannerInput(form),
      );
      if (updateResult.__kind__ === "err") throw new Error(updateResult.err);
      await queryClient.invalidateQueries({ queryKey: ["adminHeroBanners"] });
      await queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
      toast.success(
        "Slide updated! The homepage slideshow now reflects your changes.",
      );
      setEditDialog({ open: false, banner: null });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update slide");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    try {
      const deleteResult = await (
        actor as unknown as ActorExt
      ).adminDeleteHeroBanner(localStorage.getItem(SESSION_KEY) ?? "", id);
      if (deleteResult.__kind__ === "err") throw new Error(deleteResult.err);
      await queryClient.invalidateQueries({ queryKey: ["adminHeroBanners"] });
      await queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
      toast.success("Slide removed from the homepage slideshow.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete slide");
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (isLoading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <PanelHeader
        title="Hero Slideshow"
        location="Homepage — top rotating banner"
      />
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          {banners?.length ?? 0} slides
        </p>
        <Button
          size="sm"
          className="btn-primary border-0 gap-1.5 h-8"
          onClick={openAdd}
          data-ocid="admin.herobanners.add_button"
        >
          <Plus size={14} /> Add Slide
        </Button>
      </div>

      {!banners || banners.length === 0 ? (
        <div
          className="text-center py-10 bg-muted/20 rounded-xl border border-border"
          data-ocid="admin.herobanners.empty_state"
        >
          <Image size={32} className="text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">No slides yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add your first slideshow slide to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner, idx) => (
            <div
              key={banner.id.toString()}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`admin.herobanners.item.${idx + 1}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-20 h-12 rounded-lg bg-muted overflow-hidden flex-none">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      🖼️
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {banner.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                    {banner.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">
                      Order: {banner.order.toString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ⏱ {Number(banner.durationSeconds ?? 5n)}s
                    </span>
                    <Badge
                      className={`text-[9px] px-1.5 py-0 border-0 ${
                        banner.isActive
                          ? "bg-secondary/20 text-secondary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(banner)}
                  className="flex-1 h-8 text-xs gap-1"
                  data-ocid={`admin.herobanners.edit_button.${idx + 1}`}
                >
                  <Edit size={12} /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(banner.id)}
                  className={`h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 ${
                    deleteConfirm === banner.id ? "bg-destructive/10" : ""
                  }`}
                  title={
                    deleteConfirm === banner.id
                      ? "Tap again to confirm"
                      : "Delete"
                  }
                  data-ocid={`admin.herobanners.delete_button.${idx + 1}`}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Slide</DialogTitle>
          </DialogHeader>
          <BannerFormFields form={form} setField={setField} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              className="btn-primary border-0"
              disabled={!form.title.trim() || saving}
              onClick={handleAdd}
              data-ocid="admin.herobanners.save_button"
            >
              {saving ? "Saving…" : "Save Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog((p) => ({ ...p, open }))}
      >
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Slide</DialogTitle>
          </DialogHeader>
          <BannerFormFields form={form} setField={setField} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, banner: null })}
            >
              Cancel
            </Button>
            <Button
              className="btn-primary border-0"
              disabled={!form.title.trim() || saving}
              onClick={handleEdit}
              data-ocid="admin.herobanners.edit.save_button"
            >
              {saving ? "Saving…" : "Update Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BannerFormFields({
  form,
  setField,
}: {
  form: BannerFormValues;
  setField: (key: keyof BannerFormValues) => (v: string | boolean) => void;
}) {
  return (
    <div className="space-y-3 py-1">
      <FormField
        id="banner-title"
        label="Title *"
        value={form.title}
        onChange={setField("title") as (v: string) => void}
        placeholder="Fresh from Assam's Tea Gardens"
      />
      <p className="text-[11px] text-muted-foreground mt-0.5 mb-1">
        Large bold text displayed on the slide
      </p>
      <FormField
        id="banner-subtitle"
        label="Subtitle"
        value={form.subtitle}
        onChange={setField("subtitle") as (v: string) => void}
        placeholder="Premium orthodox teas — authentically Assamese"
      />
      <p className="text-[11px] text-muted-foreground mt-0.5 mb-1">
        Smaller text shown below the heading
      </p>
      <ImageUpload
        value={form.imageUrl}
        onChange={setField("imageUrl") as (v: string) => void}
        label="Slide Image"
      />
      <p className="text-[11px] text-muted-foreground mt-0.5 mb-1">
        Full-width image shown behind the text — paste a direct image URL
      </p>
      <FormField
        id="banner-duration"
        label="Display Duration (seconds)"
        value={form.durationSeconds}
        onChange={setField("durationSeconds") as (v: string) => void}
        type="number"
        placeholder="5"
        min={1}
        max={60}
      />
      <p className="text-[11px] text-muted-foreground mt-0.5 mb-1">
        Seconds this slide stays on screen before advancing
      </p>
      <FormField
        id="banner-order"
        label="Display Order"
        value={form.order}
        onChange={setField("order") as (v: string) => void}
        type="number"
        placeholder="1"
      />
      <div className="flex items-center gap-2">
        <input
          id="banner-active"
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setField("isActive")(e.target.checked)}
          className="w-4 h-4 rounded border-input"
          data-ocid="admin.field.banner-active"
        />
        <Label
          htmlFor="banner-active"
          className="text-xs font-semibold cursor-pointer"
        >
          Active (show on homepage)
        </Label>
        <p className="text-[11px] text-muted-foreground mt-0.5 mb-1">
          Uncheck to hide this slide without deleting it
        </p>
      </div>
    </div>
  );
}

// ─── Featured Blocks Panel ────────────────────────────────────────────────────

interface BlockFormValues {
  title: string;
  thumbnailUrl: string;
  content: string;
  contentImages: string[];
  order: string;
  isActive: boolean;
}

const BLANK_BLOCK: BlockFormValues = {
  title: "",
  thumbnailUrl: "",
  content: "",
  contentImages: [],
  order: "1",
  isActive: true,
};

function blockToForm(b: FeaturedBlock): BlockFormValues {
  return {
    title: b.title,
    thumbnailUrl: b.thumbnailUrl,
    content: b.content,
    contentImages: b.contentImages,
    order: b.order.toString(),
    isActive: b.isActive,
  };
}

function formToBlockInput(form: BlockFormValues): FeaturedBlockInput {
  return {
    title: form.title,
    thumbnailUrl: form.thumbnailUrl,
    content: form.content,
    contentImages: form.contentImages.filter((u) => u.trim() !== ""),
    order: BigInt(Number.parseInt(form.order) || 1),
    isActive: form.isActive,
  };
}

function FeaturedBlocksPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: blocks, isLoading } = useAdminFeaturedBlocks();
  const [addOpen, setAddOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    block: FeaturedBlock | null;
  }>({ open: false, block: null });
  const [form, setForm] = useState<BlockFormValues>(BLANK_BLOCK);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const setField =
    (key: keyof BlockFormValues) => (v: string | boolean | string[]) =>
      setForm((p) => ({ ...p, [key]: v }));

  const openAdd = () => {
    setForm(BLANK_BLOCK);
    setAddOpen(true);
  };
  const openEdit = (b: FeaturedBlock) => {
    setForm(blockToForm(b));
    setEditDialog({ open: true, block: b });
  };

  type ActorExt = {
    adminAddFeaturedBlock: (
      adminToken: string,
      input: FeaturedBlockInput,
    ) => Promise<FeaturedBlock>;
    adminUpdateFeaturedBlock: (
      adminToken: string,
      id: bigint,
      input: FeaturedBlockInput,
    ) => Promise<FeaturedBlock | null>;
    adminDeleteFeaturedBlock: (
      adminToken: string,
      id: bigint,
    ) => Promise<boolean>;
  };

  const handleAdd = async () => {
    if (!actor || !form.title.trim()) return;
    setSaving(true);
    try {
      await (actor as unknown as ActorExt).adminAddFeaturedBlock(
        localStorage.getItem(SESSION_KEY) ?? "",
        formToBlockInput(form),
      );
      await queryClient.invalidateQueries({
        queryKey: ["adminFeaturedBlocks"],
      });
      await queryClient.invalidateQueries({ queryKey: ["featuredBlocks"] });
      toast.success("Block added");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add block");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!actor || !editDialog.block || !form.title.trim()) return;
    setSaving(true);
    try {
      await (actor as unknown as ActorExt).adminUpdateFeaturedBlock(
        localStorage.getItem(SESSION_KEY) ?? "",
        editDialog.block.id,
        formToBlockInput(form),
      );
      await queryClient.invalidateQueries({
        queryKey: ["adminFeaturedBlocks"],
      });
      await queryClient.invalidateQueries({ queryKey: ["featuredBlocks"] });
      toast.success("Block updated");
      setEditDialog({ open: false, block: null });
    } catch {
      toast.error("Failed to update block");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    try {
      await (actor as unknown as ActorExt).adminDeleteFeaturedBlock(
        localStorage.getItem(SESSION_KEY) ?? "",
        id,
      );
      await queryClient.invalidateQueries({
        queryKey: ["adminFeaturedBlocks"],
      });
      await queryClient.invalidateQueries({ queryKey: ["featuredBlocks"] });
      toast.success("Block deleted");
    } catch {
      toast.error("Failed to delete block");
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (isLoading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <PanelHeader
        title="Featured Blocks"
        location="Homepage — clickable story cards below the slideshow"
      />
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          {blocks?.length ?? 0} story blocks
        </p>
        <Button
          size="sm"
          className="btn-primary border-0 gap-1.5 h-8"
          onClick={openAdd}
          data-ocid="admin.featuredblocks.add_button"
        >
          <Plus size={14} /> Add Block
        </Button>
      </div>

      {!blocks || blocks.length === 0 ? (
        <div
          className="text-center py-10 bg-muted/20 rounded-xl border border-border"
          data-ocid="admin.featuredblocks.empty_state"
        >
          <LayoutGrid
            size={32}
            className="text-muted-foreground/30 mx-auto mb-2"
          />
          <p className="text-sm font-semibold text-foreground">
            No story blocks yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Add blocks to the "Stories &amp; Highlights" section.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, idx) => (
            <div
              key={block.id.toString()}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`admin.featuredblocks.item.${idx + 1}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden flex-none">
                  {block.thumbnailUrl ? (
                    <img
                      src={block.thumbnailUrl}
                      alt={block.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      📖
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {block.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">
                      Order: {block.order.toString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {block.contentImages.length} img
                      {block.contentImages.length !== 1 ? "s" : ""}
                    </span>
                    <Badge
                      className={`text-[9px] px-1.5 py-0 border-0 ${
                        block.isActive
                          ? "bg-secondary/20 text-secondary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {block.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(block)}
                  className="flex-1 h-8 text-xs gap-1"
                  data-ocid={`admin.featuredblocks.edit_button.${idx + 1}`}
                >
                  <Edit size={12} /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(block.id)}
                  className={`h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 ${deleteConfirm === block.id ? "bg-destructive/10" : ""}`}
                  title={
                    deleteConfirm === block.id
                      ? "Tap again to confirm"
                      : "Delete"
                  }
                  data-ocid={`admin.featuredblocks.delete_button.${idx + 1}`}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Story Block</DialogTitle>
          </DialogHeader>
          <BlockFormFields form={form} setField={setField} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              className="btn-primary border-0"
              disabled={!form.title.trim() || saving}
              onClick={handleAdd}
              data-ocid="admin.featuredblocks.save_button"
            >
              {saving ? "Saving…" : "Save Block"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog((p) => ({ ...p, open }))}
      >
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Story Block</DialogTitle>
          </DialogHeader>
          <BlockFormFields form={form} setField={setField} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, block: null })}
            >
              Cancel
            </Button>
            <Button
              className="btn-primary border-0"
              disabled={!form.title.trim() || saving}
              onClick={handleEdit}
              data-ocid="admin.featuredblocks.edit.save_button"
            >
              {saving ? "Saving…" : "Update Block"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function BlockFormFields({
  form,
  setField,
}: {
  form: BlockFormValues;
  setField: (
    key: keyof BlockFormValues,
  ) => (v: string | boolean | string[]) => void;
}) {
  const addImageUrl = () =>
    setField("contentImages")([...form.contentImages, ""]);
  const updateImageUrl = (idx: number, val: string) => {
    const updated = [...form.contentImages];
    updated[idx] = val;
    setField("contentImages")(updated);
  };
  const removeImageUrl = (idx: number) => {
    setField("contentImages")(form.contentImages.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3 py-1">
      <FormField
        id="block-title"
        label="Title *"
        value={form.title}
        onChange={setField("title") as (v: string) => void}
        placeholder="Bihu Festival Traditions"
      />
      <ImageUpload
        value={form.thumbnailUrl}
        onChange={setField("thumbnailUrl") as (v: string) => void}
        label="Thumbnail"
      />
      <div className="space-y-1.5">
        <Label htmlFor="block-content" className="text-xs font-semibold">
          Content (supports HTML formatting)
        </Label>
        <p className="text-[10px] text-muted-foreground">
          You can type HTML here — headings, bold, links, and images are
          supported.
        </p>
        <textarea
          id="block-content"
          value={form.content}
          onChange={(e) =>
            (setField("content") as (v: string) => void)(e.target.value)
          }
          placeholder="<h2>Bihu Festival</h2><p>Bihu is the...</p>"
          rows={6}
          className="w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none min-h-[120px]"
          data-ocid="admin.field.block-content"
        />
      </div>

      {/* Content images list */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold">Content Images</Label>
          <button
            type="button"
            onClick={addImageUrl}
            className="text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline"
            data-ocid="admin.featuredblocks.add_image_button"
          >
            <Plus size={11} /> Add URL
          </button>
        </div>
        {form.contentImages.length === 0 && (
          <p className="text-[10px] text-muted-foreground">
            No images added yet.
          </p>
        )}
        {form.contentImages.map((url, idx) => (
          <div key={url || String(idx)} className="flex gap-2 items-center">
            <Input
              value={url}
              onChange={(e) => updateImageUrl(idx, e.target.value)}
              placeholder="https://..."
              className="h-8 text-xs flex-1"
              data-ocid={`admin.featuredblocks.image_input.${idx + 1}`}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => removeImageUrl(idx)}
              className="h-8 w-8 p-0 border-destructive/30 text-destructive hover:bg-destructive/10 flex-none"
              aria-label="Remove image"
              data-ocid={`admin.featuredblocks.remove_image_button.${idx + 1}`}
            >
              <Trash2 size={11} />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField
          id="block-order"
          label="Display Order"
          value={form.order}
          onChange={setField("order") as (v: string) => void}
          type="number"
          placeholder="1"
        />
        <div className="space-y-1.5 flex items-end pb-0.5">
          <div className="flex items-center gap-2">
            <input
              id="block-active"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setField("isActive")(e.target.checked)}
              className="w-4 h-4 rounded border-input"
              data-ocid="admin.field.block-active"
            />
            <Label
              htmlFor="block-active"
              className="text-xs font-semibold cursor-pointer"
            >
              Active
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Products Panel ───────────────────────────────────────────────────────────
function ProductsPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });
  const [saving, setSaving] = useState(false);

  const { data: result, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return { products: [], total: 0n };
      return actor.listProducts({
        categoryId: undefined,
        searchTerm: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        inStockOnly: false,
        limit: 200n,
        offset: 0n,
      });
    },
    enabled: !!actor && !actorFetching,
  });

  const products = result?.products ?? [];

  const handleAdd = async (form: ProductFormValues) => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.adminAddProduct(
        localStorage.getItem(SESSION_KEY) ?? "",
        formToProductInput(form),
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success("Product added successfully");
      setAddOpen(false);
    } catch {
      toast.error("Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form: ProductFormValues) => {
    if (!actor || !editDialog.product) return;
    setSaving(true);
    try {
      await actor.adminUpdateProduct(
        localStorage.getItem(SESSION_KEY) ?? "",
        editDialog.product.id,
        formToProductInput(form),
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success("Product updated");
      setEditDialog({ open: false, product: null });
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    try {
      await actor.adminDeleteProduct(
        localStorage.getItem(SESSION_KEY) ?? "",
        id,
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (isLoading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <PanelHeader
        title="Products"
        location="Product catalog — shown on category and search pages"
      />
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          {products.length} products
        </p>
        <Button
          size="sm"
          className="btn-primary border-0 gap-1.5 h-8"
          onClick={() => setAddOpen(true)}
          data-ocid="admin.products.add_button"
        >
          <Plus size={14} /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div
          className="text-center py-10 bg-muted/20 rounded-xl border border-border"
          data-ocid="admin.products.empty_state"
        >
          <Package
            size={32}
            className="text-muted-foreground/30 mx-auto mb-2"
          />
          <p className="text-sm font-semibold text-foreground">
            No products yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Add your first product to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product, idx) => (
            <div
              key={product.id.toString()}
              className="bg-card border border-border rounded-xl p-3"
              data-ocid={`admin.products.item.${idx + 1}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-muted rounded-lg flex-none overflow-hidden">
                  {product.imageUrls[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      📦
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight line-clamp-1">
                    {product.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {product.brand}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-sm font-bold">
                      {formatPrice(
                        discountedPrice(product.price, product.discountPercent),
                      )}
                    </span>
                    {product.discountPercent > 0n && (
                      <Badge
                        variant="destructive"
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {Number(product.discountPercent)}% OFF
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Stock: {Number(product.stock)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditDialog({ open: true, product })}
                  className="flex-1 h-8 text-xs gap-1"
                  data-ocid={`admin.products.edit_button.${idx + 1}`}
                >
                  <Edit size={12} /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(product.id)}
                  className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                  data-ocid={`admin.products.delete_button.${idx + 1}`}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        initialValues={BLANK_PRODUCT}
        title="Add New Product"
        onSave={handleAdd}
        saving={saving}
      />
      <ProductFormDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog((p) => ({ ...p, open }))}
        initialValues={
          editDialog.product ? productToForm(editDialog.product) : BLANK_PRODUCT
        }
        title="Edit Product"
        onSave={handleEdit}
        saving={saving}
      />
    </>
  );
}

// ─── Product Form Dialog ──────────────────────────────────────────────────────
function ProductFormDialog({
  open,
  onOpenChange,
  initialValues,
  title,
  onSave,
  saving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: ProductFormValues;
  title: string;
  onSave: (form: ProductFormValues) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<ProductFormValues>(initialValues);
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { data: categories } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetCategories(localStorage.getItem(SESSION_KEY) ?? "");
    },
    enabled: !!actor && !actorFetching,
  });

  const handleOpenChange = (o: boolean) => {
    if (o) setForm(initialValues);
    onOpenChange(o);
  };
  const set = (key: keyof ProductFormValues) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <FormField
            id="prod-title"
            label="Product Title *"
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Assam Gold Tea — 250g"
          />
          <FormField
            id="prod-description"
            label="Description"
            value={form.description}
            onChange={set("description")}
            placeholder="Short product description"
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              id="prod-price"
              label="Price (₹) *"
              value={form.price}
              onChange={set("price")}
              type="number"
              placeholder="499"
            />
            <FormField
              id="prod-discount"
              label="Discount %"
              value={form.discountPercent}
              onChange={set("discountPercent")}
              type="number"
              placeholder="0"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prod-category" className="text-xs font-semibold">
                Category
              </Label>
              <select
                id="prod-category"
                value={form.category}
                onChange={(e) => set("category")(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background text-sm px-3"
                data-ocid="admin.field.prod-category"
              >
                {categories && categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id.toString()} value={c.id.toString()}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="1">Tea</option>
                    <option value="2">Spices</option>
                    <option value="3">Handloom</option>
                    <option value="4">Crafts</option>
                    <option value="5">Food</option>
                    <option value="6">Books</option>
                    <option value="7">Attire</option>
                    <option value="8">Kitchen</option>
                  </>
                )}
              </select>
            </div>
            <FormField
              id="prod-subcategory"
              label="Sub-category"
              value={form.subCategory}
              onChange={set("subCategory")}
              placeholder="e.g. CTC"
            />
          </div>
          <FormField
            id="prod-brand"
            label="Brand"
            value={form.brand}
            onChange={set("brand")}
            placeholder="e.g. Heritage Tea Co."
          />
          <FormField
            id="prod-tags"
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={set("tags")}
            placeholder="tea, organic, assam"
          />
          <ImageUpload
            value={form.imageUrl}
            onChange={set("imageUrl")}
            label="Product Image"
          />
          <FormField
            id="prod-stock"
            label="Stock Qty"
            value={form.stock}
            onChange={set("stock")}
            type="number"
            placeholder="50"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(form)}
            className="btn-primary border-0"
            disabled={!form.title.trim() || !form.price || saving}
            data-ocid="admin.product.save_button"
          >
            {saving ? "Saving…" : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Categories Panel ─────────────────────────────────────────────────────────
function CategoriesPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });
  const [form, setForm] = useState<CategoryFormValues>(BLANK_CATEGORY);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetCategories(localStorage.getItem(SESSION_KEY) ?? "");
    },
    enabled: !!actor && !actorFetching,
  });

  const set = (key: keyof CategoryFormValues) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  const openAdd = () => {
    setForm(BLANK_CATEGORY);
    setAddOpen(true);
  };
  const openEdit = (cat: Category) => {
    setForm(categoryToForm(cat));
    setEditDialog({ open: true, category: cat });
  };

  const handleAdd = async () => {
    if (!actor || !form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      const result = await actor.adminAddCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        form.name,
        form.slug,
        form.description,
        form.imageUrl,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      toast.success("Category added");
      setAddOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add category",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!actor || !editDialog.category || !form.name.trim()) return;
    setSaving(true);
    try {
      const result = await actor.adminUpdateCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        editDialog.category.id,
        form.name,
        form.slug,
        form.description,
        form.imageUrl,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      toast.success("Category updated");
      setEditDialog({ open: false, category: null });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update category",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    try {
      const result = await actor.adminDeleteCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        id,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      toast.success("Category deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete category",
      );
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (isLoading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <PanelHeader
        title="Categories"
        location="Products page — top-level navigation"
      />
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          {categories?.length ?? 0} categories
        </p>
        <Button
          size="sm"
          className="btn-primary border-0 gap-1.5 h-8"
          onClick={openAdd}
          data-ocid="admin.categories.add_button"
        >
          <Plus size={14} /> Add Category
        </Button>
      </div>

      {!categories || categories.length === 0 ? (
        <div
          className="text-center py-10 bg-muted/20 rounded-xl border border-border"
          data-ocid="admin.categories.empty_state"
        >
          <FolderTree
            size={32}
            className="text-muted-foreground/30 mx-auto mb-2"
          />
          <p className="text-sm font-semibold text-foreground">
            No categories yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat, idx) => (
            <div
              key={cat.id.toString()}
              className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
              data-ocid={`admin.categories.item.${idx + 1}`}
            >
              <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-none">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">
                    🗂️
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {cat.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  /{cat.slug} · {cat.subCategories.length} sub-cats
                </p>
              </div>
              <div className="flex gap-1.5 flex-none">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(cat)}
                  className="h-7 w-7 p-0"
                  data-ocid={`admin.categories.edit_button.${idx + 1}`}
                >
                  <Edit size={12} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(cat.id)}
                  className={`h-7 w-7 p-0 border-destructive/30 text-destructive hover:bg-destructive/10 ${deleteConfirm === cat.id ? "bg-destructive/10" : ""}`}
                  title={
                    deleteConfirm === cat.id ? "Tap again to confirm" : "Delete"
                  }
                  data-ocid={`admin.categories.delete_button.${idx + 1}`}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <CategoryFormFields form={form} set={set} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              className="btn-primary border-0"
              disabled={!form.name.trim() || !form.slug.trim() || saving}
              onClick={handleAdd}
              data-ocid="admin.categories.save_button"
            >
              {saving ? "Saving…" : "Save Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog((p) => ({ ...p, open }))}
      >
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryFormFields form={form} set={set} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, category: null })}
            >
              Cancel
            </Button>
            <Button
              className="btn-primary border-0"
              disabled={!form.name.trim() || saving}
              onClick={handleEdit}
              data-ocid="admin.categories.edit.save_button"
            >
              {saving ? "Saving…" : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CategoryFormFields({
  form,
  set,
}: {
  form: CategoryFormValues;
  set: (key: keyof CategoryFormValues) => (v: string) => void;
}) {
  return (
    <div className="space-y-3 py-1">
      <FormField
        id="cat-name"
        label="Category Name *"
        value={form.name}
        onChange={set("name")}
        placeholder="e.g. Tea"
      />
      <FormField
        id="cat-slug"
        label="Slug *"
        value={form.slug}
        onChange={set("slug")}
        placeholder="e.g. tea"
      />
      <FormField
        id="cat-description"
        label="Description"
        value={form.description}
        onChange={set("description")}
        placeholder="Short description"
      />
      <ImageUpload
        value={form.imageUrl}
        onChange={set("imageUrl")}
        label="Category Image"
      />
    </div>
  );
}

// ─── Sub-Categories Panel ─────────────────────────────────────────────────────
function SubCategoriesPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [addOpen, setAddOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    subCategory: SubCategory | null;
  }>({ open: false, subCategory: null });
  const [form, setForm] = useState<SubCategoryFormValues>(BLANK_SUBCATEGORY);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetCategories(localStorage.getItem(SESSION_KEY) ?? "");
    },
    enabled: !!actor && !actorFetching,
  });

  const selectedCategory = categories?.find(
    (c) => c.id.toString() === selectedCategoryId,
  );
  const subCategories = selectedCategory?.subCategories ?? [];

  const set = (key: keyof SubCategoryFormValues) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  const openAdd = () => {
    setForm(BLANK_SUBCATEGORY);
    setAddOpen(true);
  };
  const openEdit = (sub: SubCategory) => {
    setForm({ name: sub.name, imageUrl: sub.imageUrl });
    setEditDialog({ open: true, subCategory: sub });
  };

  const handleAdd = async () => {
    if (!actor || !selectedCategoryId || !form.name.trim()) return;
    setSaving(true);
    try {
      const result = await actor.adminAddSubCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        BigInt(selectedCategoryId),
        form.name,
        form.imageUrl,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      toast.success("Sub-category added");
      setAddOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add sub-category",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!actor || !selectedCategoryId || !editDialog.subCategory) return;
    setSaving(true);
    try {
      const result = await actor.adminUpdateSubCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        BigInt(selectedCategoryId),
        editDialog.subCategory.id,
        form.name,
        form.imageUrl,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      toast.success("Sub-category updated");
      setEditDialog({ open: false, subCategory: null });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update sub-category",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subId: bigint) => {
    if (!actor || !selectedCategoryId) return;
    if (deleteConfirm !== subId) {
      setDeleteConfirm(subId);
      return;
    }
    try {
      const result = await actor.adminDeleteSubCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        BigInt(selectedCategoryId),
        subId,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      toast.success("Sub-category deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete sub-category",
      );
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (isLoading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <PanelHeader
        title="Sub-Categories"
        location="Products page — filters under each category"
      />
      {/* Parent category selector */}
      <div className="mb-4 space-y-1.5">
        <Label htmlFor="parent-category" className="text-xs font-semibold">
          Select Parent Category
        </Label>
        <select
          id="parent-category"
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setDeleteConfirm(null);
          }}
          className="w-full h-9 rounded-md border border-input bg-background text-sm px-3"
          data-ocid="admin.subcategories.parent_select"
        >
          <option value="">— Choose a category —</option>
          {categories?.map((c) => (
            <option key={c.id.toString()} value={c.id.toString()}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategoryId && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">
              {subCategories.length} sub-categories in{" "}
              <span className="font-semibold text-foreground">
                {selectedCategory?.name}
              </span>
            </p>
            <Button
              size="sm"
              className="btn-primary border-0 gap-1.5 h-8"
              onClick={openAdd}
              data-ocid="admin.subcategories.add_button"
            >
              <Plus size={14} /> Add Sub-Category
            </Button>
          </div>

          {subCategories.length === 0 ? (
            <div
              className="text-center py-10 bg-muted/20 rounded-xl border border-border"
              data-ocid="admin.subcategories.empty_state"
            >
              <Layers
                size={32}
                className="text-muted-foreground/30 mx-auto mb-2"
              />
              <p className="text-sm font-semibold text-foreground">
                No sub-categories yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add the first sub-category for {selectedCategory?.name}.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {subCategories.map((sub, idx) => (
                <div
                  key={sub.id.toString()}
                  className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
                  data-ocid={`admin.subcategories.item.${idx + 1}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-none">
                    {sub.imageUrl ? (
                      <img
                        src={sub.imageUrl}
                        alt={sub.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        🏷️
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {sub.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      ID: {sub.id.toString()}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-none">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(sub)}
                      className="h-7 w-7 p-0"
                      data-ocid={`admin.subcategories.edit_button.${idx + 1}`}
                    >
                      <Edit size={12} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(sub.id)}
                      className={`h-7 w-7 p-0 border-destructive/30 text-destructive hover:bg-destructive/10 ${deleteConfirm === sub.id ? "bg-destructive/10" : ""}`}
                      title={
                        deleteConfirm === sub.id
                          ? "Tap again to confirm"
                          : "Delete"
                      }
                      data-ocid={`admin.subcategories.delete_button.${idx + 1}`}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!selectedCategoryId && (
        <div
          className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border"
          data-ocid="admin.subcategories.no_parent_state"
        >
          <Layers size={32} className="text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Select a parent category above to manage its sub-categories
          </p>
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Add Sub-Category to {selectedCategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <FormField
              id="sub-name"
              label="Sub-Category Name *"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. CTC Tea"
            />
            <ImageUpload
              value={form.imageUrl}
              onChange={set("imageUrl")}
              label="Sub-Category Image"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              className="btn-primary border-0"
              disabled={!form.name.trim() || saving}
              onClick={handleAdd}
              data-ocid="admin.subcategories.save_button"
            >
              {saving ? "Saving…" : "Save Sub-Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog((p) => ({ ...p, open }))}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Sub-Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <FormField
              id="sub-edit-name"
              label="Sub-Category Name *"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. CTC Tea"
            />
            <ImageUpload
              value={form.imageUrl}
              onChange={set("imageUrl")}
              label="Sub-Category Image"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, subCategory: null })}
            >
              Cancel
            </Button>
            <Button
              className="btn-primary border-0"
              disabled={!form.name.trim() || saving}
              onClick={handleEdit}
              data-ocid="admin.subcategories.edit.save_button"
            >
              {saving ? "Saving…" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Video Byte Panel ─────────────────────────────────────────────────────────
function VideoBytePanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("AssamRoots");
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!actor || actorFetching) return;
    type ActorExt = {
      getVideoByte: () => Promise<{
        url: string;
        enabled: boolean;
        title: string;
      }>;
    };
    (actor as unknown as ActorExt)
      .getVideoByte()
      .then((data) => {
        setVideoUrl(data.url);
        setVideoTitle(data.title || "AssamRoots");
        setVideoEnabled(data.enabled);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, actorFetching]);

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      type ActorExt = {
        adminUpdateVideoByte: (
          adminToken: string,
          url: string,
          enabled: boolean,
          title: string,
        ) => Promise<void>;
      };
      await (actor as unknown as ActorExt).adminUpdateVideoByte(
        localStorage.getItem(SESSION_KEY) ?? "",
        videoUrl,
        videoEnabled,
        videoTitle,
      );
      toast.success("Video settings saved successfully");
    } catch {
      toast.error("Failed to save video settings");
    } finally {
      setSaving(false);
    }
  };

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
    );
    if (ytMatch)
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return url;
    return null;
  };
  const embedUrl = getEmbedUrl(videoUrl);

  if (loading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="admin.video.panel">
      <PanelHeader
        title="Video Byte"
        location="Homepage — video section with gradient overlay"
      />
      {/* Settings card */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Homepage Video Byte
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Add a featured video to the homepage — paste a YouTube link or a
            direct .mp4 URL.
          </p>
        </div>

        {/* Enable toggle */}
        <div className="flex items-center gap-3 py-2 px-3 bg-muted/30 rounded-lg">
          <input
            id="video-enabled"
            type="checkbox"
            checked={videoEnabled}
            onChange={(e) => setVideoEnabled(e.target.checked)}
            className="w-4 h-4 rounded border-input"
            data-ocid="admin.video.enabled_toggle"
          />
          <Label
            htmlFor="video-enabled"
            className="text-sm font-semibold cursor-pointer flex-1"
          >
            Show video section on homepage
          </Label>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${videoEnabled ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}`}
          >
            {videoEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>

        {/* Title input */}
        <div className="space-y-1.5">
          <Label htmlFor="video-title" className="text-xs font-semibold">
            Overlay Title
          </Label>
          <Input
            id="video-title"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="AssamRoots"
            className="h-9 text-sm"
            data-ocid="admin.video.title_input"
          />
          <p className="text-[10px] text-muted-foreground">
            This text appears in the gradient overlay on the video section.
          </p>
        </div>

        {/* URL input */}
        <div className="space-y-1.5">
          <Label htmlFor="video-url" className="text-xs font-semibold">
            Video URL
          </Label>
          <Input
            id="video-url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://example.com/video.mp4"
            className="h-9 text-sm"
            data-ocid="admin.video.url_input"
          />
          <p className="text-[10px] text-muted-foreground">
            Supports YouTube links (youtube.com/watch, youtu.be) and direct MP4
            URLs.
          </p>
        </div>

        <Button
          size="sm"
          className="btn-primary border-0 w-full h-10 gap-1.5 font-semibold"
          onClick={handleSave}
          disabled={saving}
          data-ocid="admin.video.save_button"
        >
          <Save size={14} />
          {saving ? "Saving…" : "Save Video Settings"}
        </Button>
      </div>

      {/* Preview */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Preview
        </p>
        {embedUrl ? (
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            {embedUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
              <video
                src={embedUrl}
                className="w-full h-full object-cover"
                controls
                data-ocid="admin.video.preview_player"
              >
                <track kind="captions" />
              </video>
            ) : (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video preview"
                data-ocid="admin.video.preview_player"
              />
            )}
            {/* Gradient overlay preview */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 pointer-events-none">
              <span className="text-white font-display font-bold text-xl drop-shadow-lg">
                {videoTitle || "AssamRoots"}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="aspect-video rounded-xl bg-muted/40 border border-dashed border-border flex flex-col items-center justify-center gap-2"
            data-ocid="admin.video.preview_empty_state"
          >
            <Video size={32} className="text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              Paste a video URL above to see a preview
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Services Panel ───────────────────────────────────────────────────────────
function ServicesPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  // ── Services Availability ──
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [servicesAvailable, setServicesAvailable] = useState(true);
  const [unavailabilityMessage, setUnavailabilityMessage] = useState(
    "Our services are temporarily unavailable but will resume soon. Thank you for your patience.",
  );
  const [savingAvailability, setSavingAvailability] = useState(false);

  useEffect(() => {
    if (!actor || actorFetching) return;
    actor
      .getServicesAvailability()
      .then((data) => {
        setServicesAvailable(data.available);
        setUnavailabilityMessage(
          data.message ||
            "Our services are temporarily unavailable but will resume soon. Thank you for your patience.",
        );
      })
      .catch(() => {})
      .finally(() => setAvailabilityLoading(false));
  }, [actor, actorFetching]);

  const handleSaveAvailability = async () => {
    if (!actor) return;
    setSavingAvailability(true);
    try {
      await actor.adminUpdateServicesAvailability(
        localStorage.getItem(SESSION_KEY) ?? "",
        servicesAvailable,
        unavailabilityMessage,
      );
      await queryClient.invalidateQueries({
        queryKey: ["servicesAvailability"],
      });
      toast.success("Services availability updated");
    } catch {
      toast.error("Failed to update services availability");
    } finally {
      setSavingAvailability(false);
    }
  };

  // ── Service Requests ──
  const { data: requests, isLoading } = useQuery<ServiceRequestPublic[]>({
    queryKey: ["adminServiceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.adminGetServiceRequests(
        localStorage.getItem(SESSION_KEY) ?? "",
      );
      return [...all].sort((a, b) => Number(b.submittedAt - a.submittedAt));
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30_000,
  });

  const handleStatusUpdate = async (
    id: bigint,
    status: ServiceRequestStatus,
  ) => {
    if (!actor) return;
    await actor.adminUpdateServiceRequestStatus(
      localStorage.getItem(SESSION_KEY) ?? "",
      id,
      status,
    );
    await queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
    toast.success("Status updated");
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    await actor.adminDeleteServiceRequest(
      localStorage.getItem(SESSION_KEY) ?? "",
      id,
    );
    await queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
    toast.success("Request deleted");
  };

  if (isLoading || actorFetching || availabilityLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Services Availability section ── */}
      <div
        className="bg-card border border-border rounded-xl p-4 space-y-4"
        data-ocid="admin.services.availability_section"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            Services Availability
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Control whether the Services section is open for bookings. Customers
            will see the message below when services are unavailable.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-3 py-2 px-3 bg-muted/30 rounded-lg">
          <input
            id="services-available"
            type="checkbox"
            checked={servicesAvailable}
            onChange={(e) => setServicesAvailable(e.target.checked)}
            className="w-4 h-4 rounded border-input"
            data-ocid="admin.services.available_toggle"
          />
          <Label
            htmlFor="services-available"
            className="text-sm font-semibold cursor-pointer flex-1"
          >
            Services Currently Available
          </Label>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              servicesAvailable
                ? "bg-secondary/20 text-secondary"
                : "bg-destructive/15 text-destructive"
            }`}
          >
            {servicesAvailable ? "Open" : "Unavailable"}
          </span>
        </div>

        {/* Message textarea */}
        <div className="space-y-1.5">
          <Label
            htmlFor="services-unavailability-msg"
            className="text-xs font-semibold"
          >
            Unavailability Message
          </Label>
          <textarea
            id="services-unavailability-msg"
            value={unavailabilityMessage}
            onChange={(e) => setUnavailabilityMessage(e.target.value)}
            placeholder="Our services are temporarily unavailable but will resume soon. Thank you for your patience."
            rows={3}
            className="w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none"
            data-ocid="admin.services.unavailability_message_textarea"
          />
          <p className="text-[10px] text-muted-foreground">
            Shown to customers when services are set to Unavailable.
          </p>
        </div>

        <Button
          size="sm"
          className="btn-primary border-0 w-full h-10 gap-1.5 font-semibold"
          onClick={handleSaveAvailability}
          disabled={savingAvailability}
          data-ocid="admin.services.save_availability_button"
        >
          <Save size={14} />
          {savingAvailability ? "Saving…" : "Save Availability Settings"}
        </Button>
      </div>

      {/* ── Service Requests ── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Incoming Service Requests
        </p>
        {!requests || requests.length === 0 ? (
          <div
            className="text-center py-12 bg-muted/20 rounded-xl border border-border"
            data-ocid="admin.services.empty_state"
          >
            <Bell size={36} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-semibold text-sm text-foreground">
              No service requests yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              They will appear here when customers submit them.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req, idx) => (
              <ServiceRequestRow
                key={req.id.toString()}
                request={req}
                idx={idx}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceRequestRow({
  request,
  idx,
  onStatusUpdate,
  onDelete,
}: {
  request: ServiceRequestPublic;
  idx: number;
  onStatusUpdate: (id: bigint, status: ServiceRequestStatus) => Promise<void>;
  onDelete: (id: bigint) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ServiceRequestStatus>(
    request.status,
  );
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cfg = STATUS_CONFIG[request.status];

  const submittedDate = new Date(
    Number(request.submittedAt) / 1_000_000,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden"
      data-ocid={`admin.services.item.${idx + 1}`}
    >
      <button
        type="button"
        className="w-full text-left px-4 py-3 flex items-start gap-3"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">
              {SERVICE_TYPE_LABELS[request.serviceType]}
            </span>
            <Badge
              className={`text-[10px] px-2 py-0.5 h-auto ${cfg.className}`}
            >
              {cfg.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {request.userName} · +91 {request.userPhone} · {submittedDate}
          </p>
        </div>
        {expanded ? (
          <ChevronUp
            size={16}
            className="text-muted-foreground flex-none mt-0.5"
          />
        ) : (
          <ChevronDown
            size={16}
            className="text-muted-foreground flex-none mt-0.5"
          />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/20">
          <p className="text-sm text-foreground leading-relaxed">
            {request.description}
          </p>
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label
                htmlFor={`status-${request.id}`}
                className="text-xs font-semibold"
              >
                Update Status
              </Label>
              <select
                id={`status-${request.id}`}
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as ServiceRequestStatus)
                }
                className="w-full h-9 rounded-md border border-input bg-background text-sm px-3"
                data-ocid={`admin.services.status_select.${idx + 1}`}
              >
                <option value={ServiceRequestStatus.New}>New</option>
                <option value={ServiceRequestStatus.Contacted}>
                  Contacted
                </option>
                <option value={ServiceRequestStatus.Completed}>
                  Completed
                </option>
                <option value={ServiceRequestStatus.Cancelled}>
                  Cancelled
                </option>
              </select>
            </div>
            <Button
              size="sm"
              className="h-9 btn-primary border-0 text-xs"
              onClick={async () => {
                setUpdating(true);
                await onStatusUpdate(request.id, selectedStatus);
                setUpdating(false);
              }}
              disabled={updating || selectedStatus === request.status}
              data-ocid={`admin.services.save_button.${idx + 1}`}
            >
              {updating ? "Saving…" : "Update"}
            </Button>
          </div>
          <Button
            size="sm"
            variant="outline"
            className={`w-full h-8 text-xs border-destructive/30 ${confirmDelete ? "bg-destructive/10 text-destructive" : "text-destructive"}`}
            onClick={async () => {
              if (!confirmDelete) {
                setConfirmDelete(true);
                return;
              }
              setDeleting(true);
              await onDelete(request.id);
              setDeleting(false);
              setConfirmDelete(false);
            }}
            disabled={deleting}
            data-ocid={`admin.services.delete_button.${idx + 1}`}
          >
            <Trash2 size={12} className="mr-1" />
            {confirmDelete
              ? "Tap again to confirm delete"
              : deleting
                ? "Deleting…"
                : "Delete Request"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Inventory Panel ──────────────────────────────────────────────────────────
function InventoryPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const { data: result, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return { products: [], total: 0n };
      return actor.listProducts({
        categoryId: undefined,
        searchTerm: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        inStockOnly: false,
        limit: 200n,
        offset: 0n,
      });
    },
    enabled: !!actor && !actorFetching,
  });

  const products = (result?.products ?? []).filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSaveStock = async (id: bigint) => {
    if (!actor) return;
    const key = id.toString();
    const newStock = BigInt(
      Math.max(0, Number.parseInt(stockEdits[key] ?? "0") || 0),
    );
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      await actor.adminUpdateStock(
        localStorage.getItem(SESSION_KEY) ?? "",
        id,
        newStock,
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setStockEdits((p) => {
        const n = { ...p };
        delete n[key];
        return n;
      });
      toast.success("Stock updated");
    } catch {
      toast.error("Failed to update stock");
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };

  if (isLoading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <PanelHeader
        title="Inventory"
        location="All product pages — stock badge and availability"
      />
      <Input
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 text-sm mb-4"
        data-ocid="admin.inventory.search_input"
      />
      {products.length === 0 ? (
        <div
          className="text-center py-10 bg-muted/20 rounded-xl border border-border"
          data-ocid="admin.inventory.empty_state"
        >
          <Warehouse
            size={32}
            className="text-muted-foreground/30 mx-auto mb-2"
          />
          <p className="text-sm text-muted-foreground">
            {search ? "No products match your search." : "No products found."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p, idx) => {
            const key = p.id.toString();
            const editVal =
              key in stockEdits ? stockEdits[key] : p.stock.toString();
            const isDirty = key in stockEdits;
            return (
              <div
                key={key}
                className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
                data-ocid={`admin.inventory.item.${idx + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {p.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {p.brand}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-none">
                  <Input
                    type="number"
                    min={0}
                    value={editVal}
                    onChange={(e) =>
                      setStockEdits((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="h-8 w-20 text-sm text-center"
                    data-ocid={`admin.inventory.input.${idx + 1}`}
                  />
                  <Button
                    size="sm"
                    variant={isDirty ? "default" : "outline"}
                    className={`h-8 w-8 p-0 ${isDirty ? "btn-primary border-0" : ""}`}
                    disabled={!isDirty || saving[key]}
                    onClick={() => handleSaveStock(p.id)}
                    title="Save stock"
                    data-ocid={`admin.inventory.save_button.${idx + 1}`}
                  >
                    {saving[key] ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <Save size={12} />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Discounts Panel ──────────────────────────────────────────────────────────
function DiscountsPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [discountEdits, setDiscountEdits] = useState<Record<string, string>>(
    {},
  );
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const { data: result, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return { products: [], total: 0n };
      return actor.listProducts({
        categoryId: undefined,
        searchTerm: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        inStockOnly: false,
        limit: 200n,
        offset: 0n,
      });
    },
    enabled: !!actor && !actorFetching,
  });

  const products = (result?.products ?? []).filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSaveDiscount = async (id: bigint) => {
    if (!actor) return;
    const key = id.toString();
    const pct = BigInt(
      Math.min(
        100,
        Math.max(0, Number.parseInt(discountEdits[key] ?? "0") || 0),
      ),
    );
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      await actor.adminSetDiscount(
        localStorage.getItem(SESSION_KEY) ?? "",
        id,
        pct,
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setDiscountEdits((p) => {
        const n = { ...p };
        delete n[key];
        return n;
      });
      toast.success("Discount updated");
    } catch {
      toast.error("Failed to update discount");
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };

  if (isLoading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <PanelHeader
        title="Discounts"
        location="Product cards — shown as strikethrough original price"
      />
      <Input
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 text-sm mb-4"
        data-ocid="admin.discounts.search_input"
      />
      {products.length === 0 ? (
        <div
          className="text-center py-10 bg-muted/20 rounded-xl border border-border"
          data-ocid="admin.discounts.empty_state"
        >
          <PercentCircle
            size={32}
            className="text-muted-foreground/30 mx-auto mb-2"
          />
          <p className="text-sm text-muted-foreground">
            {search ? "No products match your search." : "No products found."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p, idx) => {
            const key = p.id.toString();
            const editVal =
              key in discountEdits
                ? discountEdits[key]
                : p.discountPercent.toString();
            const isDirty = key in discountEdits;
            return (
              <div
                key={key}
                className="bg-card border border-border rounded-xl p-3 flex items-center gap-3"
                data-ocid={`admin.discounts.item.${idx + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {p.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] text-muted-foreground">
                      {formatPrice(p.price)}
                    </p>
                    {p.discountPercent > 0n && (
                      <Badge
                        variant="destructive"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {Number(p.discountPercent)}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-none">
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={editVal}
                      onChange={(e) =>
                        setDiscountEdits((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="h-8 w-16 text-sm text-center rounded-r-none"
                      data-ocid={`admin.discounts.input.${idx + 1}`}
                    />
                    <span className="h-8 px-2 flex items-center bg-muted border border-l-0 border-input rounded-r-md text-xs text-muted-foreground">
                      %
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={isDirty ? "default" : "outline"}
                    className={`h-8 w-8 p-0 ${isDirty ? "btn-primary border-0" : ""}`}
                    disabled={!isDirty || saving[key]}
                    onClick={() => handleSaveDiscount(p.id)}
                    title="Apply discount"
                    data-ocid={`admin.discounts.save_button.${idx + 1}`}
                  >
                    {saving[key] ? (
                      <RefreshCw size={12} className="animate-spin" />
                    ) : (
                      <Save size={12} />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Branding Panel ───────────────────────────────────────────────────────────
function BrandingPanel() {
  const queryClient = useQueryClient();
  const { data: settings } = useSiteSettings();
  const saveSiteSettings = useSaveSiteSettings();

  const currentLogo = settings?.logoUrl ?? "";
  const currentFavicon = settings?.faviconUrl ?? "";

  const [logoUrl, setLogoUrl] = useState<string>("");
  const [faviconUrl, setFaviconUrl] = useState<string>("");
  const [logoSaved, setLogoSaved] = useState(false);
  const [faviconSaved, setFaviconSaved] = useState(false);

  useEffect(() => {
    setLogoUrl(currentLogo);
    setFaviconUrl(currentFavicon);
  }, [currentLogo, currentFavicon]);

  const handleSaveLogo = () => {
    saveSiteSettings.mutate(
      { logoUrl: logoUrl || null, faviconUrl: currentFavicon || null },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
          setLogoSaved(true);
          setTimeout(() => setLogoSaved(false), 2500);
          toast.success("Logo updated — visible across the whole site");
        },
        onError: () => toast.error("Failed to save logo"),
      },
    );
  };

  const handleSaveFavicon = () => {
    saveSiteSettings.mutate(
      { logoUrl: currentLogo || null, faviconUrl: faviconUrl || null },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
          setFaviconSaved(true);
          setTimeout(() => setFaviconSaved(false), 2500);
          toast.success("Favicon updated — reload the tab to see it in action");
        },
        onError: () => toast.error("Failed to save favicon"),
      },
    );
  };

  return (
    <div className="space-y-6" data-ocid="admin.branding.panel">
      <PanelHeader
        title="Branding"
        location="Site-wide — logo in header and favicon in browser tab"
      />
      <div className="bg-muted/30 border border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Current Branding
        </p>
        <div className="flex items-center gap-4">
          <div className="space-y-1 flex-1">
            <p className="text-[10px] text-muted-foreground">Logo</p>
            <div className="w-28 h-10 bg-card border border-border rounded-lg overflow-hidden flex items-center justify-center">
              {currentLogo ? (
                <img
                  src={currentLogo}
                  alt="Current logo"
                  className="h-full w-auto object-contain p-1"
                />
              ) : (
                <span className="text-xs text-muted-foreground">Default</span>
              )}
            </div>
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-[10px] text-muted-foreground">Favicon</p>
            <div className="w-10 h-10 bg-card border border-border rounded-lg overflow-hidden flex items-center justify-center">
              {currentFavicon ? (
                <img
                  src={currentFavicon}
                  alt="Current favicon"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-[10px] text-muted-foreground">–</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="bg-card border border-border rounded-xl p-4 space-y-3"
        data-ocid="admin.branding.logo_section"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">Site Logo</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Displayed in the header on all pages. Recommended height: 40px. PNG
            with transparent background works best.
          </p>
        </div>
        <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Logo Image" />
        <Button
          size="sm"
          className="btn-primary border-0 w-full h-9 gap-1.5"
          onClick={handleSaveLogo}
          disabled={logoUrl === currentLogo}
          data-ocid="admin.branding.logo_save_button"
        >
          <Save size={13} />
          {logoSaved ? "Saved!" : "Save Logo"}
        </Button>
        {currentLogo && (
          <button
            type="button"
            className="text-[10px] text-destructive/70 hover:text-destructive underline underline-offset-2 transition-colors"
            onClick={() => {
              setLogoUrl("");
              saveSiteSettings.mutate(
                { logoUrl: null, faviconUrl: currentFavicon || null },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: ["siteSettings"],
                    });
                    toast.success("Logo reset to default");
                  },
                  onError: () => toast.error("Failed to reset logo"),
                },
              );
            }}
            data-ocid="admin.branding.logo_reset_button"
          >
            Reset to default logo
          </button>
        )}
      </div>

      <div
        className="bg-card border border-border rounded-xl p-4 space-y-3"
        data-ocid="admin.branding.favicon_section"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            Browser Tab Favicon
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            The small icon shown in the browser tab. Square image recommended —
            32×32 or 64×64 px PNG.
          </p>
        </div>
        <ImageUpload
          value={faviconUrl}
          onChange={setFaviconUrl}
          label="Favicon Image"
        />
        <Button
          size="sm"
          className="btn-primary border-0 w-full h-9 gap-1.5"
          onClick={handleSaveFavicon}
          disabled={faviconUrl === currentFavicon}
          data-ocid="admin.branding.favicon_save_button"
        >
          <Save size={13} />
          {faviconSaved ? "Saved!" : "Save Favicon"}
        </Button>
        {currentFavicon && (
          <button
            type="button"
            className="text-[10px] text-destructive/70 hover:text-destructive underline underline-offset-2 transition-colors"
            onClick={() => {
              setFaviconUrl("");
              saveSiteSettings.mutate(
                { logoUrl: currentLogo || null, faviconUrl: null },
                {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: ["siteSettings"],
                    });
                    toast.success("Favicon reset to default");
                  },
                  onError: () => toast.error("Failed to reset favicon"),
                },
              );
            }}
            data-ocid="admin.branding.favicon_reset_button"
          >
            Reset to default favicon
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [isLoggedIn, setIsLoggedIn] = useState(() => isSessionValid());

  // Periodically check session validity
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoggedIn && !isSessionValid()) {
        clearSession();
        setIsLoggedIn(false);
        toast.info("Your session has expired. Please sign in again.");
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleSignOut = () => {
    clearSession();
    setIsLoggedIn(false);
    toast.success("Signed out of admin panel");
  };

  const { data: serviceRequests } = useQuery<ServiceRequestPublic[]>({
    queryKey: ["adminServiceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetServiceRequests(
        localStorage.getItem(SESSION_KEY) ?? "",
      );
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
    refetchInterval: 60_000,
  });
  const newCount =
    serviceRequests?.filter((r) => r.status === ServiceRequestStatus.New)
      .length ?? 0;

  if (!isLoggedIn) {
    return <AdminLoginForm onSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <Layout>
      <div className="px-4 py-4 lg:py-6">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl lg:text-2xl font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your products, categories, and services
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSignOut}
            className="flex-none gap-1.5 h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
            data-ocid="admin.signout_button"
          >
            <LogOut size={13} /> Sign Out
          </Button>
        </div>

        {/* Tabs — scrollable row */}
        <div
          className="flex gap-1 bg-muted/50 rounded-xl p-1 mb-5 overflow-x-auto no-scrollbar"
          role="tablist"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-none text-xs font-semibold py-2 px-3 rounded-lg transition-smooth whitespace-nowrap flex items-center gap-1 relative ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`admin.tab.${tab.id}`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "services" && newCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold ml-0.5">
                  {newCount > 9 ? "9+" : newCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "homepage" && <HomepagePanel />}
        {activeTab === "herobanners" && <HeroBannersPanel />}
        {activeTab === "featuredblocks" && <FeaturedBlocksPanel />}
        {activeTab === "video" && <VideoBytePanel />}
        {activeTab === "products" && <ProductsPanel />}
        {activeTab === "categories" && <CategoriesPanel />}
        {activeTab === "subcategories" && <SubCategoriesPanel />}
        {activeTab === "services" && <ServicesPanel />}
        {activeTab === "inventory" && <InventoryPanel />}
        {activeTab === "discounts" && <DiscountsPanel />}
        {activeTab === "branding" && <BrandingPanel />}
        {activeTab === "footer" && <FooterPanel />}
        {activeTab === "vendors" && <VendorsPanel />}
        {activeTab === "vendorproducts" && <VendorProductsPanel />}
      </div>
    </Layout>
  );
}

// ─── Homepage Panel ──────────────────────────────────────────────────────────
function HomepagePanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [heroTagline, setHeroTagline] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [steps, setSteps] = useState([
    { id: "step-1", title: "", description: "" },
    { id: "step-2", title: "", description: "" },
    { id: "step-3", title: "", description: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!actor || actorFetching) return;
    type ActorExt = {
      getSiteSettings: () => Promise<{
        heroTagline: string;
        heroSubtitle: string;
        howitworksSteps: Array<{ title: string; description: string }>;
        logoUrl?: string;
        faviconUrl?: string;
      }>;
    };
    (actor as unknown as ActorExt)
      .getSiteSettings()
      .then((data) => {
        setHeroTagline(data.heroTagline || "");
        setHeroSubtitle(data.heroSubtitle || "");
        if (data.howitworksSteps && data.howitworksSteps.length > 0) {
          const filled = [...data.howitworksSteps];
          while (filled.length < 3) filled.push({ title: "", description: "" });
          setSteps(
            filled.slice(0, 3).map((s, i) => ({ id: `step-${i + 1}`, ...s })),
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor, actorFetching]);

  const updateStep = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      type ActorExt = {
        adminUpdateHeroAndHowitworks: (
          adminToken: string,
          heroTagline: string,
          heroSubtitle: string,
          howitworksSteps: Array<{ title: string; description: string }>,
        ) => Promise<void>;
      };
      await (actor as unknown as ActorExt).adminUpdateHeroAndHowitworks(
        localStorage.getItem(SESSION_KEY) ?? "",
        heroTagline,
        heroSubtitle,
        steps,
      );
      await queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Homepage content saved successfully");
    } catch {
      toast.error("Failed to save homepage content");
    } finally {
      setSaving(false);
    }
  };

  if (loading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="admin.homepage.panel">
      <PanelHeader
        title="Homepage Content"
        location="Homepage — tagline and How It Works section"
      />
      {/* Hero Section */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Hero Section</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            The main headline and subtitle displayed at the top of the homepage.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hero-tagline" className="text-xs font-semibold">
            Tagline (Main Headline)
          </Label>
          <Input
            id="hero-tagline"
            value={heroTagline}
            onChange={(e) => setHeroTagline(e.target.value)}
            placeholder="Bringing Assam to the World"
            className="h-9 text-sm"
            data-ocid="admin.homepage.tagline_input"
          />
          <p className="text-[10px] text-muted-foreground">
            Large display text shown on the hero banner.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hero-subtitle" className="text-xs font-semibold">
            Subtitle
          </Label>
          <Input
            id="hero-subtitle"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="Authentic Assamese products delivered to you, wherever you are."
            className="h-9 text-sm"
            data-ocid="admin.homepage.subtitle_input"
          />
          <p className="text-[10px] text-muted-foreground">
            Supporting text shown below the tagline.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">How It Works</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Three steps shown on the homepage to guide first-time visitors.
          </p>
        </div>

        {steps.map((step, index) => (
          <div
            key={step.id}
            className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border/60"
            data-ocid={`admin.homepage.step.${index + 1}`}
          >
            <p className="text-xs font-bold text-primary">Step {index + 1}</p>
            <div className="space-y-1.5">
              <Label
                htmlFor={`step-title-${index}`}
                className="text-xs font-semibold"
              >
                Title
              </Label>
              <Input
                id={`step-title-${index}`}
                value={step.title}
                onChange={(e) => updateStep(index, "title", e.target.value)}
                placeholder={
                  [
                    "Browse our catalog",
                    "Place your order",
                    "Delivered to you",
                  ][index]
                }
                className="h-9 text-sm"
                data-ocid={`admin.homepage.step_title.${index + 1}`}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor={`step-desc-${index}`}
                className="text-xs font-semibold"
              >
                Description
              </Label>
              <Input
                id={`step-desc-${index}`}
                value={step.description}
                onChange={(e) =>
                  updateStep(index, "description", e.target.value)
                }
                placeholder={
                  [
                    "Explore 100+ authentic Assamese products",
                    "Secure checkout with COD or online payment",
                    "Express or standard delivery, anywhere in India",
                  ][index]
                }
                className="h-9 text-sm"
                data-ocid={`admin.homepage.step_desc.${index + 1}`}
              />
            </div>
          </div>
        ))}

        <Button
          size="sm"
          className="btn-primary border-0 w-full h-10 gap-1.5 font-semibold"
          onClick={handleSave}
          disabled={saving}
          data-ocid="admin.homepage.save_button"
          type="button"
        >
          <Save size={14} />
          {saving ? "Saving…" : "Save Homepage Content"}
        </Button>
      </div>
    </div>
  );
}

// ─── Footer Panel ─────────────────────────────────────────────────────────────
interface ReviewFormValues {
  reviewerName: string;
  rating: string;
  reviewText: string;
  productName: string;
}

const BLANK_REVIEW: ReviewFormValues = {
  reviewerName: "",
  rating: "5",
  reviewText: "",
  productName: "",
};

const SOCIAL_PLATFORMS = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/assamroots",
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/assamroots",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    placeholder: "https://wa.me/919876543210",
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@assamroots",
  },
];

function FooterPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: footerData, isLoading: footerLoading } = useFooterSettings();
  const { data: reviews, isLoading: reviewsLoading } = useReviews();

  // ── Branding fields ──
  const [tagline, setTagline] = useState("");
  const [copyright, setCopyright] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [savingBranding, setSavingBranding] = useState(false);

  // ── Social links ──
  type SocialMap = Record<string, { url: string; enabled: boolean }>;
  const [socialMap, setSocialMap] = useState<SocialMap>({});
  const [savingSocials, setSavingSocials] = useState(false);

  // ── Reviews ──
  const [reviewForm, setReviewForm] = useState<ReviewFormValues>(BLANK_REVIEW);
  const [addingReview, setAddingReview] = useState(false);
  const [editReview, setEditReview] = useState<{
    open: boolean;
    id: bigint | null;
    form: ReviewFormValues;
  }>({ open: false, id: null, form: BLANK_REVIEW });
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);

  // Populate fields when data loads
  useEffect(() => {
    if (!footerData) return;
    setTagline(footerData.tagline ?? "");
    setCopyright(footerData.copyright ?? "");
    setAboutContent(footerData.aboutContent ?? "");
    const map: SocialMap = {};
    for (const p of SOCIAL_PLATFORMS) {
      const found = footerData.socialLinks?.find(
        (s) => s.platform.toLowerCase() === p.key,
      );
      map[p.key] = { url: found?.url ?? "", enabled: found?.enabled ?? false };
    }
    setSocialMap(map);
  }, [footerData]);

  const buildSocialLinks = () =>
    SOCIAL_PLATFORMS.map((p) => ({
      platform: p.key,
      url: socialMap[p.key]?.url ?? "",
      enabled: socialMap[p.key]?.enabled ?? false,
    }));

  const handleSaveBranding = async () => {
    if (!actor) return;
    setSavingBranding(true);
    try {
      await actor.adminUpdateFooterSettings(
        localStorage.getItem(SESSION_KEY) ?? "",
        tagline,
        copyright,
        aboutContent,
        buildSocialLinks(),
      );
      await queryClient.invalidateQueries({ queryKey: ["footerSettings"] });
      toast.success("Footer branding saved");
    } catch {
      toast.error("Failed to save footer branding");
    } finally {
      setSavingBranding(false);
    }
  };

  const handleSaveSocials = async () => {
    if (!actor) return;
    setSavingSocials(true);
    try {
      await actor.adminUpdateFooterSettings(
        localStorage.getItem(SESSION_KEY) ?? "",
        tagline,
        copyright,
        aboutContent,
        buildSocialLinks(),
      );
      await queryClient.invalidateQueries({ queryKey: ["footerSettings"] });
      toast.success("Social links saved");
    } catch {
      toast.error("Failed to save social links");
    } finally {
      setSavingSocials(false);
    }
  };

  const handleAddReview = async () => {
    if (
      !actor ||
      !reviewForm.reviewerName.trim() ||
      !reviewForm.reviewText.trim()
    )
      return;
    setAddingReview(true);
    try {
      await actor.adminAddReview(
        localStorage.getItem(SESSION_KEY) ?? "",
        reviewForm.reviewerName,
        BigInt(Number.parseInt(reviewForm.rating) || 5),
        reviewForm.reviewText,
        reviewForm.productName,
      );
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review added");
      setReviewForm(BLANK_REVIEW);
    } catch {
      toast.error("Failed to add review");
    } finally {
      setAddingReview(false);
    }
  };

  const handleEditReview = async () => {
    if (!actor || !editReview.id) return;
    try {
      await actor.adminUpdateReview(
        localStorage.getItem(SESSION_KEY) ?? "",
        editReview.id,
        editReview.form.reviewerName,
        BigInt(Number.parseInt(editReview.form.rating) || 5),
        editReview.form.reviewText,
        editReview.form.productName,
      );
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review updated");
      setEditReview({ open: false, id: null, form: BLANK_REVIEW });
    } catch {
      toast.error("Failed to update review");
    }
  };

  const handleDeleteReview = async (id: bigint) => {
    if (!actor) return;
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setDeletingId(id);
    try {
      await actor.adminDeleteReview(
        localStorage.getItem(SESSION_KEY) ?? "",
        id,
      );
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (footerLoading || reviewsLoading || actorFetching) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="admin.footer.panel">
      <PanelHeader
        title="Footer"
        location="Bottom of every page — tagline, social links, and reviews"
      />
      {/* ── Branding sub-section ── */}
      <div
        className="bg-card border border-border rounded-xl p-4 space-y-4"
        data-ocid="admin.footer.branding_section"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            Footer Branding
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Tagline and copyright text shown in the footer on every page.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="footer-tagline" className="text-xs font-semibold">
            Tagline
          </Label>
          <Input
            id="footer-tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Bringing Assam to the World"
            className="h-9 text-sm"
            data-ocid="admin.footer.tagline_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="footer-copyright" className="text-xs font-semibold">
            Copyright Text
          </Label>
          <Input
            id="footer-copyright"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            placeholder={`© ${new Date().getFullYear()} AssamRoots. All rights reserved.`}
            className="h-9 text-sm"
            data-ocid="admin.footer.copyright_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="footer-about" className="text-xs font-semibold">
            About Page Content
          </Label>
          <p className="text-[10px] text-muted-foreground">
            This text is shown on the /about page.
          </p>
          <textarea
            id="footer-about"
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
            placeholder="AssamRoots is an Assamese-first platform connecting the diaspora with authentic products..."
            rows={5}
            className="w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none"
            data-ocid="admin.footer.about_textarea"
          />
        </div>
        <Button
          size="sm"
          className="btn-primary border-0 w-full h-10 gap-1.5 font-semibold"
          onClick={handleSaveBranding}
          disabled={savingBranding}
          data-ocid="admin.footer.save_branding_button"
        >
          <Save size={14} />
          {savingBranding ? "Saving…" : "Save Footer Branding"}
        </Button>
      </div>

      {/* ── Social Links sub-section ── */}
      <div
        className="bg-card border border-border rounded-xl p-4 space-y-4"
        data-ocid="admin.footer.socials_section"
      >
        <div>
          <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <MessageSquare size={15} /> Social Links
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Social media links shown in the footer. Toggle to show or hide each
            one.
          </p>
        </div>
        <div className="space-y-3">
          {SOCIAL_PLATFORMS.map((p) => (
            <div key={p.key} className="flex items-center gap-3">
              <input
                id={`social-enabled-${p.key}`}
                type="checkbox"
                checked={socialMap[p.key]?.enabled ?? false}
                onChange={(e) =>
                  setSocialMap((prev) => ({
                    ...prev,
                    [p.key]: { ...prev[p.key], enabled: e.target.checked },
                  }))
                }
                className="w-4 h-4 rounded border-input flex-none"
                data-ocid={`admin.footer.social_enabled.${p.key}`}
              />
              <Label
                htmlFor={`social-enabled-${p.key}`}
                className="text-xs font-semibold w-20 flex-none cursor-pointer"
              >
                {p.label}
              </Label>
              <Input
                value={socialMap[p.key]?.url ?? ""}
                onChange={(e) =>
                  setSocialMap((prev) => ({
                    ...prev,
                    [p.key]: { ...prev[p.key], url: e.target.value },
                  }))
                }
                placeholder={p.placeholder}
                className="h-8 text-xs flex-1"
                data-ocid={`admin.footer.social_url.${p.key}`}
              />
            </div>
          ))}
        </div>
        <Button
          size="sm"
          className="btn-primary border-0 w-full h-10 gap-1.5 font-semibold"
          onClick={handleSaveSocials}
          disabled={savingSocials}
          data-ocid="admin.footer.save_socials_button"
        >
          <Save size={14} />
          {savingSocials ? "Saving…" : "Save Social Links"}
        </Button>
      </div>

      {/* ── Customer Reviews sub-section ── */}
      <div
        className="bg-card border border-border rounded-xl p-4 space-y-4"
        data-ocid="admin.footer.reviews_section"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Star size={15} /> Customer Reviews
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Reviews shown in the Reviews page and footer testimonials section.
            </p>
          </div>
        </div>

        {/* Existing reviews list */}
        {!reviews || reviews.length === 0 ? (
          <div
            className="text-center py-8 bg-muted/20 rounded-xl border border-border"
            data-ocid="admin.footer.reviews_empty_state"
          >
            <Star size={28} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No reviews yet. Add the first one below.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {reviews.map((review, idx) => (
              <div
                key={review.id.toString()}
                className="bg-muted/30 border border-border rounded-xl p-3"
                data-ocid={`admin.footer.review.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {review.reviewerName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={
                              s <= Number(review.rating)
                                ? "fill-accent text-accent"
                                : "fill-muted text-muted-foreground"
                            }
                          />
                        ))}
                      </span>
                      {review.productName && (
                        <span className="text-[10px] text-muted-foreground truncate">
                          {review.productName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {review.reviewText}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-none">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() =>
                        setEditReview({
                          open: true,
                          id: review.id,
                          form: {
                            reviewerName: review.reviewerName,
                            rating: review.rating.toString(),
                            reviewText: review.reviewText,
                            productName: review.productName,
                          },
                        })
                      }
                      data-ocid={`admin.footer.review.edit_button.${idx + 1}`}
                    >
                      <Edit size={11} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-7 w-7 p-0 border-destructive/30 text-destructive hover:bg-destructive/10 ${
                        confirmDeleteId === review.id ? "bg-destructive/10" : ""
                      }`}
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={deletingId === review.id}
                      title={
                        confirmDeleteId === review.id
                          ? "Tap again to confirm"
                          : "Delete"
                      }
                      data-ocid={`admin.footer.review.delete_button.${idx + 1}`}
                    >
                      <Trash2 size={11} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Review form */}
        <div className="border-t border-border pt-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Add New Review
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="review-name" className="text-xs font-semibold">
                Reviewer Name *
              </Label>
              <Input
                id="review-name"
                value={reviewForm.reviewerName}
                onChange={(e) =>
                  setReviewForm((p) => ({ ...p, reviewerName: e.target.value }))
                }
                placeholder="Priya Sarma"
                className="h-9 text-sm"
                data-ocid="admin.footer.review.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="review-rating" className="text-xs font-semibold">
                Rating (1–5)
              </Label>
              <Input
                id="review-rating"
                type="number"
                min={1}
                max={5}
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm((p) => ({ ...p, rating: e.target.value }))
                }
                className="h-9 text-sm"
                data-ocid="admin.footer.review.rating_input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="review-product" className="text-xs font-semibold">
              Product Name
            </Label>
            <Input
              id="review-product"
              value={reviewForm.productName}
              onChange={(e) =>
                setReviewForm((p) => ({ ...p, productName: e.target.value }))
              }
              placeholder="Assam CTC Tea"
              className="h-9 text-sm"
              data-ocid="admin.footer.review.product_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="review-text" className="text-xs font-semibold">
              Review Text *
            </Label>
            <textarea
              id="review-text"
              value={reviewForm.reviewText}
              onChange={(e) =>
                setReviewForm((p) => ({ ...p, reviewText: e.target.value }))
              }
              placeholder="Amazing product, tastes exactly like back home..."
              rows={3}
              className="w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none"
              data-ocid="admin.footer.review.text_textarea"
            />
          </div>
          <Button
            size="sm"
            className="btn-primary border-0 w-full h-10 gap-1.5 font-semibold"
            onClick={handleAddReview}
            disabled={
              addingReview ||
              !reviewForm.reviewerName.trim() ||
              !reviewForm.reviewText.trim()
            }
            data-ocid="admin.footer.review.add_button"
          >
            <Plus size={14} />
            {addingReview ? "Adding…" : "Add Review"}
          </Button>
        </div>
      </div>

      {/* Edit Review Dialog */}
      <Dialog
        open={editReview.open}
        onOpenChange={(open) => setEditReview((p) => ({ ...p, open }))}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Reviewer Name *</Label>
                <Input
                  value={editReview.form.reviewerName}
                  onChange={(e) =>
                    setEditReview((p) => ({
                      ...p,
                      form: { ...p.form, reviewerName: e.target.value },
                    }))
                  }
                  className="h-9 text-sm"
                  data-ocid="admin.footer.review.edit_name_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Rating (1–5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={editReview.form.rating}
                  onChange={(e) =>
                    setEditReview((p) => ({
                      ...p,
                      form: { ...p.form, rating: e.target.value },
                    }))
                  }
                  className="h-9 text-sm"
                  data-ocid="admin.footer.review.edit_rating_input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Product Name</Label>
              <Input
                value={editReview.form.productName}
                onChange={(e) =>
                  setEditReview((p) => ({
                    ...p,
                    form: { ...p.form, productName: e.target.value },
                  }))
                }
                placeholder="Assam CTC Tea"
                className="h-9 text-sm"
                data-ocid="admin.footer.review.edit_product_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Review Text *</Label>
              <textarea
                value={editReview.form.reviewText}
                onChange={(e) =>
                  setEditReview((p) => ({
                    ...p,
                    form: { ...p.form, reviewText: e.target.value },
                  }))
                }
                rows={3}
                className="w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none"
                data-ocid="admin.footer.review.edit_text_textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setEditReview({ open: false, id: null, form: BLANK_REVIEW })
              }
              data-ocid="admin.footer.review.edit_cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="btn-primary border-0"
              disabled={
                !editReview.form.reviewerName.trim() ||
                !editReview.form.reviewText.trim()
              }
              onClick={handleEditReview}
              data-ocid="admin.footer.review.edit_save_button"
            >
              Update Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Vendors Panel ────────────────────────────────────────────────────────────
type VendorFilter = "all" | "pending" | "approved" | "rejected" | "suspended";

interface AdminVendorSummary {
  id: { toText: () => string };
  businessName: string;
  contactEmail: string;
  phone: string;
  status: string;
  assignedProductIds: string[];
  bankAccountNumber?: string;
  ifscCode?: string;
  fssaiDocumentUrl?: string;
}

function VendorStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    suspended: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
        map[status] ?? "bg-muted text-muted-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}

function VendorsPanel() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<VendorFilter>("all");
  const [assignProductId, setAssignProductId] = useState<
    Record<string, string>
  >({});
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  const { data: vendors = [], isLoading } = useQuery<AdminVendorSummary[]>({
    queryKey: ["admin-vendors", filter],
    queryFn: async () => {
      if (!actor) return [];
      const statusParam = filter === "all" ? null : (filter as VendorStatus);
      const res = await actor.adminListVendors(statusParam);
      return res as AdminVendorSummary[];
    },
    enabled: !!actor,
  });

  const doAction = async (
    key: string,
    fn: () => Promise<{ ok?: unknown; err?: string }>,
  ) => {
    setActionLoading((p) => ({ ...p, [key]: true }));
    try {
      const res = await fn();
      if ("ok" in res) {
        toast.success("Action completed");
        queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      } else {
        toast.error(res.err ?? "Action failed");
        if (res.err === "Unauthorized") {
          clearSession();
          window.location.reload();
        }
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading((p) => ({ ...p, [key]: false }));
    }
  };

  const filterTabs: { id: VendorFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "suspended", label: "Suspended" },
  ];

  return (
    <div className="space-y-5" data-ocid="admin.vendors.panel">
      <PanelHeader
        title="Vendors"
        location="Admin only — vendor applications and approval flow"
      />
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">
          Vendor Management
        </h2>
        <Badge variant="outline" className="text-xs">
          {vendors.length} vendors
        </Badge>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 flex-wrap"
        data-ocid="admin.vendors.filter.tab"
      >
        {filterTabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-ocid={`admin.vendors.filter_${t.id}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 animate-pulse space-y-2"
            >
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <div
          className="text-center py-12"
          data-ocid="admin.vendors.empty_state"
        >
          <Users size={36} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No vendors found for this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendors.map((vendor, idx) => {
            const vid = vendor.id.toText();
            const isApproved = vendor.status === "approved";
            const isPending = vendor.status === "pending";
            const isSuspended = vendor.status === "suspended";
            return (
              <div
                key={vid}
                className="bg-card border border-border rounded-xl p-4 space-y-3"
                data-ocid={`admin.vendors.item.${idx + 1}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {vendor.businessName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {vendor.contactEmail}
                    </p>
                    {vendor.phone && (
                      <p className="text-xs text-muted-foreground">
                        {vendor.phone}
                      </p>
                    )}
                    {vendor.bankAccountNumber && (
                      <p className="text-xs text-muted-foreground">
                        Bank: {vendor.bankAccountNumber}
                      </p>
                    )}
                    {vendor.ifscCode && (
                      <p className="text-xs text-muted-foreground">
                        IFSC: {vendor.ifscCode}
                      </p>
                    )}
                    {vendor.fssaiDocumentUrl && (
                      <a
                        href={vendor.fssaiDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View FSSAI Document
                      </a>
                    )}
                  </div>
                  <VendorStatusBadge status={vendor.status} />
                </div>

                {/* Assigned products */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1">
                    Assigned Products ({vendor.assignedProductIds?.length ?? 0})
                  </p>
                  {vendor.assignedProductIds?.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {vendor.assignedProductIds.map((pid) => (
                        <span
                          key={pid}
                          className="inline-flex items-center gap-1 bg-muted rounded-md px-2 py-0.5 text-[10px] font-mono"
                        >
                          {pid}
                          <button
                            type="button"
                            onClick={() =>
                              doAction(`unassign-${vid}-${pid}`, () =>
                                actor!.adminUnassignProductFromVendor(
                                  localStorage.getItem(SESSION_KEY) ?? "",
                                  vendor.id as unknown as Principal,
                                  pid,
                                ),
                              )
                            }
                            disabled={actionLoading[`unassign-${vid}-${pid}`]}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={`Remove product ${pid}`}
                          >
                            <XCircle size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground italic">
                      No products assigned yet.
                    </p>
                  )}
                </div>

                {/* Assign product */}
                {isApproved && (
                  <div className="flex gap-2">
                    <Input
                      value={assignProductId[vid] ?? ""}
                      onChange={(e) =>
                        setAssignProductId((p) => ({
                          ...p,
                          [vid]: e.target.value,
                        }))
                      }
                      placeholder="Product ID to assign"
                      className="h-8 text-xs flex-1"
                      data-ocid={`admin.vendors.assign_product_input.${idx + 1}`}
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="btn-primary border-0 h-8 text-xs px-3"
                      disabled={
                        !assignProductId[vid]?.trim() ||
                        actionLoading[`assign-${vid}`]
                      }
                      onClick={() => {
                        const pid = assignProductId[vid]?.trim();
                        if (!pid) return;
                        doAction(`assign-${vid}`, () =>
                          actor!.adminAssignProductToVendor(
                            localStorage.getItem(SESSION_KEY) ?? "",
                            vendor.id as unknown as Principal,
                            pid,
                          ),
                        ).then(() =>
                          setAssignProductId((p) => ({ ...p, [vid]: "" })),
                        );
                      }}
                      data-ocid={`admin.vendors.assign_product_button.${idx + 1}`}
                    >
                      Assign
                    </Button>
                  </div>
                )}

                {/* Reject reason */}
                {isPending && (
                  <div className="space-y-1">
                    <Input
                      value={rejectReason[vid] ?? ""}
                      onChange={(e) =>
                        setRejectReason((p) => ({
                          ...p,
                          [vid]: e.target.value,
                        }))
                      }
                      placeholder="Rejection reason (required to reject)"
                      className="h-8 text-xs"
                      data-ocid={`admin.vendors.reject_reason_input.${idx + 1}`}
                    />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 flex-wrap pt-1">
                  {isPending && (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-8 text-xs"
                        disabled={actionLoading[`approve-${vid}`]}
                        onClick={() =>
                          doAction(`approve-${vid}`, () =>
                            actor!.adminApproveVendor(
                              localStorage.getItem(SESSION_KEY) ?? "",
                              vendor.id as unknown as Principal,
                            ),
                          )
                        }
                        data-ocid={`admin.vendors.approve_button.${idx + 1}`}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8 text-xs"
                        disabled={
                          !rejectReason[vid]?.trim() ||
                          actionLoading[`reject-${vid}`]
                        }
                        onClick={() =>
                          doAction(`reject-${vid}`, () =>
                            actor!.adminRejectVendor(
                              localStorage.getItem(SESSION_KEY) ?? "",
                              vendor.id as unknown as Principal,
                              rejectReason[vid] ?? "",
                            ),
                          )
                        }
                        data-ocid={`admin.vendors.reject_button.${idx + 1}`}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {isApproved && !isSuspended && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs text-amber-700 border-amber-200 hover:bg-amber-50"
                      disabled={actionLoading[`suspend-${vid}`]}
                      onClick={() =>
                        doAction(`suspend-${vid}`, () =>
                          actor!.adminSuspendVendor(
                            localStorage.getItem(SESSION_KEY) ?? "",
                            vendor.id as unknown as Principal,
                          ),
                        )
                      }
                      data-ocid={`admin.vendors.suspend_button.${idx + 1}`}
                    >
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
