import { r as reactExports, j as jsxRuntimeExports, d as useQueryClient, S as Skeleton } from "./index-D4oc9L-H.js";
import { S as ServiceRequestStatus, a as ServiceType, c as createActor } from "./backend-_UQ-CFUH.js";
import { L as Layout } from "./Layout-CddzSLPN.js";
import { B as Badge } from "./badge-BLfyvmpN.js";
import { B as Button } from "./button-BheL6zVp.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-ByR6adIl.js";
import { L as Label, I as Input } from "./label-P3qVKHAO.js";
import { u as useAuth } from "./useAuth-E-HR_wVi.js";
import { f as formatPrice, d as discountedPrice } from "./types-Dmw7OeI0.js";
import { u as useActor, a as useQuery } from "./useActor-Cd9Rra9U.js";
import { L as LogIn } from "./log-in-DFLvcpU6.js";
import { P as Plus, T as Trash2 } from "./trash-2-Dt14C7U5.js";
import { P as Package } from "./package-z0U_1abw.js";
import { c as createLucideIcon } from "./createLucideIcon-DMAq5fnw.js";
import "./index-CT5_lWjy.js";
import "./index-BdIKiqEc.js";
import "./index-BmjgszZ4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "M9 9h.01", key: "1q5me6" }],
  ["path", { d: "M15 15h.01", key: "lqbp3k" }]
];
const CirclePercent = createLucideIcon("circle-percent", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);
const INITIAL_PRODUCTS = [
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
    updatedAt: 0n
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
    updatedAt: 0n
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
    updatedAt: 0n
  }
];
const BLANK_FORM = {
  title: "",
  description: "",
  price: "",
  discountPercent: "0",
  category: "1",
  subCategory: "",
  brand: "",
  imageUrl: "",
  stock: "0"
};
const SERVICE_TYPE_LABELS = {
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
  [ServiceType.Other]: "🤝 Community Help"
};
const STATUS_CONFIG = {
  [ServiceRequestStatus.New]: {
    label: "New",
    className: "bg-primary/15 text-primary border-0"
  },
  [ServiceRequestStatus.Contacted]: {
    label: "Contacted",
    className: "bg-amber-500/20 text-amber-700 border-0"
  },
  [ServiceRequestStatus.Completed]: {
    label: "Completed",
    className: "bg-secondary/20 text-secondary border-0"
  },
  [ServiceRequestStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-destructive/15 text-destructive border-0"
  }
};
function productToForm(p) {
  return {
    title: p.title,
    description: p.description,
    price: (Number(p.price) / 100).toString(),
    discountPercent: p.discountPercent.toString(),
    category: p.category.toString(),
    subCategory: p.subCategory,
    brand: p.brand,
    imageUrl: p.imageUrls[0] ?? "",
    stock: p.stock.toString()
  };
}
function formToProduct(form, id) {
  return {
    id,
    title: form.title,
    description: form.description,
    price: BigInt(Math.round(Number.parseFloat(form.price || "0") * 100)),
    discountPercent: BigInt(
      Math.min(100, Math.max(0, Number.parseInt(form.discountPercent) || 0))
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
    updatedAt: BigInt(Date.now())
  };
}
function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: id, className: "text-xs font-semibold", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        id,
        type,
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        className: "h-9 text-sm",
        "data-ocid": `admin-field-${id}`
      }
    )
  ] });
}
function ProductFormDialog({
  open,
  onOpenChange,
  initialValues,
  title,
  onSave
}) {
  const [form, setForm] = reactExports.useState(initialValues);
  const handleOpenChange = (o) => {
    if (o) setForm(initialValues);
    onOpenChange(o);
  };
  const set = (key) => (v) => setForm((prev) => ({ ...prev, [key]: v }));
  const handleSave = () => {
    if (!form.title.trim() || !form.price) return;
    onSave(form);
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          id: "prod-title",
          label: "Product Title *",
          value: form.title,
          onChange: set("title"),
          placeholder: "e.g. Assam Gold Tea — 250g"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          id: "prod-description",
          label: "Description",
          value: form.description,
          onChange: set("description"),
          placeholder: "Short product description"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            id: "prod-price",
            label: "Price (₹) *",
            value: form.price,
            onChange: set("price"),
            type: "number",
            placeholder: "499"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            id: "prod-discount",
            label: "Discount %",
            value: form.discountPercent,
            onChange: set("discountPercent"),
            type: "number",
            placeholder: "0"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "prod-category", className: "text-xs font-semibold", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "prod-category",
              value: form.category,
              onChange: (e) => set("category")(e.target.value),
              className: "w-full h-9 rounded-md border border-input bg-background text-sm px-3",
              "data-ocid": "admin-field-prod-category",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "1", children: "Tea" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2", children: "Spices" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "3", children: "Handloom" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "4", children: "Crafts" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5", children: "Food" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "6", children: "Books" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "7", children: "Attire" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "8", children: "Kitchen" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            id: "prod-subcategory",
            label: "Sub-category",
            value: form.subCategory,
            onChange: set("subCategory"),
            placeholder: "e.g. CTC"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          id: "prod-brand",
          label: "Brand",
          value: form.brand,
          onChange: set("brand"),
          placeholder: "e.g. Heritage Tea Co."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          id: "prod-image",
          label: "Image URL",
          value: form.imageUrl,
          onChange: set("imageUrl"),
          placeholder: "/assets/generated/product-ctc-tea.dim_400x400.jpg"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          id: "prod-stock",
          label: "Stock Qty",
          value: form.stock,
          onChange: set("stock"),
          type: "number",
          placeholder: "50"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSave,
          className: "btn-primary border-0",
          disabled: !form.title.trim() || !form.price,
          "data-ocid": "admin-product-save",
          children: "Save Product"
        }
      )
    ] })
  ] }) });
}
function ServiceRequestRow({
  request,
  onStatusUpdate,
  onDelete
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [selectedStatus, setSelectedStatus] = reactExports.useState(
    request.status
  );
  const [updating, setUpdating] = reactExports.useState(false);
  const [deleting, setDeleting] = reactExports.useState(false);
  const [confirmDelete, setConfirmDelete] = reactExports.useState(false);
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
    Number(request.submittedAt) / 1e6
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-xl overflow-hidden",
      "data-ocid": `admin-service-request-${request.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full text-left px-4 py-3 flex items-start gap-3",
            onClick: () => setExpanded((p) => !p),
            "aria-expanded": expanded,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: SERVICE_TYPE_LABELS[request.serviceType] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `text-[10px] px-2 py-0.5 h-auto ${cfg.className}`,
                      children: cfg.label
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  request.userName,
                  " · +91 ",
                  request.userPhone,
                  " · ",
                  submittedDate
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "📅 ",
                  request.preferredDate,
                  " · ⏰ ",
                  request.preferredTime
                ] })
              ] }),
              expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronUp,
                {
                  size: 16,
                  className: "text-muted-foreground flex-none mt-0.5"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  size: 16,
                  className: "text-muted-foreground flex-none mt-0.5"
                }
              )
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border px-4 py-3 space-y-3 bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-1", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: request.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: `status-${request.id}`,
                  className: "text-xs font-semibold",
                  children: "Update Status"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: `status-${request.id}`,
                  value: selectedStatus,
                  onChange: (e) => setSelectedStatus(e.target.value),
                  className: "w-full h-9 rounded-md border border-input bg-background text-sm px-3",
                  "data-ocid": `admin-service-status-${request.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ServiceRequestStatus.New, children: "New" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ServiceRequestStatus.Contacted, children: "Contacted" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ServiceRequestStatus.Completed, children: "Completed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ServiceRequestStatus.Cancelled, children: "Cancelled" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "h-9 btn-primary border-0 text-xs",
                onClick: handleStatusUpdate,
                disabled: updating || selectedStatus === request.status,
                "data-ocid": `admin-service-update-${request.id}`,
                children: updating ? "Saving…" : "Update"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: `w-full h-8 text-xs border-destructive/30 ${confirmDelete ? "bg-destructive/10 text-destructive" : "text-destructive"}`,
              onClick: handleDelete,
              disabled: deleting,
              "data-ocid": `admin-service-delete-${request.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12, className: "mr-1" }),
                confirmDelete ? "Tap again to confirm delete" : deleting ? "Deleting…" : "Delete Request"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ServiceRequestsPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: requests, isLoading } = useQuery({
    queryKey: ["adminServiceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.adminGetServiceRequests();
      return [...all].sort((a, b) => Number(b.submittedAt - a.submittedAt));
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 3e4
  });
  const handleStatusUpdate = async (id, status) => {
    if (!actor) return;
    await actor.adminUpdateServiceRequestStatus(id, status);
    await queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
  };
  const handleDelete = async (id) => {
    if (!actor) return;
    await actor.adminDeleteServiceRequest(id);
    await queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
  };
  if (isLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) });
  }
  if (!requests || requests.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-12 bg-muted/20 rounded-xl border border-border",
        "data-ocid": "admin-service-requests-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 36, className: "text-muted-foreground/30 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: "No service requests yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "They will appear here when customers submit them." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: requests.map((req) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ServiceRequestRow,
    {
      request: req,
      onStatusUpdate: handleStatusUpdate,
      onDelete: handleDelete
    },
    req.id.toString()
  )) });
}
function AdminPage() {
  var _a;
  const { isAuthenticated, login } = useAuth();
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [products, setProducts] = reactExports.useState(INITIAL_PRODUCTS);
  const [nextId, setNextId] = reactExports.useState(4n);
  const [activeTab, setActiveTab] = reactExports.useState(
    "products"
  );
  const [discountDialog, setDiscountDialog] = reactExports.useState({ open: false, product: null, value: "" });
  const [addDialogOpen, setAddDialogOpen] = reactExports.useState(false);
  const [editDialog, setEditDialog] = reactExports.useState({ open: false, product: null });
  const { data: serviceRequests } = useQuery({
    queryKey: ["adminServiceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetServiceRequests();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    refetchInterval: 6e4
  });
  const newCount = (serviceRequests == null ? void 0 : serviceRequests.filter((r) => r.status === ServiceRequestStatus.New).length) ?? 0;
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 px-6",
        "data-ocid": "admin-unauthenticated",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 48, className: "text-muted-foreground/40 mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "Admin Access Required" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Sign in with your admin Internet Identity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => login(),
              className: "btn-primary border-0 px-8",
              "data-ocid": "admin-login",
              children: "Sign In"
            }
          )
        ]
      }
    ) });
  }
  const openDiscount = (product) => {
    setDiscountDialog({
      open: true,
      product,
      value: product.discountPercent.toString()
    });
  };
  const applyDiscount = () => {
    const pct = Math.min(
      100,
      Math.max(0, Number.parseInt(discountDialog.value) || 0)
    );
    setProducts(
      (prev) => prev.map(
        (p) => {
          var _a2;
          return p.id === ((_a2 = discountDialog.product) == null ? void 0 : _a2.id) ? { ...p, discountPercent: BigInt(pct) } : p;
        }
      )
    );
    setDiscountDialog({ open: false, product: null, value: "" });
  };
  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));
  const handleAddProduct = (form) => {
    setProducts((prev) => [...prev, formToProduct(form, nextId)]);
    setNextId((n) => n + 1n);
  };
  const handleEditProduct = (form) => {
    if (!editDialog.product) return;
    const updated = formToProduct(form, editDialog.product.id);
    setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Admin Panel" }),
        activeTab === "products" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "btn-primary border-0 gap-1.5 h-8",
            onClick: () => setAddDialogOpen(true),
            "data-ocid": "admin-add-product",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
              " Add Product"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex gap-1 bg-muted/50 rounded-xl p-1 mb-5",
          role: "tablist",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": activeTab === "products",
                onClick: () => setActiveTab("products"),
                className: `flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-smooth ${activeTab === "products" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": "admin-tab-products",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 13, className: "inline mr-1" }),
                  "Products"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": activeTab === "services",
                onClick: () => setActiveTab("services"),
                className: `flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-smooth relative ${activeTab === "services" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                "data-ocid": "admin-tab-services",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 13, className: "inline mr-1" }),
                  "Service Requests",
                  newCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold", children: newCount > 9 ? "9+" : newCount })
                ]
              }
            )
          ]
        }
      ),
      activeTab === "products" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 mb-5", children: [
          {
            label: "Products",
            value: products.length,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16 })
          },
          {
            label: "Active",
            value: products.filter((p) => p.isActive).length,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePercent, { size: 16 })
          },
          {
            label: "On Sale",
            value: products.filter((p) => p.discountPercent > 0n).length,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 16 })
          }
        ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-3 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-primary mx-auto w-fit mb-1", children: stat.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-black text-foreground", children: stat.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: stat.label })
            ]
          },
          stat.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm text-foreground mb-3", children: "Product Inventory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-3",
            "data-ocid": `admin-product-${product.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 bg-muted rounded-lg flex-none overflow-hidden", children: product.imageUrls[0] ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: product.imageUrls[0],
                    alt: product.title,
                    className: "w-full h-full object-cover"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-2xl", children: "📦" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-tight line-clamp-1", children: product.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: product.brand }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: formatPrice(
                      discountedPrice(
                        product.price,
                        product.discountPercent
                      )
                    ) }),
                    product.discountPercent > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "destructive",
                        className: "text-[10px] px-1.5 py-0.5",
                        children: [
                          Number(product.discountPercent),
                          "% OFF"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "Stock: ",
                      Number(product.stock)
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => openDiscount(product),
                    className: "flex-1 h-8 text-xs gap-1 border-primary/30 text-primary",
                    "data-ocid": `admin-discount-${product.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePercent, { size: 12 }),
                      " Set Discount"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => setEditDialog({ open: true, product }),
                    className: "flex-1 h-8 text-xs gap-1",
                    "data-ocid": `admin-edit-${product.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 12 }),
                      " Edit"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => deleteProduct(product.id),
                    className: "h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10",
                    "data-ocid": `admin-delete-${product.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                  }
                )
              ] })
            ]
          },
          product.id.toString()
        )) })
      ] }),
      activeTab === "services" && /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceRequestsPanel, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: discountDialog.open,
        onOpenChange: (open) => setDiscountDialog((p) => ({ ...p, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Set Discount" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-1", children: (_a = discountDialog.product) == null ? void 0 : _a.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "discount-pct", children: "Discount Percentage (0–100)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "discount-pct",
                    type: "number",
                    min: 0,
                    max: 100,
                    value: discountDialog.value,
                    onChange: (e) => setDiscountDialog((p) => ({ ...p, value: e.target.value })),
                    className: "h-11",
                    "data-ocid": "admin-discount-input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "%" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDiscountDialog({ open: false, product: null, value: "" }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: applyDiscount,
                className: "btn-primary border-0",
                "data-ocid": "admin-discount-apply",
                children: "Apply Discount"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductFormDialog,
      {
        open: addDialogOpen,
        onOpenChange: setAddDialogOpen,
        initialValues: BLANK_FORM,
        title: "Add New Product",
        onSave: handleAddProduct
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductFormDialog,
      {
        open: editDialog.open,
        onOpenChange: (open) => setEditDialog((prev) => ({ ...prev, open })),
        initialValues: editDialog.product ? productToForm(editDialog.product) : BLANK_FORM,
        title: "Edit Product",
        onSave: handleEditProduct
      }
    )
  ] });
}
export {
  AdminPage as default
};
