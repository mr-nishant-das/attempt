import {
  type CreateServiceRequestInput,
  type ServiceRequestPublic,
  ServiceType,
  createActor,
} from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServicesAvailability } from "@/hooks/useQueries";
import { useActor } from "@caffeineai/core-infrastructure";
import { AlertTriangle, CheckCircle2, Clock, Globe, Info } from "lucide-react";
import { useState } from "react";

// ─── Service definitions ─────────────────────────────────────────────────────
interface ServiceDef {
  type: ServiceType;
  emoji: string;
  title: string;
  desc: string;
  color: string;
}

const SERVICES: ServiceDef[] = [
  {
    type: ServiceType.Ambulance,
    emoji: "🚑",
    title: "Ambulance",
    desc: "Emergency medical transport across Assam, 24/7 dispatch.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    type: ServiceType.Doctors,
    emoji: "👨‍⚕️",
    title: "Doctors",
    desc: "Home visits and clinic consultations with local doctors.",
    color: "bg-primary/10 text-primary",
  },
  {
    type: ServiceType.Medicines,
    emoji: "💊",
    title: "Medicines",
    desc: "Medicine delivery to your doorstep within Assam.",
    color: "bg-secondary/15 text-secondary",
  },
  {
    type: ServiceType.FoodDelivery,
    emoji: "🍱",
    title: "Food Delivery",
    desc: "Fresh local home-cooked Assamese meals delivered hot.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    type: ServiceType.Taxi,
    emoji: "🚕",
    title: "Taxi & Transport",
    desc: "Reliable local taxi and transport throughout Assam.",
    color: "bg-primary/10 text-primary",
  },
  {
    type: ServiceType.EventManagement,
    emoji: "🎪",
    title: "Event Management",
    desc: "Hall bookings and full event coordination services.",
    color: "bg-secondary/15 text-secondary",
  },
  {
    type: ServiceType.FuneralServices,
    emoji: "🕯️",
    title: "Funeral Services",
    desc: "Compassionate funeral arrangements and last rites support.",
    color: "bg-muted text-muted-foreground",
  },
  {
    type: ServiceType.WeddingsAnniversaries,
    emoji: "💒",
    title: "Weddings & Anniversaries",
    desc: "Wedding planning, venue selection and anniversary events.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    type: ServiceType.Gifting,
    emoji: "🎁",
    title: "Gifting",
    desc: "Curated Assamese gift boxes delivered to your loved ones.",
    color: "bg-primary/10 text-primary",
  },
  {
    type: ServiceType.VideoConferencing,
    emoji: "📹",
    title: "Video Conferencing",
    desc: "Live video connectivity for rural and remote Assam areas.",
    color: "bg-secondary/15 text-secondary",
  },
  {
    type: ServiceType.SchoolAdmissions,
    emoji: "🎓",
    title: "School/College Admissions",
    desc: "Guidance, documentation and admission support in Assam.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    type: ServiceType.Tourism,
    emoji: "🏔️",
    title: "Tourism",
    desc: "Authentic Assam travel packages, guides and homestays.",
    color: "bg-primary/10 text-primary",
  },
  {
    type: ServiceType.Other,
    emoji: "🤝",
    title: "Community Help",
    desc: "Other community needs — describe what you require.",
    color: "bg-secondary/15 text-secondary",
  },
];

// ─── Today's date string for min date ────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

// ─── Booking form state ───────────────────────────────────────────────────────
interface BookingForm {
  userName: string;
  userPhone: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  isRequestForSelf: boolean;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
}

interface FormErrors {
  userName?: string;
  userPhone?: string;
  preferredDate?: string;
  preferredTime?: string;
  description?: string;
  recipientName?: string;
  recipientPhone?: string;
}

