import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SubCategory {
    id: SubCategoryId;
    name: string;
    imageUrl: string;
}
export type OrderId = bigint;
export interface HeroBanner {
    id: HeroBannerId;
    title: string;
    order: bigint;
    isActive: boolean;
    imageUrl: string;
    ctaSlug: string;
    ctaText: string;
    durationSeconds: bigint;
    subtitle: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type CustomerReviewId = bigint;
export interface CartItem {
    productId: bigint;
    addedAt: bigint;
    quantity: bigint;
}
export type SubCategoryId = bigint;
export interface SocialLink {
    url: string;
    platform: string;
    enabled: boolean;
}
export interface OrderItem {
    title: string;
    discountPercent: bigint;
    productId: bigint;
    imageUrl: string;
    quantity: bigint;
    price: bigint;
}
export interface HowItWorksStep {
    title: string;
    description: string;
}
export interface Address {
    city: string;
    name: string;
    line1: string;
    line2: string;
    state: string;
    isDefault: boolean;
    phone: string;
    pincode: string;
}
export interface OrderPublic {
    id: OrderId;
    status: OrderStatus;
    deliveryAddress: DeliveryAddress;
    shipmentUpdates: Array<ShipmentUpdate>;
    paymentMethod: string;
    userId: Principal;
    createdAt: bigint;
    estimatedDelivery?: bigint;
    deliveryCost: bigint;
    deliveryType: DeliveryType;
    updatedAt: bigint;
    totalAmount: bigint;
    items: Array<OrderItem>;
}
export interface CustomerReview {
    id: CustomerReviewId;
    createdAt: bigint;
    reviewText: string;
    reviewerName: string;
    productName: string;
    rating: bigint;
}
export interface VendorProductInput {
    moq?: bigint;
    mrp?: bigint;
    imageUrls: Array<string>;
    fssaiDocumentUrl?: string;
    pricePerKg?: bigint;
    supplyPrice?: bigint;
    description: string;
    productName: string;
    availableQuantityKg?: bigint;
    category: string;
    basePrice: bigint;
    vendorName: string;
    vendorType: VendorType;
}
export interface CreateServiceRequestInput {
    userName: string;
    serviceType: ServiceType;
    recipientPhone?: string;
    description: string;
    userPhone: string;
    isRequestForSelf: boolean;
    preferredDate: string;
    preferredTime: string;
    recipientAddress?: string;
    recipientName?: string;
}
export interface ServiceRequestPublic {
    id: bigint;
    status: ServiceRequestStatus;
    userName: string;
    serviceType: ServiceType;
    userId: string;
    recipientPhone?: string;
    submittedAt: bigint;
    description: string;
    userPhone: string;
    lastUpdatedAt: bigint;
    isRequestForSelf: boolean;
    preferredDate: string;
    preferredTime: string;
    recipientAddress?: string;
    recipientName?: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CreateOrderInput {
    deliveryAddress: DeliveryAddress;
    paymentMethod: string;
    deliveryCost: bigint;
    deliveryType: DeliveryType;
    items: Array<{
        productId: bigint;
        quantity: bigint;
    }>;
}
export interface CartPublic {
    userId: Principal;
    updatedAt: bigint;
    items: Array<CartItem>;
}
export interface DeliveryAddress {
    street: string;
    city: string;
    name: string;
    district: string;
    state: string;
    landmark: string;
    phone: string;
    pincode: string;
    locality: string;
    houseNo: string;
}
export interface VendorRegistration {
    bankAccountNumber: string;
    categories: Array<string>;
    ifscCode: string;
    fssaiDocumentUrl?: string;
    businessName: string;
    address: string;
    contactEmail: string;
    brandName?: string;
    phone: string;
    packagingDetails?: string;
    vendorType: VendorType;
    gstinNumber?: string;
}
export type HeroBannerId = bigint;
export type FeaturedBlockId = bigint;
export interface Category {
    id: CategoryId;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    subCategories: Array<SubCategory>;
}
export interface ProductInput {
    subCategory: string;
    title: string;
    imageUrls: Array<string>;
    tags: Array<string>;
    description: string;
    discountPercent: bigint;
    stock: bigint;
    category: CategoryId;
    brand: string;
    rating: bigint;
    price: bigint;
    reviewCount: bigint;
}
export interface ProductListResult {
    total: bigint;
    products: Array<Product>;
}
export interface FeaturedBlock {
    id: FeaturedBlockId;
    title: string;
    content: string;
    thumbnailUrl: string;
    order: bigint;
    createdAt: bigint;
    isActive: boolean;
    contentImages: Array<string>;
}
export interface FeaturedBlockInput {
    title: string;
    content: string;
    thumbnailUrl: string;
    order: bigint;
    isActive: boolean;
    contentImages: Array<string>;
}
export interface VendorSummary {
    id: Principal;
    bankAccountNumber: string;
    categories: Array<string>;
    status: VendorStatus;
    assignedProductIds: Array<string>;
    ifscCode: string;
    fssaiDocumentUrl?: string;
    approvedAt?: bigint;
    businessName: string;
    address: string;
    contactEmail: string;
    brandName?: string;
    phone: string;
    packagingDetails?: string;
    registeredAt: bigint;
    vendorType: VendorType;
    gstinNumber?: string;
}
export interface VendorOrderSummary {
    productId: string;
    productName: string;
    orderId: string;
    placedAt: bigint;
    quantity: bigint;
    totalPrice: number;
}
export interface UserProfilePublic {
    id: UserId;
    name: string;
    createdAt: bigint;
    email: string;
    updatedAt: bigint;
    addresses: Array<Address>;
    isAdmin: boolean;
    phone: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface VendorProductView {
    id: bigint;
    moq?: bigint;
    mrp?: bigint;
    finalPrice?: bigint;
    status: Variant_pending_approved_rejected;
    packagingCost?: bigint;
    taxPercent?: bigint;
    imageUrls: Array<string>;
    fssaiDocumentUrl?: string;
    pricePerKg?: bigint;
    rejectionReason?: string;
    supplyPrice?: bigint;
    submittedAt: bigint;
    description: string;
    productName: string;
    reviewedAt?: bigint;
    availableQuantityKg?: bigint;
    vendorId: Principal;
    category: string;
    basePrice: bigint;
    vendorEmail: string;
    vendorName: string;
    vendorType: VendorType;
}
export interface ProductFilter {
    categoryId?: CategoryId;
    inStockOnly: boolean;
    offset: bigint;
    maxPrice?: bigint;
    limit: bigint;
    searchTerm?: string;
    minPrice?: bigint;
}
export interface HeroBannerInput {
    title: string;
    order: bigint;
    isActive: boolean;
    imageUrl: string;
    ctaSlug: string;
    ctaText: string;
    durationSeconds: bigint;
    subtitle: string;
}
export type CategoryId = bigint;
export type ProductId = bigint;
export interface VendorProfile {
    id: Principal;
    bankAccountNumber: string;
    categories: Array<string>;
    status: VendorStatus;
    assignedProductIds: Array<string>;
    ifscCode: string;
    fssaiDocumentUrl?: string;
    approvedAt?: bigint;
    businessName: string;
    address: string;
    contactEmail: string;
    brandName?: string;
    phone: string;
    packagingDetails?: string;
    registeredAt: bigint;
    vendorType: VendorType;
    gstinNumber?: string;
}
export interface UserProfileInput {
    name: string;
    email: string;
    phone: string;
}
export interface Product {
    id: ProductId;
    subCategory: string;
    title: string;
    imageUrls: Array<string>;
    createdAt: bigint;
    tags: Array<string>;
    description: string;
    discountPercent: bigint;
    isActive: boolean;
    updatedAt: bigint;
    stock: bigint;
    category: CategoryId;
    brand: string;
    rating: bigint;
    price: bigint;
    reviewCount: bigint;
}
export interface ShipmentUpdate {
    status: OrderStatus;
    message: string;
    timestamp: bigint;
}
export enum DeliveryType {
    Standard = "Standard",
    Express = "Express"
}
export enum OrderStatus {
    Delivered = "Delivered",
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Processing = "Processing",
    Shipped = "Shipped",
    OutForDelivery = "OutForDelivery"
}
export enum ServiceRequestStatus {
    New = "New",
    Contacted = "Contacted",
    Cancelled = "Cancelled",
    Completed = "Completed"
}
export enum ServiceType {
    Ambulance = "Ambulance",
    FoodDelivery = "FoodDelivery",
    Taxi = "Taxi",
    SchoolAdmissions = "SchoolAdmissions",
    Medicines = "Medicines",
    Gifting = "Gifting",
    FuneralServices = "FuneralServices",
    Tourism = "Tourism",
    Doctors = "Doctors",
    VideoConferencing = "VideoConferencing",
    EventManagement = "EventManagement",
    WeddingsAnniversaries = "WeddingsAnniversaries",
    Other = "Other"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum Variant_reject_approve {
    reject = "reject",
    approve = "approve"
}
export enum VendorStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected",
    suspended = "suspended"
}
export enum VendorType {
    rawMaterial = "rawMaterial",
    brand = "brand"
}
export interface backendInterface {
    addMyAddress(address: Address): Promise<UserProfilePublic>;
    addToCart(productId: bigint, quantity: bigint): Promise<CartPublic>;
    adminAddCategory(adminToken: string, name: string, slug: string, description: string, imageUrl: string): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminAddFeaturedBlock(adminToken: string, input: FeaturedBlockInput): Promise<FeaturedBlock>;
    adminAddHeroBanner(adminToken: string, input: HeroBannerInput): Promise<HeroBanner>;
    adminAddProduct(adminToken: string, input: ProductInput): Promise<Product>;
    adminAddReview(adminToken: string, reviewerName: string, rating: bigint, reviewText: string, productName: string): Promise<bigint>;
    adminAddSubCategory(adminToken: string, categoryId: CategoryId, name: string, imageUrl: string): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminApproveVendor(adminToken: string, vendorId: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminApproveVendorProduct(adminToken: string, productId: bigint, taxPercent: bigint, packagingCost: bigint | null): Promise<{
        __kind__: "ok";
        ok: VendorProductView;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminAssignProductToVendor(adminToken: string, vendorId: Principal, productId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteCategory(adminToken: string, id: CategoryId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteFeaturedBlock(adminToken: string, id: FeaturedBlockId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteHeroBanner(adminToken: string, id: HeroBannerId): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminDeleteProduct(adminToken: string, id: ProductId): Promise<boolean>;
    adminDeleteReview(adminToken: string, id: bigint): Promise<boolean>;
    adminDeleteServiceRequest(adminToken: string, id: bigint): Promise<boolean>;
    adminDeleteSubCategory(adminToken: string, categoryId: CategoryId, subCategoryId: SubCategoryId): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminGetAllOrders(limit: bigint, offset: bigint): Promise<Array<OrderPublic>>;
    adminGetCategories(adminToken: string): Promise<Array<Category>>;
    adminGetServiceRequests(adminToken: string): Promise<Array<ServiceRequestPublic>>;
    adminListFeaturedBlocks(adminToken: string): Promise<Array<FeaturedBlock>>;
    adminListHeroBanners(adminToken: string): Promise<Array<HeroBanner>>;
    adminListVendorProducts(adminToken: string): Promise<Array<VendorProductView>>;
    adminListVendorProductsByVendor(adminToken: string, vendorId: Principal): Promise<Array<VendorProductView>>;
    adminListVendors(status: VendorStatus | null): Promise<Array<VendorSummary>>;
    adminLogin(userId: string, passcode: string): Promise<string | null>;
    adminLogout(token: string): Promise<void>;
    adminRegisterImageHash(adminToken: string, hash: string): Promise<string>;
    adminRejectVendor(adminToken: string, vendorId: Principal, reason: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminRejectVendorProduct(adminToken: string, productId: bigint, reason: string): Promise<{
        __kind__: "ok";
        ok: VendorProductView;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminReorderHeroBanner(adminToken: string, id: HeroBannerId, newOrder: bigint): Promise<{
        __kind__: "ok";
        ok: HeroBanner;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminRequestOtp(): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminSetDiscount(adminToken: string, id: ProductId, discountPercent: bigint): Promise<Product | null>;
    adminSetUserAdmin(targetUser: Principal, adminStatus: boolean): Promise<boolean>;
    adminSuspendVendor(adminToken: string, vendorId: Principal): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUnassignProductFromVendor(adminToken: string, vendorId: Principal, productId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateCategory(adminToken: string, id: CategoryId, name: string, slug: string, description: string, imageUrl: string): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateFeaturedBlock(adminToken: string, id: FeaturedBlockId, input: FeaturedBlockInput): Promise<{
        __kind__: "ok";
        ok: FeaturedBlock;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateFooterSettings(adminToken: string, tagline: string, copyright: string, aboutContent: string, socialLinks: Array<SocialLink>): Promise<boolean>;
    adminUpdateHeroAndHowitworks(adminToken: string, heroTagline: string, heroSubtitle: string, howitworksSteps: Array<HowItWorksStep>): Promise<void>;
    adminUpdateHeroBanner(adminToken: string, id: HeroBannerId, input: HeroBannerInput): Promise<{
        __kind__: "ok";
        ok: HeroBanner;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateOrderStatus(orderId: OrderId, newStatus: OrderStatus, message: string): Promise<OrderPublic | null>;
    adminUpdatePolicyContent(adminToken: string, policyContent: string): Promise<boolean>;
    adminUpdateProduct(adminToken: string, id: ProductId, input: ProductInput): Promise<Product | null>;
    adminUpdateReview(adminToken: string, id: bigint, reviewerName: string, rating: bigint, reviewText: string, productName: string): Promise<boolean>;
    adminUpdateServiceRequestStatus(adminToken: string, id: bigint, status: ServiceRequestStatus): Promise<ServiceRequestPublic | null>;
    adminUpdateServicesAvailability(adminToken: string, available: boolean, message: string): Promise<void>;
    adminUpdateSiteSettings(adminToken: string, logoUrl: string | null, faviconUrl: string | null): Promise<{
        logoUrl?: string;
        faviconUrl?: string;
    }>;
    adminUpdateStock(adminToken: string, id: ProductId, newStock: bigint): Promise<Product | null>;
    adminUpdateSubCategory(adminToken: string, categoryId: CategoryId, subCategoryId: SubCategoryId, name: string, imageUrl: string): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateVendorProductQuantity(adminToken: string, productId: bigint, newQuantityKg: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminUpdateVideoByte(adminToken: string, url: string, enabled: boolean, title: string): Promise<void>;
    adminVerifyKey(secretKey: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminVerifyOtp(code: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    claimAdminIfFirst(): Promise<boolean>;
    clearMyCart(): Promise<void>;
    createOrder(input: CreateOrderInput): Promise<OrderPublic>;
    createRazorpayOrder(amount: bigint, receipt: string): Promise<{
        __kind__: "ok";
        ok: {
            orderId: string;
            currency: string;
            amount: bigint;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCategory(id: CategoryId): Promise<Category | null>;
    getCategoryBySlug(slug: string): Promise<Category | null>;
    getFeaturedBlock(id: FeaturedBlockId): Promise<FeaturedBlock | null>;
    getFooterSettings(): Promise<{
        tagline: string;
        socialLinks: Array<SocialLink>;
        policyContent: string;
        aboutContent: string;
        copyright: string;
    }>;
    getHeroBanner(id: HeroBannerId): Promise<HeroBanner | null>;
    getMyCart(): Promise<CartPublic>;
    getMyOrders(): Promise<Array<OrderPublic>>;
    getMyProfile(): Promise<UserProfilePublic>;
    getMyVendorOrders(): Promise<Array<VendorOrderSummary>>;
    getMyVendorProfile(): Promise<{
        __kind__: "ok";
        ok: VendorProfile;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getOrder(orderId: OrderId): Promise<OrderPublic | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getReviews(): Promise<Array<CustomerReview>>;
    getServicesAvailability(): Promise<{
        available: boolean;
        message: string;
    }>;
    getSiteSettings(): Promise<{
        heroSubtitle: string;
        howitworksSteps: Array<HowItWorksStep>;
        logoUrl?: string;
        faviconUrl?: string;
        heroTagline: string;
    }>;
    getVendorForProduct(productId: string): Promise<VendorSummary | null>;
    getVendorStatusBySession(token: string): Promise<VendorStatus | null>;
    getVideoByte(): Promise<{
        url: string;
        title: string;
        enabled: boolean;
    }>;
    isAdminSession(token: string): Promise<boolean>;
    isCurrentUserAdmin(): Promise<boolean>;
    listBestSellers(limit: bigint): Promise<Array<Product>>;
    listCategories(): Promise<Array<Category>>;
    listFeaturedBlocks(): Promise<Array<FeaturedBlock>>;
    listHeroBanners(): Promise<Array<HeroBanner>>;
    listNewArrivals(limit: bigint): Promise<Array<Product>>;
    listProducts(filter: ProductFilter): Promise<ProductListResult>;
    listProductsByCategory(categoryId: CategoryId, limit: bigint, offset: bigint): Promise<ProductListResult>;
    processVendorActionToken(token: string, action: Variant_reject_approve): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    razorpayTransform(input: TransformationInput): Promise<TransformationOutput>;
    registerVendor(details: VendorRegistration): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    removeFromCart(productId: bigint): Promise<CartPublic>;
    requestOtp(email: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    searchProducts(term: string, limit: bigint, offset: bigint): Promise<ProductListResult>;
    submitServiceRequest(input: CreateServiceRequestInput): Promise<ServiceRequestPublic>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<CartPublic>;
    updateMyProfile(input: UserProfileInput): Promise<UserProfilePublic>;
    vendorGetMyProducts(sessionToken: string): Promise<{
        __kind__: "ok";
        ok: Array<VendorProductView>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    vendorSubmitProduct(sessionToken: string, input: VendorProductInput): Promise<{
        __kind__: "ok";
        ok: VendorProductView;
    } | {
        __kind__: "err";
        err: string;
    }>;
    vendorUpdateProductQuantity(sessionToken: string, productId: bigint, newQuantityKg: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    verifyOtp(email: string, code: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    verifyRazorpayPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    verifyVendorOtp(email: string, code: string): Promise<{
        __kind__: "ok";
        ok: {
            status: VendorStatus;
            token: string;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
}
