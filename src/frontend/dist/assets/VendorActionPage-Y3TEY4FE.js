import { b as useSearch, r as reactExports, j as jsxRuntimeExports } from "./index-CstiQ4sz.js";
import { Variant_reject_approve, createActor } from "./backend-Dxpf4-N4.js";
import { c as createLucideIcon, u as useActor } from "./createLucideIcon-ByrRp2U0.js";
import { L as LoaderCircle } from "./loader-circle-CUtHoZGF.js";
import { C as CircleCheck } from "./circle-check-DYqL9Alt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
function VendorActionPage() {
  const search = useSearch({ from: "/vendor-action" });
  const action = search.action ?? "";
  const token = search.token ?? "";
  const { actor, isFetching } = useActor(createActor);
  const [state, setState] = reactExports.useState("idle");
  const [message, setMessage] = reactExports.useState("");
  const hasRun = reactExports.useRef(false);
  const isApprove = action === "approve";
  const isValidAction = action === "approve" || action === "reject";
  reactExports.useEffect(() => {
    if (hasRun.current) return;
    if (!isValidAction || !token) {
      hasRun.current = true;
      setState("error");
      setMessage(
        "Invalid or missing action link. Please check the email and try again."
      );
      return;
    }
    if (isFetching || !actor) return;
    hasRun.current = true;
    setState("loading");
    const variantAction = isApprove ? Variant_reject_approve.approve : Variant_reject_approve.reject;
    actor.processVendorActionToken(token, variantAction).then((result) => {
      if (result.__kind__ === "ok") {
        setState("success");
        setMessage(
          `Vendor has been ${isApprove ? "approved" : "rejected"} successfully.`
        );
      } else {
        setState("error");
        setMessage(result.err ?? "An unexpected error occurred.");
      }
    }).catch((err) => {
      setState("error");
      setMessage(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    });
  }, [actor, isFetching, isApprove, isValidAction, token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold tracking-tight text-primary", children: "AssamRoots" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-widest", children: "Vendor Management" })
    ] }),
    (state === "idle" || state === "loading") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-3",
        "data-ocid": "vendor-action.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            LoaderCircle,
            {
              size: 44,
              className: "text-primary animate-spin",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isFetching ? "Connecting to backend…" : "Processing request…" })
        ]
      }
    ),
    state === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-3",
        "data-ocid": "vendor-action.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CircleCheck,
            {
              size: 52,
              className: "text-emerald-500",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: message }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "You may close this tab." })
        ]
      }
    ),
    state === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-3",
        "data-ocid": "vendor-action.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CircleAlert,
            {
              size: 52,
              className: "text-destructive",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-destructive", children: "Action Failed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground break-words", children: message }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "If this keeps happening, please contact support or use the admin panel to manage vendors directly." })
        ]
      }
    )
  ] }) });
}
export {
  VendorActionPage as default
};