const BLANK_FORM: BookingForm = {
  userName: "",
  userPhone: "",
  preferredDate: "",
  preferredTime: "",
  description: "",
  isRequestForSelf: true,
  recipientName: "",
  recipientPhone: "",
  recipientAddress: "",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { data: servicesAvailability } = useServicesAvailability();

  // Booking modal
  const [bookingService, setBookingService] = useState<ServiceDef | null>(null);
  const [form, setForm] = useState<BookingForm>(BLANK_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Success modal
  const [successRequest, setSuccessRequest] =
    useState<ServiceRequestPublic | null>(null);
  const [successService, setSuccessService] = useState<string>("");
  const [successRecipientName, setSuccessRecipientName] = useState<string>("");

  // ─── Open / close booking modal ───────────────────────────────────────────
  const openBooking = (svc: ServiceDef) => {
    setBookingService(svc);
    setForm(BLANK_FORM);
    setErrors({});
    setBackendError(null);
  };

  const closeBooking = () => {
    setBookingService(null);
  };

  // ─── Validate form ────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.userName.trim()) e.userName = "Name is required";
    const phone = form.userPhone.replace(/\D/g, "");
    if (!phone || phone.length < 10)
      e.userPhone = "Enter a valid 10-digit phone number";
    if (!form.preferredDate) e.preferredDate = "Preferred date is required";
    if (!form.preferredTime) e.preferredTime = "Preferred time is required";
    if (!form.description.trim())
      e.description = "Please describe what you need";

    if (!form.isRequestForSelf) {
      if (!form.recipientName.trim())
        e.recipientName = "Recipient name is required";
      const rPhone = form.recipientPhone.replace(/\D/g, "");
      if (!rPhone || rPhone.length < 10)
        e.recipientPhone = "Enter a valid 10-digit phone number";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Submit booking ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate() || !bookingService || !actor) return;
    setSubmitting(true);
    setBackendError(null);
    try {
      const input: CreateServiceRequestInput = {
        userName: form.userName.trim(),
        userPhone: form.userPhone.trim(),
        serviceType: bookingService.type,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        description: form.description.trim(),
        isRequestForSelf: form.isRequestForSelf,
        recipientName: form.isRequestForSelf
          ? undefined
          : form.recipientName.trim() || undefined,
        recipientPhone: form.isRequestForSelf
          ? undefined
          : form.recipientPhone.trim() || undefined,
        recipientAddress:
          form.isRequestForSelf || !form.recipientAddress.trim()
            ? undefined
            : form.recipientAddress.trim(),
      };
      const result = await actor.submitServiceRequest(input);
      setSuccessRequest(result);
      setSuccessService(bookingService.title);
      setSuccessRecipientName(
        form.isRequestForSelf ? "" : form.recipientName.trim(),
      );
      setBookingService(null);
    } catch (_err) {
      setBackendError("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (key: keyof FormErrors) =>
    errors[key] ? (
      <p className="text-xs text-destructive mt-1">{errors[key]}</p>
    ) : null;

  return (
    <Layout>
      <div className="px-4 py-4 pb-24" data-ocid="services-page">
        {/* Services unavailability banner — shown when admin has disabled services */}
        {servicesAvailability && !servicesAvailability.available && (
          <div
            className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-4 mb-5"
            role="alert"
            data-ocid="services-unavailable-banner"
          >
            <Clock size={20} className="text-amber-600 flex-none mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-900 leading-tight">
                Services Temporarily Unavailable
              </p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {servicesAvailability.message ||
                  "Our community services are currently paused."}
              </p>
              <p className="text-xs text-amber-700 mt-1.5 font-medium">
                🔔 Services will resume soon — check back later.
              </p>
            </div>
          </div>
        )}

        {/* Page header */}
        <div className="mb-4">
          <h1 className="font-display text-2xl font-black text-foreground tracking-tight">
            Assam Community Services
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Local services for the people of Assam
          </p>
        </div>

        {/* Global info banner — always visible */}
        <div
          className="flex items-start gap-3 bg-primary/8 border border-primary/25 rounded-xl px-4 py-3 mb-5"
          role="note"
          data-ocid="services-global-banner"
        >
          <Globe size={18} className="text-primary flex-none mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Available worldwide — fulfilled within Assam
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              All services are physically carried out within Assam. You can
              request a service from anywhere in the world for someone in Assam.
            </p>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVICES.map((svc) => (
            <div
              key={svc.type}
              className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 transition-smooth hover:border-primary/30 hover:shadow-sm overflow-hidden"
              data-ocid={`service-card-${svc.type.toLowerCase()}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-none ${svc.color}`}
                  aria-hidden="true"
                >
                  {svc.emoji}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-semibold text-sm text-foreground leading-tight truncate">
                    {svc.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2 break-words">
                    {svc.desc}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full h-9 text-xs font-semibold btn-primary border-0 flex-none"
                disabled={
                  actorFetching ||
                  (servicesAvailability
                    ? !servicesAvailability.available
                    : false)
                }
                onClick={() => openBooking(svc)}
                data-ocid={`service-book-${svc.type.toLowerCase()}`}
              >
                {servicesAvailability && !servicesAvailability.available
                  ? "Currently Unavailable"
                  : "Request Service"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Booking Modal ───────────────────────────────────────────────── */}
      <Dialog
        open={!!bookingService}
        onOpenChange={(o) => !o && closeBooking()}
      >
        <DialogContent className="max-w-sm max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span aria-hidden="true">{bookingService?.emoji}</span>
              {bookingService?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-1">
            {/* Info banner inside modal */}
            <div className="flex items-start gap-2 bg-primary/8 border border-primary/20 rounded-lg px-3 py-2">
              <Info size={13} className="text-primary flex-none mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                This service will be carried out within Assam. You can book from
                anywhere in the world.
              </p>
            </div>

            {/* Service type (read-only display) */}
            <div className="bg-muted/50 rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground">Service Type</p>
              <p className="text-sm font-semibold text-foreground">
                {bookingService?.title}
              </p>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="svc-name" className="text-xs font-semibold">
                Your Full Name *
              </Label>
              <Input
                id="svc-name"
                value={form.userName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, userName: e.target.value }))
                }
                placeholder="Your full name"
                className="h-9 text-sm"
                data-ocid="service-form-name"
              />
              {fieldError("userName")}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="svc-phone" className="text-xs font-semibold">
                Your Phone Number *
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground bg-muted border border-input rounded-md px-3 h-9 flex items-center">
                  +91
                </span>
                <Input
                  id="svc-phone"
                  type="tel"
                  value={form.userPhone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, userPhone: e.target.value }))
                  }
                  placeholder="10-digit mobile number"
                  className="h-9 text-sm flex-1"
                  maxLength={10}
                  data-ocid="service-form-phone"
                />
              </div>
              {fieldError("userPhone")}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="svc-date" className="text-xs font-semibold">
                  Preferred Date *
                </Label>
                <Input
                  id="svc-date"
                  type="date"
                  min={todayStr()}
                  value={form.preferredDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, preferredDate: e.target.value }))
                  }
                  className="h-9 text-sm"
                  data-ocid="service-form-date"
                />
                {fieldError("preferredDate")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="svc-time" className="text-xs font-semibold">
                  Preferred Time *
                </Label>
                <Input
                  id="svc-time"
                  type="time"
                  value={form.preferredTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, preferredTime: e.target.value }))
                  }
                  className="h-9 text-sm"
                  data-ocid="service-form-time"
                />
                {fieldError("preferredTime")}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="svc-description"
                className="text-xs font-semibold"
              >
                Describe What You Need *
              </Label>
              <Textarea
                id="svc-description"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Describe what you need in detail…"
                className="text-sm resize-none"
                rows={3}
                data-ocid="service-form-description"
              />
              {fieldError("description")}
            </div>

            {/* ── Service Recipient Section ─────────────────────────────── */}
            <div className="border border-border rounded-xl p-3 space-y-3 bg-muted/20">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="svc-for-others"
                  checked={!form.isRequestForSelf}
                  onCheckedChange={(checked) =>
                    setForm((p) => ({
                      ...p,
                      isRequestForSelf: !checked,
                      recipientName: "",
                      recipientPhone: "",
                      recipientAddress: "",
                    }))
                  }
                  data-ocid="service-form-for-others"
                />
                <Label
                  htmlFor="svc-for-others"
                  className="text-xs font-semibold leading-tight cursor-pointer"
                >
                  I am requesting this service for someone else in Assam
                  <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                    Tick this if you're outside Assam and want to help someone
                    there
                  </span>
                </Label>
              </div>

              {/* Recipient fields — shown only when booking for someone else */}
              {!form.isRequestForSelf && (
                <div className="space-y-3 pt-1 border-t border-border/60">
                  <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                    <span>👤</span> Service Recipient Details
                  </p>

                  {/* Recipient Name */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="svc-recipient-name"
                      className="text-xs font-semibold"
                    >
                      Recipient Full Name *
                    </Label>
                    <Input
                      id="svc-recipient-name"
                      value={form.recipientName}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          recipientName: e.target.value,
                        }))
                      }
                      placeholder="Name of the person in Assam"
                      className="h-9 text-sm"
                      data-ocid="service-form-recipient-name"
                    />
                    {fieldError("recipientName")}
                  </div>

                  {/* Recipient Phone */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="svc-recipient-phone"
                      className="text-xs font-semibold"
                    >
                      Recipient Phone Number *
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground bg-muted border border-input rounded-md px-3 h-9 flex items-center">
                        +91
                      </span>
                      <Input
                        id="svc-recipient-phone"
                        type="tel"
                        value={form.recipientPhone}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            recipientPhone: e.target.value,
                          }))
                        }
                        placeholder="10-digit mobile number"
                        className="h-9 text-sm flex-1"
                        maxLength={10}
                        data-ocid="service-form-recipient-phone"
                      />
                    </div>
                    {fieldError("recipientPhone")}
                  </div>

                  {/* Recipient Address */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="svc-recipient-address"
                      className="text-xs font-semibold"
                    >
                      Recipient Address in Assam{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      id="svc-recipient-address"
                      value={form.recipientAddress}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          recipientAddress: e.target.value,
                        }))
                      }
                      placeholder="Street, village, town, district in Assam…"
                      className="text-sm resize-none"
                      rows={2}
                      data-ocid="service-form-recipient-address"
                    />
                  </div>
                </div>
              )}
            </div>

            {backendError && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                <AlertTriangle
                  size={14}
                  className="text-destructive flex-none"
                />
                <p className="text-xs text-destructive">{backendError}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeBooking}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="btn-primary border-0"
              disabled={submitting || !actor}
              data-ocid="service-form-submit"
            >
              {submitting ? "Submitting…" : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Success Modal ───────────────────────────────────────────────── */}
      <Dialog
        open={!!successRequest}
        onOpenChange={(o) => !o && setSuccessRequest(null)}
      >
        <DialogContent className="max-w-sm text-center">
          <div className="py-4 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center">
              <CheckCircle2 size={36} className="text-secondary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black text-foreground mb-1">
                Request Submitted!
              </h2>
              {successRecipientName ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your request for{" "}
                  <span className="font-semibold text-foreground">
                    {successRecipientName}
                  </span>{" "}
                  has been submitted. Our team will contact them in Assam
                  shortly.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your service request has been submitted. Our team will contact
                  you shortly.
                </p>
              )}
            </div>
            {successRequest && (
              <div className="w-full bg-muted/50 rounded-xl p-4 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Reference #
                  </span>
                  <span className="text-xs font-bold text-primary">
                    SR-{successRequest.id.toString().padStart(4, "0")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Service</span>
                  <span className="text-xs font-semibold text-foreground">
                    {successService}
                  </span>
                </div>
                {successRecipientName && (
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Recipient
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {successRecipientName}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Submitted
                  </span>
                  <span className="text-xs text-foreground">
                    {new Date(
                      Number(successRequest.submittedAt) / 1_000_000,
                    ).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge className="text-[10px] bg-primary/10 text-primary border-0 px-2 py-0.5 h-auto">
                    New
                  </Badge>
                </div>
              </div>
            )}
          </div>
          <Button
            type="button"
            onClick={() => setSuccessRequest(null)}
            className="w-full btn-primary border-0"
            data-ocid="service-success-done"
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
