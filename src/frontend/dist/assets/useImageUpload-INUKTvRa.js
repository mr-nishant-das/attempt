const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/backend-Dxpf4-N4.js","assets/index-CstiQ4sz.js","assets/index-BmSsoijD.css"])))=>i.map(i=>d[i]);
import { am as loadConfig, r as reactExports, an as __vitePreload, aj as createActorWithConfig, ao as InternetIdentityProvider, c as useInternetIdentity } from "./index-CstiQ4sz.js";
import { u as useActor } from "./createLucideIcon-ByrRp2U0.js";
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  InternetIdentityProvider,
  createActorWithConfig,
  loadConfig,
  useActor,
  useInternetIdentity
}, Symbol.toStringTag, { value: "Module" }));
let cachedUploadFile = null;
async function getUploadFile() {
  if (cachedUploadFile) return cachedUploadFile;
  await createActorWithConfig(
    (_canisterId, uploadFile) => {
      cachedUploadFile = uploadFile;
      return {};
    }
  );
  if (!cachedUploadFile) throw new Error("Failed to initialise upload client");
  return cachedUploadFile;
}
function useImageUpload() {
  const uploadFile = reactExports.useCallback(
    async (file, onProgress) => {
      const upload = await getUploadFile();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { ExternalBlob } = await __vitePreload(async () => {
        const { ExternalBlob: ExternalBlob2 } = await import("./backend-Dxpf4-N4.js");
        return { ExternalBlob: ExternalBlob2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const blob = ExternalBlob.fromBytes(bytes);
      if (onProgress) blob.withUploadProgress(onProgress);
      const resultBytes = await upload(blob);
      const hashWithPrefix = new TextDecoder().decode(resultBytes);
      const CAF_SENTINEL = "!caf!";
      const hash = hashWithPrefix.startsWith(CAF_SENTINEL) ? hashWithPrefix.slice(CAF_SENTINEL.length) : hashWithPrefix;
      const { loadConfig: loadConfig2 } = await __vitePreload(async () => {
        const { loadConfig: loadConfig3 } = await Promise.resolve().then(() => index);
        return { loadConfig: loadConfig3 };
      }, true ? void 0 : void 0);
      const config = await loadConfig2();
      const GATEWAY_VERSION = "v1";
      return `${config.storage_gateway_url}/${GATEWAY_VERSION}/blob/?blob_hash=${encodeURIComponent(hash)}&owner_id=${encodeURIComponent(config.backend_canister_id)}&project_id=${encodeURIComponent(config.project_id)}`;
    },
    []
  );
  return { uploadFile };
}
export {
  useImageUpload as u
};
