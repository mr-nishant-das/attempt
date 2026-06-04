import { r as reactExports, j as jsxRuntimeExports, e as ue, k as useQueryClient, S as Skeleton } from "./index-CstiQ4sz.js";
import { ServiceRequestStatus, Variant_pending_approved_rejected, ServiceType, createActor } from "./backend-Dxpf4-N4.js";
import { B as Button } from "./button-T7X4xHPX.js";
import { L as Label, I as Input } from "./label-3F1HN_us.js";
import { u as useImageUpload } from "./useImageUpload-INUKTvRa.js";
import { X, L as Layout, H as House } from "./Layout-BaVl6Ee_.js";
import { c as createLucideIcon, u as useActor, a as useQuery } from "./createLucideIcon-ByrRp2U0.js";
import { L as LoaderCircle } from "./loader-circle-CUtHoZGF.js";
import { I as Image, C as ChevronUp } from "./image-D83V5NNz.js";
import { B as Badge } from "./badge-COIfXMhJ.js";
import { G as Globe, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-B8KzOkom.js";
import { r as useAdminHeroBanners, s as useAdminFeaturedBlocks, i as useSiteSettings, t as useSaveSiteSettings, e as useFooterSettings, g as useReviews } from "./useQueries-CA65lisC.js";
import { f as formatPrice, d as discountedPrice } from "./types-_UKd8--C.js";
import { L as LogOut } from "./log-out-BMJ7Yvti.js";
import { S as ShieldCheck } from "./shield-check-CLlROwmg.js";
import { P as Package } from "./package-B99SaNTR.js";
import { S as ShoppingBag } from "./shopping-bag-D9TtHJ4I.js";
import { P as Plus } from "./plus-BmxuJhdF.js";
import { T as Trash2 } from "./trash-2-Bx-_1ZeS.js";
import { S as Star } from "./star-185lLld2.js";
import { C as CircleX } from "./circle-x-Bt1znnOM.js";
import "./index-DbvNitIR.js";
import "./index-h3cuVvEG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = createLucideIcon("bell", __iconNode$f);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$e);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "M9 9h.01", key: "1q5me6" }],
  ["path", { d: "M15 15h.01", key: "lqbp3k" }]
];
const CirclePercent = createLucideIcon("circle-percent", __iconNode$d);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", key: "1pljnt" }],
  ["path", { d: "m8 17 4-4 4 4", key: "1quai1" }]
];
const CloudUpload = createLucideIcon("cloud-upload", __iconNode$c);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  [
    "path",
    {
      d: "M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
      key: "hod4my"
    }
  ],
  [
    "path",
    {
      d: "M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
      key: "w4yl2u"
    }
  ],
  ["path", { d: "M3 5a2 2 0 0 0 2 2h3", key: "f2jnh7" }],
  ["path", { d: "M3 3v13a2 2 0 0 0 2 2h3", key: "k8epm1" }]
];
const FolderTree = createLucideIcon("folder-tree", __iconNode$b);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode$a);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
];
const LayoutGrid = createLucideIcon("layout-grid", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["path", { d: "m14.622 17.897-10.68-2.913", key: "vj2p1u" }],
  [
    "path",
    {
      d: "M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z",
      key: "18tc5c"
    }
  ],
  [
    "path",
    {
      d: "M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15",
      key: "ytzfxy"
    }
  ]
];
const Paintbrush = createLucideIcon("paintbrush", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11", key: "pb2vm6" }],
  [
    "path",
    {
      d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z",
      key: "doq5xv"
    }
  ],
  ["path", { d: "M6 13h12", key: "yf64js" }],
  ["path", { d: "M6 17h12", key: "1jwigz" }]
];
const Warehouse = createLucideIcon("warehouse", __iconNode);
function ImageUpload({
  value,
  onChange,
  label = "Product Image"
}) {
  const fileInputRef = reactExports.useRef(null);
  const [uploadState, setUploadState] = reactExports.useState({ kind: "idle" });
  const [urlMode, setUrlMode] = reactExports.useState(false);
  const { uploadFile } = useImageUpload();
  const handleFileChange = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadState({
        kind: "error",
        message: "Please select an image file (JPG, PNG, WEBP, etc.)."
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadState({
        kind: "error",
        message: "Image must be smaller than 10 MB."
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
      const msg = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadState({ kind: "error", message: msg });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const isUploading = uploadState.kind === "uploading";
  const hasError = uploadState.kind === "error";
  const progress = uploadState.kind === "uploading" ? uploadState.progress : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: label }),
    value && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-36 rounded-lg overflow-hidden border border-border bg-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: value,
          alt: "Product preview",
          className: "w-full h-full object-cover",
          "data-ocid": "admin-image-preview"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Remove image",
          onClick: () => onChange(""),
          className: "absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/90 border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/30 transition-colors",
          "data-ocid": "admin-image-remove",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12, className: "text-foreground" })
        }
      )
    ] }),
    !value && !isUploading && !urlMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => {
          var _a;
          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
        },
        className: "w-full h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary",
        "data-ocid": "admin-image-dropzone",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { size: 22 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Click to upload image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-60", children: "JPG, PNG, WEBP · max 10 MB" })
        ]
      }
    ),
    isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "w-full h-24 rounded-lg border border-border bg-muted/30 flex flex-col items-center justify-center gap-2",
        "data-ocid": "admin-image-loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 20, className: "animate-spin text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-primary rounded-full transition-all duration-300",
              style: { width: `${progress}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Uploading… ",
            progress,
            "%"
          ] })
        ]
      }
    ),
    hasError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20",
        "data-ocid": "admin-image-error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 14, className: "text-destructive flex-none mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive flex-1", children: uploadState.kind === "error" ? uploadState.message : "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setUploadState({ kind: "idle" }),
              className: "text-destructive/60 hover:text-destructive transition-colors",
              "aria-label": "Dismiss error",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setUrlMode((p) => !p);
            setUploadState({ kind: "idle" });
          },
          className: "text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors",
          "data-ocid": "admin-image-toggle-url",
          children: urlMode ? "← Back to upload" : "Or paste a URL instead"
        }
      ),
      !value && !isUploading && !urlMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          className: "h-7 text-xs gap-1.5 ml-auto",
          onClick: () => {
            var _a;
            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
          },
          "data-ocid": "admin-image-upload_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { size: 12 }),
            "Choose Image"
          ]
        }
      )
    ] }),
    urlMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        type: "url",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder: "https://example.com/product-image.jpg",
        className: "h-9 text-sm",
        "data-ocid": "admin-image-url-input"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        className: "sr-only",
        onChange: handleFileChange,
        "aria-label": "Upload product image",
        "data-ocid": "admin-image-file-input"
      }
    )
  ] });
}
const BLANK_PRODUCT = {
  title: "",
  description: "",
  price: "",
  discountPercent: "0",
  category: "1",
  subCategory: "",
  brand: "",
  imageUrl: "",
  stock: "0",
  tags: ""
};
const BLANK_CATEGORY = {
  name: "",
  slug: "",
  description: "",
  imageUrl: ""
};
const BLANK_SUBCATEGORY = { name: "", imageUrl: "" };
const SESSION_KEY = "adminSessionToken";
const SESSION_TS_KEY = "adminSessionTs";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1e3;
function isSessionValid() {
  const token = localStorage.getItem(SESSION_KEY);
  const ts = localStorage.getItem(SESSION_TS_KEY);
  if (!token || !ts) return false;
  const elapsed = Date.now() - Number(ts);
  return elapsed < SESSION_DURATION_MS;
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_TS_KEY);
}
function createSession(token) {
  localStorage.setItem(SESSION_KEY, token);
  localStorage.setItem(SESSION_TS_KEY, String(Date.now()));
}
function AdminLoginForm({ onSuccess }) {
  const [step, setStep] = reactExports.useState("key");
  const [secretKey, setSecretKey] = reactExports.useState("");
  const [otp, setOtp] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const { actor } = useActor(createActor);
  const handleKeySubmit = reactExports.useCallback(
    async (e) => {
      e.preventDefault();
      if (!secretKey.trim()) {
        setError("Please enter the Admin Secret Key.");
        return;
      }
      if (!actor) {
        setError("Connecting to backend… please wait.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await actor.adminVerifyKey(secretKey.trim());
        if ("ok" in res) {
          await actor.adminRequestOtp();
          setStep("otp");
        } else {
          setError(res.err ?? "Invalid key. Please try again.");
        }
      } catch {
        setError("Authentication error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [secretKey, actor]
  );
  const handleOtpSubmit = reactExports.useCallback(
    async (e) => {
      e.preventDefault();
      if (!otp.trim() || otp.length < 6) {
        setError("Please enter the 6-digit verification code.");
        return;
      }
      if (!actor) return;
      setLoading(true);
      setError("");
      try {
        const res = await actor.adminVerifyOtp(otp.trim());
        if ("ok" in res) {
          createSession(res.ok);
          onSuccess();
        } else {
          setError(res.err ?? "Invalid code. Please try again.");
        }
      } catch {
        setError("Verification error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [otp, actor, onSuccess]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-elevated p-8 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 28, className: "text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Admin Access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: step === "key" ? "Enter your admin secret key to continue" : "Verify your identity" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-2 h-2 rounded-full ${step === "key" ? "bg-primary" : "bg-primary/40"}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-8 h-0.5 ${step === "otp" ? "bg-primary" : "bg-border"}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-2 h-2 rounded-full ${step === "otp" ? "bg-primary" : "bg-border"}`
        }
      )
    ] }),
    step === "key" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleKeySubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "admin-secret-key",
            className: "text-sm font-semibold",
            children: "Admin Secret Key"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            KeyRound,
            {
              size: 15,
              className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "admin-secret-key",
              type: "password",
              value: secretKey,
              onChange: (e) => setSecretKey(e.target.value),
              placeholder: "Enter secret key",
              autoComplete: "current-password",
              className: "h-12 pl-10 text-base",
              "data-ocid": "admin.login.secretkey_input",
              autoFocus: true,
              required: true
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2",
          "data-ocid": "admin.login.error_state",
          children: error
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          className: "btn-primary border-0 w-full h-11 text-sm font-semibold",
          disabled: loading,
          "data-ocid": "admin.login.submit_button",
          children: loading ? "Verifying…" : "Continue"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleOtpSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/5 border border-primary/15 rounded-xl p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
        "A 6-digit verification code has been sent to",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "assamshop@assamroots.shop" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "admin-otp", className: "text-sm font-semibold", children: "Verification Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "admin-otp",
            type: "text",
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: 6,
            value: otp,
            onChange: (e) => setOtp(e.target.value.replace(/\D/g, "")),
            placeholder: "000000",
            className: "h-12 text-center text-xl tracking-[0.5em] font-mono",
            "data-ocid": "admin.login.otp_input",
            autoFocus: true,
            required: true
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2",
          "data-ocid": "admin.login.otp_error_state",
          children: error
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          className: "btn-primary border-0 w-full h-11 text-sm font-semibold",
          disabled: loading || otp.length < 6,
          "data-ocid": "admin.login.otp_submit_button",
          children: loading ? "Verifying…" : "Sign In"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "w-full text-xs text-muted-foreground hover:text-foreground transition-colors",
          onClick: () => {
            setStep("key");
            setOtp("");
            setError("");
          },
          "data-ocid": "admin.login.back_button",
          children: "← Back to key entry"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-center text-muted-foreground", children: "Session expires automatically after 30 minutes of inactivity." })
  ] }) }) });
}
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
function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  max
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
        min,
        max,
        className: "h-9 text-sm",
        "data-ocid": `admin.field.${id}`
      }
    )
  ] });
}
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
    stock: p.stock.toString(),
    tags: p.tags.join(", ")
  };
}
function formToProductInput(form) {
  return {
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
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    stock: BigInt(Math.max(0, Number.parseInt(form.stock) || 0)),
    rating: 0n,
    reviewCount: 0n
  };
}
function categoryToForm(c) {
  return {
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl
  };
}
const TABS = [
  { id: "homepage", label: "Homepage", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 13 }) },
  { id: "herobanners", label: "Slideshow", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 13 }) },
  { id: "featuredblocks", label: "Stories", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 13 }) },
  { id: "video", label: "Video", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 13 }) },
  { id: "products", label: "Products", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 13 }) },
  { id: "categories", label: "Categories", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { size: 13 }) },
  { id: "subcategories", label: "Sub-Cats", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 13 }) },
  { id: "services", label: "Services", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 13 }) },
  { id: "inventory", label: "Inventory", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Warehouse, { size: 13 }) },
  { id: "discounts", label: "Discounts", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePercent, { size: 13 }) },
  { id: "branding", label: "Branding", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Paintbrush, { size: 13 }) },
  { id: "footer", label: "Footer", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 13 }) },
  { id: "vendors", label: "Vendors", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 13 }) },
  {
    id: "vendorproducts",
    label: "Vendor Products",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { size: 13 })
  }
];
function VendorProductsPanel() {
  var _a, _b;
  const { actor } = useActor(createActor);
  const [products, setProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [selectedVendorId, setSelectedVendorId] = reactExports.useState(null);
  const [taxInputs, setTaxInputs] = reactExports.useState({});
  const [rejectReasons, setRejectReasons] = reactExports.useState(
    {}
  );
  const [showRejectInput, setShowRejectInput] = reactExports.useState({});
  const [actionLoading, setActionLoading] = reactExports.useState(
    {}
  );
  const sessionKey = localStorage.getItem(SESSION_KEY) ?? "";
  const loadProducts = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError(null);
    try {
      const res = await actor.adminListVendorProducts(sessionKey);
      setProducts(res);
    } catch (_e) {
      setError("Failed to load vendor products");
    } finally {
      setLoading(false);
    }
  }, [actor, sessionKey]);
  reactExports.useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  const grouped = products.reduce(
    (acc, p) => {
      const key = p.vendorId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(p);
      return acc;
    },
    {}
  );
  const doAction = async (key, fn) => {
    setActionLoading((p) => ({ ...p, [key]: true }));
    try {
      const res = await fn();
      if ("ok" in res) {
        ue.success("Action completed");
        await loadProducts();
      } else {
        ue.error(res.err ?? "Action failed");
        if (res.err === "Unauthorized") {
          clearSession();
          window.location.reload();
        }
      }
    } catch {
      ue.error("Action failed");
    } finally {
      setActionLoading((p) => ({ ...p, [key]: false }));
    }
  };
  if (selectedVendorId) {
    const vendorProducts = products.filter(
      (p) => p.vendorId.toString() === selectedVendorId
    );
    const vendorName = ((_a = vendorProducts[0]) == null ? void 0 : _a.vendorName) ?? "Vendor";
    const vendorEmail = ((_b = vendorProducts[0]) == null ? void 0 : _b.vendorEmail) ?? "";
    const pending = vendorProducts.filter(
      (p) => p.status === Variant_pending_approved_rejected.pending
    );
    const approved = vendorProducts.filter(
      (p) => p.status === Variant_pending_approved_rejected.approved
    );
    const rejected = vendorProducts.filter(
      (p) => p.status === Variant_pending_approved_rejected.rejected
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.vendorproducts.detail", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setSelectedVendorId(null),
          className: "text-xs text-primary hover:underline",
          "data-ocid": "admin.vendorproducts.back_button",
          children: "← Back to all vendors"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PanelHeader,
        {
          title: `Products from ${vendorName}`,
          location: `${vendorEmail} — review, tax, and approve vendor-submitted products`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-foreground mb-3", children: [
          "Pending (",
          pending.length,
          ")"
        ] }),
        pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No pending products." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: pending.map((product) => {
          var _a2;
          const pid = product.id.toString();
          const tax = taxInputs[pid] ?? 0;
          const base = Number(product.basePrice) / 100;
          const final = base * (1 + tax / 100);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-card border border-border rounded-xl p-4 space-y-3",
              "data-ocid": `admin.vendorproducts.item.${pid}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: product.productName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: product.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Category: ",
                      product.category
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Base Price: ₹",
                      base.toFixed(2)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: "Pending" })
                ] }),
                product.imageUrls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: product.imageUrls.slice(0, 3).map((url) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: url,
                    alt: "",
                    className: "w-16 h-16 object-cover rounded"
                  },
                  url
                )) }),
                product.fssaiDocumentUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: product.fssaiDocumentUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-xs text-primary hover:underline",
                    children: "View FSSAI Document"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Tax (%)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      max: 100,
                      value: tax,
                      onChange: (e) => setTaxInputs((p) => ({
                        ...p,
                        [pid]: Number(e.target.value)
                      })),
                      className: "h-8 text-xs w-20",
                      "data-ocid": `admin.vendorproducts.tax_input.${pid}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "Final: ₹",
                    final.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      className: "bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-8 text-xs",
                      disabled: actionLoading[`approve-${pid}`],
                      onClick: () => doAction(
                        `approve-${pid}`,
                        () => actor.adminApproveVendorProduct(
                          sessionKey,
                          product.id,
                          BigInt(tax),
                          null
                        )
                      ),
                      "data-ocid": `admin.vendorproducts.approve_button.${pid}`,
                      children: "Approve"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "destructive",
                      className: "h-8 text-xs",
                      disabled: actionLoading[`reject-${pid}`],
                      onClick: () => setShowRejectInput((p) => ({ ...p, [pid]: !p[pid] })),
                      "data-ocid": `admin.vendorproducts.reject_toggle.${pid}`,
                      children: "Reject"
                    }
                  )
                ] }),
                showRejectInput[pid] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      value: rejectReasons[pid] ?? "",
                      onChange: (e) => setRejectReasons((p) => ({
                        ...p,
                        [pid]: e.target.value
                      })),
                      placeholder: "Reason for rejection",
                      className: "w-full rounded-md border border-input bg-background px-3 py-2 text-xs",
                      rows: 2,
                      "data-ocid": `admin.vendorproducts.reject_reason.${pid}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "destructive",
                      className: "h-8 text-xs",
                      disabled: !((_a2 = rejectReasons[pid]) == null ? void 0 : _a2.trim()) || actionLoading[`reject-${pid}`],
                      onClick: () => doAction(
                        `reject-${pid}`,
                        () => actor.adminRejectVendorProduct(
                          sessionKey,
                          product.id,
                          rejectReasons[pid] ?? ""
                        )
                      ),
                      "data-ocid": `admin.vendorproducts.confirm_reject_button.${pid}`,
                      children: "Confirm Reject"
                    }
                  )
                ] })
              ]
            },
            pid
          );
        }) })
      ] }),
      approved.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-emerald-700 mb-3", children: [
          "Approved (",
          approved.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: approved.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-emerald-50 border border-emerald-200 rounded-xl p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-emerald-800", children: product.productName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-700", children: [
                "Final Price: ₹",
                (Number(product.finalPrice ?? 0) / 100).toFixed(2)
              ] })
            ]
          },
          product.id.toString()
        )) })
      ] }),
      rejected.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-red-700 mb-3", children: [
          "Rejected (",
          rejected.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: rejected.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-red-50 border border-red-200 rounded-xl p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-red-800", children: product.productName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-700", children: [
                "Reason: ",
                product.rejectionReason ?? "—"
              ] })
            ]
          },
          product.id.toString()
        )) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.vendorproducts.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Vendor Products",
        location: "Review and approve products submitted by vendors"
      }
    ),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 animate-pulse space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-1/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded w-1/2" })
        ]
      },
      i
    )) }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error }) : Object.keys(grouped).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-12",
        "data-ocid": "admin.vendorproducts.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ShoppingBag,
            {
              size: 36,
              className: "text-muted-foreground/30 mx-auto mb-3"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No vendor products found." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: Object.entries(grouped).map(([vid, list]) => {
      var _a2, _b2;
      const pendingCount = list.filter(
        (p) => p.status === Variant_pending_approved_rejected.pending
      ).length;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-sm transition-shadow text-left w-full",
          onClick: () => setSelectedVendorId(vid),
          "data-ocid": `admin.vendorproducts.vendor_card.${vid}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: ((_a2 = list[0]) == null ? void 0 : _a2.vendorName) ?? "Unknown Vendor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: ((_b2 = list[0]) == null ? void 0 : _b2.vendorEmail) ?? "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                list.length,
                " product(s)"
              ] })
            ] }),
            pendingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "default", className: "text-[10px]", children: [
              pendingCount,
              " pending"
            ] })
          ] })
        },
        vid
      );
    }) })
  ] });
}
const BLANK_BANNER = {
  title: "",
  subtitle: "",
  imageUrl: "",
  ctaText: "Shop Now",
  ctaSlug: "",
  order: "1",
  isActive: true,
  durationSeconds: "5"
};
function bannerToForm(b) {
  return {
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.imageUrl,
    ctaText: b.ctaText,
    ctaSlug: b.ctaSlug,
    order: b.order.toString(),
    isActive: b.isActive,
    durationSeconds: Number(b.durationSeconds ?? 5n).toString()
  };
}
function formToBannerInput(form) {
  return {
    title: form.title,
    subtitle: form.subtitle,
    imageUrl: form.imageUrl,
    ctaText: form.ctaText,
    ctaSlug: form.ctaSlug,
    order: BigInt(Number.parseInt(form.order) || 1),
    isActive: form.isActive,
    durationSeconds: BigInt(Number.parseInt(form.durationSeconds) || 5)
  };
}
function PanelHeader({ title, location }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 pb-3 border-b border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
      "Appears on: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: location })
    ] })
  ] });
}
function HeroBannersPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: banners, isLoading } = useAdminHeroBanners();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editDialog, setEditDialog] = reactExports.useState({ open: false, banner: null });
  const [form, setForm] = reactExports.useState(BLANK_BANNER);
  const [saving, setSaving] = reactExports.useState(false);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const setField = (key) => (v) => setForm((p) => ({ ...p, [key]: v }));
  const openAdd = () => {
    setForm(BLANK_BANNER);
    setAddOpen(true);
  };
  const openEdit = (b) => {
    setForm(bannerToForm(b));
    setEditDialog({ open: true, banner: b });
  };
  const handleAdd = async () => {
    if (actorFetching) {
      ue.error("Still connecting, please try again in a moment.");
      return;
    }
    if (!actor || !form.title.trim()) return;
    setSaving(true);
    try {
      await actor.adminAddHeroBanner(
        localStorage.getItem(SESSION_KEY) ?? "",
        formToBannerInput(form)
      );
      await queryClient.invalidateQueries({ queryKey: ["adminHeroBanners"] });
      await queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
      ue.success(
        "Slide saved! It will now appear in the homepage slideshow."
      );
      setAddOpen(false);
    } catch {
      ue.error("Failed to add slide");
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = async () => {
    if (actorFetching) {
      ue.error("Still connecting, please try again in a moment.");
      return;
    }
    if (!actor || !editDialog.banner || !form.title.trim()) return;
    setSaving(true);
    try {
      const updateResult = await actor.adminUpdateHeroBanner(
        localStorage.getItem(SESSION_KEY) ?? "",
        editDialog.banner.id,
        formToBannerInput(form)
      );
      if (updateResult.__kind__ === "err") throw new Error(updateResult.err);
      await queryClient.invalidateQueries({ queryKey: ["adminHeroBanners"] });
      await queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
      ue.success(
        "Slide updated! The homepage slideshow now reflects your changes."
      );
      setEditDialog({ open: false, banner: null });
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to update slide");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!actor) return;
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    try {
      const deleteResult = await actor.adminDeleteHeroBanner(localStorage.getItem(SESSION_KEY) ?? "", id);
      if (deleteResult.__kind__ === "err") throw new Error(deleteResult.err);
      await queryClient.invalidateQueries({ queryKey: ["adminHeroBanners"] });
      await queryClient.invalidateQueries({ queryKey: ["heroBanners"] });
      ue.success("Slide removed from the homepage slideshow.");
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to delete slide");
    } finally {
      setDeleteConfirm(null);
    }
  };
  if (isLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Hero Slideshow",
        location: "Homepage — top rotating banner"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        (banners == null ? void 0 : banners.length) ?? 0,
        " slides"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "btn-primary border-0 gap-1.5 h-8",
          onClick: openAdd,
          "data-ocid": "admin.herobanners.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            " Add Slide"
          ]
        }
      )
    ] }),
    !banners || banners.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 bg-muted/20 rounded-xl border border-border",
        "data-ocid": "admin.herobanners.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 32, className: "text-muted-foreground/30 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No slides yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add your first slideshow slide to get started." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: banners.map((banner, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-3",
        "data-ocid": `admin.herobanners.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-12 rounded-lg bg-muted overflow-hidden flex-none", children: banner.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: banner.imageUrl,
                alt: banner.title,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-xl", children: "🖼️" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: banner.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground line-clamp-1 mt-0.5", children: banner.subtitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                  "Order: ",
                  banner.order.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                  "⏱ ",
                  Number(banner.durationSeconds ?? 5n),
                  "s"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: `text-[9px] px-1.5 py-0 border-0 ${banner.isActive ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}`,
                    children: banner.isActive ? "Active" : "Hidden"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => openEdit(banner),
                className: "flex-1 h-8 text-xs gap-1",
                "data-ocid": `admin.herobanners.edit_button.${idx + 1}`,
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
                onClick: () => handleDelete(banner.id),
                className: `h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 ${deleteConfirm === banner.id ? "bg-destructive/10" : ""}`,
                title: deleteConfirm === banner.id ? "Tap again to confirm" : "Delete",
                "data-ocid": `admin.herobanners.delete_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
              }
            )
          ] })
        ]
      },
      banner.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Slide" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BannerFormFields, { form, setField }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setAddOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "btn-primary border-0",
            disabled: !form.title.trim() || saving,
            onClick: handleAdd,
            "data-ocid": "admin.herobanners.save_button",
            children: saving ? "Saving…" : "Save Slide"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: editDialog.open,
        onOpenChange: (open) => setEditDialog((p) => ({ ...p, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Slide" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BannerFormFields, { form, setField }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setEditDialog({ open: false, banner: null }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "btn-primary border-0",
                disabled: !form.title.trim() || saving,
                onClick: handleEdit,
                "data-ocid": "admin.herobanners.edit.save_button",
                children: saving ? "Saving…" : "Update Slide"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function BannerFormFields({
  form,
  setField
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "banner-title",
        label: "Title *",
        value: form.title,
        onChange: setField("title"),
        placeholder: "Fresh from Assam's Tea Gardens"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 mb-1", children: "Large bold text displayed on the slide" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "banner-subtitle",
        label: "Subtitle",
        value: form.subtitle,
        onChange: setField("subtitle"),
        placeholder: "Premium orthodox teas — authentically Assamese"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 mb-1", children: "Smaller text shown below the heading" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImageUpload,
      {
        value: form.imageUrl,
        onChange: setField("imageUrl"),
        label: "Slide Image"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 mb-1", children: "Full-width image shown behind the text — paste a direct image URL" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "banner-duration",
        label: "Display Duration (seconds)",
        value: form.durationSeconds,
        onChange: setField("durationSeconds"),
        type: "number",
        placeholder: "5",
        min: 1,
        max: 60
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 mb-1", children: "Seconds this slide stays on screen before advancing" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "banner-order",
        label: "Display Order",
        value: form.order,
        onChange: setField("order"),
        type: "number",
        placeholder: "1"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "banner-active",
          type: "checkbox",
          checked: form.isActive,
          onChange: (e) => setField("isActive")(e.target.checked),
          className: "w-4 h-4 rounded border-input",
          "data-ocid": "admin.field.banner-active"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Label,
        {
          htmlFor: "banner-active",
          className: "text-xs font-semibold cursor-pointer",
          children: "Active (show on homepage)"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 mb-1", children: "Uncheck to hide this slide without deleting it" })
    ] })
  ] });
}
const BLANK_BLOCK = {
  title: "",
  thumbnailUrl: "",
  content: "",
  contentImages: [],
  order: "1",
  isActive: true
};
function blockToForm(b) {
  return {
    title: b.title,
    thumbnailUrl: b.thumbnailUrl,
    content: b.content,
    contentImages: b.contentImages,
    order: b.order.toString(),
    isActive: b.isActive
  };
}
function formToBlockInput(form) {
  return {
    title: form.title,
    thumbnailUrl: form.thumbnailUrl,
    content: form.content,
    contentImages: form.contentImages.filter((u) => u.trim() !== ""),
    order: BigInt(Number.parseInt(form.order) || 1),
    isActive: form.isActive
  };
}
function FeaturedBlocksPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: blocks, isLoading } = useAdminFeaturedBlocks();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editDialog, setEditDialog] = reactExports.useState({ open: false, block: null });
  const [form, setForm] = reactExports.useState(BLANK_BLOCK);
  const [saving, setSaving] = reactExports.useState(false);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const setField = (key) => (v) => setForm((p) => ({ ...p, [key]: v }));
  const openAdd = () => {
    setForm(BLANK_BLOCK);
    setAddOpen(true);
  };
  const openEdit = (b) => {
    setForm(blockToForm(b));
    setEditDialog({ open: true, block: b });
  };
  const handleAdd = async () => {
    if (!actor || !form.title.trim()) return;
    setSaving(true);
    try {
      await actor.adminAddFeaturedBlock(
        localStorage.getItem(SESSION_KEY) ?? "",
        formToBlockInput(form)
      );
      await queryClient.invalidateQueries({
        queryKey: ["adminFeaturedBlocks"]
      });
      await queryClient.invalidateQueries({ queryKey: ["featuredBlocks"] });
      ue.success("Block added");
      setAddOpen(false);
    } catch {
      ue.error("Failed to add block");
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = async () => {
    if (!actor || !editDialog.block || !form.title.trim()) return;
    setSaving(true);
    try {
      await actor.adminUpdateFeaturedBlock(
        localStorage.getItem(SESSION_KEY) ?? "",
        editDialog.block.id,
        formToBlockInput(form)
      );
      await queryClient.invalidateQueries({
        queryKey: ["adminFeaturedBlocks"]
      });
      await queryClient.invalidateQueries({ queryKey: ["featuredBlocks"] });
      ue.success("Block updated");
      setEditDialog({ open: false, block: null });
    } catch {
      ue.error("Failed to update block");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!actor) return;
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    try {
      await actor.adminDeleteFeaturedBlock(
        localStorage.getItem(SESSION_KEY) ?? "",
        id
      );
      await queryClient.invalidateQueries({
        queryKey: ["adminFeaturedBlocks"]
      });
      await queryClient.invalidateQueries({ queryKey: ["featuredBlocks"] });
      ue.success("Block deleted");
    } catch {
      ue.error("Failed to delete block");
    } finally {
      setDeleteConfirm(null);
    }
  };
  if (isLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Featured Blocks",
        location: "Homepage — clickable story cards below the slideshow"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        (blocks == null ? void 0 : blocks.length) ?? 0,
        " story blocks"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "btn-primary border-0 gap-1.5 h-8",
          onClick: openAdd,
          "data-ocid": "admin.featuredblocks.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            " Add Block"
          ]
        }
      )
    ] }),
    !blocks || blocks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 bg-muted/20 rounded-xl border border-border",
        "data-ocid": "admin.featuredblocks.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            LayoutGrid,
            {
              size: 32,
              className: "text-muted-foreground/30 mx-auto mb-2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No story blocks yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: 'Add blocks to the "Stories & Highlights" section.' })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: blocks.map((block, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-3",
        "data-ocid": `admin.featuredblocks.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-12 rounded-lg bg-muted overflow-hidden flex-none", children: block.thumbnailUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: block.thumbnailUrl,
                alt: block.title,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-xl", children: "📖" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: block.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                  "Order: ",
                  block.order.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                  block.contentImages.length,
                  " img",
                  block.contentImages.length !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: `text-[9px] px-1.5 py-0 border-0 ${block.isActive ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}`,
                    children: block.isActive ? "Active" : "Hidden"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => openEdit(block),
                className: "flex-1 h-8 text-xs gap-1",
                "data-ocid": `admin.featuredblocks.edit_button.${idx + 1}`,
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
                onClick: () => handleDelete(block.id),
                className: `h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 ${deleteConfirm === block.id ? "bg-destructive/10" : ""}`,
                title: deleteConfirm === block.id ? "Tap again to confirm" : "Delete",
                "data-ocid": `admin.featuredblocks.delete_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
              }
            )
          ] })
        ]
      },
      block.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Story Block" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BlockFormFields, { form, setField }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setAddOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "btn-primary border-0",
            disabled: !form.title.trim() || saving,
            onClick: handleAdd,
            "data-ocid": "admin.featuredblocks.save_button",
            children: saving ? "Saving…" : "Save Block"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: editDialog.open,
        onOpenChange: (open) => setEditDialog((p) => ({ ...p, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Story Block" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BlockFormFields, { form, setField }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setEditDialog({ open: false, block: null }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "btn-primary border-0",
                disabled: !form.title.trim() || saving,
                onClick: handleEdit,
                "data-ocid": "admin.featuredblocks.edit.save_button",
                children: saving ? "Saving…" : "Update Block"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function BlockFormFields({
  form,
  setField
}) {
  const addImageUrl = () => setField("contentImages")([...form.contentImages, ""]);
  const updateImageUrl = (idx, val) => {
    const updated = [...form.contentImages];
    updated[idx] = val;
    setField("contentImages")(updated);
  };
  const removeImageUrl = (idx) => {
    setField("contentImages")(form.contentImages.filter((_, i) => i !== idx));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "block-title",
        label: "Title *",
        value: form.title,
        onChange: setField("title"),
        placeholder: "Bihu Festival Traditions"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImageUpload,
      {
        value: form.thumbnailUrl,
        onChange: setField("thumbnailUrl"),
        label: "Thumbnail"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "block-content", className: "text-xs font-semibold", children: "Content (supports HTML formatting)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "You can type HTML here — headings, bold, links, and images are supported." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          id: "block-content",
          value: form.content,
          onChange: (e) => setField("content")(e.target.value),
          placeholder: "<h2>Bihu Festival</h2><p>Bihu is the...</p>",
          rows: 6,
          className: "w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none min-h-[120px]",
          "data-ocid": "admin.field.block-content"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Content Images" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: addImageUrl,
            className: "text-xs text-primary font-semibold flex items-center gap-0.5 hover:underline",
            "data-ocid": "admin.featuredblocks.add_image_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 11 }),
              " Add URL"
            ]
          }
        )
      ] }),
      form.contentImages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "No images added yet." }),
      form.contentImages.map((url, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: url,
            onChange: (e) => updateImageUrl(idx, e.target.value),
            placeholder: "https://...",
            className: "h-8 text-xs flex-1",
            "data-ocid": `admin.featuredblocks.image_input.${idx + 1}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            onClick: () => removeImageUrl(idx),
            className: "h-8 w-8 p-0 border-destructive/30 text-destructive hover:bg-destructive/10 flex-none",
            "aria-label": "Remove image",
            "data-ocid": `admin.featuredblocks.remove_image_button.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11 })
          }
        )
      ] }, url || String(idx)))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          id: "block-order",
          label: "Display Order",
          value: form.order,
          onChange: setField("order"),
          type: "number",
          placeholder: "1"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 flex items-end pb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "block-active",
            type: "checkbox",
            checked: form.isActive,
            onChange: (e) => setField("isActive")(e.target.checked),
            className: "w-4 h-4 rounded border-input",
            "data-ocid": "admin.field.block-active"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "block-active",
            className: "text-xs font-semibold cursor-pointer",
            children: "Active"
          }
        )
      ] }) })
    ] })
  ] });
}
function ProductsPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editDialog, setEditDialog] = reactExports.useState({ open: false, product: null });
  const [saving, setSaving] = reactExports.useState(false);
  const { data: result, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return { products: [], total: 0n };
      return actor.listProducts({
        categoryId: void 0,
        searchTerm: void 0,
        minPrice: void 0,
        maxPrice: void 0,
        inStockOnly: false,
        limit: 200n,
        offset: 0n
      });
    },
    enabled: !!actor && !actorFetching
  });
  const products = (result == null ? void 0 : result.products) ?? [];
  const handleAdd = async (form) => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.adminAddProduct(
        localStorage.getItem(SESSION_KEY) ?? "",
        formToProductInput(form)
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      ue.success("Product added successfully");
      setAddOpen(false);
    } catch {
      ue.error("Failed to add product");
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = async (form) => {
    if (!actor || !editDialog.product) return;
    setSaving(true);
    try {
      await actor.adminUpdateProduct(
        localStorage.getItem(SESSION_KEY) ?? "",
        editDialog.product.id,
        formToProductInput(form)
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      ue.success("Product updated");
      setEditDialog({ open: false, product: null });
    } catch {
      ue.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!actor) return;
    try {
      await actor.adminDeleteProduct(
        localStorage.getItem(SESSION_KEY) ?? "",
        id
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      ue.success("Product deleted");
    } catch {
      ue.error("Failed to delete product");
    }
  };
  if (isLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Products",
        location: "Product catalog — shown on category and search pages"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        products.length,
        " products"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "btn-primary border-0 gap-1.5 h-8",
          onClick: () => setAddOpen(true),
          "data-ocid": "admin.products.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            " Add Product"
          ]
        }
      )
    ] }),
    products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 bg-muted/20 rounded-xl border border-border",
        "data-ocid": "admin.products.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Package,
            {
              size: 32,
              className: "text-muted-foreground/30 mx-auto mb-2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No products yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add your first product to get started." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: products.map((product, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-3",
        "data-ocid": `admin.products.item.${idx + 1}`,
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
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold", children: formatPrice(
                  discountedPrice(product.price, product.discountPercent)
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
                onClick: () => setEditDialog({ open: true, product }),
                className: "flex-1 h-8 text-xs gap-1",
                "data-ocid": `admin.products.edit_button.${idx + 1}`,
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
                onClick: () => handleDelete(product.id),
                className: "h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10",
                "data-ocid": `admin.products.delete_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
              }
            )
          ] })
        ]
      },
      product.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductFormDialog,
      {
        open: addOpen,
        onOpenChange: setAddOpen,
        initialValues: BLANK_PRODUCT,
        title: "Add New Product",
        onSave: handleAdd,
        saving
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductFormDialog,
      {
        open: editDialog.open,
        onOpenChange: (open) => setEditDialog((p) => ({ ...p, open })),
        initialValues: editDialog.product ? productToForm(editDialog.product) : BLANK_PRODUCT,
        title: "Edit Product",
        onSave: handleEdit,
        saving
      }
    )
  ] });
}
function ProductFormDialog({
  open,
  onOpenChange,
  initialValues,
  title,
  onSave,
  saving
}) {
  const [form, setForm] = reactExports.useState(initialValues);
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { data: categories } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetCategories(localStorage.getItem(SESSION_KEY) ?? "");
    },
    enabled: !!actor && !actorFetching
  });
  const handleOpenChange = (o) => {
    if (o) setForm(initialValues);
    onOpenChange(o);
  };
  const set = (key) => (v) => setForm((prev) => ({ ...prev, [key]: v }));
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "prod-category",
              value: form.category,
              onChange: (e) => set("category")(e.target.value),
              className: "w-full h-9 rounded-md border border-input bg-background text-sm px-3",
              "data-ocid": "admin.field.prod-category",
              children: categories && categories.length > 0 ? categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id.toString(), children: c.name }, c.id.toString())) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "1", children: "Tea" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "2", children: "Spices" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "3", children: "Handloom" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "4", children: "Crafts" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5", children: "Food" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "6", children: "Books" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "7", children: "Attire" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "8", children: "Kitchen" })
              ] })
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
          id: "prod-tags",
          label: "Tags (comma-separated)",
          value: form.tags,
          onChange: set("tags"),
          placeholder: "tea, organic, assam"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ImageUpload,
        {
          value: form.imageUrl,
          onChange: set("imageUrl"),
          label: "Product Image"
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
          onClick: () => onSave(form),
          className: "btn-primary border-0",
          disabled: !form.title.trim() || !form.price || saving,
          "data-ocid": "admin.product.save_button",
          children: saving ? "Saving…" : "Save Product"
        }
      )
    ] })
  ] }) });
}
function CategoriesPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editDialog, setEditDialog] = reactExports.useState({ open: false, category: null });
  const [form, setForm] = reactExports.useState(BLANK_CATEGORY);
  const [saving, setSaving] = reactExports.useState(false);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const { data: categories, isLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetCategories(localStorage.getItem(SESSION_KEY) ?? "");
    },
    enabled: !!actor && !actorFetching
  });
  const set = (key) => (v) => setForm((p) => ({ ...p, [key]: v }));
  const openAdd = () => {
    setForm(BLANK_CATEGORY);
    setAddOpen(true);
  };
  const openEdit = (cat) => {
    setForm(categoryToForm(cat));
    setEditDialog({ open: true, category: cat });
  };
  const handleAdd = async () => {
    if (!actor || !form.name.trim() || !form.slug.trim()) return;
    setSaving(true);
    try {
      const result = await actor.adminAddCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        form.name,
        form.slug,
        form.description,
        form.imageUrl
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      ue.success("Category added");
      setAddOpen(false);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to add category"
      );
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = async () => {
    if (!actor || !editDialog.category || !form.name.trim()) return;
    setSaving(true);
    try {
      const result = await actor.adminUpdateCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        editDialog.category.id,
        form.name,
        form.slug,
        form.description,
        form.imageUrl
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      ue.success("Category updated");
      setEditDialog({ open: false, category: null });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to update category"
      );
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!actor) return;
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    try {
      const result = await actor.adminDeleteCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        id
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      ue.success("Category deleted");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    } finally {
      setDeleteConfirm(null);
    }
  };
  if (isLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Categories",
        location: "Products page — top-level navigation"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        (categories == null ? void 0 : categories.length) ?? 0,
        " categories"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "btn-primary border-0 gap-1.5 h-8",
          onClick: openAdd,
          "data-ocid": "admin.categories.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            " Add Category"
          ]
        }
      )
    ] }),
    !categories || categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 bg-muted/20 rounded-xl border border-border",
        "data-ocid": "admin.categories.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FolderTree,
            {
              size: 32,
              className: "text-muted-foreground/30 mx-auto mb-2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No categories yet" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: categories.map((cat, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-3 flex items-center gap-3",
        "data-ocid": `admin.categories.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted overflow-hidden flex-none", children: cat.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: cat.imageUrl,
              alt: cat.name,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-lg", children: "🗂️" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: cat.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground truncate", children: [
              "/",
              cat.slug,
              " · ",
              cat.subCategories.length,
              " sub-cats"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 flex-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => openEdit(cat),
                className: "h-7 w-7 p-0",
                "data-ocid": `admin.categories.edit_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 12 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => handleDelete(cat.id),
                className: `h-7 w-7 p-0 border-destructive/30 text-destructive hover:bg-destructive/10 ${deleteConfirm === cat.id ? "bg-destructive/10" : ""}`,
                title: deleteConfirm === cat.id ? "Tap again to confirm" : "Delete",
                "data-ocid": `admin.categories.delete_button.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
              }
            )
          ] })
        ]
      },
      cat.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Category" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryFormFields, { form, set }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setAddOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "btn-primary border-0",
            disabled: !form.name.trim() || !form.slug.trim() || saving,
            onClick: handleAdd,
            "data-ocid": "admin.categories.save_button",
            children: saving ? "Saving…" : "Save Category"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: editDialog.open,
        onOpenChange: (open) => setEditDialog((p) => ({ ...p, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Category" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryFormFields, { form, set }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setEditDialog({ open: false, category: null }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "btn-primary border-0",
                disabled: !form.name.trim() || saving,
                onClick: handleEdit,
                "data-ocid": "admin.categories.edit.save_button",
                children: saving ? "Saving…" : "Update Category"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function CategoryFormFields({
  form,
  set
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "cat-name",
        label: "Category Name *",
        value: form.name,
        onChange: set("name"),
        placeholder: "e.g. Tea"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "cat-slug",
        label: "Slug *",
        value: form.slug,
        onChange: set("slug"),
        placeholder: "e.g. tea"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        id: "cat-description",
        label: "Description",
        value: form.description,
        onChange: set("description"),
        placeholder: "Short description"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImageUpload,
      {
        value: form.imageUrl,
        onChange: set("imageUrl"),
        label: "Category Image"
      }
    )
  ] });
}
function SubCategoriesPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = reactExports.useState("");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editDialog, setEditDialog] = reactExports.useState({ open: false, subCategory: null });
  const [form, setForm] = reactExports.useState(BLANK_SUBCATEGORY);
  const [saving, setSaving] = reactExports.useState(false);
  const [deleteConfirm, setDeleteConfirm] = reactExports.useState(null);
  const { data: categories, isLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetCategories(localStorage.getItem(SESSION_KEY) ?? "");
    },
    enabled: !!actor && !actorFetching
  });
  const selectedCategory = categories == null ? void 0 : categories.find(
    (c) => c.id.toString() === selectedCategoryId
  );
  const subCategories = (selectedCategory == null ? void 0 : selectedCategory.subCategories) ?? [];
  const set = (key) => (v) => setForm((p) => ({ ...p, [key]: v }));
  const openAdd = () => {
    setForm(BLANK_SUBCATEGORY);
    setAddOpen(true);
  };
  const openEdit = (sub) => {
    setForm({ name: sub.name, imageUrl: sub.imageUrl });
    setEditDialog({ open: true, subCategory: sub });
  };
  const handleAdd = async () => {
    if (!actor || !selectedCategoryId || !form.name.trim()) return;
    setSaving(true);
    try {
      const result = await actor.adminAddSubCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        BigInt(selectedCategoryId),
        form.name,
        form.imageUrl
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      ue.success("Sub-category added");
      setAddOpen(false);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to add sub-category"
      );
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = async () => {
    if (!actor || !selectedCategoryId || !editDialog.subCategory) return;
    setSaving(true);
    try {
      const result = await actor.adminUpdateSubCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        BigInt(selectedCategoryId),
        editDialog.subCategory.id,
        form.name,
        form.imageUrl
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      ue.success("Sub-category updated");
      setEditDialog({ open: false, subCategory: null });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to update sub-category"
      );
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (subId) => {
    if (!actor || !selectedCategoryId) return;
    if (deleteConfirm !== subId) {
      setDeleteConfirm(subId);
      return;
    }
    try {
      const result = await actor.adminDeleteSubCategory(
        localStorage.getItem(SESSION_KEY) ?? "",
        BigInt(selectedCategoryId),
        subId
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      await queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      ue.success("Sub-category deleted");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to delete sub-category"
      );
    } finally {
      setDeleteConfirm(null);
    }
  };
  if (isLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Sub-Categories",
        location: "Products page — filters under each category"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "parent-category", className: "text-xs font-semibold", children: "Select Parent Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: "parent-category",
          value: selectedCategoryId,
          onChange: (e) => {
            setSelectedCategoryId(e.target.value);
            setDeleteConfirm(null);
          },
          className: "w-full h-9 rounded-md border border-input bg-background text-sm px-3",
          "data-ocid": "admin.subcategories.parent_select",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Choose a category —" }),
            categories == null ? void 0 : categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id.toString(), children: c.name }, c.id.toString()))
          ]
        }
      )
    ] }),
    selectedCategoryId && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          subCategories.length,
          " sub-categories in",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: selectedCategory == null ? void 0 : selectedCategory.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "btn-primary border-0 gap-1.5 h-8",
            onClick: openAdd,
            "data-ocid": "admin.subcategories.add_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
              " Add Sub-Category"
            ]
          }
        )
      ] }),
      subCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-10 bg-muted/20 rounded-xl border border-border",
          "data-ocid": "admin.subcategories.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Layers,
              {
                size: 32,
                className: "text-muted-foreground/30 mx-auto mb-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No sub-categories yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
              "Add the first sub-category for ",
              selectedCategory == null ? void 0 : selectedCategory.name,
              "."
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: subCategories.map((sub, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3 flex items-center gap-3",
          "data-ocid": `admin.subcategories.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted overflow-hidden flex-none", children: sub.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: sub.imageUrl,
                alt: sub.name,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-lg", children: "🏷️" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: sub.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                "ID: ",
                sub.id.toString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 flex-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => openEdit(sub),
                  className: "h-7 w-7 p-0",
                  "data-ocid": `admin.subcategories.edit_button.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 12 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => handleDelete(sub.id),
                  className: `h-7 w-7 p-0 border-destructive/30 text-destructive hover:bg-destructive/10 ${deleteConfirm === sub.id ? "bg-destructive/10" : ""}`,
                  title: deleteConfirm === sub.id ? "Tap again to confirm" : "Delete",
                  "data-ocid": `admin.subcategories.delete_button.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                }
              )
            ] })
          ]
        },
        sub.id.toString()
      )) })
    ] }),
    !selectedCategoryId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border",
        "data-ocid": "admin.subcategories.no_parent_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 32, className: "text-muted-foreground/30 mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Select a parent category above to manage its sub-categories" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Add Sub-Category to ",
        selectedCategory == null ? void 0 : selectedCategory.name
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            id: "sub-name",
            label: "Sub-Category Name *",
            value: form.name,
            onChange: set("name"),
            placeholder: "e.g. CTC Tea"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ImageUpload,
          {
            value: form.imageUrl,
            onChange: set("imageUrl"),
            label: "Sub-Category Image"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setAddOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "btn-primary border-0",
            disabled: !form.name.trim() || saving,
            onClick: handleAdd,
            "data-ocid": "admin.subcategories.save_button",
            children: saving ? "Saving…" : "Save Sub-Category"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: editDialog.open,
        onOpenChange: (open) => setEditDialog((p) => ({ ...p, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Sub-Category" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                id: "sub-edit-name",
                label: "Sub-Category Name *",
                value: form.name,
                onChange: set("name"),
                placeholder: "e.g. CTC Tea"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ImageUpload,
              {
                value: form.imageUrl,
                onChange: set("imageUrl"),
                label: "Sub-Category Image"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setEditDialog({ open: false, subCategory: null }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "btn-primary border-0",
                disabled: !form.name.trim() || saving,
                onClick: handleEdit,
                "data-ocid": "admin.subcategories.edit.save_button",
                children: saving ? "Saving…" : "Update"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function VideoBytePanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [videoUrl, setVideoUrl] = reactExports.useState("");
  const [videoTitle, setVideoTitle] = reactExports.useState("AssamRoots");
  const [videoEnabled, setVideoEnabled] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor || actorFetching) return;
    actor.getVideoByte().then((data) => {
      setVideoUrl(data.url);
      setVideoTitle(data.title || "AssamRoots");
      setVideoEnabled(data.enabled);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [actor, actorFetching]);
  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.adminUpdateVideoByte(
        localStorage.getItem(SESSION_KEY) ?? "",
        videoUrl,
        videoEnabled,
        videoTitle
      );
      ue.success("Video settings saved successfully");
    } catch {
      ue.error("Failed to save video settings");
    } finally {
      setSaving(false);
    }
  };
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    if (ytMatch)
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return url;
    return null;
  };
  const embedUrl = getEmbedUrl(videoUrl);
  if (loading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.video.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Video Byte",
        location: "Homepage — video section with gradient overlay"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Homepage Video Byte" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Add a featured video to the homepage — paste a YouTube link or a direct .mp4 URL." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2 px-3 bg-muted/30 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "video-enabled",
            type: "checkbox",
            checked: videoEnabled,
            onChange: (e) => setVideoEnabled(e.target.checked),
            className: "w-4 h-4 rounded border-input",
            "data-ocid": "admin.video.enabled_toggle"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "video-enabled",
            className: "text-sm font-semibold cursor-pointer flex-1",
            children: "Show video section on homepage"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs font-semibold px-2 py-0.5 rounded-full ${videoEnabled ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}`,
            children: videoEnabled ? "Enabled" : "Disabled"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "video-title", className: "text-xs font-semibold", children: "Overlay Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "video-title",
            value: videoTitle,
            onChange: (e) => setVideoTitle(e.target.value),
            placeholder: "AssamRoots",
            className: "h-9 text-sm",
            "data-ocid": "admin.video.title_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "This text appears in the gradient overlay on the video section." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "video-url", className: "text-xs font-semibold", children: "Video URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "video-url",
            value: videoUrl,
            onChange: (e) => setVideoUrl(e.target.value),
            placeholder: "https://www.youtube.com/watch?v=... or https://example.com/video.mp4",
            className: "h-9 text-sm",
            "data-ocid": "admin.video.url_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Supports YouTube links (youtube.com/watch, youtu.be) and direct MP4 URLs." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "btn-primary border-0 w-full h-10 gap-1.5 font-semibold",
          onClick: handleSave,
          disabled: saving,
          "data-ocid": "admin.video.save_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
            saving ? "Saving…" : "Save Video Settings"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Preview" }),
      embedUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden bg-black aspect-video", children: [
        embedUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            src: embedUrl,
            className: "w-full h-full object-cover",
            controls: true,
            "data-ocid": "admin.video.preview_player",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            src: embedUrl,
            className: "w-full h-full",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
            title: "Video preview",
            "data-ocid": "admin.video.preview_player"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-display font-bold text-xl drop-shadow-lg", children: videoTitle || "AssamRoots" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "aspect-video rounded-xl bg-muted/40 border border-dashed border-border flex flex-col items-center justify-center gap-2",
          "data-ocid": "admin.video.preview_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { size: 32, className: "text-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Paste a video URL above to see a preview" })
          ]
        }
      )
    ] })
  ] });
}
function ServicesPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [availabilityLoading, setAvailabilityLoading] = reactExports.useState(true);
  const [servicesAvailable, setServicesAvailable] = reactExports.useState(true);
  const [unavailabilityMessage, setUnavailabilityMessage] = reactExports.useState(
    "Our services are temporarily unavailable but will resume soon. Thank you for your patience."
  );
  const [savingAvailability, setSavingAvailability] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor || actorFetching) return;
    actor.getServicesAvailability().then((data) => {
      setServicesAvailable(data.available);
      setUnavailabilityMessage(
        data.message || "Our services are temporarily unavailable but will resume soon. Thank you for your patience."
      );
    }).catch(() => {
    }).finally(() => setAvailabilityLoading(false));
  }, [actor, actorFetching]);
  const handleSaveAvailability = async () => {
    if (!actor) return;
    setSavingAvailability(true);
    try {
      await actor.adminUpdateServicesAvailability(
        localStorage.getItem(SESSION_KEY) ?? "",
        servicesAvailable,
        unavailabilityMessage
      );
      await queryClient.invalidateQueries({
        queryKey: ["servicesAvailability"]
      });
      ue.success("Services availability updated");
    } catch {
      ue.error("Failed to update services availability");
    } finally {
      setSavingAvailability(false);
    }
  };
  const { data: requests, isLoading } = useQuery({
    queryKey: ["adminServiceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.adminGetServiceRequests(
        localStorage.getItem(SESSION_KEY) ?? ""
      );
      return [...all].sort((a, b) => Number(b.submittedAt - a.submittedAt));
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 3e4
  });
  const handleStatusUpdate = async (id, status) => {
    if (!actor) return;
    await actor.adminUpdateServiceRequestStatus(
      localStorage.getItem(SESSION_KEY) ?? "",
      id,
      status
    );
    await queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
    ue.success("Status updated");
  };
  const handleDelete = async (id) => {
    if (!actor) return;
    await actor.adminDeleteServiceRequest(
      localStorage.getItem(SESSION_KEY) ?? "",
      id
    );
    await queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
    ue.success("Request deleted");
  };
  if (isLoading || actorFetching || availabilityLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 space-y-4",
        "data-ocid": "admin.services.availability_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Services Availability" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Control whether the Services section is open for bookings. Customers will see the message below when services are unavailable." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2 px-3 bg-muted/30 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "services-available",
                type: "checkbox",
                checked: servicesAvailable,
                onChange: (e) => setServicesAvailable(e.target.checked),
                className: "w-4 h-4 rounded border-input",
                "data-ocid": "admin.services.available_toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "services-available",
                className: "text-sm font-semibold cursor-pointer flex-1",
                children: "Services Currently Available"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-semibold px-2 py-0.5 rounded-full ${servicesAvailable ? "bg-secondary/20 text-secondary" : "bg-destructive/15 text-destructive"}`,
                children: servicesAvailable ? "Open" : "Unavailable"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "services-unavailability-msg",
                className: "text-xs font-semibold",
                children: "Unavailability Message"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "services-unavailability-msg",
                value: unavailabilityMessage,
                onChange: (e) => setUnavailabilityMessage(e.target.value),
                placeholder: "Our services are temporarily unavailable but will resume soon. Thank you for your patience.",
                rows: 3,
                className: "w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none",
                "data-ocid": "admin.services.unavailability_message_textarea"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Shown to customers when services are set to Unavailable." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "btn-primary border-0 w-full h-10 gap-1.5 font-semibold",
              onClick: handleSaveAvailability,
              disabled: savingAvailability,
              "data-ocid": "admin.services.save_availability_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
                savingAvailability ? "Saving…" : "Save Availability Settings"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Incoming Service Requests" }),
      !requests || requests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-12 bg-muted/20 rounded-xl border border-border",
          "data-ocid": "admin.services.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 36, className: "text-muted-foreground/30 mx-auto mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: "No service requests yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "They will appear here when customers submit them." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: requests.map((req, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ServiceRequestRow,
        {
          request: req,
          idx,
          onStatusUpdate: handleStatusUpdate,
          onDelete: handleDelete
        },
        req.id.toString()
      )) })
    ] })
  ] });
}
function ServiceRequestRow({
  request,
  idx,
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
      "data-ocid": `admin.services.item.${idx + 1}`,
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: request.description }),
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
                  "data-ocid": `admin.services.status_select.${idx + 1}`,
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
                onClick: async () => {
                  setUpdating(true);
                  await onStatusUpdate(request.id, selectedStatus);
                  setUpdating(false);
                },
                disabled: updating || selectedStatus === request.status,
                "data-ocid": `admin.services.save_button.${idx + 1}`,
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
              onClick: async () => {
                if (!confirmDelete) {
                  setConfirmDelete(true);
                  return;
                }
                setDeleting(true);
                await onDelete(request.id);
                setDeleting(false);
                setConfirmDelete(false);
              },
              disabled: deleting,
              "data-ocid": `admin.services.delete_button.${idx + 1}`,
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
function InventoryPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [stockEdits, setStockEdits] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState({});
  const { data: result, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return { products: [], total: 0n };
      return actor.listProducts({
        categoryId: void 0,
        searchTerm: void 0,
        minPrice: void 0,
        maxPrice: void 0,
        inStockOnly: false,
        limit: 200n,
        offset: 0n
      });
    },
    enabled: !!actor && !actorFetching
  });
  const products = ((result == null ? void 0 : result.products) ?? []).filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleSaveStock = async (id) => {
    if (!actor) return;
    const key = id.toString();
    const newStock = BigInt(
      Math.max(0, Number.parseInt(stockEdits[key] ?? "0") || 0)
    );
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      await actor.adminUpdateStock(
        localStorage.getItem(SESSION_KEY) ?? "",
        id,
        newStock
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setStockEdits((p) => {
        const n = { ...p };
        delete n[key];
        return n;
      });
      ue.success("Stock updated");
    } catch {
      ue.error("Failed to update stock");
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };
  if (isLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Inventory",
        location: "All product pages — stock badge and availability"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        placeholder: "Search products…",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        className: "h-9 text-sm mb-4",
        "data-ocid": "admin.inventory.search_input"
      }
    ),
    products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 bg-muted/20 rounded-xl border border-border",
        "data-ocid": "admin.inventory.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Warehouse,
            {
              size: 32,
              className: "text-muted-foreground/30 mx-auto mb-2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: search ? "No products match your search." : "No products found." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: products.map((p, idx) => {
      const key = p.id.toString();
      const editVal = key in stockEdits ? stockEdits[key] : p.stock.toString();
      const isDirty = key in stockEdits;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3 flex items-center gap-3",
          "data-ocid": `admin.inventory.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: p.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: p.brand })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0,
                  value: editVal,
                  onChange: (e) => setStockEdits((prev) => ({
                    ...prev,
                    [key]: e.target.value
                  })),
                  className: "h-8 w-20 text-sm text-center",
                  "data-ocid": `admin.inventory.input.${idx + 1}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: isDirty ? "default" : "outline",
                  className: `h-8 w-8 p-0 ${isDirty ? "btn-primary border-0" : ""}`,
                  disabled: !isDirty || saving[key],
                  onClick: () => handleSaveStock(p.id),
                  title: "Save stock",
                  "data-ocid": `admin.inventory.save_button.${idx + 1}`,
                  children: saving[key] ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 12 })
                }
              )
            ] })
          ]
        },
        key
      );
    }) })
  ] });
}
function DiscountsPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [discountEdits, setDiscountEdits] = reactExports.useState(
    {}
  );
  const [saving, setSaving] = reactExports.useState({});
  const { data: result, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return { products: [], total: 0n };
      return actor.listProducts({
        categoryId: void 0,
        searchTerm: void 0,
        minPrice: void 0,
        maxPrice: void 0,
        inStockOnly: false,
        limit: 200n,
        offset: 0n
      });
    },
    enabled: !!actor && !actorFetching
  });
  const products = ((result == null ? void 0 : result.products) ?? []).filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleSaveDiscount = async (id) => {
    if (!actor) return;
    const key = id.toString();
    const pct = BigInt(
      Math.min(
        100,
        Math.max(0, Number.parseInt(discountEdits[key] ?? "0") || 0)
      )
    );
    setSaving((p) => ({ ...p, [key]: true }));
    try {
      await actor.adminSetDiscount(
        localStorage.getItem(SESSION_KEY) ?? "",
        id,
        pct
      );
      await queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setDiscountEdits((p) => {
        const n = { ...p };
        delete n[key];
        return n;
      });
      ue.success("Discount updated");
    } catch {
      ue.error("Failed to update discount");
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  };
  if (isLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Discounts",
        location: "Product cards — shown as strikethrough original price"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        placeholder: "Search products…",
        value: search,
        onChange: (e) => setSearch(e.target.value),
        className: "h-9 text-sm mb-4",
        "data-ocid": "admin.discounts.search_input"
      }
    ),
    products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 bg-muted/20 rounded-xl border border-border",
        "data-ocid": "admin.discounts.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CirclePercent,
            {
              size: 32,
              className: "text-muted-foreground/30 mx-auto mb-2"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: search ? "No products match your search." : "No products found." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: products.map((p, idx) => {
      const key = p.id.toString();
      const editVal = key in discountEdits ? discountEdits[key] : p.discountPercent.toString();
      const isDirty = key in discountEdits;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-3 flex items-center gap-3",
          "data-ocid": `admin.discounts.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: p.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: formatPrice(p.price) }),
                p.discountPercent > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "destructive",
                    className: "text-[10px] px-1.5 py-0",
                    children: [
                      Number(p.discountPercent),
                      "% OFF"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    value: editVal,
                    onChange: (e) => setDiscountEdits((prev) => ({
                      ...prev,
                      [key]: e.target.value
                    })),
                    className: "h-8 w-16 text-sm text-center rounded-r-none",
                    "data-ocid": `admin.discounts.input.${idx + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-8 px-2 flex items-center bg-muted border border-l-0 border-input rounded-r-md text-xs text-muted-foreground", children: "%" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: isDirty ? "default" : "outline",
                  className: `h-8 w-8 p-0 ${isDirty ? "btn-primary border-0" : ""}`,
                  disabled: !isDirty || saving[key],
                  onClick: () => handleSaveDiscount(p.id),
                  title: "Apply discount",
                  "data-ocid": `admin.discounts.save_button.${idx + 1}`,
                  children: saving[key] ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 12 })
                }
              )
            ] })
          ]
        },
        key
      );
    }) })
  ] });
}
function BrandingPanel() {
  const queryClient = useQueryClient();
  const { data: settings } = useSiteSettings();
  const saveSiteSettings = useSaveSiteSettings();
  const currentLogo = (settings == null ? void 0 : settings.logoUrl) ?? "";
  const currentFavicon = (settings == null ? void 0 : settings.faviconUrl) ?? "";
  const [logoUrl, setLogoUrl] = reactExports.useState("");
  const [faviconUrl, setFaviconUrl] = reactExports.useState("");
  const [logoSaved, setLogoSaved] = reactExports.useState(false);
  const [faviconSaved, setFaviconSaved] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setLogoUrl(currentLogo);
    setFaviconUrl(currentFavicon);
  }, [currentLogo, currentFavicon]);
  const handleSaveLogo = () => {
    saveSiteSettings.mutate(
      { logoUrl: logoUrl || null, faviconUrl: currentFavicon || null },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
          setLogoSaved(true);
          setTimeout(() => setLogoSaved(false), 2500);
          ue.success("Logo updated — visible across the whole site");
        },
        onError: () => ue.error("Failed to save logo")
      }
    );
  };
  const handleSaveFavicon = () => {
    saveSiteSettings.mutate(
      { logoUrl: currentLogo || null, faviconUrl: faviconUrl || null },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
          setFaviconSaved(true);
          setTimeout(() => setFaviconSaved(false), 2500);
          ue.success("Favicon updated — reload the tab to see it in action");
        },
        onError: () => ue.error("Failed to save favicon")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin.branding.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Branding",
        location: "Site-wide — logo in header and favicon in browser tab"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Current Branding" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Logo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-10 bg-card border border-border rounded-lg overflow-hidden flex items-center justify-center", children: currentLogo ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: currentLogo,
              alt: "Current logo",
              className: "h-full w-auto object-contain p-1"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Default" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Favicon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 bg-card border border-border rounded-lg overflow-hidden flex items-center justify-center", children: currentFavicon ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: currentFavicon,
              alt: "Current favicon",
              className: "w-full h-full object-contain p-1"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "–" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 space-y-3",
        "data-ocid": "admin.branding.logo_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Site Logo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Displayed in the header on all pages. Recommended height: 40px. PNG with transparent background works best." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUpload, { value: logoUrl, onChange: setLogoUrl, label: "Logo Image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "btn-primary border-0 w-full h-9 gap-1.5",
              onClick: handleSaveLogo,
              disabled: logoUrl === currentLogo,
              "data-ocid": "admin.branding.logo_save_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 13 }),
                logoSaved ? "Saved!" : "Save Logo"
              ]
            }
          ),
          currentLogo && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-[10px] text-destructive/70 hover:text-destructive underline underline-offset-2 transition-colors",
              onClick: () => {
                setLogoUrl("");
                saveSiteSettings.mutate(
                  { logoUrl: null, faviconUrl: currentFavicon || null },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: ["siteSettings"]
                      });
                      ue.success("Logo reset to default");
                    },
                    onError: () => ue.error("Failed to reset logo")
                  }
                );
              },
              "data-ocid": "admin.branding.logo_reset_button",
              children: "Reset to default logo"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 space-y-3",
        "data-ocid": "admin.branding.favicon_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Browser Tab Favicon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "The small icon shown in the browser tab. Square image recommended — 32×32 or 64×64 px PNG." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ImageUpload,
            {
              value: faviconUrl,
              onChange: setFaviconUrl,
              label: "Favicon Image"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "btn-primary border-0 w-full h-9 gap-1.5",
              onClick: handleSaveFavicon,
              disabled: faviconUrl === currentFavicon,
              "data-ocid": "admin.branding.favicon_save_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 13 }),
                faviconSaved ? "Saved!" : "Save Favicon"
              ]
            }
          ),
          currentFavicon && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-[10px] text-destructive/70 hover:text-destructive underline underline-offset-2 transition-colors",
              onClick: () => {
                setFaviconUrl("");
                saveSiteSettings.mutate(
                  { logoUrl: currentLogo || null, faviconUrl: null },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: ["siteSettings"]
                      });
                      ue.success("Favicon reset to default");
                    },
                    onError: () => ue.error("Failed to reset favicon")
                  }
                );
              },
              "data-ocid": "admin.branding.favicon_reset_button",
              children: "Reset to default favicon"
            }
          )
        ]
      }
    )
  ] });
}
function AdminPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const [activeTab, setActiveTab] = reactExports.useState("products");
  const [isLoggedIn, setIsLoggedIn] = reactExports.useState(() => isSessionValid());
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      if (isLoggedIn && !isSessionValid()) {
        clearSession();
        setIsLoggedIn(false);
        ue.info("Your session has expired. Please sign in again.");
      }
    }, 6e4);
    return () => clearInterval(interval);
  }, [isLoggedIn]);
  const handleSignOut = () => {
    clearSession();
    setIsLoggedIn(false);
    ue.success("Signed out of admin panel");
  };
  const { data: serviceRequests } = useQuery({
    queryKey: ["adminServiceRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetServiceRequests(
        localStorage.getItem(SESSION_KEY) ?? ""
      );
    },
    enabled: !!actor && !actorFetching && isLoggedIn,
    refetchInterval: 6e4
  });
  const newCount = (serviceRequests == null ? void 0 : serviceRequests.filter((r) => r.status === ServiceRequestStatus.New).length) ?? 0;
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLoginForm, { onSuccess: () => setIsLoggedIn(true) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 lg:py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl lg:text-2xl font-bold text-foreground", children: "Admin Panel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Manage your products, categories, and services" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: handleSignOut,
          className: "flex-none gap-1.5 h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10",
          "data-ocid": "admin.signout_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 13 }),
            " Sign Out"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 bg-muted/50 rounded-xl p-1 mb-5 overflow-x-auto no-scrollbar",
        role: "tablist",
        children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": activeTab === tab.id,
            onClick: () => setActiveTab(tab.id),
            className: `flex-none text-xs font-semibold py-2 px-3 rounded-lg transition-smooth whitespace-nowrap flex items-center gap-1 relative ${activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
            "data-ocid": `admin.tab.${tab.id}`,
            children: [
              tab.icon,
              tab.label,
              tab.id === "services" && newCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold ml-0.5", children: newCount > 9 ? "9+" : newCount })
            ]
          },
          tab.id
        ))
      }
    ),
    activeTab === "homepage" && /* @__PURE__ */ jsxRuntimeExports.jsx(HomepagePanel, {}),
    activeTab === "herobanners" && /* @__PURE__ */ jsxRuntimeExports.jsx(HeroBannersPanel, {}),
    activeTab === "featuredblocks" && /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedBlocksPanel, {}),
    activeTab === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx(VideoBytePanel, {}),
    activeTab === "products" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsPanel, {}),
    activeTab === "categories" && /* @__PURE__ */ jsxRuntimeExports.jsx(CategoriesPanel, {}),
    activeTab === "subcategories" && /* @__PURE__ */ jsxRuntimeExports.jsx(SubCategoriesPanel, {}),
    activeTab === "services" && /* @__PURE__ */ jsxRuntimeExports.jsx(ServicesPanel, {}),
    activeTab === "inventory" && /* @__PURE__ */ jsxRuntimeExports.jsx(InventoryPanel, {}),
    activeTab === "discounts" && /* @__PURE__ */ jsxRuntimeExports.jsx(DiscountsPanel, {}),
    activeTab === "branding" && /* @__PURE__ */ jsxRuntimeExports.jsx(BrandingPanel, {}),
    activeTab === "footer" && /* @__PURE__ */ jsxRuntimeExports.jsx(FooterPanel, {}),
    activeTab === "vendors" && /* @__PURE__ */ jsxRuntimeExports.jsx(VendorsPanel, {}),
    activeTab === "vendorproducts" && /* @__PURE__ */ jsxRuntimeExports.jsx(VendorProductsPanel, {})
  ] }) });
}
function HomepagePanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [heroTagline, setHeroTagline] = reactExports.useState("");
  const [heroSubtitle, setHeroSubtitle] = reactExports.useState("");
  const [steps, setSteps] = reactExports.useState([
    { id: "step-1", title: "", description: "" },
    { id: "step-2", title: "", description: "" },
    { id: "step-3", title: "", description: "" }
  ]);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor || actorFetching) return;
    actor.getSiteSettings().then((data) => {
      setHeroTagline(data.heroTagline || "");
      setHeroSubtitle(data.heroSubtitle || "");
      if (data.howitworksSteps && data.howitworksSteps.length > 0) {
        const filled = [...data.howitworksSteps];
        while (filled.length < 3) filled.push({ title: "", description: "" });
        setSteps(
          filled.slice(0, 3).map((s, i) => ({ id: `step-${i + 1}`, ...s }))
        );
      }
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [actor, actorFetching]);
  const updateStep = (index, field, value) => {
    setSteps(
      (prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s)
    );
  };
  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.adminUpdateHeroAndHowitworks(
        localStorage.getItem(SESSION_KEY) ?? "",
        heroTagline,
        heroSubtitle,
        steps
      );
      await queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      ue.success("Homepage content saved successfully");
    } catch {
      ue.error("Failed to save homepage content");
    } finally {
      setSaving(false);
    }
  };
  if (loading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.homepage.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Homepage Content",
        location: "Homepage — tagline and How It Works section"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Hero Section" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "The main headline and subtitle displayed at the top of the homepage." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hero-tagline", className: "text-xs font-semibold", children: "Tagline (Main Headline)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "hero-tagline",
            value: heroTagline,
            onChange: (e) => setHeroTagline(e.target.value),
            placeholder: "Bringing Assam to the World",
            className: "h-9 text-sm",
            "data-ocid": "admin.homepage.tagline_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Large display text shown on the hero banner." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hero-subtitle", className: "text-xs font-semibold", children: "Subtitle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "hero-subtitle",
            value: heroSubtitle,
            onChange: (e) => setHeroSubtitle(e.target.value),
            placeholder: "Authentic Assamese products delivered to you, wherever you are.",
            className: "h-9 text-sm",
            "data-ocid": "admin.homepage.subtitle_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Supporting text shown below the tagline." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "How It Works" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Three steps shown on the homepage to guide first-time visitors." })
      ] }),
      steps.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "space-y-2 p-3 bg-muted/30 rounded-lg border border-border/60",
          "data-ocid": `admin.homepage.step.${index + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-primary", children: [
              "Step ",
              index + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: `step-title-${index}`,
                  className: "text-xs font-semibold",
                  children: "Title"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: `step-title-${index}`,
                  value: step.title,
                  onChange: (e) => updateStep(index, "title", e.target.value),
                  placeholder: [
                    "Browse our catalog",
                    "Place your order",
                    "Delivered to you"
                  ][index],
                  className: "h-9 text-sm",
                  "data-ocid": `admin.homepage.step_title.${index + 1}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: `step-desc-${index}`,
                  className: "text-xs font-semibold",
                  children: "Description"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: `step-desc-${index}`,
                  value: step.description,
                  onChange: (e) => updateStep(index, "description", e.target.value),
                  placeholder: [
                    "Explore 100+ authentic Assamese products",
                    "Secure checkout with COD or online payment",
                    "Express or standard delivery, anywhere in India"
                  ][index],
                  className: "h-9 text-sm",
                  "data-ocid": `admin.homepage.step_desc.${index + 1}`
                }
              )
            ] })
          ]
        },
        step.id
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "btn-primary border-0 w-full h-10 gap-1.5 font-semibold",
          onClick: handleSave,
          disabled: saving,
          "data-ocid": "admin.homepage.save_button",
          type: "button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
            saving ? "Saving…" : "Save Homepage Content"
          ]
        }
      )
    ] })
  ] });
}
const BLANK_REVIEW = {
  reviewerName: "",
  rating: "5",
  reviewText: "",
  productName: ""
};
const SOCIAL_PLATFORMS = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/assamroots"
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/assamroots"
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    placeholder: "https://wa.me/919876543210"
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@assamroots"
  }
];
function FooterPanel() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: footerData, isLoading: footerLoading } = useFooterSettings();
  const { data: reviews, isLoading: reviewsLoading } = useReviews();
  const [tagline, setTagline] = reactExports.useState("");
  const [copyright, setCopyright] = reactExports.useState("");
  const [aboutContent, setAboutContent] = reactExports.useState("");
  const [savingBranding, setSavingBranding] = reactExports.useState(false);
  const [socialMap, setSocialMap] = reactExports.useState({});
  const [savingSocials, setSavingSocials] = reactExports.useState(false);
  const [reviewForm, setReviewForm] = reactExports.useState(BLANK_REVIEW);
  const [addingReview, setAddingReview] = reactExports.useState(false);
  const [editReview, setEditReview] = reactExports.useState({ open: false, id: null, form: BLANK_REVIEW });
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    var _a;
    if (!footerData) return;
    setTagline(footerData.tagline ?? "");
    setCopyright(footerData.copyright ?? "");
    setAboutContent(footerData.aboutContent ?? "");
    const map = {};
    for (const p of SOCIAL_PLATFORMS) {
      const found = (_a = footerData.socialLinks) == null ? void 0 : _a.find(
        (s) => s.platform.toLowerCase() === p.key
      );
      map[p.key] = { url: (found == null ? void 0 : found.url) ?? "", enabled: (found == null ? void 0 : found.enabled) ?? false };
    }
    setSocialMap(map);
  }, [footerData]);
  const buildSocialLinks = () => SOCIAL_PLATFORMS.map((p) => {
    var _a, _b;
    return {
      platform: p.key,
      url: ((_a = socialMap[p.key]) == null ? void 0 : _a.url) ?? "",
      enabled: ((_b = socialMap[p.key]) == null ? void 0 : _b.enabled) ?? false
    };
  });
  const handleSaveBranding = async () => {
    if (!actor) return;
    setSavingBranding(true);
    try {
      await actor.adminUpdateFooterSettings(
        localStorage.getItem(SESSION_KEY) ?? "",
        tagline,
        copyright,
        aboutContent,
        buildSocialLinks()
      );
      await queryClient.invalidateQueries({ queryKey: ["footerSettings"] });
      ue.success("Footer branding saved");
    } catch {
      ue.error("Failed to save footer branding");
    } finally {
      setSavingBranding(false);
    }
  };
  const handleSaveSocials = async () => {
    if (!actor) return;
    setSavingSocials(true);
    try {
      await actor.adminUpdateFooterSettings(
        localStorage.getItem(SESSION_KEY) ?? "",
        tagline,
        copyright,
        aboutContent,
        buildSocialLinks()
      );
      await queryClient.invalidateQueries({ queryKey: ["footerSettings"] });
      ue.success("Social links saved");
    } catch {
      ue.error("Failed to save social links");
    } finally {
      setSavingSocials(false);
    }
  };
  const handleAddReview = async () => {
    if (!actor || !reviewForm.reviewerName.trim() || !reviewForm.reviewText.trim())
      return;
    setAddingReview(true);
    try {
      await actor.adminAddReview(
        localStorage.getItem(SESSION_KEY) ?? "",
        reviewForm.reviewerName,
        BigInt(Number.parseInt(reviewForm.rating) || 5),
        reviewForm.reviewText,
        reviewForm.productName
      );
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      ue.success("Review added");
      setReviewForm(BLANK_REVIEW);
    } catch {
      ue.error("Failed to add review");
    } finally {
      setAddingReview(false);
    }
  };
  const handleEditReview = async () => {
    if (!actor || !editReview.id) return;
    try {
      await actor.adminUpdateReview(
        localStorage.getItem(SESSION_KEY) ?? "",
        editReview.id,
        editReview.form.reviewerName,
        BigInt(Number.parseInt(editReview.form.rating) || 5),
        editReview.form.reviewText,
        editReview.form.productName
      );
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      ue.success("Review updated");
      setEditReview({ open: false, id: null, form: BLANK_REVIEW });
    } catch {
      ue.error("Failed to update review");
    }
  };
  const handleDeleteReview = async (id) => {
    if (!actor) return;
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setDeletingId(id);
    try {
      await actor.adminDeleteReview(
        localStorage.getItem(SESSION_KEY) ?? "",
        id
      );
      await queryClient.invalidateQueries({ queryKey: ["reviews"] });
      ue.success("Review deleted");
    } catch {
      ue.error("Failed to delete review");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };
  if (footerLoading || reviewsLoading || actorFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin.footer.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Footer",
        location: "Bottom of every page — tagline, social links, and reviews"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 space-y-4",
        "data-ocid": "admin.footer.branding_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Footer Branding" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Tagline and copyright text shown in the footer on every page." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "footer-tagline", className: "text-xs font-semibold", children: "Tagline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "footer-tagline",
                value: tagline,
                onChange: (e) => setTagline(e.target.value),
                placeholder: "Bringing Assam to the World",
                className: "h-9 text-sm",
                "data-ocid": "admin.footer.tagline_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "footer-copyright", className: "text-xs font-semibold", children: "Copyright Text" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "footer-copyright",
                value: copyright,
                onChange: (e) => setCopyright(e.target.value),
                placeholder: `© ${(/* @__PURE__ */ new Date()).getFullYear()} AssamRoots. All rights reserved.`,
                className: "h-9 text-sm",
                "data-ocid": "admin.footer.copyright_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "footer-about", className: "text-xs font-semibold", children: "About Page Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "This text is shown on the /about page." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "footer-about",
                value: aboutContent,
                onChange: (e) => setAboutContent(e.target.value),
                placeholder: "AssamRoots is an Assamese-first platform connecting the diaspora with authentic products...",
                rows: 5,
                className: "w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none",
                "data-ocid": "admin.footer.about_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "btn-primary border-0 w-full h-10 gap-1.5 font-semibold",
              onClick: handleSaveBranding,
              disabled: savingBranding,
              "data-ocid": "admin.footer.save_branding_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
                savingBranding ? "Saving…" : "Save Footer Branding"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 space-y-4",
        "data-ocid": "admin.footer.socials_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 15 }),
              " Social Links"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Social media links shown in the footer. Toggle to show or hide each one." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: SOCIAL_PLATFORMS.map((p) => {
            var _a, _b;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `social-enabled-${p.key}`,
                  type: "checkbox",
                  checked: ((_a = socialMap[p.key]) == null ? void 0 : _a.enabled) ?? false,
                  onChange: (e) => setSocialMap((prev) => ({
                    ...prev,
                    [p.key]: { ...prev[p.key], enabled: e.target.checked }
                  })),
                  className: "w-4 h-4 rounded border-input flex-none",
                  "data-ocid": `admin.footer.social_enabled.${p.key}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: `social-enabled-${p.key}`,
                  className: "text-xs font-semibold w-20 flex-none cursor-pointer",
                  children: p.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: ((_b = socialMap[p.key]) == null ? void 0 : _b.url) ?? "",
                  onChange: (e) => setSocialMap((prev) => ({
                    ...prev,
                    [p.key]: { ...prev[p.key], url: e.target.value }
                  })),
                  placeholder: p.placeholder,
                  className: "h-8 text-xs flex-1",
                  "data-ocid": `admin.footer.social_url.${p.key}`
                }
              )
            ] }, p.key);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "btn-primary border-0 w-full h-10 gap-1.5 font-semibold",
              onClick: handleSaveSocials,
              disabled: savingSocials,
              "data-ocid": "admin.footer.save_socials_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
                savingSocials ? "Saving…" : "Save Social Links"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 space-y-4",
        "data-ocid": "admin.footer.reviews_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 15 }),
              " Customer Reviews"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Reviews shown in the Reviews page and footer testimonials section." })
          ] }) }),
          !reviews || reviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-8 bg-muted/20 rounded-xl border border-border",
              "data-ocid": "admin.footer.reviews_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 28, className: "text-muted-foreground/30 mx-auto mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No reviews yet. Add the first one below." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: reviews.map((review, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-muted/30 border border-border rounded-xl p-3",
              "data-ocid": `admin.footer.review.item.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: review.reviewerName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Star,
                      {
                        size: 11,
                        className: s <= Number(review.rating) ? "fill-accent text-accent" : "fill-muted text-muted-foreground"
                      },
                      s
                    )) }),
                    review.productName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground truncate", children: review.productName })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed", children: review.reviewText })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-7 w-7 p-0",
                      onClick: () => setEditReview({
                        open: true,
                        id: review.id,
                        form: {
                          reviewerName: review.reviewerName,
                          rating: review.rating.toString(),
                          reviewText: review.reviewText,
                          productName: review.productName
                        }
                      }),
                      "data-ocid": `admin.footer.review.edit_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 11 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: `h-7 w-7 p-0 border-destructive/30 text-destructive hover:bg-destructive/10 ${confirmDeleteId === review.id ? "bg-destructive/10" : ""}`,
                      onClick: () => handleDeleteReview(review.id),
                      disabled: deletingId === review.id,
                      title: confirmDeleteId === review.id ? "Tap again to confirm" : "Delete",
                      "data-ocid": `admin.footer.review.delete_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11 })
                    }
                  )
                ] })
              ] })
            },
            review.id.toString()
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Add New Review" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "review-name", className: "text-xs font-semibold", children: "Reviewer Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "review-name",
                    value: reviewForm.reviewerName,
                    onChange: (e) => setReviewForm((p) => ({ ...p, reviewerName: e.target.value })),
                    placeholder: "Priya Sarma",
                    className: "h-9 text-sm",
                    "data-ocid": "admin.footer.review.name_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "review-rating", className: "text-xs font-semibold", children: "Rating (1–5)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "review-rating",
                    type: "number",
                    min: 1,
                    max: 5,
                    value: reviewForm.rating,
                    onChange: (e) => setReviewForm((p) => ({ ...p, rating: e.target.value })),
                    className: "h-9 text-sm",
                    "data-ocid": "admin.footer.review.rating_input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "review-product", className: "text-xs font-semibold", children: "Product Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "review-product",
                  value: reviewForm.productName,
                  onChange: (e) => setReviewForm((p) => ({ ...p, productName: e.target.value })),
                  placeholder: "Assam CTC Tea",
                  className: "h-9 text-sm",
                  "data-ocid": "admin.footer.review.product_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "review-text", className: "text-xs font-semibold", children: "Review Text *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "review-text",
                  value: reviewForm.reviewText,
                  onChange: (e) => setReviewForm((p) => ({ ...p, reviewText: e.target.value })),
                  placeholder: "Amazing product, tastes exactly like back home...",
                  rows: 3,
                  className: "w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none",
                  "data-ocid": "admin.footer.review.text_textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "btn-primary border-0 w-full h-10 gap-1.5 font-semibold",
                onClick: handleAddReview,
                disabled: addingReview || !reviewForm.reviewerName.trim() || !reviewForm.reviewText.trim(),
                "data-ocid": "admin.footer.review.add_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                  addingReview ? "Adding…" : "Add Review"
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: editReview.open,
        onOpenChange: (open) => setEditReview((p) => ({ ...p, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Review" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Reviewer Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: editReview.form.reviewerName,
                    onChange: (e) => setEditReview((p) => ({
                      ...p,
                      form: { ...p.form, reviewerName: e.target.value }
                    })),
                    className: "h-9 text-sm",
                    "data-ocid": "admin.footer.review.edit_name_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Rating (1–5)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 1,
                    max: 5,
                    value: editReview.form.rating,
                    onChange: (e) => setEditReview((p) => ({
                      ...p,
                      form: { ...p.form, rating: e.target.value }
                    })),
                    className: "h-9 text-sm",
                    "data-ocid": "admin.footer.review.edit_rating_input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Product Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editReview.form.productName,
                  onChange: (e) => setEditReview((p) => ({
                    ...p,
                    form: { ...p.form, productName: e.target.value }
                  })),
                  placeholder: "Assam CTC Tea",
                  className: "h-9 text-sm",
                  "data-ocid": "admin.footer.review.edit_product_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Review Text *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: editReview.form.reviewText,
                  onChange: (e) => setEditReview((p) => ({
                    ...p,
                    form: { ...p.form, reviewText: e.target.value }
                  })),
                  rows: 3,
                  className: "w-full rounded-md border border-input bg-background text-sm px-3 py-2 resize-none",
                  "data-ocid": "admin.footer.review.edit_text_textarea"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setEditReview({ open: false, id: null, form: BLANK_REVIEW }),
                "data-ocid": "admin.footer.review.edit_cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "btn-primary border-0",
                disabled: !editReview.form.reviewerName.trim() || !editReview.form.reviewText.trim(),
                onClick: handleEditReview,
                "data-ocid": "admin.footer.review.edit_save_button",
                children: "Update Review"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function VendorStatusBadge({ status }) {
  const map = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
    suspended: "bg-slate-100 text-slate-600 border-slate-200"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${map[status] ?? "bg-muted text-muted-foreground border-border"}`,
      children: status
    }
  );
}
function VendorsPanel() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [filter, setFilter] = reactExports.useState("all");
  const [assignProductId, setAssignProductId] = reactExports.useState({});
  const [rejectReason, setRejectReason] = reactExports.useState({});
  const [actionLoading, setActionLoading] = reactExports.useState(
    {}
  );
  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ["admin-vendors", filter],
    queryFn: async () => {
      if (!actor) return [];
      const statusParam = filter === "all" ? null : filter;
      const res = await actor.adminListVendors(statusParam);
      return res;
    },
    enabled: !!actor
  });
  const doAction = async (key, fn) => {
    setActionLoading((p) => ({ ...p, [key]: true }));
    try {
      const res = await fn();
      if ("ok" in res) {
        ue.success("Action completed");
        queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      } else {
        ue.error(res.err ?? "Action failed");
        if (res.err === "Unauthorized") {
          clearSession();
          window.location.reload();
        }
      }
    } catch {
      ue.error("Action failed");
    } finally {
      setActionLoading((p) => ({ ...p, [key]: false }));
    }
  };
  const filterTabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "suspended", label: "Suspended" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "admin.vendors.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PanelHeader,
      {
        title: "Vendors",
        location: "Admin only — vendor applications and approval flow"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: "Vendor Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
        vendors.length,
        " vendors"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 flex-wrap",
        "data-ocid": "admin.vendors.filter.tab",
        children: filterTabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setFilter(t.id),
            className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
            "data-ocid": `admin.vendors.filter_${t.id}`,
            children: t.label
          },
          t.id
        ))
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-xl p-4 animate-pulse space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-1/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded w-1/2" })
        ]
      },
      i
    )) }) : vendors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-12",
        "data-ocid": "admin.vendors.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 36, className: "text-muted-foreground/30 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No vendors found for this filter." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: vendors.map((vendor, idx) => {
      var _a, _b, _c, _d;
      const vid = vendor.id.toText();
      const isApproved = vendor.status === "approved";
      const isPending = vendor.status === "pending";
      const isSuspended = vendor.status === "suspended";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl p-4 space-y-3",
          "data-ocid": `admin.vendors.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: vendor.businessName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: vendor.contactEmail }),
                vendor.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: vendor.phone }),
                vendor.bankAccountNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Bank: ",
                  vendor.bankAccountNumber
                ] }),
                vendor.ifscCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "IFSC: ",
                  vendor.ifscCode
                ] }),
                vendor.fssaiDocumentUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: vendor.fssaiDocumentUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-xs text-primary hover:underline",
                    children: "View FSSAI Document"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(VendorStatusBadge, { status: vendor.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1", children: [
                "Assigned Products (",
                ((_a = vendor.assignedProductIds) == null ? void 0 : _a.length) ?? 0,
                ")"
              ] }),
              ((_b = vendor.assignedProductIds) == null ? void 0 : _b.length) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: vendor.assignedProductIds.map((pid) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 bg-muted rounded-md px-2 py-0.5 text-[10px] font-mono",
                  children: [
                    pid,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => doAction(
                          `unassign-${vid}-${pid}`,
                          () => actor.adminUnassignProductFromVendor(
                            localStorage.getItem(SESSION_KEY) ?? "",
                            vendor.id,
                            pid
                          )
                        ),
                        disabled: actionLoading[`unassign-${vid}-${pid}`],
                        className: "text-muted-foreground hover:text-destructive transition-colors",
                        "aria-label": `Remove product ${pid}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 10 })
                      }
                    )
                  ]
                },
                pid
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "No products assigned yet." })
            ] }),
            isApproved && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: assignProductId[vid] ?? "",
                  onChange: (e) => setAssignProductId((p) => ({
                    ...p,
                    [vid]: e.target.value
                  })),
                  placeholder: "Product ID to assign",
                  className: "h-8 text-xs flex-1",
                  "data-ocid": `admin.vendors.assign_product_input.${idx + 1}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "btn-primary border-0 h-8 text-xs px-3",
                  disabled: !((_c = assignProductId[vid]) == null ? void 0 : _c.trim()) || actionLoading[`assign-${vid}`],
                  onClick: () => {
                    var _a2;
                    const pid = (_a2 = assignProductId[vid]) == null ? void 0 : _a2.trim();
                    if (!pid) return;
                    doAction(
                      `assign-${vid}`,
                      () => actor.adminAssignProductToVendor(
                        localStorage.getItem(SESSION_KEY) ?? "",
                        vendor.id,
                        pid
                      )
                    ).then(
                      () => setAssignProductId((p) => ({ ...p, [vid]: "" }))
                    );
                  },
                  "data-ocid": `admin.vendors.assign_product_button.${idx + 1}`,
                  children: "Assign"
                }
              )
            ] }),
            isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: rejectReason[vid] ?? "",
                onChange: (e) => setRejectReason((p) => ({
                  ...p,
                  [vid]: e.target.value
                })),
                placeholder: "Rejection reason (required to reject)",
                className: "h-8 text-xs",
                "data-ocid": `admin.vendors.reject_reason_input.${idx + 1}`
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap pt-1", children: [
              isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    className: "bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-8 text-xs",
                    disabled: actionLoading[`approve-${vid}`],
                    onClick: () => doAction(
                      `approve-${vid}`,
                      () => actor.adminApproveVendor(
                        localStorage.getItem(SESSION_KEY) ?? "",
                        vendor.id
                      )
                    ),
                    "data-ocid": `admin.vendors.approve_button.${idx + 1}`,
                    children: "Approve"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "destructive",
                    className: "h-8 text-xs",
                    disabled: !((_d = rejectReason[vid]) == null ? void 0 : _d.trim()) || actionLoading[`reject-${vid}`],
                    onClick: () => doAction(
                      `reject-${vid}`,
                      () => actor.adminRejectVendor(
                        localStorage.getItem(SESSION_KEY) ?? "",
                        vendor.id,
                        rejectReason[vid] ?? ""
                      )
                    ),
                    "data-ocid": `admin.vendors.reject_button.${idx + 1}`,
                    children: "Reject"
                  }
                )
              ] }),
              isApproved && !isSuspended && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "h-8 text-xs text-amber-700 border-amber-200 hover:bg-amber-50",
                  disabled: actionLoading[`suspend-${vid}`],
                  onClick: () => doAction(
                    `suspend-${vid}`,
                    () => actor.adminSuspendVendor(
                      localStorage.getItem(SESSION_KEY) ?? "",
                      vendor.id
                    )
                  ),
                  "data-ocid": `admin.vendors.suspend_button.${idx + 1}`,
                  children: "Suspend"
                }
              )
            ] })
          ]
        },
        vid
      );
    }) })
  ] });
}
export {
  AdminPage as default
};
