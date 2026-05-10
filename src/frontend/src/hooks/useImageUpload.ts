import type { ExternalBlob } from "@/backend";
import { createActorWithConfig } from "@caffeineai/core-infrastructure";
import { useCallback } from "react";

type UploadFileFn = (file: ExternalBlob) => Promise<Uint8Array>;

// Lazily initialised — created once, reused on subsequent calls.
let cachedUploadFile: UploadFileFn | null = null;

/**
 * Resolves the uploadFile function from the object-storage layer by using
 * createActorWithConfig with a capturing factory function.  The factory never
 * actually builds a real actor; it just grabs uploadFile out of the closure.
 */
async function getUploadFile(): Promise<UploadFileFn> {
  if (cachedUploadFile) return cachedUploadFile;

  await createActorWithConfig(
    (_canisterId: string, uploadFile: UploadFileFn) => {
      cachedUploadFile = uploadFile;
      // Return a dummy — the actor is never used
      return {} as unknown as ReturnType<typeof createActorWithConfig>;
    },
  );

  if (!cachedUploadFile) throw new Error("Failed to initialise upload client");
  return cachedUploadFile;
}

export interface UseImageUploadResult {
  uploadFile: (
    file: File,
    onProgress?: (pct: number) => void,
  ) => Promise<string>;
}

/**
 * Returns a stable `uploadFile` function that uploads a File to the
 * Caffeine object-storage and returns a public direct URL.
 */
export function useImageUpload(): UseImageUploadResult {
  const uploadFile = useCallback(
    async (file: File, onProgress?: (pct: number) => void): Promise<string> => {
      const upload = await getUploadFile();
      const bytes = new Uint8Array(await file.arrayBuffer());

      // ExternalBlob is imported from the local backend.ts (auto-generated)
      // We construct it using the static fromBytes factory
      const { ExternalBlob } = await import("@/backend");
      const blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) blob.withUploadProgress(onProgress);

      const resultBytes = await upload(blob);
      // resultBytes is "!caf!<hash>" encoded as UTF-8
      const hashWithPrefix = new TextDecoder().decode(resultBytes);
      const CAF_SENTINEL = "!caf!";
      const hash = hashWithPrefix.startsWith(CAF_SENTINEL)
        ? hashWithPrefix.slice(CAF_SENTINEL.length)
        : hashWithPrefix;

      // Build the direct URL using the same pattern as StorageClient.getDirectURL
      const { loadConfig } = await import("@caffeineai/core-infrastructure");
      const config = await loadConfig();
      const GATEWAY_VERSION = "v1";
      return `${config.storage_gateway_url}/${GATEWAY_VERSION}/blob/?blob_hash=${encodeURIComponent(hash)}&owner_id=${encodeURIComponent(config.backend_canister_id)}&project_id=${encodeURIComponent(config.project_id)}`;
    },
    [],
  );

  return { uploadFile };
}
