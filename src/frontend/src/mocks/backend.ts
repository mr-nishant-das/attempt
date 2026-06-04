import type { backendInterface, Product, Category, CartPublic, UserProfilePublic, OrderPublic, ProductListResult, ServiceRequestPublic, CreateServiceRequestInput, _ImmutableObjectStorageCreateCertificateResult, _ImmutableObjectStorageRefillInformation, _ImmutableObjectStorageRefillResult, HeroBanner, FeaturedBlock, VendorRegistration, VendorSummary, VendorOrderSummary } from "../backend";
import { OrderStatus, ServiceRequestStatus, VendorStatus, VendorType } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const samplePrincipal = { toText: () => "aaaaa-aa" } as unknown as Principal;

const sampleCategories: Category[] = [
  {
    id: BigInt(1),
    name: "Assam Tea",
    slug: "assam-tea",
    description: "World-famous Assam black tea and specialty blends",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    subCategories: [
      { id: 1n, name: "CTC Tea", imageUrl: "" },
      { id: 2n, name: "Orthodox Tea", imageUrl: "" },
      { id: 3n, name: "Green Tea", imageUrl: "" },
      { id: 4n, name: "White Tea", imageUrl: "" },
    ],
  },
  {
    id: BigInt(2),
    name: "Handloom & Textiles",
    slug: "handloom",
    description: "Traditional Assamese handloom sarees and fabrics",
    imageUrl: "https://images.unsplash.com/photo-1583391733975-a1cf4f358d79?w=400",
    subCategories: [
      { id: 5n, name: "Mekhela Sador", imageUrl: "" },
      { id: 6n, name: "Gamosa", imageUrl: "" },
      { id: 7n, name: "Silk", imageUrl: "" },
      { id: 8n, name: "Cotton", imageUrl: "" },
    ],
  },
  {
    id: BigInt(3),
    name: "Handicrafts",
    slug: "handicrafts",
    description: "Authentic Assamese handicrafts and artifacts",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    subCategories: [
      { id: 9n, name: "Bamboo", imageUrl: "" },
      { id: 10n, name: "Cane", imageUrl: "" },
      { id: 11n, name: "Bell Metal", imageUrl: "" },
      { id: 12n, name: "Pottery", imageUrl: "" },
    ],
  },
  {
    id: BigInt(4),
    name: "Spices & Foods",
    slug: "spices-foods",
    description: "Fresh Assamese spices, pickles, and local foods",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
    subCategories: [
      { id: 13n, name: "Spices", imageUrl: "" },
      { id: 14n, name: "Pickles", imageUrl: "" },
      { id: 15n, name: "Mustard Oil", imageUrl: "" },
      { id: 16n, name: "Dried Fish", imageUrl: "" },
    ],
  },
  {
    id: BigInt(5),
    name: "Books & Literature",
    slug: "books",
    description: "Assamese literature, history, and cultural books",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    subCategories: [
      { id: 17n, name: "Fiction", imageUrl: "" },
      { id: 18n, name: "Non-fiction", imageUrl: "" },
      { id: 19n, name: "Poetry", imageUrl: "" },
      { id: 20n, name: "Children", imageUrl: "" },
    ],
  },
  {
    id: BigInt(6),
    name: "Organic Produce",
    slug: "organic",
    description: "Farm-fresh organic fruits and vegetables from Assam",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    subCategories: [
      { id: 21n, name: "Fruits", imageUrl: "" },
      { id: 22n, name: "Vegetables", imageUrl: "" },
      { id: 23n, name: "Herbs", imageUrl: "" },
      { id: 24n, name: "Rice", imageUrl: "" },
    ],
  },
];

