import {
  type Variant_pending_approved_rejected,
  type VendorProductInput,
  VendorType,
  createActor,
} from "@/backend";
import type { VendorOrderSummary, VendorProfile } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageUpload } from "@/hooks/useImageUpload";
import {
  useCategories,
  useVendorMyProducts,
  useVendorSubmitProduct,
  useVendorUpdateProductQuantity,
} from "@/hooks/useQueries";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  ImageIcon,
  LogOut,
  Package,
  PauseCircle,
  PlusCircle,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending Review",
      className: "bg-accent/15 text-accent-foreground border-accent/30",
    },
    approved: {
      label: "Active",
      className:
        "bg-secondary/15 text-secondary-foreground border-secondary/30",
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/15 text-destructive border-destructive/30",
    },
    suspended: {
      label: "Suspended",
      className: "bg-muted text-muted-foreground border-border",
    },
  };
  const { label, className } = config[status] ?? config.pending;
  return (
    <Badge variant="outline" className={`text-xs font-semibold ${className}`}>
      {label}
    </Badge>
  );
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={32} className="text-accent" />,
  approved: <CheckCircle2 size={32} className="text-secondary" />,
  rejected: <XCircle size={32} className="text-destructive" />,
  suspended: <PauseCircle size={32} className="text-muted-foreground" />,
};

