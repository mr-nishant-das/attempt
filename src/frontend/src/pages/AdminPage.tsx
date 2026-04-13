import {
  type ServiceRequestPublic,
  ServiceRequestStatus,
  ServiceType,
  createActor,
} from "@/backend";
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
import { useAuth } from "@/hooks/useAuth";
import { discountedPrice, formatPrice } from "@/types";
import type { Product } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Edit,
  LogIn,
  Package,
  PercentCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1n,
    title: "Heritage CTC Assam Tea — 500g",
    description: "Bold malty CTC tea.",
    price: 49900n,
    discountPercent: 10n,
    imageUrls: ["/assets/generated/product-ctc-tea.dim_400x400.jpg"],
    category: 1n,
    subCategory: "CTC",
    rating: 42n,
    reviewCount: 1280n,
    stock: 50n,
    brand: "Heritage Tea",
    tags: ["tea"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 2n,
    title: "Handwoven Mekhela Chador",
    description: "Traditional silk saree.",
    price: 325000n,
    discountPercent: 5n,
    imageUrls: ["/assets/generated/product-mekhela-chador.dim_400x400.jpg"],
    category: 3n,
    subCategory: "Mekhela",
    rating: 47n,
    reviewCount: 312n,
    stock: 8n,
    brand: "Majuli Weavers",
    tags: ["handloom"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
  {
    id: 3n,
    title: "Bamboo Cane Basket Set",
    description: "Handcrafted baskets.",
    price: 49900n,
    discountPercent: 0n,
    imageUrls: ["/assets/generated/product-bamboo-basket.dim_400x400.jpg"],
    category: 4n,
    subCategory: "Baskets",
    rating: 44n,
    reviewCount: 89n,
    stock: 23n,
    brand: "Bongaigaon Crafts",
    tags: ["bamboo"],
    isActive: true,
    createdAt: 0n,
    updatedAt: 0n,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
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
}

const BLANK_FORM: ProductFormValues = {
  title: "",
  description: "",
  price: "",
  discountPercent: "0",
  category: "1",
  subCategory: "",
  brand: "",
  imageUrl: "",
  stock: "0",
};

// ─── Service request helpers ──────────────────────────────────────────────────
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

// ─── Product helpers ──────────────────────────────────────────────────────────
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
  };
}

function formToProduct(form: ProductFormValues, id: bigint): Product {
  return {
    id,
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
    tags: [],
    rating: 0n,
    reviewCount: 0n,
    stock: BigInt(Math.max(0, Number.parseInt(form.stock) || 0)),
    isActive: true,
    createdAt: 0n,
    updatedAt: BigInt(Date.now()),
  };
}

// ─── Shared form field ────────────────────────────────────────────────────────
function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
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
        className="h-9 text-sm"
        data-ocid={`admin-field-${id}`}
      />
    </div>
  );
}

// ─── Product form dialog ──────────────────────────────────────────────────────
function ProductFormDialog({
  open,
  onOpenChange,
  initialValues,
  title,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: ProductFormValues;
  title: string;
  onSave: (form: ProductFormValues) => void;
}) {
  const [form, setForm] = useState<ProductFormValues>(initialValues);
  const handleOpenChange = (o: boolean) => {
    if (o) setForm(initialValues);
    onOpenChange(o);
  };
  const set = (key: keyof ProductFormValues) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));
  const handleSave = () => {
    if (!form.title.trim() || !form.price) return;
    onSave(form);
    onOpenChange(false);
  };
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
                data-ocid="admin-field-prod-category"
              >
                <option value="1">Tea</option>
                <option value="2">Spices</option>
                <option value="3">Handloom</option>
                <option value="4">Crafts</option>
                <option value="5">Food</option>
                <option value="6">Books</option>
                <option value="7">Attire</option>
                <option value="8">Kitchen</option>
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
            id="prod-image"
            label="Image URL"
            value={form.imageUrl}
            onChange={set("imageUrl")}
            placeholder="/assets/generated/product-ctc-tea.dim_400x400.jpg"
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
            onClick={handleSave}
            className="btn-primary border-0"
            disabled={!form.title.trim() || !form.price}
            data-ocid="admin-product-save"
          >
            Save Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Service Request Row ──────────────────────────────────────────────────────
