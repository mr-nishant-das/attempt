import { createActor } from "@/backend";
import { Variant_reject_approve } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useSearch } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ActionState = "idle" | "loading" | "success" | "error";

export default function VendorActionPage() {
  const search = useSearch({ from: "/vendor-action" });
  const action = (search as Record<string, string>).action ?? "";
  const token = (search as Record<string, string>).token ?? "";

  const { actor, isFetching } = useActor(createActor);

  const [state, setState] = useState<ActionState>("idle");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  const isApprove = action === "approve";
  const isValidAction = action === "approve" || action === "reject";

  useEffect(() => {
    if (hasRun.current) return;

    if (!isValidAction || !token) {
      hasRun.current = true;
      setState("error");
      setMessage(
        "Invalid or missing action link. Please check the email and try again.",
      );
      return;
    }

    if (isFetching || !actor) return;

    hasRun.current = true;
    setState("loading");

    const variantAction = isApprove
      ? Variant_reject_approve.approve
      : Variant_reject_approve.reject;

    actor
      .processVendorActionToken(token, variantAction)
      .then((result) => {
        if (result.__kind__ === "ok") {
          setState("success");
          setMessage(
            `Vendor has been ${isApprove ? "approved" : "rejected"} successfully.`,
          );
        } else {
          setState("error");
          setMessage(result.err ?? "An unexpected error occurred.");
        }
      })
      .catch((err: unknown) => {
        setState("error");
        setMessage(
          err instanceof Error ? err.message : "An unexpected error occurred.",
        );
      });
  }, [actor, isFetching, isApprove, isValidAction, token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-5">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <span className="text-2xl font-bold tracking-tight text-primary">
            AssamRoots
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Vendor Management
          </span>
        </div>

        {/* Status icon + message */}
        {(state === "idle" || state === "loading") && (
          <div
            className="flex flex-col items-center gap-3"
            data-ocid="vendor-action.loading_state"
          >
            <Loader2
              size={44}
              className="text-primary animate-spin"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {isFetching ? "Connecting to backend…" : "Processing request…"}
            </p>
          </div>
        )}

        {state === "success" && (
          <div
            className="flex flex-col items-center gap-3"
            data-ocid="vendor-action.success_state"
          >
            <CheckCircle2
              size={52}
              className="text-emerald-500"
              aria-hidden="true"
            />
            <p className="text-base font-semibold text-foreground">{message}</p>
            <p className="text-xs text-muted-foreground">
              You may close this tab.
            </p>
          </div>
        )}

        {state === "error" && (
          <div
            className="flex flex-col items-center gap-3"
            data-ocid="vendor-action.error_state"
          >
            <AlertCircle
              size={52}
              className="text-destructive"
              aria-hidden="true"
            />
            <p className="text-base font-semibold text-destructive">
              Action Failed
            </p>
            <p className="text-sm text-muted-foreground break-words">
              {message}
            </p>
            <p className="text-xs text-muted-foreground">
              If this keeps happening, please contact support or use the admin
              panel to manage vendors directly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