const sampleProducts: Product[] = [
  {
    id: BigInt(1),
    title: "Premium Assam CTC Tea (500g)",
    subCategory: "CTC Tea",
    imageUrls: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"],
    createdAt: BigInt(Date.now()),
    tags: ["tea", "assam", "organic"],
    description: "Premium garden-fresh Assam CTC tea with rich malty flavour.",
    discountPercent: BigInt(20),
    isActive: true,
    updatedAt: BigInt(Date.now()),
    stock: BigInt(50),
    category: BigInt(1),
    brand: "Brahmaputra Teas",
    rating: BigInt(45),
    price: BigInt(25000),
    reviewCount: BigInt(128),
  },
  {
    id: BigInt(2),
    title: "Traditional Mekhela Sador (Silk)",
    subCategory: "Mekhela Sador",
    imageUrls: ["https://images.unsplash.com/photo-1583391733975-a1cf4f358d79?w=400"],
    createdAt: BigInt(Date.now()),
    tags: ["handloom", "silk", "assam"],
    description: "Hand-woven traditional Assamese silk mekhela sador.",
    discountPercent: BigInt(10),
    isActive: true,
    updatedAt: BigInt(Date.now()),
    stock: BigInt(15),
    category: BigInt(2),
    brand: "Kamrup Handlooms",
    rating: BigInt(48),
    price: BigInt(450000),
    reviewCount: BigInt(64),
  },
  {
    id: BigInt(3),
    title: "Bamboo Handicraft Basket Set",
    subCategory: "Bamboo",
    imageUrls: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    createdAt: BigInt(Date.now()),
    tags: ["bamboo", "handicraft", "eco-friendly"],
    description: "Handmade bamboo basket set by Assamese artisans.",
    discountPercent: BigInt(15),
    isActive: true,
    updatedAt: BigInt(Date.now()),
    stock: BigInt(30),
    category: BigInt(3),
    brand: "Assam Crafts Co.",
    rating: BigInt(44),
    price: BigInt(120000),
    reviewCount: BigInt(89),
  },
  {
    id: BigInt(4),
    title: "Assamese Mustard Oil (1L)",
    subCategory: "Mustard Oil",
    imageUrls: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400"],
    createdAt: BigInt(Date.now()),
    tags: ["oil", "mustard", "cooking"],
    description: "Cold-pressed pure mustard oil from Assam mustard seeds.",
    discountPercent: BigInt(5),
    isActive: true,
    updatedAt: BigInt(Date.now()),
    stock: BigInt(100),
    category: BigInt(4),
    brand: "Jorhat Naturals",
    rating: BigInt(46),
    price: BigInt(18000),
    reviewCount: BigInt(210),
  },
  {
    id: BigInt(5),
    title: "Assamese Literature Collection",
    subCategory: "Fiction",
    imageUrls: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"],
    createdAt: BigInt(Date.now()),
    tags: ["books", "assamese", "literature"],
    description: "Curated collection of classic Assamese literary works.",
    discountPercent: BigInt(0),
    isActive: true,
    updatedAt: BigInt(Date.now()),
    stock: BigInt(40),
    category: BigInt(5),
    brand: "Guwahati Press",
    rating: BigInt(50),
    price: BigInt(85000),
    reviewCount: BigInt(45),
  },
  {
    id: BigInt(6),
    title: "Organic Kaji Nemu Lemons (1kg)",
    subCategory: "Fruits",
    imageUrls: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"],
    createdAt: BigInt(Date.now()),
    tags: ["organic", "lemon", "fresh"],
    description: "Fresh organic Kaji Nemu (Assamese lemon) with distinct aroma.",
    discountPercent: BigInt(10),
    isActive: true,
    updatedAt: BigInt(Date.now()),
    stock: BigInt(75),
    category: BigInt(6),
    brand: "Majuli Farms",
    rating: BigInt(47),
    price: BigInt(8000),
    reviewCount: BigInt(156),
  },
  {
    id: BigInt(7),
    title: "Bell Metal Xorai (Ritual Plate)",
    subCategory: "Bell Metal",
    imageUrls: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    createdAt: BigInt(Date.now()),
    tags: ["bell-metal", "ritual", "traditional"],
    description: "Handcrafted traditional bell metal Xorai offering plate.",
    discountPercent: BigInt(0),
    isActive: true,
    updatedAt: BigInt(Date.now()),
    stock: BigInt(20),
    category: BigInt(3),
    brand: "Sarthebari Metals",
    rating: BigInt(50),
    price: BigInt(380000),
    reviewCount: BigInt(32),
  },
  {
    id: BigInt(8),
    title: "Assam Organic Green Tea (250g)",
    subCategory: "Green Tea",
    imageUrls: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"],
    createdAt: BigInt(Date.now()),
    tags: ["green-tea", "organic", "health"],
    description: "Light and refreshing organic Assam green tea leaves.",
    discountPercent: BigInt(25),
    isActive: true,
    updatedAt: BigInt(Date.now()),
    stock: BigInt(60),
    category: BigInt(1),
    brand: "Dibrugarh Gardens",
    rating: BigInt(46),
    price: BigInt(35000),
    reviewCount: BigInt(94),
  },
];

