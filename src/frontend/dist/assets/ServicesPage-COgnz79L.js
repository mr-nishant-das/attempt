import { j as jsxRuntimeExports, c as cn, r as reactExports } from "./index-D4oc9L-H.js";
import { a as ServiceType, c as createActor } from "./backend-_UQ-CFUH.js";
import { L as Layout } from "./Layout-CddzSLPN.js";
import { B as Badge } from "./badge-BLfyvmpN.js";
import { B as Button } from "./button-BheL6zVp.js";
import { C as Checkbox, T as TriangleAlert } from "./checkbox-IsnKOkzL.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-ByR6adIl.js";
import { L as Label, I as Input } from "./label-P3qVKHAO.js";
import { u as useActor } from "./useActor-Cd9Rra9U.js";
import { c as createLucideIcon } from "./createLucideIcon-DMAq5fnw.js";
import { C as CircleCheck } from "./circle-check-CScK-JOr.js";
import "./index-CT5_lWjy.js";
import "./index-BdIKiqEc.js";
import "./index-BmjgszZ4.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const SERVICES = [
  {
    type: ServiceType.Ambulance,
    emoji: "🚑",
    title: "Ambulance",
    desc: "Emergency medical transport across Assam, 24/7 dispatch.",
    color: "bg-destructive/10 text-destructive"
  },
  {
    type: ServiceType.Doctors,
    emoji: "👨‍⚕️",
    title: "Doctors",
    desc: "Home visits and clinic consultations with local doctors.",
    color: "bg-primary/10 text-primary"
  },
  {
    type: ServiceType.Medicines,
    emoji: "💊",
    title: "Medicines",
    desc: "Medicine delivery to your doorstep within Assam.",
    color: "bg-secondary/15 text-secondary"
  },
  {
    type: ServiceType.FoodDelivery,
    emoji: "🍱",
    title: "Food Delivery",
    desc: "Fresh local home-cooked Assamese meals delivered hot.",
    color: "bg-accent/20 text-accent-foreground"
  },
  {
    type: ServiceType.Taxi,
    emoji: "🚕",
    title: "Taxi & Transport",
    desc: "Reliable local taxi and transport throughout Assam.",
    color: "bg-primary/10 text-primary"
  },
  {
    type: ServiceType.EventManagement,
    emoji: "🎪",
    title: "Event Management",
    desc: "Hall bookings and full event coordination services.",
    color: "bg-secondary/15 text-secondary"
  },
  {
    type: ServiceType.FuneralServices,
    emoji: "🕯️",
    title: "Funeral Services",
    desc: "Compassionate funeral arrangements and last rites support.",
    color: "bg-muted text-muted-foreground"
  },
  {
    type: ServiceType.WeddingsAnniversaries,
    emoji: "💒",
    title: "Weddings & Anniversaries",
    desc: "Wedding planning, venue selection and anniversary events.",
    color: "bg-accent/20 text-accent-foreground"
  },
  {
    type: ServiceType.Gifting,
    emoji: "🎁",
    title: "Gifting",
    desc: "Curated Assamese gift boxes delivered to your loved ones.",
    color: "bg-primary/10 text-primary"
  },
  {
    type: ServiceType.VideoConferencing,
    emoji: "📹",
    title: "Video Conferencing",
    desc: "Live video connectivity for rural and remote Assam areas.",
    color: "bg-secondary/15 text-secondary"
  },
  {
    type: ServiceType.SchoolAdmissions,
    emoji: "🎓",
    title: "School/College Admissions",
    desc: "Guidance, documentation and admission support in Assam.",
    color: "bg-accent/20 text-accent-foreground"
  },
  {
    type: ServiceType.Tourism,
    emoji: "🏔️",
    title: "Tourism",
    desc: "Authentic Assam travel packages, guides and homestays.",
    color: "bg-primary/10 text-primary"
  },
  {
    type: ServiceType.Other,
    emoji: "🤝",
    title: "Community Help",
    desc: "Other community needs — describe what you require.",
    color: "bg-secondary/15 text-secondary"
  }
];
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
const BLANK_FORM = {
  userName: "",
  userPhone: "",
  preferredDate: "",
  preferredTime: "",
  description: "",
  isRequestForSelf: true,
  recipientName: "",
  recipientPhone: "",
  recipientAddress: ""
};
function ServicesPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [bookingService, setBookingService] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(BLANK_FORM);
  const [errors, setErrors] = reactExports.useState({});
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [backendError, setBackendError] = reactExports.useState(null);
  const [successRequest, setSuccessRequest] = reactExports.useState(null);
  const [successService, setSuccessService] = reactExports.useState("");
  const [successRecipientName, setSuccessRecipientName] = reactExports.useState("");
  const openBooking = (svc) => {
    setBookingService(svc);
    setForm(BLANK_FORM);
    setErrors({});
    setBackendError(null);
  };
  const closeBooking = () => {
    setBookingService(null);
  };
  const validate = () => {
    const e = {};
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
  const handleSubmit = async () => {
    if (!validate() || !bookingService || !actor) return;
    setSubmitting(true);
    setBackendError(null);
    try {
      const input = {
        userName: form.userName.trim(),
        userPhone: form.userPhone.trim(),
        serviceType: bookingService.type,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        description: form.description.trim(),
        isRequestForSelf: form.isRequestForSelf,
        recipientName: form.isRequestForSelf ? void 0 : form.recipientName.trim() || void 0,
        recipientPhone: form.isRequestForSelf ? void 0 : form.recipientPhone.trim() || void 0,
        recipientAddress: form.isRequestForSelf || !form.recipientAddress.trim() ? void 0 : form.recipientAddress.trim()
      };
      const result = await actor.submitServiceRequest(input);
      setSuccessRequest(result);
      setSuccessService(bookingService.title);
      setSuccessRecipientName(
        form.isRequestForSelf ? "" : form.recipientName.trim()
      );
      setBookingService(null);
    } catch (_err) {
      setBackendError("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const fieldError = (key) => errors[key] ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: errors[key] }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 pb-24", "data-ocid": "services-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black text-foreground tracking-tight", children: "Assam Community Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Local services for the people of Assam" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 bg-primary/8 border border-primary/25 rounded-xl px-4 py-3 mb-5",
          role: "note",
          "data-ocid": "services-global-banner",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 18, className: "text-primary flex-none mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Available worldwide — fulfilled within Assam" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: "All services are physically carried out within Assam. You can request a service from anywhere in the world for someone in Assam." })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: SERVICES.map((svc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-3 transition-smooth hover:border-primary/30 hover:shadow-sm",
          "data-ocid": `service-card-${svc.type.toLowerCase()}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-none ${svc.color}`,
                  "aria-hidden": "true",
                  children: svc.emoji
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground leading-tight", children: svc.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2", children: svc.desc })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "w-full h-9 text-xs font-semibold btn-primary border-0",
                disabled: actorFetching,
                onClick: () => openBooking(svc),
                "data-ocid": `service-book-${svc.type.toLowerCase()}`,
                children: "Request Service"
              }
            )
          ]
        },
        svc.type
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!bookingService,
        onOpenChange: (o) => !o && closeBooking(),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm max-h-[92vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: bookingService == null ? void 0 : bookingService.emoji }),
            bookingService == null ? void 0 : bookingService.title
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-primary/8 border border-primary/20 rounded-lg px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 13, className: "text-primary flex-none mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "This service will be carried out within Assam. You can book from anywhere in the world." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-lg px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Service Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: bookingService == null ? void 0 : bookingService.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "svc-name", className: "text-xs font-semibold", children: "Your Full Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "svc-name",
                  value: form.userName,
                  onChange: (e) => setForm((p) => ({ ...p, userName: e.target.value })),
                  placeholder: "Your full name",
                  className: "h-9 text-sm",
                  "data-ocid": "service-form-name"
                }
              ),
              fieldError("userName")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "svc-phone", className: "text-xs font-semibold", children: "Your Phone Number *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground bg-muted border border-input rounded-md px-3 h-9 flex items-center", children: "+91" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "svc-phone",
                    type: "tel",
                    value: form.userPhone,
                    onChange: (e) => setForm((p) => ({ ...p, userPhone: e.target.value })),
                    placeholder: "10-digit mobile number",
                    className: "h-9 text-sm flex-1",
                    maxLength: 10,
                    "data-ocid": "service-form-phone"
                  }
                )
              ] }),
              fieldError("userPhone")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "svc-date", className: "text-xs font-semibold", children: "Preferred Date *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "svc-date",
                    type: "date",
                    min: todayStr(),
                    value: form.preferredDate,
                    onChange: (e) => setForm((p) => ({ ...p, preferredDate: e.target.value })),
                    className: "h-9 text-sm",
                    "data-ocid": "service-form-date"
                  }
                ),
                fieldError("preferredDate")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "svc-time", className: "text-xs font-semibold", children: "Preferred Time *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "svc-time",
                    type: "time",
                    value: form.preferredTime,
                    onChange: (e) => setForm((p) => ({ ...p, preferredTime: e.target.value })),
                    className: "h-9 text-sm",
                    "data-ocid": "service-form-time"
                  }
                ),
                fieldError("preferredTime")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "svc-description",
                  className: "text-xs font-semibold",
                  children: "Describe What You Need *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "svc-description",
                  value: form.description,
                  onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
                  placeholder: "Describe what you need in detail…",
                  className: "text-sm resize-none",
                  rows: 3,
                  "data-ocid": "service-form-description"
                }
              ),
              fieldError("description")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-xl p-3 space-y-3 bg-muted/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    id: "svc-for-others",
                    checked: !form.isRequestForSelf,
                    onCheckedChange: (checked) => setForm((p) => ({
                      ...p,
                      isRequestForSelf: !checked,
                      recipientName: "",
                      recipientPhone: "",
                      recipientAddress: ""
                    })),
                    "data-ocid": "service-form-for-others"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "svc-for-others",
                    className: "text-xs font-semibold leading-tight cursor-pointer",
                    children: [
                      "I am requesting this service for someone else in Assam",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs font-normal text-muted-foreground mt-0.5", children: "Tick this if you're outside Assam and want to help someone there" })
                    ]
                  }
                )
              ] }),
              !form.isRequestForSelf && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-1 border-t border-border/60", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-primary flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "👤" }),
                  " Service Recipient Details"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "svc-recipient-name",
                      className: "text-xs font-semibold",
                      children: "Recipient Full Name *"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "svc-recipient-name",
                      value: form.recipientName,
                      onChange: (e) => setForm((p) => ({
                        ...p,
                        recipientName: e.target.value
                      })),
                      placeholder: "Name of the person in Assam",
                      className: "h-9 text-sm",
                      "data-ocid": "service-form-recipient-name"
                    }
                  ),
                  fieldError("recipientName")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "svc-recipient-phone",
                      className: "text-xs font-semibold",
                      children: "Recipient Phone Number *"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground bg-muted border border-input rounded-md px-3 h-9 flex items-center", children: "+91" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "svc-recipient-phone",
                        type: "tel",
                        value: form.recipientPhone,
                        onChange: (e) => setForm((p) => ({
                          ...p,
                          recipientPhone: e.target.value
                        })),
                        placeholder: "10-digit mobile number",
                        className: "h-9 text-sm flex-1",
                        maxLength: 10,
                        "data-ocid": "service-form-recipient-phone"
                      }
                    )
                  ] }),
                  fieldError("recipientPhone")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "svc-recipient-address",
                      className: "text-xs font-semibold",
                      children: [
                        "Recipient Address in Assam",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground", children: "(optional)" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "svc-recipient-address",
                      value: form.recipientAddress,
                      onChange: (e) => setForm((p) => ({
                        ...p,
                        recipientAddress: e.target.value
                      })),
                      placeholder: "Street, village, town, district in Assam…",
                      className: "text-sm resize-none",
                      rows: 2,
                      "data-ocid": "service-form-recipient-address"
                    }
                  )
                ] })
              ] })
            ] }),
            backendError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  size: 14,
                  className: "text-destructive flex-none"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: backendError })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: closeBooking,
                disabled: submitting,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: handleSubmit,
                className: "btn-primary border-0",
                disabled: submitting || !actor,
                "data-ocid": "service-form-submit",
                children: submitting ? "Submitting…" : "Submit Request"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!successRequest,
        onOpenChange: (o) => !o && setSuccessRequest(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 36, className: "text-secondary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-black text-foreground mb-1", children: "Request Submitted!" }),
              successRecipientName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
                "Your request for",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: successRecipientName }),
                " ",
                "has been submitted. Our team will contact them in Assam shortly."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Your service request has been submitted. Our team will contact you shortly." })
            ] }),
            successRequest && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-muted/50 rounded-xl p-4 space-y-2 text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Reference #" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary", children: [
                  "SR-",
                  successRequest.id.toString().padStart(4, "0")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Service" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: successService })
              ] }),
              successRecipientName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Recipient" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: successRecipientName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Submitted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: new Date(
                  Number(successRequest.submittedAt) / 1e6
                ).toLocaleDateString("en-IN") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] bg-primary/10 text-primary border-0 px-2 py-0.5 h-auto", children: "New" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: () => setSuccessRequest(null),
              className: "w-full btn-primary border-0",
              "data-ocid": "service-success-done",
              children: "Done"
            }
          )
        ] })
      }
    )
  ] });
}
export {
  ServicesPage as default
};
