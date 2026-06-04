import { VendorType, createActor } from "@/backend";
import { useImageUpload } from "@/hooks/useImageUpload";
import type { VendorRegistration } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Leaf,
  Package,
  Store,
  Tag,
  Truck,
  Upload,
} from "lucide-react";
import { useState } from "react";

const VENDOR_CATEGORIES = [
  "Food & Spices",
  "Tea",
  "Clothing & Textiles",
  "Art & Crafts",
  "Books & Media",
  "Health & Medicine",
  "Religious Items",
  "Decor",
];

function AssameseBorder() {
  return (
    <svg viewBox="0 0 400 12" className="w-full" aria-hidden="true" fill="none">
      <path
        d="M0 6 Q25 0 50 6 Q75 12 100 6 Q125 0 150 6 Q175 12 200 6 Q225 0 250 6 Q275 12 300 6 Q325 0 350 6 Q375 12 400 6"
        stroke="oklch(var(--primary))"
        strokeWidth="2"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

export default function VendorRegisterPage() {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const [selectedVendorType, setSelectedVendorType] = useState<
    "brand" | "rawMaterial" | null
  >(null);

  const [form, setForm] = useState<VendorRegistration>({
    businessName: "",
    contactEmail: "",
    phone: "",
    categories: [],
    address: "",
    bankAccountNumber: "",
    ifscCode: "",
    fssaiDocumentUrl: undefined,
    vendorType: VendorType.brand,
    gstinNumber: undefined,
    brandName: undefined,
    packagingDetails: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fssaiUploading, setFssaiUploading] = useState(false);
  const { uploadFile } = useImageUpload();

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSubmit = async () => {
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
      if (!form.gstinNumber?.trim()) {
        setError("GSTIN number is required for brand vendors.");
        return;
      }
      if (!form.brandName?.trim()) {
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
      const payload: VendorRegistration = {
        ...form,
        vendorType:
          selectedVendorType === "brand"
            ? VendorType.brand
            : VendorType.rawMaterial,
        gstinNumber:
          selectedVendorType === "brand"
            ? (form.gstinNumber ?? undefined)
            : undefined,
        brandName:
          selectedVendorType === "brand"
            ? (form.brandName ?? undefined)
            : undefined,
        packagingDetails:
          selectedVendorType === "brand"
            ? (form.packagingDetails ?? undefined)
            : undefined,
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-5">
        <div className="w-full max-w-sm text-center space-y-5">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/15">
            <CheckCircle2 size={40} className="text-secondary" />
          </div>
          <h1 className="font-display text-2xl font-black text-foreground">
            Application Submitted!
          </h1>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Tag size={12} />
            {selectedVendorType === "brand"
              ? "Brand Vendor"
              : "Raw Material Supplier"}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your vendor application has been received. The AssamRoots admin team
            will review it and notify you at{" "}
            <span className="font-semibold text-foreground">
              {form.contactEmail}
            </span>{" "}
            within 2–3 business days.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/home" })}
            data-ocid="vendor-register.home_button"
            className="w-full h-11 rounded-xl font-display font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
          >
            Back to AssamRoots
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
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
        <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted flex items-center gap-1">
          <Store size={12} />
          Vendor Registration
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 shadow-md bg-primary/10">
              <Store size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-black text-foreground tracking-tight">
              Become a Vendor
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Supply authentic Assamese products and reach thousands of
              customers across India and the diaspora.
            </p>
          </div>

          <AssameseBorder />

          {!selectedVendorType && (
            <div className="space-y-3">
              <h2 className="font-display text-sm font-bold text-foreground text-center">
                Choose Your Vendor Type
              </h2>
              <button
                type="button"
                onClick={() => setSelectedVendorType("brand")}
                data-ocid="vendor-register.type_brand_button"
                className="w-full text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-smooth space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground text-sm">
                      Brand Vendor
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Has own packaging, GSTIN, FSSAI licence
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-[52px]">
                  You have a registered brand with packaged products, MRP
                  labels, and all compliance documents. You sell to us at a
                  wholesale rate.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setSelectedVendorType("rawMaterial")}
                data-ocid="vendor-register.type_raw_button"
                className="w-full text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-smooth space-y-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Truck size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground text-sm">
                      Raw Material Supplier
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bulk/unpackaged goods sold per kg
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-[52px]">
                  You supply raw or generic materials in bulk (by kg). We handle
                  packaging, branding, and final pricing. No FSSAI or GSTIN
                  needed.
                </p>
              </button>
            </div>
          )}

          {selectedVendorType && (
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" />
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    Business Details
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSelectedVendorType(null)}
                    className="text-xs text-primary underline underline-offset-2 hover:opacity-80"
                    data-ocid="vendor-register.change_type_button"
                  >
                    Change type
                  </button>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <Tag size={11} />
                  {selectedVendorType === "brand"
                    ? "Brand Vendor"
                    : "Raw Material Supplier"}
                </div>

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="vendor-business-name"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      Business Name *
                    </label>
                    <input
                      id="vendor-business-name"
                      type="text"
                      placeholder="e.g. Brahmaputra Teas"
                      value={form.businessName}
                      onChange={(e) => {
                        setForm((p) => ({
                          ...p,
                          businessName: e.target.value,
                        }));
                        setError("");
                      }}
                      disabled={loading}
                      data-ocid="vendor-register.business_name_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vendor-business-email"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      Business Email *
                    </label>
                    <input
                      id="vendor-business-email"
                      type="email"
                      placeholder="business@example.com"
                      value={form.contactEmail}
                      onChange={(e) => {
                        setForm((p) => ({
                          ...p,
                          contactEmail: e.target.value,
                        }));
                        setError("");
                      }}
                      disabled={loading}
                      data-ocid="vendor-register.email_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vendor-phone"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="vendor-phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) => {
                        setForm((p) => ({
                          ...p,
                          phone: e.target.value.replace(/\D/g, ""),
                        }));
                        setError("");
                      }}
                      maxLength={10}
                      disabled={loading}
                      data-ocid="vendor-register.phone_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                      Product Categories *{" "}
                      <span className="text-muted-foreground normal-case font-normal">
                        (select all that apply)
                      </span>
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {VENDOR_CATEGORIES.map((cat) => (
                        <label
                          key={cat}
                          className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer text-xs font-medium transition-smooth ${
                            form.categories.includes(cat)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-foreground hover:border-primary/40"
                          }`}
                          data-ocid={`vendor-register.category_${cat.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                        >
                          <input
                            type="checkbox"
                            checked={form.categories.includes(cat)}
                            onChange={() => {
                              toggleCategory(cat);
                              setError("");
                            }}
                            className="sr-only"
                          />
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                              form.categories.includes(cat)
                                ? "bg-primary border-primary"
                                : "border-input"
                            }`}
                          >
                            {form.categories.includes(cat) && (
                              <svg
                                viewBox="0 0 10 8"
                                className="w-2.5 h-2 fill-primary-foreground"
                                aria-hidden="true"
                              >
                                <path
                                  d="M1 4l2.5 2.5L9 1"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                              </svg>
                            )}
                          </span>
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="vendor-address"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      Business Address *
                    </label>
                    <textarea
                      id="vendor-address"
                      placeholder="Full address including city, district, state, PIN"
                      value={form.address}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, address: e.target.value }));
                        setError("");
                      }}
                      disabled={loading}
                      rows={3}
                      data-ocid="vendor-register.address_input"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 resize-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vendor-bank-account"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      Bank Account Number *
                    </label>
                    <input
                      id="vendor-bank-account"
                      type="text"
                      placeholder="e.g. 123456789012"
                      value={form.bankAccountNumber}
                      onChange={(e) => {
                        setForm((p) => ({
                          ...p,
                          bankAccountNumber: e.target.value.replace(/\D/g, ""),
                        }));
                        setError("");
                      }}
                      disabled={loading}
                      data-ocid="vendor-register.bank_account_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vendor-ifsc"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                    >
                      IFSC Code *
                    </label>
                    <input
                      id="vendor-ifsc"
                      type="text"
                      placeholder="e.g. SBIN0001234"
                      value={form.ifscCode}
                      onChange={(e) => {
                        setForm((p) => ({
                          ...p,
                          ifscCode: e.target.value.toUpperCase(),
                        }));
                        setError("");
                      }}
                      disabled={loading}
                      data-ocid="vendor-register.ifsc_input"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                    />
                  </div>

                  {selectedVendorType === "brand" && (
                    <>
                      <div>
                        <label
                          htmlFor="vendor-gstin"
                          className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                        >
                          GSTIN Number *
                        </label>
                        <input
                          id="vendor-gstin"
                          type="text"
                          placeholder="e.g. 27AABCU9603R1ZM"
                          value={form.gstinNumber ?? ""}
                          onChange={(e) => {
                            setForm((p) => ({
                              ...p,
                              gstinNumber: e.target.value.toUpperCase(),
                            }));
                            setError("");
                          }}
                          disabled={loading}
                          data-ocid="vendor-register.gstin_input"
                          className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="vendor-brand-name"
                          className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                        >
                          Brand Name *
                        </label>
                        <input
                          id="vendor-brand-name"
                          type="text"
                          placeholder="e.g. Brahmaputra Gold"
                          value={form.brandName ?? ""}
                          onChange={(e) => {
                            setForm((p) => ({
                              ...p,
                              brandName: e.target.value,
                            }));
                            setError("");
                          }}
                          disabled={loading}
                          data-ocid="vendor-register.brand_name_input"
                          className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="vendor-packaging"
                          className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                        >
                          Packaging Details{" "}
                          <span className="text-muted-foreground normal-case font-normal">
                            (optional)
                          </span>
                        </label>
                        <textarea
                          id="vendor-packaging"
                          placeholder="Describe your packaging type, sizes, materials, etc."
                          value={form.packagingDetails ?? ""}
                          onChange={(e) => {
                            setForm((p) => ({
                              ...p,
                              packagingDetails: e.target.value,
                            }));
                            setError("");
                          }}
                          disabled={loading}
                          rows={3}
                          data-ocid="vendor-register.packaging_input"
                          className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 resize-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="vendor-fssai"
                          className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1"
                        >
                          FSSAI Registration Document{" "}
                          <span className="text-muted-foreground normal-case font-normal">
                            (optional)
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            id="vendor-fssai"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setFssaiUploading(true);
                              setError("");
                              try {
                                const url = await uploadFile(file);
                                setForm((p) => ({
                                  ...p,
                                  fssaiDocumentUrl: url,
                                }));
                              } catch {
                                setError(
                                  "Failed to upload FSSAI document. Please try again.",
                                );
                              } finally {
                                setFssaiUploading(false);
                              }
                            }}
                            disabled={loading || fssaiUploading}
                            data-ocid="vendor-register.fssai_input"
                            className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-60"
                          />
                          {fssaiUploading && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              Uploading…
                            </span>
                          )}
                        </div>
                        {form.fssaiDocumentUrl && (
                          <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                            <Upload size={12} /> Document uploaded
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {error && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="vendor-register.error_state"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    data-ocid="vendor-register.submit_button"
                    className="w-full h-12 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-smooth active:scale-95 disabled:opacity-60 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {loading ? (
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
                        <Store size={16} /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 justify-center">
            <Leaf size={13} className="text-primary" />
            <p className="text-center text-xs text-muted-foreground">
              Already a vendor?{" "}
              <a
                href="/vendor-login"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                Sign in here
              </a>
            </p>
          </div>

          <AssameseBorder />
        </div>
      </main>
    </div>
  );
}