const sampleCart: CartPublic = {
  userId: samplePrincipal,
  updatedAt: BigInt(Date.now()),
  items: [],
};

const sampleProfile: UserProfilePublic = {
  id: samplePrincipal,
  name: "Anurag Sharma",
  createdAt: BigInt(Date.now()),
  email: "anurag@example.com",
  updatedAt: BigInt(Date.now()),
  addresses: [],
  isAdmin: false,
  phone: "+91 98765 43210",
};

export const mockBackend: backendInterface = {
  listCategories: async () => sampleCategories,
  getCategory: async (id) => sampleCategories.find(c => c.id === id) ?? null,
  getCategoryBySlug: async (slug) => sampleCategories.find(c => c.slug === slug) ?? null,

  listProducts: async (_filter) => ({
    total: BigInt(sampleProducts.length),
    products: sampleProducts,
  } as ProductListResult),
  listProductsByCategory: async (categoryId, limit, offset) => {
    const filtered = sampleProducts.filter(p => p.category === categoryId);
    return { total: BigInt(filtered.length), products: filtered.slice(Number(offset), Number(offset) + Number(limit)) };
  },
  searchProducts: async (term, limit, offset) => {
    const filtered = sampleProducts.filter(p =>
      p.title.toLowerCase().includes(term.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(term.toLowerCase()))
    );
    return { total: BigInt(filtered.length), products: filtered.slice(Number(offset), Number(offset) + Number(limit)) };
  },
  getProduct: async (id) => sampleProducts.find(p => p.id === id) ?? null,

  adminGetCategories: async (_adminToken: string) => sampleCategories,
  adminAddCategory: async (_adminToken: string, _name, _slug, _description, _imageUrl) => ({ __kind__: "ok" as const, ok: sampleCategories[0] }),
  adminUpdateCategory: async (_adminToken: string, _id, _name, _slug, _description, _imageUrl) => ({ __kind__: "ok" as const, ok: sampleCategories[0] }),
  adminDeleteCategory: async (_adminToken: string, _id) => ({ __kind__: "ok" as const, ok: true }),
  adminAddSubCategory: async (_adminToken: string, _categoryId, _name, _imageUrl) => ({ __kind__: "ok" as const, ok: sampleCategories[0] }),
  adminUpdateSubCategory: async (_adminToken: string, _categoryId, _subCategoryId, _name, _imageUrl) => ({ __kind__: "ok" as const, ok: sampleCategories[0] }),
  adminDeleteSubCategory: async (_adminToken: string, _categoryId, _subCategoryId) => ({ __kind__: "ok" as const, ok: sampleCategories[0] }),

  adminAddProduct: async (_adminToken: string, _input) => sampleProducts[0],
  adminUpdateProduct: async (_adminToken: string, _id, _input) => sampleProducts[0],
  adminDeleteProduct: async (_adminToken: string, _id) => true,
  adminUpdateStock: async (_adminToken: string, _id, _stock) => sampleProducts[0],
  adminSetDiscount: async (_adminToken: string, _id, _discount) => sampleProducts[0],

  getMyCart: async () => sampleCart,
  addToCart: async (_productId, _quantity) => sampleCart,
  removeFromCart: async (_productId) => sampleCart,
  updateCartItem: async (_productId, _quantity) => sampleCart,
  clearMyCart: async () => undefined,

  getMyProfile: async () => sampleProfile,
  updateMyProfile: async (_input) => sampleProfile,
  addMyAddress: async (_address) => sampleProfile,

  getMyOrders: async () => [],
  getOrder: async (_orderId) => null,
  createOrder: async (_input) => ({
    id: BigInt(1),
    status: OrderStatus.Confirmed,
    deliveryAddress: { name: "Anurag Sharma", phone: "+91 98765 43210", houseNo: "12", street: "MG Road", locality: "Paltan Bazar", landmark: "", city: "Guwahati", district: "Kamrup Metropolitan", state: "Assam", pincode: "781001" },
    paymentMethod: "Cash on Delivery",
    deliveryType: { Standard: null } as unknown as OrderPublic["deliveryType"],
    deliveryCost: BigInt(5900),
    shipmentUpdates: [],
    userId: samplePrincipal,
    createdAt: BigInt(Date.now()),
    estimatedDelivery: BigInt(Date.now() + 5 * 24 * 60 * 60 * 1000),
    updatedAt: BigInt(Date.now()),
    totalAmount: BigInt(25000),
    items: [],
  } as OrderPublic),

  adminGetAllOrders: async (_limit, _offset) => [],
  adminUpdateOrderStatus: async (_orderId, _status, _message) => null,
  adminSetUserAdmin: async (_user, _status) => true,
  claimAdminIfFirst: async () => false,
  isCurrentUserAdmin: async () => false,

  submitServiceRequest: async (input: CreateServiceRequestInput): Promise<ServiceRequestPublic> => ({
    id: BigInt(1),
    status: ServiceRequestStatus.New,
    userName: input.userName,
    serviceType: input.serviceType,
    userId: "aaaaa-aa",
    submittedAt: BigInt(Date.now() * 1_000_000),
    description: input.description,
    userPhone: input.userPhone,
    lastUpdatedAt: BigInt(Date.now() * 1_000_000),
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    isRequestForSelf: input.isRequestForSelf,
    recipientName: input.recipientName,
    recipientPhone: input.recipientPhone,
    recipientAddress: input.recipientAddress,
  }),
  adminGetServiceRequests: async (_adminToken: string): Promise<ServiceRequestPublic[]> => [],
  adminUpdateServiceRequestStatus: async (_adminToken: string, _id, _status) => null,
  adminDeleteServiceRequest: async (_adminToken: string, _id) => true,

  adminRegisterImageHash: async (_adminToken: string, _hash: string): Promise<string> => _hash,

  listHeroBanners: async (): Promise<HeroBanner[]> => [],
  getHeroBanner: async (_id): Promise<HeroBanner | null> => null,
  listFeaturedBlocks: async (): Promise<FeaturedBlock[]> => [],
  getFeaturedBlock: async (_id): Promise<FeaturedBlock | null> => null,

  adminListHeroBanners: async (_adminToken: string): Promise<HeroBanner[]> => [],
  adminAddHeroBanner: async (_adminToken: string, _input) => ({ id: BigInt(1), title: "", order: BigInt(0), isActive: true, imageUrl: "", ctaSlug: "", ctaText: "", subtitle: "", durationSeconds: 5n }),
  adminUpdateHeroBanner: async (_adminToken: string, _id, _input) => ({ __kind__: "ok" as const, ok: { id: BigInt(1), title: "", order: BigInt(0), isActive: true, imageUrl: "", ctaSlug: "", ctaText: "", subtitle: "", durationSeconds: 5n } }),
  adminDeleteHeroBanner: async (_adminToken: string, _id) => ({ __kind__: "ok" as const, ok: true }),
  adminReorderHeroBanner: async (_adminToken: string, _id, _newOrder) => ({ __kind__: "ok" as const, ok: { id: BigInt(1), title: "", order: BigInt(0), isActive: true, imageUrl: "", ctaSlug: "", ctaText: "", subtitle: "", durationSeconds: 5n } }),

  adminListFeaturedBlocks: async (_adminToken: string): Promise<FeaturedBlock[]> => [],
  adminAddFeaturedBlock: async (_adminToken: string, _input) => ({ id: BigInt(1), title: "", content: "", thumbnailUrl: "", order: BigInt(0), createdAt: BigInt(Date.now()), isActive: true, contentImages: [] }),
  adminUpdateFeaturedBlock: async (_adminToken: string, _id, _input) => ({ __kind__: "ok" as const, ok: { id: BigInt(1), title: "", content: "", thumbnailUrl: "", order: BigInt(0), createdAt: BigInt(Date.now()), isActive: true, contentImages: [] } }),
  adminDeleteFeaturedBlock: async (_adminToken: string, _id) => ({ __kind__: "ok" as const, ok: true }),

  _immutableObjectStorageBlobsAreLive: async (_hashes: Array<Uint8Array>): Promise<Array<boolean>> =>
    _hashes.map(() => true),

  _immutableObjectStorageBlobsToDelete: async (): Promise<Array<Uint8Array>> => [],

  _immutableObjectStorageConfirmBlobDeletion: async (_blobs: Array<Uint8Array>): Promise<void> => undefined,

  _immutableObjectStorageCreateCertificate: async (_blobHash: string): Promise<_ImmutableObjectStorageCreateCertificateResult> => ({
    method: "stub",
    blob_hash: _blobHash,
  }),

  _immutableObjectStorageRefillCashier: async (_refillInformation: _ImmutableObjectStorageRefillInformation | null): Promise<_ImmutableObjectStorageRefillResult> => ({
    success: true,
    topped_up_amount: BigInt(0),
  }),

  _immutableObjectStorageUpdateGatewayPrincipals: async (): Promise<void> => undefined,

  createRazorpayOrder: async (_amount, _receipt) => ({
    __kind__: "ok" as const,
    ok: { orderId: "order_mock123", amount: _amount, currency: "INR" },
  }),

  razorpayTransform: async (input) => input as unknown as ReturnType<backendInterface["razorpayTransform"]> extends Promise<infer T> ? T : never,

  verifyRazorpayPayment: async (_orderId, _paymentId, _signature) => ({
    __kind__: "ok" as const,
    ok: true,
  }),

  getSiteSettings: async () => ({
    logoUrl: undefined,
    faviconUrl: undefined,
    heroTagline: "",
    heroSubtitle: "",
    howitworksSteps: [],
  }),

  adminUpdateSiteSettings: async (_adminToken: string, logoUrl, faviconUrl) => ({
    logoUrl: logoUrl ?? undefined,
    faviconUrl: faviconUrl ?? undefined,
  }),

  adminLogin: async (_userId, _passcode) => null,
  adminLogout: async (_token) => undefined,
  isAdminSession: async (_token) => false,

  getVideoByte: async () => ({ url: "", title: "AssamRoots", enabled: false }),
  adminUpdateVideoByte: async (_adminToken: string, _url, _enabled, _title) => undefined,

  getServicesAvailability: async () => ({ available: true, message: "" }),
  adminUpdateServicesAvailability: async (_adminToken: string, _available, _message) => undefined,

  getFooterSettings: async () => ({
    tagline: "Bringing Assam to the World",
    copyright: `© ${new Date().getFullYear()} AssamRoots. All rights reserved.`,
    aboutContent: "",
    socialLinks: [],
    policyContent: "",
  }),
  adminUpdateFooterSettings: async (
    _adminToken: string,
    _t: string,
    _c: string,
    _a: string,
    _s: Array<{ platform: string; url: string; enabled: boolean }>,
  ) => true,

  getReviews: async () => [],
  adminAddReview: async (
    _adminToken: string,
    _n: string,
    _r: bigint,
    _t: string,
    _p: string,
  ): Promise<bigint> => BigInt(1),
  adminUpdateReview: async (
    _adminToken: string,
    _id: bigint,
    _n: string,
    _r: bigint,
    _t: string,
    _p: string,
  ): Promise<boolean> => true,
  adminDeleteReview: async (_adminToken: string, _id: bigint): Promise<boolean> => true,

  adminUpdateHeroAndHowitworks: async (
    _adminToken: string,
    _heroTagline: string,
    _heroSubtitle: string,
    _howitworksSteps: Array<{ title: string; description: string }>,
  ): Promise<void> => undefined,

  adminUpdatePolicyContent: async (_adminToken: string, _policyContent: string): Promise<boolean> => true,

  listBestSellers: async (_limit: bigint): Promise<typeof sampleProducts> =>
    sampleProducts.slice(0, Number(_limit)),

  listNewArrivals: async (_limit: bigint): Promise<typeof sampleProducts> =>
    sampleProducts.slice(0, Number(_limit)),

  // ─── OTP / Auth stubs ──────────────────────────────────────────────────
  requestOtp: async (_email: string) => ({ __kind__: "ok" as const, ok: null }),
  verifyOtp: async (_email: string, _code: string) => ({ __kind__: "ok" as const, ok: "mock-token" }),

  // ─── Admin extra auth stubs ────────────────────────────────────────────
  adminVerifyKey: async (_secretKey: string) => ({ __kind__: "ok" as const, ok: null }),
  adminRequestOtp: async () => ({ __kind__: "ok" as const, ok: null }),
  adminVerifyOtp: async (_code: string) => ({ __kind__: "ok" as const, ok: "mock-admin-token" }),

  // ─── Vendor stubs ──────────────────────────────────────────────────────
  registerVendor: async (_details: VendorRegistration) => ({ __kind__: "ok" as const, ok: "mock-vendor-id" }),
  getMyVendorProfile: async () => ({ __kind__: "ok" as const, ok: {
    id: samplePrincipal,
    businessName: "Demo Vendor",
    contactEmail: "vendor@example.com",
    phone: "9876543210",
    categories: ["Food & Spices", "Tea"],
    status: VendorStatus.pending,
    registeredAt: BigInt(Date.now()),
    assignedProductIds: [],
    address: "",
    bankAccountNumber: "",
    ifscCode: "",
    vendorType: VendorType.brand,
  } }),
  getMyVendorOrders: async () => [] as VendorOrderSummary[],
  getVendorForProduct: async (_productId: string): Promise<VendorSummary | null> => null,

  processVendorActionToken: async (_token: string, _action: unknown) => Promise.resolve({ __kind__: "ok" as const, ok: "done" }),

  // ─── Admin vendor management stubs ────────────────────────────────────
  adminListVendors: async (_status: VendorStatus | null) => [] as VendorSummary[],
  adminApproveVendor: async (_adminToken: string, _vendorId: Principal) => ({ __kind__: "ok" as const, ok: null }),
  adminRejectVendor: async (_adminToken: string, _vendorId: Principal, _reason: string) => ({ __kind__: "ok" as const, ok: null }),
  adminSuspendVendor: async (_adminToken: string, _vendorId: Principal) => ({ __kind__: "ok" as const, ok: null }),
  adminAssignProductToVendor: async (_adminToken: string, _vendorId: Principal, _productId: string) => ({ __kind__: "ok" as const, ok: null }),
  adminUnassignProductFromVendor: async (_adminToken: string, _vendorId: Principal, _productId: string) => ({ __kind__: "ok" as const, ok: null }),

  adminApproveVendorProduct: async (_token: string, _id: bigint, _tax: bigint) => ({ __kind__: 'ok' as const, ok: {} as any }),
  adminListVendorProducts: async (_token: string) => [] as any[],
  adminListVendorProductsByVendor: async (_token: string, _vendorId: any) => [] as any[],
  adminRejectVendorProduct: async (_token: string, _id: bigint, _reason: string) => ({ __kind__: 'ok' as const, ok: {} as any }),
  vendorSubmitProduct: async (_token: string, _input: any) => ({ __kind__: 'ok' as const, ok: {} as any }),
  vendorGetMyProducts: async (_token: string) => ({ __kind__: 'ok' as const, ok: [] as any[] }),
  adminUpdateVendorProductQuantity: async (_adminToken: string, _productId: bigint, _newQuantityKg: bigint) => ({ __kind__: 'ok' as const, ok: null }),
  vendorUpdateProductQuantity: async (_sessionToken: string, _productId: bigint, _newQuantityKg: bigint) => ({ __kind__: 'ok' as const, ok: null }),
  getVendorStatusBySession: async (_token: string) => null as import('@/backend').VendorStatus | null,
  verifyVendorOtp: async (_email: string, _code: string) => ({ __kind__: 'err' as const, err: 'mock' }),
};