export default function VendorDashboardPage() {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products"
  >("overview");
  const [showProductForm, setShowProductForm] = useState(false);
  const [vendorStatus, setVendorStatus] = useState<string | null>(null);

  // Guard: must have vendor session + check live status
  useEffect(() => {
    if (!actor || isFetching) return;
    const token = localStorage.getItem("vendorSession");
    if (!token) {
      navigate({ to: "/vendor-login" });
      return;
    }
    (async () => {
      try {
        const result = await actor.getVendorStatusBySession(token);
        const statusStr = result
          ? typeof result === "object"
            ? Object.keys(result)[0]
            : String(result)
          : null;
        if (!result || statusStr === null) {
          localStorage.removeItem("vendorSession");
          localStorage.removeItem("vendorEmail");
          localStorage.removeItem("vendorSession");
          navigate({ to: "/vendor-login" });
          return;
        }
        if (statusStr !== "approved") {
          setVendorStatus(statusStr);
          return;
        }
        setVendorStatus("approved");
      } catch {
        navigate({ to: "/vendor-login" });
      }
    })();
  }, [actor, isFetching, navigate]);

  const profileQuery = useQuery<{ ok: VendorProfile } | { err: string }>({
    queryKey: ["vendor-profile"],
    queryFn: async () => {
      if (!actor) return { err: "Not connected" };
      return actor.getMyVendorProfile();
    },
    enabled: !!actor && !isFetching,
  });

  const ordersQuery = useQuery<VendorOrderSummary[]>({
    queryKey: ["vendor-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyVendorOrders();
    },
    enabled: !!actor && !isFetching && activeTab === "orders",
  });

  const handleLogout = () => {
    localStorage.removeItem("vendorSession");
    navigate({ to: "/vendor-login" });
  };

  const profile =
    profileQuery.data && "ok" in profileQuery.data
      ? profileQuery.data.ok
      : null;

  if (vendorStatus && vendorStatus !== "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="bg-card rounded-xl shadow-md p-8 max-w-md w-full text-center border border-border">
          {vendorStatus === "pending" && (
            <>
              <div className="text-4xl mb-4">⏳</div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Application Under Review
              </h2>
              <p className="text-muted-foreground mb-6">
                Your vendor application is being reviewed. You will be notified
                at your email once approved.
              </p>
            </>
          )}
          {vendorStatus === "rejected" && (
            <>
              <div className="text-4xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Application Rejected
              </h2>
              <p className="text-muted-foreground mb-6">
                Your vendor application was rejected. Please contact
                assamshop@assamroots.shop for more information.
              </p>
            </>
          )}
          {vendorStatus === "suspended" && (
            <>
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Account Suspended
              </h2>
              <p className="text-muted-foreground mb-6">
                Your vendor account has been suspended. Please contact
                assamshop@assamroots.shop.
              </p>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("vendorSession");
              localStorage.removeItem("vendorEmail");
              localStorage.removeItem("vendorSessionToken");
              window.location.href = "/vendor-login";
            }}
            className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 bg-card border-b border-border shadow-sm">
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          aria-label="AssamRoots home"
          className="select-none"
        >
          <img
            src="/assets/logo.png"
            alt="AssamRoots"
            className="h-10 w-auto object-contain"
          />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted flex items-center gap-1">
            <Store size={12} /> Vendor Portal
          </span>
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="vendor-dashboard.logout_button"
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-smooth"
            aria-label="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Profile card */}
        {profileQuery.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ) : profile ? (
          <>
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" />
              <div className="p-5 flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {STATUS_ICONS[profile.status] ?? (
                    <Store size={28} className="text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-xl font-black text-foreground truncate">
                      {profile.businessName}
                    </h1>
                    <StatusBadge status={profile.status} />
                    {profile.vendorType === VendorType.brand ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-bold uppercase tracking-wider">
                        Brand Vendor
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider">
                        Raw Material Supplier
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {profile.contactEmail} · {profile.phone}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {profile.status === "pending" && (
                <div className="mx-5 mb-5 rounded-xl border border-accent/30 bg-accent/10 p-3 flex gap-2 items-start">
                  <Clock
                    size={16}
                    className="text-accent mt-0.5 flex-shrink-0"
                  />
                  <p className="text-xs text-foreground leading-relaxed">
                    Your application is under review. The AssamRoots team will
                    verify your details and get back to you within 2–3 business
                    days.
                  </p>
                </div>
              )}
              {profile.status === "rejected" && (
                <div className="mx-5 mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
                  <p className="text-xs text-destructive font-semibold">
                    Application not approved
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact{" "}
                    <a
                      href="mailto:assamshop@assamroots.shop"
                      className="text-primary underline"
                    >
                      assamshop@assamroots.shop
                    </a>{" "}
                    for questions.
                  </p>
                </div>
              )}
            </div>

            {/* Tabs — only show if approved */}
            {profile.status === "approved" && (
              <>
                <div className="flex gap-2 bg-card rounded-xl border border-border p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    data-ocid="vendor-dashboard.overview_tab"
                    className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-smooth ${
                      activeTab === "overview"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    data-ocid="vendor-dashboard.orders_tab"
                    className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-smooth ${
                      activeTab === "orders"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("products")}
                    data-ocid="vendor-dashboard.products_tab"
                    className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-smooth ${
                      activeTab === "products"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    My Products
                  </button>
                </div>

                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <h2 className="font-display text-base font-bold text-foreground">
                      Assigned Products
                    </h2>
                    {profile.assignedProductIds.length === 0 ? (
                      <div
                        className="rounded-2xl border border-dashed border-border bg-card p-8 text-center"
                        data-ocid="vendor-dashboard.empty_state"
                      >
                        <Package
                          size={32}
                          className="text-muted-foreground mx-auto mb-3"
                        />
                        <p className="text-sm font-semibold text-foreground">
                          No products assigned yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          The admin will assign products to your vendor account.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {profile.assignedProductIds.map((id, i) => (
                          <div
                            key={id}
                            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                            data-ocid={`vendor-dashboard.product.item.${i + 1}`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <ShoppingBag size={18} className="text-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground">
                              Product ID: {id}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "orders" && (
                  <div className="space-y-4">
                    <h2 className="font-display text-base font-bold text-foreground">
                      Order Activity
                    </h2>
                    {ordersQuery.isLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <Skeleton
                            key={i}
                            className="h-16 w-full rounded-xl"
                          />
                        ))}
                      </div>
                    ) : (ordersQuery.data ?? []).length === 0 ? (
                      <div
                        className="rounded-2xl border border-dashed border-border bg-card p-8 text-center"
                        data-ocid="vendor-dashboard.orders_empty_state"
                      >
                        <ShoppingBag
                          size={32}
                          className="text-muted-foreground mx-auto mb-3"
                        />
                        <p className="text-sm font-semibold text-foreground">
                          No orders yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Orders for your products will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {(ordersQuery.data ?? []).map((order, i) => (
                          <div
                            key={order.orderId}
                            className="rounded-xl border border-border bg-card p-4 space-y-1"
                            data-ocid={`vendor-dashboard.order.item.${i + 1}`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-foreground">
                                {order.productName}
                              </p>
                              <span className="text-xs font-medium text-primary">
                                ₹{order.totalPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">
                                Qty: {Number(order.quantity)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Order #{order.orderId}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "products" && (
                  <VendorProductsTab
                    sessionToken={localStorage.getItem("vendorSession") ?? ""}
                    showForm={showProductForm}
                    onToggleForm={() => setShowProductForm((s) => !s)}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <div
            className="rounded-2xl border border-border bg-card p-8 text-center"
            data-ocid="vendor-dashboard.error_state"
          >
            <XCircle size={32} className="text-destructive mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">
              Unable to load profile
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Please check your connection or sign in again.
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 text-xs text-primary underline underline-offset-2"
            >
              Sign in again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Vendor Products Tab ─────────────────────────────────────────────────────

function ProductStatusBadge({
  status,
}: {
  status: Variant_pending_approved_rejected;
}) {
  const config: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending Review",
      className: "bg-accent/15 text-accent-foreground border-accent/30",
    },
    approved: {
      label: "Approved",
      className:
        "bg-secondary/15 text-secondary-foreground border-secondary/30",
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive/15 text-destructive border-destructive/30",
    },
  };
  const { label, className } = config[status] ?? config.pending;
  return (
    <Badge variant="outline" className={`text-xs font-semibold ${className}`}>
      {label}
    </Badge>
  );
}

// ─── How To Get Live Stepper ─────────────────────────────────────────────────
function HowToGetLiveStepper() {
  const steps = [
    {
      num: 1,
      icon: <Package size={18} className="text-primary" />,
      title: "Submit Your Product",
      desc: "Fill in product details, pricing, and upload images.",
    },
    {
      num: 2,
      icon: <Clock size={18} className="text-accent" />,
      title: "Admin Review",
      desc: "Our team checks compliance, adds taxes & sets the final price.",
    },
    {
      num: 3,
      icon: <Sparkles size={18} className="text-secondary" />,
      title: "Goes Live",
      desc: "Your product becomes visible to all AssamRoots customers.",
    },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">
        How to get your products live
      </p>
      <div className="flex items-start gap-0">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="flex-1 flex flex-col items-center relative"
          >
            {/* connector line */}
            {idx < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 bg-border" />
            )}
            <div className="relative z-10 w-10 h-10 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center mb-2 shadow-sm">
              {step.icon}
            </div>
            <p className="text-xs font-bold text-foreground text-center leading-snug">
              {step.title}
            </p>
            <p className="text-[10px] text-muted-foreground text-center mt-0.5 leading-relaxed px-1">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Vendor Products Tab ─────────────────────────────────────────────────────
function VendorProductsTab({
  sessionToken,
  showForm,
  onToggleForm,
}: {
  sessionToken: string;
  showForm: boolean;
  onToggleForm: () => void;
}) {
  const { actor, isFetching } = useActor(createActor);
  const categoriesQuery = useCategories();
  const myProductsQuery = useVendorMyProducts(sessionToken);
  const submitMutation = useVendorSubmitProduct();
  const updateQuantityMutation = useVendorUpdateProductQuantity();
  const { uploadFile } = useImageUpload();

  const [vendorType, setVendorType] = useState<VendorType | null>(null);

  const [form, setForm] = useState<{
    productName: string;
    vendorName: string;
    description: string;
    category: string;
    basePrice: string;
    imageUrls: string[];
    fssaiDocumentUrl: string | undefined;
    mrp: string;
    supplyPrice: string;
    moq: string;
    pricePerKg: string;
    availableQuantityKg: string;
  }>({
    productName: "",
    vendorName: "",
    description: "",
    category: "",
    basePrice: "",
    imageUrls: [],
    fssaiDocumentUrl: undefined,
    mrp: "",
    supplyPrice: "",
    moq: "",
    pricePerKg: "",
    availableQuantityKg: "",
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingFssai, setUploadingFssai] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [updatingStockId, setUpdatingStockId] = useState<bigint | null>(null);
  const [newStockValue, setNewStockValue] = useState("");
  const [resubmitProductId, setResubmitProductId] = useState<bigint | null>(
    null,
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    if (form.imageUrls.length + files.length > 5) {
      setFormError("Maximum 5 images allowed.");
      return;
    }
    setUploadingImages(true);
    setFormError("");
    try {
      const urls: string[] = [];
      for (const file of files) {
        const url = await uploadFile(file);
        urls.push(url);
      }
      setForm((p) => ({ ...p, imageUrls: [...p.imageUrls, ...urls] }));
    } catch {
      setFormError("Failed to upload one or more images.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleFssaiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFssai(true);
    setFormError("");
    try {
      const url = await uploadFile(file);
      setForm((p) => ({ ...p, fssaiDocumentUrl: url }));
    } catch {
      setFormError("Failed to upload FSSAI document.");
    } finally {
      setUploadingFssai(false);
    }
  };

  const removeImage = (idx: number) => {
    setForm((p) => ({
      ...p,
      imageUrls: p.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  // Fetch vendor profile to determine type for dynamic form
  useEffect(() => {
    if (!actor || isFetching) return;
    actor.getMyVendorProfile().then((res) => {
      if ("ok" in res) {
        setVendorType(res.ok.vendorType);
      }
    });
  }, [actor, isFetching]);

  const handleSubmit = async () => {
    if (!form.productName.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!form.vendorName.trim()) {
      setFormError("Vendor/brand name is required.");
      return;
    }
    if (!form.description.trim()) {
      setFormError("Description is required.");
      return;
    }
    if (!form.category) {
      setFormError("Please select a category.");
      return;
    }
    if (!form.basePrice || Number(form.basePrice) <= 0) {
      setFormError("Enter a valid base price.");
      return;
    }
    if (form.imageUrls.length === 0) {
      setFormError("Upload at least one product image.");
      return;
    }

    if (vendorType === VendorType.brand) {
      if (!form.mrp || Number(form.mrp) <= 0) {
        setFormError("MRP is required for brand vendors.");
        return;
      }
      if (!form.supplyPrice || Number(form.supplyPrice) <= 0) {
        setFormError("Supply price is required for brand vendors.");
        return;
      }
      if (Number(form.supplyPrice) >= Number(form.mrp)) {
        setFormError("Supply price must be less than MRP.");
        return;
      }
      if (!form.moq || Number(form.moq) <= 0) {
        setFormError("MOQ (minimum order quantity) is required.");
        return;
      }
    }

    if (vendorType === VendorType.rawMaterial) {
      if (!form.pricePerKg || Number(form.pricePerKg) <= 0) {
        setFormError("Price per kg is required for raw material suppliers.");
        return;
      }
      if (!form.availableQuantityKg || Number(form.availableQuantityKg) <= 0) {
        setFormError("Available quantity in kg is required.");
        return;
      }
    }

    setSubmitting(true);
    setFormError("");
    try {
      const input: VendorProductInput = {
        productName: form.productName.trim(),
        vendorName: form.vendorName.trim(),
        description: form.description.trim(),
        category: form.category,
        basePrice: BigInt(Math.round(Number(form.basePrice) * 100)),
        imageUrls: form.imageUrls,
        fssaiDocumentUrl: form.fssaiDocumentUrl,
        vendorType:
          vendorType === VendorType.brand
            ? VendorType.brand
            : VendorType.rawMaterial,
        ...(vendorType === VendorType.brand
          ? {
              mrp: BigInt(Math.round(Number(form.mrp) * 100)),
              supplyPrice: BigInt(Math.round(Number(form.supplyPrice) * 100)),
              moq: BigInt(Math.round(Number(form.moq))),
            }
          : {}),
        ...(vendorType === VendorType.rawMaterial
          ? {
              pricePerKg: BigInt(Math.round(Number(form.pricePerKg) * 100)),
              availableQuantityKg: BigInt(
                Math.round(Number(form.availableQuantityKg)),
              ),
            }
          : {}),
      };
      await submitMutation.mutateAsync({ sessionToken, input });
      toast.success("Product submitted successfully!");
      setForm({
        productName: "",
        vendorName: "",
        description: "",
        category: "",
        basePrice: "",
        imageUrls: [],
        fssaiDocumentUrl: undefined,
        mrp: "",
        supplyPrice: "",
        moq: "",
        pricePerKg: "",
        availableQuantityKg: "",
      });
      onToggleForm();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to submit product.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStock = async (productId: bigint) => {
    if (!newStockValue || Number(newStockValue) <= 0) {
      toast.error("Enter a valid quantity in kg.");
      return;
    }
    try {
      await updateQuantityMutation.mutateAsync({
        sessionToken,
        productId,
        newQuantityKg: BigInt(Math.round(Number(newStockValue))),
      });
      toast.success("Stock updated successfully!");
      setUpdatingStockId(null);
      setNewStockValue("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update stock.",
      );
    }
  };

  // Pre-populate form for resubmit
  const handleResubmit = (
    product: NonNullable<typeof myProductsQuery.data>[number],
  ) => {
    setForm({
      productName: product.productName,
      vendorName: product.vendorName,
      description: product.description,
      category: product.category,
      basePrice: (Number(product.basePrice) / 100).toFixed(2),
      imageUrls: product.imageUrls,
      fssaiDocumentUrl: product.fssaiDocumentUrl?.[0] ?? undefined,
      mrp: product.mrp ? (Number(product.mrp) / 100).toFixed(2) : "",
      supplyPrice: product.supplyPrice
        ? (Number(product.supplyPrice) / 100).toFixed(2)
        : "",
      moq: product.moq ? String(Number(product.moq)) : "",
      pricePerKg: product.pricePerKg
        ? (Number(product.pricePerKg) / 100).toFixed(2)
        : "",
      availableQuantityKg: product.availableQuantityKg
        ? String(Number(product.availableQuantityKg))
        : "",
    });
    setResubmitProductId(product.id);
    if (!showForm) onToggleForm();
    setTimeout(
      () =>
        document
          .getElementById("productName")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      100,
    );
  };

  return (
    <div className="space-y-5">
      {/* How-to stepper shown at top of products tab */}
      <HowToGetLiveStepper />

      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-foreground">
          My Products
        </h2>
        <button
          type="button"
          onClick={() => {
            setResubmitProductId(null);
            setForm({
              productName: "",
              vendorName: "",
              description: "",
              category: "",
              basePrice: "",
              imageUrls: [],
              fssaiDocumentUrl: undefined,
              mrp: "",
              supplyPrice: "",
              moq: "",
              pricePerKg: "",
              availableQuantityKg: "",
            });
            onToggleForm();
          }}
          data-ocid="vendor-dashboard.submit_product_button"
          className="h-9 px-4 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth flex items-center gap-1.5"
        >
          {showForm ? <ChevronUp size={16} /> : <PlusCircle size={16} />}
          {showForm ? "Close Form" : "Submit New Product"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-secondary" />
          <div className="p-5 space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground">
              {resubmitProductId
                ? "Edit & Resubmit Product"
                : "Submit New Product"}
            </h3>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="productName"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                >
                  Product Name *
                </label>
                <input
                  id="productName"
                  type="text"
                  placeholder="e.g. Organic Assam Tea 250g"
                  value={form.productName}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, productName: e.target.value }));
                    setFormError("");
                  }}
                  disabled={submitting}
                  data-ocid="vendor-dashboard.product_name_input"
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The name customers will see on the products page
                </p>
              </div>

              <div>
                <label
                  htmlFor="vendorName"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                >
                  Vendor / Brand Name *
                </label>
                <input
                  id="vendorName"
                  type="text"
                  placeholder="e.g. Brahmaputra Teas"
                  value={form.vendorName}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, vendorName: e.target.value }));
                    setFormError("");
                  }}
                  disabled={submitting}
                  data-ocid="vendor-dashboard.vendor_name_input"
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your product — ingredients, origin, usage, etc."
                  value={form.description}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, description: e.target.value }));
                    setFormError("");
                  }}
                  disabled={submitting}
                  rows={4}
                  data-ocid="vendor-dashboard.product_description_input"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Describe the product — ingredients, origin, how it is made or
                  harvested
                </p>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, category: e.target.value }));
                    setFormError("");
                  }}
                  disabled={submitting || categoriesQuery.isLoading}
                  data-ocid="vendor-dashboard.product_category_select"
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                >
                  <option value="">Select a category</option>
                  {(categoriesQuery.data ?? []).map((cat) => (
                    <option key={cat.id.toString()} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Select the category that best fits your product
                </p>
              </div>

              <div>
                <label
                  htmlFor="basePrice"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                >
                  Base Price (INR) *
                </label>
                <input
                  id="basePrice"
                  type="number"
                  placeholder="e.g. 299"
                  value={form.basePrice}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, basePrice: e.target.value }));
                    setFormError("");
                  }}
                  disabled={submitting}
                  min={1}
                  data-ocid="vendor-dashboard.product_price_input"
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The price at which you supply this product to AssamRoots
                  (before tax)
                </p>
              </div>

              {vendorType === VendorType.brand && (
                <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Brand Vendor Details
                  </p>
                  <div>
                    <label
                      htmlFor="mrp"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      MRP (₹) *
                    </label>
                    <input
                      id="mrp"
                      type="number"
                      placeholder="e.g. 499"
                      value={form.mrp}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, mrp: e.target.value }));
                        setFormError("");
                      }}
                      disabled={submitting}
                      min={1}
                      data-ocid="vendor-dashboard.product_mrp_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The maximum retail price printed on your packaging
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="supplyPrice"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      Supply Price (₹) *
                    </label>
                    <input
                      id="supplyPrice"
                      type="number"
                      placeholder="e.g. 350"
                      value={form.supplyPrice}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, supplyPrice: e.target.value }));
                        setFormError("");
                      }}
                      disabled={submitting}
                      min={1}
                      data-ocid="vendor-dashboard.product_supply_price_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The price at which you supply this product to AssamRoots
                      (must be lower than MRP)
                    </p>
                    {form.supplyPrice &&
                      form.mrp &&
                      Number(form.supplyPrice) >= Number(form.mrp) && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Supply price should be less than MRP for both parties
                          to profit.
                        </p>
                      )}
                  </div>
                  <div>
                    <label
                      htmlFor="moq"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      Minimum Order Quantity (units) *
                    </label>
                    <input
                      id="moq"
                      type="number"
                      placeholder="e.g. 50"
                      value={form.moq}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, moq: e.target.value }));
                        setFormError("");
                      }}
                      disabled={submitting}
                      min={1}
                      data-ocid="vendor-dashboard.product_moq_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum quantity per order you can supply
                    </p>
                  </div>
                </div>
              )}

              {vendorType === VendorType.rawMaterial && (
                <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    Raw Material Supplier Details
                  </p>
                  <div>
                    <label
                      htmlFor="pricePerKg"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      Price per kg (₹/kg) *
                    </label>
                    <input
                      id="pricePerKg"
                      type="number"
                      placeholder="e.g. 120"
                      value={form.pricePerKg}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, pricePerKg: e.target.value }));
                        setFormError("");
                      }}
                      disabled={submitting}
                      min={1}
                      data-ocid="vendor-dashboard.product_price_per_kg_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your asking rate per kilogram for bulk supply
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="availableQuantityKg"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      Available Quantity (kg) *
                    </label>
                    <input
                      id="availableQuantityKg"
                      type="number"
                      placeholder="e.g. 500"
                      value={form.availableQuantityKg}
                      onChange={(e) => {
                        setForm((p) => ({
                          ...p,
                          availableQuantityKg: e.target.value,
                        }));
                        setFormError("");
                      }}
                      disabled={submitting}
                      min={1}
                      data-ocid="vendor-dashboard.product_available_qty_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      How many kilograms you currently have available
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="productImages"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                >
                  Product Images *{" "}
                  <span className="normal-case font-normal">(up to 5)</span>
                </label>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Upload clear photos of your product (or raw material)
                </p>
                <input
                  id="productImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={submitting || uploadingImages}
                  data-ocid="vendor-dashboard.product_images_input"
                  className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-60"
                />
                {uploadingImages && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Uploading images…
                  </p>
                )}
                {form.imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.imageUrls.map((url, idx) => (
                      <div
                        key={url}
                        className="relative w-16 h-16 rounded-lg overflow-hidden border border-border"
                      >
                        <img
                          src={url}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="fssaiDoc"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                >
                  FSSAI Document{" "}
                  <span className="normal-case font-normal">
                    (required for food products)
                  </span>
                </label>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Required for food products — upload your FSSAI registration
                  certificate
                </p>
                <input
                  id="fssaiDoc"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFssaiUpload}
                  disabled={submitting || uploadingFssai}
                  data-ocid="vendor-dashboard.product_fssai_input"
                  className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-60"
                />
                {uploadingFssai && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Uploading document…
                  </p>
                )}
                {form.fssaiDocumentUrl && (
                  <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                    <Upload size={12} /> FSSAI document uploaded
                  </p>
                )}
              </div>

              {formError && (
                <p className="text-xs text-destructive">{formError}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                data-ocid="vendor-dashboard.product_submit_button"
                className="w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <>
                    <Tag size={16} />
                    {resubmitProductId ? "Resubmit Product" : "Submit Product"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product list */}
      {myProductsQuery.isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (myProductsQuery.data ?? []).length === 0 ? (
        <div
          className="rounded-2xl border border-dashed border-primary/30 bg-card p-10 text-center"
          data-ocid="vendor-dashboard.products_empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-primary" />
          </div>
          <p className="text-base font-bold text-foreground">
            No products submitted yet
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
            Start by submitting your first product. Once approved by our team,
            it will appear on the AssamRoots products page.
          </p>
          <button
            type="button"
            onClick={() => {
              setResubmitProductId(null);
              if (!showForm) onToggleForm();
              setTimeout(
                () =>
                  document
                    .getElementById("productName")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" }),
                100,
              );
            }}
            data-ocid="vendor-dashboard.submit_first_product_button"
            className="mt-5 h-12 px-8 rounded-xl font-display font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth active:scale-95 flex items-center gap-2 mx-auto"
          >
            <PlusCircle size={18} />
            Submit Your First Product
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {(myProductsQuery.data ?? []).map((product, i) => (
            <div
              key={product.id.toString()}
              className="rounded-xl border border-border bg-card p-4 space-y-2"
              data-ocid={`vendor-dashboard.product.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {product.imageUrls[0] ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.productName}
                      className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={18} className="text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {product.productName}
                    </p>
                    {product.vendorType === VendorType.brand ? (
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>
                          MRP: ₹{(Number(product.mrp ?? 0) / 100).toFixed(2)}
                        </p>
                        <p>
                          Supply: ₹
                          {(Number(product.supplyPrice ?? 0) / 100).toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>
                          ₹{(Number(product.pricePerKg ?? 0) / 100).toFixed(2)}
                          /kg
                        </p>
                        <p>
                          Stock: {Number(product.availableQuantityKg ?? 0)} kg
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <ProductStatusBadge status={product.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Submitted{" "}
                  {new Date(
                    Number(product.submittedAt) / 1_000_000,
                  ).toLocaleDateString("en-IN")}
                </span>
                <span>·</span>
                <span>{product.category}</span>
              </div>
              {product.status === "rejected" && (
                <div className="space-y-2">
                  {product.rejectionReason && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 flex gap-2 items-start">
                      <AlertTriangle
                        size={14}
                        className="text-destructive mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-destructive">
                          Reason for rejection
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {product.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleResubmit(product)}
                    data-ocid={`vendor-dashboard.edit_resubmit_button.${i + 1}`}
                    className="h-9 px-4 rounded-lg text-xs font-semibold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-smooth flex items-center gap-1.5"
                  >
                    <Edit3 size={13} />
                    Edit &amp; Resubmit
                  </button>
                </div>
              )}
              {product.status === "approved" && (
                <div className="rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2.5 flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className="text-secondary flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-secondary">
                      Live on AssamRoots
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Your product is visible to all customers on the products
                      page
                    </p>
                  </div>
                  {product.finalPrice && (
                    <span className="ml-auto text-xs font-semibold text-secondary whitespace-nowrap">
                      ₹{(Number(product.finalPrice) / 100).toFixed(2)}
                    </span>
                  )}
                </div>
              )}
              {product.vendorType === VendorType.rawMaterial &&
                product.status === "approved" && (
                  <div className="pt-1">
                    {updatingStockId === product.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="New qty (kg)"
                          value={newStockValue}
                          onChange={(e) => setNewStockValue(e.target.value)}
                          className="h-8 w-28 rounded-lg border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                          min={1}
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateStock(product.id)}
                          disabled={updateQuantityMutation.isPending}
                          data-ocid={`vendor-dashboard.update_stock_confirm.${i + 1}`}
                          className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-smooth disabled:opacity-60"
                        >
                          {updateQuantityMutation.isPending
                            ? "Saving…"
                            : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUpdatingStockId(null);
                            setNewStockValue("");
                          }}
                          className="h-8 px-3 rounded-lg text-xs font-semibold bg-muted text-muted-foreground hover:bg-muted/80 transition-smooth"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setUpdatingStockId(product.id);
                          setNewStockValue(
                            String(product.availableQuantityKg ?? ""),
                          );
                        }}
                        data-ocid={`vendor-dashboard.update_stock_button.${i + 1}`}
                        className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-600/10 text-emerald-700 border border-emerald-200 hover:bg-emerald-600/20 transition-smooth"
                      >
                        Update Stock
                      </button>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
