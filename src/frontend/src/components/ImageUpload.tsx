import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

type UploadState =
  | { kind: "idle" }
  | { kind: "uploading"; progress: number }
  | { kind: "error"; message: string };

export function ImageUpload({
  value,
  onChange,
  label = "Product Image",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>({ kind: "idle" });
  const [urlMode, setUrlMode] = useState(false);
  const { uploadFile } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadState({
        kind: "error",
        message: "Please select an image file (JPG, PNG, WEBP, etc.).",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadState({
        kind: "error",
        message: "Image must be smaller than 10 MB.",
      });
      return;
    }

    setUploadState({ kind: "uploading", progress: 0 });

    try {
      const url = await uploadFile(file, (pct) => {
        setUploadState({ kind: "uploading", progress: Math.round(pct) });
      });
      onChange(url);
      setUploadState({ kind: "idle" });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadState({ kind: "error", message: msg });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isUploading = uploadState.kind === "uploading";
  const hasError = uploadState.kind === "error";
  const progress = uploadState.kind === "uploading" ? uploadState.progress : 0;

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold">{label}</Label>

      {/* Image preview */}
      {value && (
        <div className="relative w-full h-36 rounded-lg overflow-hidden border border-border bg-muted">
          <img
            src={value}
            alt="Product preview"
            className="w-full h-full object-cover"
            data-ocid="admin-image-preview"
          />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/90 border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
            data-ocid="admin-image-remove"
          >
            <X size={12} className="text-foreground" />
          </button>
        </div>
      )}

      {/* Upload drop zone */}
      {!value && !isUploading && !urlMode && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary"
          data-ocid="admin-image-dropzone"
        >
          <UploadCloud size={22} />
          <span className="text-xs font-medium">Click to upload image</span>
          <span className="text-[10px] opacity-60">
            JPG, PNG, WEBP · max 10 MB
          </span>
        </button>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div
          className="w-full h-24 rounded-lg border border-border bg-muted/30 flex flex-col items-center justify-center gap-2"
          data-ocid="admin-image-loading_state"
        >
          <Loader2 size={20} className="animate-spin text-primary" />
          <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Uploading… {progress}%
          </span>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div
          className="flex items-start gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20"
          data-ocid="admin-image-error_state"
        >
          <ImageIcon size={14} className="text-destructive flex-none mt-0.5" />
          <p className="text-xs text-destructive flex-1">
            {uploadState.kind === "error" ? uploadState.message : ""}
          </p>
          <button
            type="button"
            onClick={() => setUploadState({ kind: "idle" })}
            className="text-destructive/60 hover:text-destructive transition-colors"
            aria-label="Dismiss error"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Toggle URL mode / upload button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setUrlMode((p) => !p);
            setUploadState({ kind: "idle" });
          }}
          className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
          data-ocid="admin-image-toggle-url"
        >
          {urlMode ? "← Back to upload" : "Or paste a URL instead"}
        </button>

        {!value && !isUploading && !urlMode && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5 ml-auto"
            onClick={() => fileInputRef.current?.click()}
            data-ocid="admin-image-upload_button"
          >
            <UploadCloud size={12} />
            Choose Image
          </Button>
        )}
      </div>

      {/* URL text input fallback */}
      {urlMode && (
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/product-image.jpg"
          className="h-9 text-sm"
          data-ocid="admin-image-url-input"
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="Upload product image"
        data-ocid="admin-image-file-input"
      />
    </div>
  );
}