function ServiceRequestRow({
  request,
  onStatusUpdate,
  onDelete,
}: {
  request: ServiceRequestPublic;
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

  const handleStatusUpdate = async () => {
    setUpdating(true);
    await onStatusUpdate(request.id, selectedStatus);
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await onDelete(request.id);
    setDeleting(false);
    setConfirmDelete(false);
  };

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
      data-ocid={`admin-service-request-${request.id}`}
    >
      {/* Row header */}
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
          <p className="text-xs text-muted-foreground mt-0.5">
            📅 {request.preferredDate} · ⏰ {request.preferredTime}
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

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/20">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Description
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {request.description}
            </p>
          </div>

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
                data-ocid={`admin-service-status-${request.id}`}
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
              onClick={handleStatusUpdate}
              disabled={updating || selectedStatus === request.status}
              data-ocid={`admin-service-update-${request.id}`}
            >
              {updating ? "Saving…" : "Update"}
            </Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            className={`w-full h-8 text-xs border-destructive/30 ${confirmDelete ? "bg-destructive/10 text-destructive" : "text-destructive"}`}
            onClick={handleDelete}
            disabled={deleting}
            data-ocid={`admin-service-delete-${request.id}`}
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

// ─── Service Requests Panel ───────────────────────────────────────────────────
function ServiceRequestsPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery<ServiceRequestPublic[]>({
    queryKey: ["adminServiceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.adminGetServiceRequests();
      // Sort newest first
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
    await actor.adminUpdateServiceRequestStatus(id, status);
    await queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    await actor.adminDeleteServiceRequest(id);
    await queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
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

  if (!requests || requests.length === 0) {
    return (
      <div
        className="text-center py-12 bg-muted/20 rounded-xl border border-border"
        data-ocid="admin-service-requests-empty"
      >
        <Bell size={36} className="text-muted-foreground/30 mx-auto mb-3" />
        <p className="font-semibold text-sm text-foreground">
          No service requests yet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          They will appear here when customers submit them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <ServiceRequestRow
          key={req.id.toString()}
          request={req}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { isAuthenticated, login } = useAuth();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [nextId, setNextId] = useState(4n);
  const [activeTab, setActiveTab] = useState<"products" | "services">(
    "products",
  );

  // Discount dialog
  const [discountDialog, setDiscountDialog] = useState<{
    open: boolean;
    product: Product | null;
    value: string;
  }>({ open: false, product: null, value: "" });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({ open: false, product: null });

  // Count new service requests for tab badge
  const { data: serviceRequests } = useQuery<ServiceRequestPublic[]>({
    queryKey: ["adminServiceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetServiceRequests();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    refetchInterval: 60_000,
  });
  const newCount =
    serviceRequests?.filter((r) => r.status === ServiceRequestStatus.New)
      .length ?? 0;

  if (!isAuthenticated) {
    return (
      <Layout>
        <div
          className="text-center py-16 px-6"
          data-ocid="admin-unauthenticated"
        >
          <LogIn size={48} className="text-muted-foreground/40 mx-auto mb-4" />
          <p className="font-display font-bold text-lg text-foreground mb-1">
            Admin Access Required
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in with your admin Internet Identity
          </p>
          <Button
            onClick={() => login()}
            className="btn-primary border-0 px-8"
            data-ocid="admin-login"
          >
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  const openDiscount = (product: Product) => {
    setDiscountDialog({
      open: true,
      product,
      value: product.discountPercent.toString(),
    });
  };
  const applyDiscount = () => {
    const pct = Math.min(
      100,
      Math.max(0, Number.parseInt(discountDialog.value) || 0),
    );
    setProducts((prev) =>
      prev.map((p) =>
        p.id === discountDialog.product?.id
          ? { ...p, discountPercent: BigInt(pct) }
          : p,
      ),
    );
    setDiscountDialog({ open: false, product: null, value: "" });
  };
  const deleteProduct = (id: bigint) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));
  const handleAddProduct = (form: ProductFormValues) => {
    setProducts((prev) => [...prev, formToProduct(form, nextId)]);
    setNextId((n) => n + 1n);
  };
  const handleEditProduct = (form: ProductFormValues) => {
    if (!editDialog.product) return;
    const updated = formToProduct(form, editDialog.product.id);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <Layout>
      <div className="px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display text-xl font-bold text-foreground">
            Admin Panel
          </h1>
          {activeTab === "products" && (
            <Button
              size="sm"
              className="btn-primary border-0 gap-1.5 h-8"
              onClick={() => setAddDialogOpen(true)}
              data-ocid="admin-add-product"
            >
              <Plus size={14} /> Add Product
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 bg-muted/50 rounded-xl p-1 mb-5"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "products"}
            onClick={() => setActiveTab("products")}
            className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-smooth ${
              activeTab === "products"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="admin-tab-products"
          >
            <Package size={13} className="inline mr-1" />
            Products
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "services"}
            onClick={() => setActiveTab("services")}
            className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-smooth relative ${
              activeTab === "services"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="admin-tab-services"
          >
            <Bell size={13} className="inline mr-1" />
            Service Requests
            {newCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                {newCount > 9 ? "9+" : newCount}
              </span>
            )}
          </button>
        </div>

        {/* Products tab */}
        {activeTab === "products" && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                {
                  label: "Products",
                  value: products.length,
                  icon: <Package size={16} />,
                },
                {
                  label: "Active",
                  value: products.filter((p) => p.isActive).length,
                  icon: <PercentCircle size={16} />,
                },
                {
                  label: "On Sale",
                  value: products.filter((p) => p.discountPercent > 0n).length,
                  icon: <Edit size={16} />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded-xl p-3 text-center"
                >
                  <div className="text-primary mx-auto w-fit mb-1">
                    {stat.icon}
                  </div>
                  <p className="text-lg font-black text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="font-semibold text-sm text-foreground mb-3">
              Product Inventory
            </h2>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id.toString()}
                  className="bg-card border border-border rounded-xl p-3"
                  data-ocid={`admin-product-${product.id}`}
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
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm font-bold">
                          {formatPrice(
                            discountedPrice(
                              product.price,
                              product.discountPercent,
                            ),
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
                      onClick={() => openDiscount(product)}
                      className="flex-1 h-8 text-xs gap-1 border-primary/30 text-primary"
                      data-ocid={`admin-discount-${product.id}`}
                    >
                      <PercentCircle size={12} /> Set Discount
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditDialog({ open: true, product })}
                      className="flex-1 h-8 text-xs gap-1"
                      data-ocid={`admin-edit-${product.id}`}
                    >
                      <Edit size={12} /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteProduct(product.id)}
                      className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                      data-ocid={`admin-delete-${product.id}`}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Service Requests tab */}
        {activeTab === "services" && <ServiceRequestsPanel />}
      </div>

      {/* Discount dialog */}
      <Dialog
        open={discountDialog.open}
        onOpenChange={(open) => setDiscountDialog((p) => ({ ...p, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground line-clamp-1">
              {discountDialog.product?.title}
            </p>
            <div className="space-y-2">
              <Label htmlFor="discount-pct">Discount Percentage (0–100)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="discount-pct"
                  type="number"
                  min={0}
                  max={100}
                  value={discountDialog.value}
                  onChange={(e) =>
                    setDiscountDialog((p) => ({ ...p, value: e.target.value }))
                  }
                  className="h-11"
                  data-ocid="admin-discount-input"
                />
                <span className="text-muted-foreground font-semibold">%</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDiscountDialog({ open: false, product: null, value: "" })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={applyDiscount}
              className="btn-primary border-0"
              data-ocid="admin-discount-apply"
            >
              Apply Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProductFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        initialValues={BLANK_FORM}
        title="Add New Product"
        onSave={handleAddProduct}
      />
      <ProductFormDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog((prev) => ({ ...prev, open }))}
        initialValues={
          editDialog.product ? productToForm(editDialog.product) : BLANK_FORM
        }
        title="Edit Product"
        onSave={handleEditProduct}
      />
    </Layout>
  );
}
