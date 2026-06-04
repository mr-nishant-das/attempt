import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-CstiQ4sz.js";
import { VendorType, createActor } from "./backend-Dxpf4-N4.js";
import { u as useImageUpload } from "./useImageUpload-INUKTvRa.js";
import { u as useActor } from "./createLucideIcon-ByrRp2U0.js";
import { C as CircleCheck } from "./circle-check-DYqL9Alt.js";
import { T as Tag } from "./tag-BAplgXF0.js";
import { S as Store } from "./store-Dj_Vp66S.js";
import { P as Package } from "./package-B99SaNTR.js";
import { T as Truck } from "./truck-kLCYE6aP.js";
import { U as Upload } from "./upload-CV9VWsTf.js";
import { L as Leaf } from "./leaf-jf1_lp7m.js";
const VENDOR_CATEGORIES = [
  "Food & Spices",
  "Tea",
  "Clothing & Textiles",
  "Art & Crafts",
  "Books & Media",
  "Health & Medicine",
  "Religious Items",
  "Decor"
];
function AssameseBorder() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 400 12", className: "w-full", "aria-hidden": "true", fill: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "path",
    {
      d: "M0 6 Q25 0 50 6 Q75 12 100 6 Q125 0 150 6 Q175 12 200 6 Q225 0 250 6 Q275 12 300 6 Q325 0 350 6 Q375 12 400 6",
      stroke: "oklch(var(--primary))",
      strokeWidth: "2",
      strokeOpacity: "0.5"
    }
  ) });
}
function VendorRegisterPage() {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [selectedVendorType, setSelectedVendorType] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    businessName: "",
    contactEmail: "",
    phone: "",
    categories: [],
    address: "",
    bankAccountNumber: "",
    ifscCode: "",
    fssaiDocumentUrl: void 0,
    vendorType: VendorType.brand,
    gstinNumber: void 0,
    brandName: void 0,
    packagingDetails: void 0
  });
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  const [fssaiUploading, setFssaiUploading] = reactExports.useState(false);
  const { uploadFile } = useImageUpload();
  const toggleCategory = (cat) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat]
    }));
  };
  const handleSubmit = async () => {
    var _a, _b;
    if (!form.businessName.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!form.contactEmail.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    if (form.categories.length === 0) {
      setError("Select at least one product category.");
      return;
    }
    if (!form.address.trim()) {
      setError("Business address is required.");
      return;
    }
    if (!form.bankAccountNumber.trim()) {
      setError("Bank account number is required.");
      return;
    }
    if (!form.ifscCode.trim()) {
      setError("IFSC code is required.");
      return;
    }
    if (selectedVendorType === "brand") {
      if (!((_a = form.gstinNumber) == null ? void 0 : _a.trim())) {
        setError("GSTIN number is required for brand vendors.");
        return;
      }
      if (!((_b = form.brandName) == null ? void 0 : _b.trim())) {
        setError("Brand name is required for brand vendors.");
        return;
      }
    }
    if (!actor || isFetching) {
      setError("Connecting to server, please try again.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        vendorType: selectedVendorType === "brand" ? VendorType.brand : VendorType.rawMaterial,
        gstinNumber: selectedVendorType === "brand" ? form.gstinNumber ?? void 0 : void 0,
        brandName: selectedVendorType === "brand" ? form.brandName ?? void 0 : void 0,
        packagingDetails: selectedVendorType === "brand" ? form.packagingDetails ?? void 0 : void 0
      };
      const result = await actor.registerVendor(payload);
      if ("err" in result) {
        setError(result.err);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex flex-col items-center justify-center bg-muted/30 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm text-center space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 40, className: "text-secondary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-foreground", children: "Application Submitted!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 12 }),
        selectedVendorType === "brand" ? "Brand Vendor" : "Raw Material Supplier"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
        "Your vendor application has been received. The AssamRoots admin team will review it and notify you at",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: form.contactEmail }),
        " ",
        "within 2–3 business days."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/home" }),
          "data-ocid": "vendor-register.home_button",
          className: "w-full h-11 rounded-xl font-display font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth",
          children: "Back to AssamRoots"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex items-center justify-between px-5 py-3 bg-card border-b border-border shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/home" }),
          "aria-label": "AssamRoots home",
          className: "select-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/logo.png",
              alt: "AssamRoots",
              className: "h-10 w-auto object-contain"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 12 }),
        "Vendor Registration"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col items-center justify-center px-5 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 shadow-md bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 28, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-foreground tracking-tight", children: "Become a Vendor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Supply authentic Assamese products and reach thousands of customers across India and the diaspora." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AssameseBorder, {}),
      !selectedVendorType && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-bold text-foreground text-center", children: "Choose Your Vendor Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setSelectedVendorType("brand"),
            "data-ocid": "vendor-register.type_brand_button",
            className: "w-full text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-smooth space-y-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 20, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: "Brand Vendor" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Has own packaging, GSTIN, FSSAI licence" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed pl-[52px]", children: "You have a registered brand with packaged products, MRP labels, and all compliance documents. You sell to us at a wholesale rate." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setSelectedVendorType("rawMaterial"),
            "data-ocid": "vendor-register.type_raw_button",
            className: "w-full text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-smooth space-y-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 20, className: "text-secondary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: "Raw Material Supplier" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bulk/unpackaged goods sold per kg" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed pl-[52px]", children: "You supply raw or generic materials in bulk (by kg). We handle packaging, branding, and final pricing. No FSSAI or GSTIN needed." })
            ]
          }
        )
      ] }),
      selectedVendorType && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Business Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setSelectedVendorType(null),
                className: "text-xs text-primary underline underline-offset-2 hover:opacity-80",
                "data-ocid": "vendor-register.change_type_button",
                children: "Change type"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { size: 11 }),
            selectedVendorType === "brand" ? "Brand Vendor" : "Raw Material Supplier"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "vendor-business-name",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "Business Name *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "vendor-business-name",
                  type: "text",
                  placeholder: "e.g. Brahmaputra Teas",
                  value: form.businessName,
                  onChange: (e) => {
                    setForm((p) => ({
                      ...p,
                      businessName: e.target.value
                    }));
                    setError("");
                  },
                  disabled: loading,
                  "data-ocid": "vendor-register.business_name_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "vendor-business-email",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "Business Email *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "vendor-business-email",
                  type: "email",
                  placeholder: "business@example.com",
                  value: form.contactEmail,
                  onChange: (e) => {
                    setForm((p) => ({
                      ...p,
                      contactEmail: e.target.value
                    }));
                    setError("");
                  },
                  disabled: loading,
                  "data-ocid": "vendor-register.email_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "vendor-phone",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "Phone Number *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "vendor-phone",
                  type: "tel",
                  placeholder: "10-digit mobile number",
                  value: form.phone,
                  onChange: (e) => {
                    setForm((p) => ({
                      ...p,
                      phone: e.target.value.replace(/\D/g, "")
                    }));
                    setError("");
                  },
                  maxLength: 10,
                  disabled: loading,
                  "data-ocid": "vendor-register.phone_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2", children: [
                "Product Categories *",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground normal-case font-normal", children: "(select all that apply)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: VENDOR_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: `flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer text-xs font-medium transition-smooth ${form.categories.includes(cat) ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:border-primary/40"}`,
                  "data-ocid": `vendor-register.category_${cat.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: form.categories.includes(cat),
                        onChange: () => {
                          toggleCategory(cat);
                          setError("");
                        },
                        className: "sr-only"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${form.categories.includes(cat) ? "bg-primary border-primary" : "border-input"}`,
                        children: form.categories.includes(cat) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "svg",
                          {
                            viewBox: "0 0 10 8",
                            className: "w-2.5 h-2 fill-primary-foreground",
                            "aria-hidden": "true",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "path",
                              {
                                d: "M1 4l2.5 2.5L9 1",
                                stroke: "currentColor",
                                strokeWidth: "1.5",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                fill: "none"
                              }
                            )
                          }
                        )
                      }
                    ),
                    cat
                  ]
                },
                cat
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "vendor-address",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "Business Address *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "vendor-address",
                  placeholder: "Full address including city, district, state, PIN",
                  value: form.address,
                  onChange: (e) => {
                    setForm((p) => ({ ...p, address: e.target.value }));
                    setError("");
                  },
                  disabled: loading,
                  rows: 3,
                  "data-ocid": "vendor-register.address_input",
                  className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "vendor-bank-account",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "Bank Account Number *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "vendor-bank-account",
                  type: "text",
                  placeholder: "e.g. 123456789012",
                  value: form.bankAccountNumber,
                  onChange: (e) => {
                    setForm((p) => ({
                      ...p,
                      bankAccountNumber: e.target.value.replace(/\D/g, "")
                    }));
                    setError("");
                  },
                  disabled: loading,
                  "data-ocid": "vendor-register.bank_account_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "vendor-ifsc",
                  className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                  children: "IFSC Code *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "vendor-ifsc",
                  type: "text",
                  placeholder: "e.g. SBIN0001234",
                  value: form.ifscCode,
                  onChange: (e) => {
                    setForm((p) => ({
                      ...p,
                      ifscCode: e.target.value.toUpperCase()
                    }));
                    setError("");
                  },
                  disabled: loading,
                  "data-ocid": "vendor-register.ifsc_input",
                  className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                }
              )
            ] }),
            selectedVendorType === "brand" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "vendor-gstin",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                    children: "GSTIN Number *"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "vendor-gstin",
                    type: "text",
                    placeholder: "e.g. 27AABCU9603R1ZM",
                    value: form.gstinNumber ?? "",
                    onChange: (e) => {
                      setForm((p) => ({
                        ...p,
                        gstinNumber: e.target.value.toUpperCase()
                      }));
                      setError("");
                    },
                    disabled: loading,
                    "data-ocid": "vendor-register.gstin_input",
                    className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "vendor-brand-name",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                    children: "Brand Name *"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "vendor-brand-name",
                    type: "text",
                    placeholder: "e.g. Brahmaputra Gold",
                    value: form.brandName ?? "",
                    onChange: (e) => {
                      setForm((p) => ({
                        ...p,
                        brandName: e.target.value
                      }));
                      setError("");
                    },
                    disabled: loading,
                    "data-ocid": "vendor-register.brand_name_input",
                    className: "w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "vendor-packaging",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                    children: [
                      "Packaging Details",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground normal-case font-normal", children: "(optional)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "vendor-packaging",
                    placeholder: "Describe your packaging type, sizes, materials, etc.",
                    value: form.packagingDetails ?? "",
                    onChange: (e) => {
                      setForm((p) => ({
                        ...p,
                        packagingDetails: e.target.value
                      }));
                      setError("");
                    },
                    disabled: loading,
                    rows: 3,
                    "data-ocid": "vendor-register.packaging_input",
                    className: "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 resize-none"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "vendor-fssai",
                    className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1",
                    children: [
                      "FSSAI Registration Document",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground normal-case font-normal", children: "(optional)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "vendor-fssai",
                      type: "file",
                      accept: ".pdf,.jpg,.jpeg,.png",
                      onChange: async (e) => {
                        var _a;
                        const file = (_a = e.target.files) == null ? void 0 : _a[0];
                        if (!file) return;
                        setFssaiUploading(true);
                        setError("");
                        try {
                          const url = await uploadFile(file);
                          setForm((p) => ({
                            ...p,
                            fssaiDocumentUrl: url
                          }));
                        } catch {
                          setError(
                            "Failed to upload FSSAI document. Please try again."
                          );
                        } finally {
                          setFssaiUploading(false);
                        }
                      },
                      disabled: loading || fssaiUploading,
                      "data-ocid": "vendor-register.fssai_input",
                      className: "w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-60"
                    }
                  ),
                  fssaiUploading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground", children: "Uploading…" })
                ] }),
                form.fssaiDocumentUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-secondary mt-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 12 }),
                  " Document uploaded"
                ] })
              ] })
            ] }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "vendor-register.error_state",
                children: error
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleSubmit,
                disabled: loading,
                "data-ocid": "vendor-register.submit_button",
                className: "w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90",
                children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    className: "animate-spin h-4 w-4",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    "aria-hidden": "true",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "circle",
                        {
                          className: "opacity-25",
                          cx: "12",
                          cy: "12",
                          r: "10",
                          stroke: "currentColor",
                          strokeWidth: "4"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          className: "opacity-75",
                          fill: "currentColor",
                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        }
                      )
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 16 }),
                  " Submit Application"
                ] })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Leaf, { size: 13, className: "text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
          "Already a vendor?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "/vendor-login",
              className: "text-primary underline underline-offset-2 hover:opacity-80",
              children: "Sign in here"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AssameseBorder, {})
    ] }) })
  ] });
}
export {
  VendorRegisterPage as default
};
